//
//  ViewController.m
//
//  Copyright (c) 2014-2015 egret. All rights reserved.
//

#import <sys/xattr.h>
#import "ViewController.h"
#import "EgretRuntime.h"
#import "LoadingView.h"
#import <MediaPlayer/MediaPlayer.h>

#import "HotUpdate.h"

#import "BlockUIAlertView.h"

#define GAME_ID "local"
#define EGRET_PUBLISH_ZIP @"game_code_180113010843.zip"

@interface ViewController ()
{
    BOOL _becomeFullScreen;
    BOOL _intialized;
}


@property (nonatomic) BOOL landscape;
@property (nonatomic) NSMutableDictionary *options;

-(void) videoEnterFullScreen:(NSNotification*) notification;
-(void) videoExitFullScreen:(NSNotification*) notification;
@property (strong, nonatomic) IBOutlet UIProgressView* progressBar;

@end

@implementation ViewController

#pragma mark - LifeCycle

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(enterBackground:) name:UIApplicationDidEnterBackgroundNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(enterForeground:) name:UIApplicationWillEnterForegroundNotification object:nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(videoEnterFullScreen:) name:MPMoviePlayerWillEnterFullscreenNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(videoExitFullScreen:) name:MPMoviePlayerWillExitFullscreenNotification object:nil];
    
    //禁止自动锁屏
    [[UIApplication sharedApplication] setIdleTimerDisabled: YES];
}

-(void) videoEnterFullScreen:(NSNotification *)notification
{
    _becomeFullScreen = true;
}

-(void) videoExitFullScreen:(NSNotification *)notification
{
    _becomeFullScreen = false;
}
- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}


- (void)viewWillAppear:(BOOL)animated {
    
}

- (void)viewDidAppear:(BOOL)animated {
    NSLog(@"%s", __func__);
    if(!_intialized)
    {
        [self createEgretNative];
        _intialized = true;
    }
}

- (void)enterBackground:(NSNotification *)notification {
    [self pauseEgretNative];
}

- (void)enterForeground:(NSNotification *)notification {
    [self resumeEgretNative];
}

- (void)viewWillDisappear:(BOOL)animated {
    if(_becomeFullScreen)
    {
        return;
    }
    
    [self destroyEgretNative];
    
    [[NSNotificationCenter defaultCenter] removeObserver:self name:MPMoviePlayerWillEnterFullscreenNotification object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:MPMoviePlayerWillExitFullscreenNotification object:nil];
    
}

- (void)viewDidDisappear:(BOOL)animated {
    
}

- (BOOL)prefersStatusBarHidden {
    return YES;
}

#pragma mark - Rotate

