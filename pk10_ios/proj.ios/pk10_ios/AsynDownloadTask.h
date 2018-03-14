#import <Foundation/Foundation.h>
#import <Security/Security.h>

@interface AsynDownloadTask : NSObject <NSURLConnectionDelegate, NSURLConnectionDataDelegate>
-(void) startRequest:(NSURLRequest*)request;
- (instancetype) initWithDestPath:(NSString*) destPath
                completionHandler:(void(^)(BOOL isSuccess))completionHandler
                  progressHandler:(void(^)(float progress))progressHandler;
@end
