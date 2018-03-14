#import "HotUpdate.h"
#import "AsynDownloadTask.h"
#import "SSZipArchive.h"
#import "ViewController.h"
#import "BlockUIAlertView.h"

@interface HotUpdate()
{
    NSString* _gameId;
    NSString* _jsonUrl;
    NSString* _zipPath;
    NSString* _zipFilePath;
    NSString* _gamePath;
    
    NSString* _loaderUrl;
    NSString* _updateUrl;
}

@property (nonatomic) UIProgressView* progressBar;
@property (nonatomic) ViewController* viewController;

@end

@implementation HotUpdate

- (instancetype)initWithGameId:(NSString *)gameId
                   ProgressBar:(UIProgressView*)bar
                ViewController:(ViewController *)controller
{
    if (self = [super init])
    {
        _gameId = gameId;
        
        //_jsonUrl = @"http://www.yourhost.com/egret.json";
        
        //NSString *bundle = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleIdentifier"];
        //NSString *appName = [bundle stringByReplacingOccurrencesOfString:@"com.rainbow." withString:@""];
        //_jsonUrl = [NSString stringWithFormat:@"http://pk.kn86.cn/update_%@/version.php", appName];
        
        _jsonUrl = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"UpdateUrl"];
        _zipPath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES)
                    objectAtIndex:0];
        _gamePath = [_zipPath stringByAppendingFormat:@"/%@/game", gameId];
        
        _progressBar = bar;
        _viewController = controller;
    }
    return self;
}

-(BOOL)checkAppVersionUpdate
{
    NSURL* jsonUrlObj = [NSURL URLWithString:_jsonUrl];
    NSData* data = [NSData dataWithContentsOfURL:jsonUrlObj];
    if(!data)
    {
        return NO;
    }
    
    NSMutableDictionary* json = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
    if(!json)
    {
        return NO;
    }
    
    NSString *app_update_url = json[@"app_update_url"];
    NSString *app_version_ios = json[@"app_version_ios"];
    
    NSString *current_version = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];
    
    if(app_update_url && app_update_url.length>0 && app_version_ios && app_version_ios.length>0)
    {
        NSInteger versionCheck = [self compareVersion:current_version to:app_version_ios];
        if(versionCheck==-1)
        {
            [_viewController performSelectorOnMainThread:@selector(showUpdate:)
                                              withObject:@{@"app_version_ios":app_version_ios, @"app_update_url":app_update_url}
                                           waitUntilDone:NO];
            return YES;
        }
    }
    
    return NO;
    
}

- (void)doLoadGame
{
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        if([self checkAppVersionUpdate])
        {
            return;
        }
        
        if ([self getGameJson])
        {
            dispatch_async(dispatch_get_main_queue(),^{
                _progressBar.hidden = NO;
                [self downloadZip:^(BOOL isSuccess){
                    if(isSuccess){
                        // 下载完成，则开始解压缩更新文件，完成更新
                        [self unzip];
                    }
                    else{
                        // 下载失败
                        [self downLoadUpdateFailed];
                    }
                }];
            });
        }
        else
        {
            [self runGame];
        }
    });
}

- (void)runGame
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [_viewController runGameWithUpdateUrl:_updateUrl];
    });
}

- (BOOL)getGameJson
{
    NSURL* jsonUrlObj = [NSURL URLWithString:_jsonUrl];
    NSData* data = [NSData dataWithContentsOfURL:jsonUrlObj];
    if(!data)
    {
        return NO;
    }
    
    NSMutableDictionary* json = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
    
    // 从json对象中获得用以热更新的字段
    _loaderUrl = json[@"code_url"];
    _updateUrl = json[@"update_url"];
    
    // 比对本地配置的更新地址和此次获取的更新地址，如果变更则需要更新
    BOOL needUpdate = NO;
    NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
    NSString* codeUrlSetting = [defaults stringForKey:@"code_url"];
    if (_loaderUrl && ![_loaderUrl isEqualToString:codeUrlSetting])
    {
        needUpdate = YES;
    }
    NSString* updateUrlSetting = [defaults stringForKey:@"update_url"];
    if (_updateUrl && ![_updateUrl isEqualToString:updateUrlSetting])
    {
        [defaults setObject:_updateUrl forKey:@"update_url"];
    }
    
    return needUpdate;
}