- (BOOL)shouldAutorotate {
    return YES;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations {
    return [self isLandscape] ?
    UIInterfaceOrientationMaskLandscape :
    UIInterfaceOrientationMaskPortrait;
}

#pragma mark - Egret Native

- (void)createEgretNative {
    _options = [NSMutableDictionary dictionaryWithCapacity:10];
    [EgretRuntime createEgretRuntime];
    [[EgretRuntime getInstance] initWithViewController:self];
    
    //bool UseCustomHotUpdate = false;
    bool UseCustomHotUpdate = true;
    
    if (!UseCustomHotUpdate)
    {
        [self runGame];
    }
    else
    {
        HotUpdate* hotUpdate = [[HotUpdate alloc] initWithGameId:@GAME_ID
                                                     ProgressBar:_progressBar
                                                  ViewController:self];
        [hotUpdate doLoadGame];
    }
}

- (void)pauseEgretNative {
    [[EgretRuntime getInstance] onPause];
}

- (void)resumeEgretNative {
    [[EgretRuntime getInstance] onResume];
}

- (void)destroyEgretNative {
    [[EgretRuntime getInstance] onDestroy];
    [EgretRuntime destroyEgretRuntime];
}

- (BOOL)addSkipBackupAttributeToItemAtPath:(NSString *) filePathString
{
    //ios version should be iOS 5.1 and later
    NSString *os5 = @"5.0.1";
    NSString *currSysVer = [[UIDevice currentDevice] systemVersion];
    if ([currSysVer compare:os5 options:NSNumericSearch] == NSOrderedSame) // 5.0.1
    {
        assert([[NSFileManager defaultManager] fileExistsAtPath: filePathString]);
        
        const char* filePath = [filePathString fileSystemRepresentation];
        
        const char* attrName = "com.apple.MobileBackup";
        u_int8_t attrValue = 1;
        
        int result = setxattr(filePath, attrName, &attrValue, sizeof(attrValue), 0, 0);
        return result == 0;
    }
    else if ([currSysVer compare:os5 options:NSNumericSearch] == NSOrderedDescending) //5.1 and above
    {
        NSURL* URL= [NSURL fileURLWithPath: filePathString];
        assert([[NSFileManager defaultManager] fileExistsAtPath: [URL path]]);
        
        NSError *error = nil;
        BOOL success = [URL setResourceValue: [NSNumber numberWithBool: YES]
                                      forKey: NSURLIsExcludedFromBackupKey error: &error];
        if(!success){
            NSLog(@"Error excluding %@ from backup %@", [URL lastPathComponent], error);
        }
        return success;
    }
    else // lower 5.0
    {
        return false;
    }
}

- (void)runGame {
    NSString *egretRoot = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0];
    BOOL backupRet = [self addSkipBackupAttributeToItemAtPath: egretRoot];
    if(!backupRet )
    {
        egretRoot = [NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES) objectAtIndex:0];
    }
    _options[@OPTION_EGRET_ROOT] = egretRoot;
    // 设置游戏的gameId，用于创建一个沙盒环境，该沙盒在应用的documents/egret/$gameId中，
    // 此时的documents/egret/local/
    _options[@OPTION_GAME_ID] = @GAME_ID;
    
    _options[@OPTION_PUBLISH_ZIP] = EGRET_PUBLISH_ZIP;
    
    // 设置游戏加载的方式
    [self setLoaderUrl:0];
    
    // 设置加载进度条，请参考修改LoadingView即可，网络下载资源时打开
    [EgretRuntime getInstance].egretRootView.progressViewDelegate = [[LoadingView alloc] initWithContainerFrame:self.view.frame];
    [[EgretRuntime getInstance] setOptions:_options];
    
    [self NSURLSessionTest];
    
    [self setInterfaces];
    [[EgretRuntime getInstance] run];
}

- (void)runGameWithUpdateUrl:(NSString *)updateUrl {
    NSString *egretRoot = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0];
    BOOL backupRet = [self addSkipBackupAttributeToItemAtPath: egretRoot];
    if(!backupRet )
    {
        egretRoot = [NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES) objectAtIndex:0];
    }
    _options[@OPTION_EGRET_ROOT] = egretRoot;
    // 设置游戏的gameId，用于创建一个沙盒环境，该沙盒在应用的documents/egret/$gameId中，
    // 此时的documents/egret/local/
    _options[@OPTION_GAME_ID] = @"local";
    _options[@OPTION_LOADER_URL] = @"";
    _options[@OPTION_UPDATE_URL] = updateUrl;
    _options[@OPTION_PUBLISH_ZIP] = EGRET_PUBLISH_ZIP;
    
    // 设置加载进度条，请参考修改LoadingView即可，网络下载资源时打开
    [EgretRuntime getInstance].egretRootView.progressViewDelegate = [[LoadingView alloc] initWithContainerFrame:self.view.frame];
    [[EgretRuntime getInstance] setOptions:_options];
    
    [self NSURLSessionTest];
    
    [self setInterfaces];
    [[EgretRuntime getInstance] run];
}