- (void)downloadZip:(void(^)(BOOL isSuccess))completionHandler
{
    @try {
        _zipFilePath = [_zipPath stringByAppendingPathComponent:@"temp.zip"];
        AsynDownloadTask* connection = [[AsynDownloadTask alloc] initWithDestPath:_zipFilePath completionHandler:completionHandler progressHandler:^(float progress) {
            dispatch_async(dispatch_get_main_queue(),^{
                //在主进程更新UI信息,下载进度代表了进度条前50%的流程
                [self.progressBar setProgress:0.5*progress];
            });
        }];
        NSURL *url = [NSURL URLWithString:_loaderUrl];
        NSURLRequest *theRequest = [NSURLRequest requestWithURL:url cachePolicy:NSURLRequestReloadIgnoringLocalCacheData timeoutInterval:60];
        [connection startRequest:theRequest];
    }
    @catch(NSException *exception) {
        NSLog(@"%@", exception.reason);
    }
}

- (void)unzip
{
    [SSZipArchive unzipFileAtPath:_zipFilePath toDestination:_gamePath progressHandler:^(NSString * _Nonnull entry, unz_file_info zipInfo, long entryNumber, long total) {
        dispatch_async(dispatch_get_main_queue(),^{
            //在主进程更新UI信息,开始解压缩则意味下载完成，所以进度从50%开始，如果需要更准确的显示下载进度，可使用NSConnection来进行下载
            [self.progressBar setProgress:0.5+0.5*entryNumber/total];
        });
    } completionHandler:^(NSString * _Nonnull path, BOOL succeeded, NSError * _Nonnull error) {
        //成功更新文件，更新本地的版本配置
        if(succeeded){
            NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
            [defaults setObject:_loaderUrl forKey:@"code_url"];
            [self runGame];
        }
    }];
}

- (void)downLoadUpdateFailed
{
    NSLog(@"更新失败");
}

/**
比较两个版本号的大小

@param v1 第一个版本号
@param v2 第二个版本号
@return 版本号相等,返回0; v1小于v2,返回-1; 否则返回1.
*/
- (NSInteger)compareVersion:(NSString *)v1 to:(NSString *)v2 {
    // 都为空，相等，返回0
    if (!v1 && !v2) {
        return 0;
    }
    
    // v1为空，v2不为空，返回-1
    if (!v1 && v2) {
        return -1;
    }
    
    // v2为空，v1不为空，返回1
    if (v1 && !v2) {
        return 1;
    }
    
    // 获取版本号字段
    NSArray *v1Array = [v1 componentsSeparatedByString:@"."];
    NSArray *v2Array = [v2 componentsSeparatedByString:@"."];
    // 取字段最少的，进行循环比较
    NSInteger smallCount = (v1Array.count > v2Array.count) ? v2Array.count : v1Array.count;
    
    for (int i = 0; i < smallCount; i++) {
        NSInteger value1 = [[v1Array objectAtIndex:i] integerValue];
        NSInteger value2 = [[v2Array objectAtIndex:i] integerValue];
        if (value1 > value2) {
            // v1版本字段大于v2版本字段，返回1
            return 1;
        } else if (value1 < value2) {
            // v2版本字段大于v1版本字段，返回-1
            return -1;
        }
        
        // 版本相等，继续循环。
    }
    
    // 版本可比较字段相等，则字段多的版本高于字段少的版本。
    if (v1Array.count > v2Array.count) {
        return 1;
    } else if (v1Array.count < v2Array.count) {
        return -1;
    } else {
        return 0;
    }
    
    return 0;
}

@end