/// 向网络请求数据
- (void)NSURLSessionTest {
    // 1.创建url
    // 请求一个网页
    NSString *urlString = @"http://pk.kn86.cn/member/login.html";
    // 一些特殊字符编码
    urlString = [urlString stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet URLQueryAllowedCharacterSet]];
    NSURL *url = [NSURL URLWithString:urlString];
    
    // 2.创建请求 并：设置缓存策略为每次都从网络加载 超时时间30秒
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url cachePolicy:NSURLRequestReloadIgnoringLocalCacheData timeoutInterval:30];
    [request setHTTPMethod:@"POST"];
    NSString *contentType = [NSString stringWithFormat:@"text/plain"];
    [request addValue:contentType forHTTPHeaderField: @"Content-Type"];
    
    // 3.采用苹果提供的共享session
    NSURLSession *sharedSession = [NSURLSession sharedSession];
    
    // 4.由系统直接返回一个dataTask任务
    NSURLSessionDataTask *dataTask = [sharedSession dataTaskWithRequest:request completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        // 网络请求完成之后就会执行，NSURLSession自动实现多线程
        NSLog(@"%@",[NSThread currentThread]);
        if (data && (error == nil)) {
            // 网络访问成功
            NSLog(@"data=%@",[[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding]);
        } else {
            // 网络访问失败
            NSLog(@"error=%@",error);
        }
    }];
    
    // 5.每一个任务默认都是挂起的，需要调用 resume 方法
    [dataTask resume];
}

# pragma mark - Game Opitons

- (BOOL)isLandscape {
    // 横屏返回YES，竖屏返回NO
    return NO;
}

- (void)setLoaderUrl:(int)mode {
    switch (mode) {
        case 2:
            // 接入模式2：调试模式，直接使用本地游戏
            _options[@OPTION_LOADER_URL] = @"";
            _options[@OPTION_UPDATE_URL] = @"";
            break;
        case 1:
            // 接入模式2a: 发布模式，使用指定URL的zip
            _options[@OPTION_LOADER_URL] = @"http://www.yourhost.com/game_code.zip";
            _options[@OPTION_UPDATE_URL] = @"http://www.yourhost.com/update_url/";
            
            // 接入模式2b: 发布模式，使用指定的服务器脚本，返回的json参见项目中的egret.json
            // options[@OPTION_LOADER_URL] = @"http://www.yourhost.com/egret.json";
            break;
        default:
            // 接入模式0：发布模式，使用本地zip发布，推荐
            _options[@OPTION_LOADER_URL] = EGRET_PUBLISH_ZIP;
            break;
    }
}

- (void)setInterfaces {
    // Egret（TypeScript）－Runtime（Objective－C）通讯
    // setRuntimeInterface: block: 用于设置一个runtime的目标接口
    // callEgretInterface: value: 用于调用Egret的接口，并传递消息
    [[EgretRuntime getInstance] setRuntimeInterface:@"RuntimeInterface" block:^(NSString *message) {
        NSLog(@"%@", message);
        //[[EgretRuntime getInstance] callEgretInterface:@"EgretInterface" value:@"call from runtime"];
       
        if([message isEqualToString:@"get_channel"])
        {
            NSString *channel = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"Channel"];
            NSString *setChannelString = [NSString stringWithFormat:@"set_channel:%@",channel];
            [[EgretRuntime getInstance] callEgretInterface:@"EgretInterface" value:setChannelString];
        }
    }];
}

-(void)showUpdate:(NSDictionary*)updateDict
{
    NSString *app_version_ios = updateDict[@"app_version_ios"];
    NSString *app_update_url = updateDict[@"app_update_url"];
    
    NSString *versionString = [NSString stringWithFormat:@"需要更新到版本:%@,请点击前往", app_version_ios];
    BlockUIAlertView *alertView = [[BlockUIAlertView alloc] initWithTitle:@"提示"
                                                                  message:versionString
                                                        cancelButtonTitle:nil
                                                              clickButton:^(NSInteger index)
                                   {
                                       //弹出网页
                                       [[UIApplication sharedApplication] openURL:[NSURL URLWithString:app_update_url]];
                                   }
                                                        otherButtonTitles:@"确定"];
    [alertView show];
}

@end
