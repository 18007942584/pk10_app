#import "AsynDownloadTask.h"

@interface AsynDownloadTask (){
    void (^_completionHandler)(BOOL isSuccess);
    void(^_progressHandler)(float progress);
}

@property (readwrite) NSString *statusString;
@property (readwrite) NSURLRequest *request;
@property (readwrite) long long expectedBytes;
@property (readwrite) float progress;
@property (readwrite) NSString *destPath;
@property (strong) NSString *srcURL;
@property (strong) NSString *sslFile;
@property (copy) NSDictionary *responseHeader;
@property (strong) NSMutableData *responseData;
@property (readonly) NSInteger getDataTime;
@property (readonly) NSInteger responseCode;
@property (strong) NSError *responseError;
@property (strong) NSError *connError;
@property (strong) NSURLConnection *conn;
@property (strong) NSRunLoop *runLoop;
@end

@implementation AsynDownloadTask
@synthesize srcURL = srcURL;
@synthesize sslFile = sslFile;
@synthesize responseHeader = responseHeader;
@synthesize responseData = responseData;
@synthesize getDataTime = getDataTime;
@synthesize responseCode = responseCode;
@synthesize statusString = statusString;
@synthesize responseError = responseError;
@synthesize connError = connError;
@synthesize conn = conn;
@synthesize runLoop = runLoop;

- (void)dealloc{
    NSLog(@"HttpAsynConnection dealloc");
//    no need in automatic reference counting
    srcURL = nil;
    sslFile = nil;
    responseHeader = nil;
    responseData = nil;
    responseError = nil;
    conn = nil;
    runLoop = nil;
    connError = nil;
}

- (instancetype) initWithDestPath:(NSString*) destPath
                completionHandler:(void(^)(BOOL isSuccess))completionHandler
                  progressHandler:(void(^)(float progress))progressHandler{
    self = [self init];
    _destPath = destPath;
    _completionHandler = completionHandler;
    _progressHandler = progressHandler;
    return self;
}

- (void) startRequest:(NSURLRequest *)request{
    self.responseData = [NSMutableData data];
    getDataTime = 0;

    self.responseError = nil;
    self.connError = nil;
    
    // create the connection with the target request and this class as the delegate
    self.conn = [[NSURLConnection alloc] initWithRequest:request
                                                 delegate:self
                                         startImmediately:NO] ;
    
    [self.conn scheduleInRunLoop:[NSRunLoop currentRunLoop] forMode:NSDefaultRunLoopMode];
    
    // start the connection
    [self.conn start];
}

#pragma mark NSURLConnectionDelegate methods
/**
 * This delegate method is called when the NSURLConnection connects to the server.  It contains the 
 * NSURLResponse object with the headers returned by the server.  This method may be called multiple times.
 * Therefore, it is important to reset the data on each call.  Do not assume that it is the first call
 * of this method.
 **/
- (void) connection:(NSURLConnection *)connection 
 didReceiveResponse:(NSURLResponse *)response {
#ifdef DEBUG
    NSLog(@"Received response from request to url %@", srcURL);
#endif
    
    NSHTTPURLResponse *httpResponse = (NSHTTPURLResponse *)response;
    //NSLog(@"All headers = %@", [httpResponse allHeaderFields]);
    self.responseHeader = [httpResponse allHeaderFields];

    responseCode = httpResponse.statusCode;
    self.statusString = [NSHTTPURLResponse localizedStringForStatusCode:responseCode];
    if(responseCode == 200){
        self.statusString = @"OK";
    }
 
    /*The individual values of the numeric status codes defined for HTTP/1.1
    | "200"  ; OK
    | "201"  ; Created
    | "202"  ; Accepted
    | "203"  ; Non-Authoritative Information
    | "204"  ; No Content
    | "205"  ; Reset Content
    | "206"  ; Partial Content
    */
    if (responseCode < 200 || responseCode >= 300){
        // something went wrong, abort the whole thing
        self.responseError = [NSError errorWithDomain:@"CCBackendDomain"
                                            code:responseCode
                                        userInfo:@{NSLocalizedDescriptionKey: @"Bad HTTP Response Code"}];        
    }
    
    [responseData setLength:0];
    //get expected bytes
    _expectedBytes = [httpResponse expectedContentLength];
}

/**
 * This delegate method is called for each chunk of data received from the server.  The chunk size
 * is dependent on the network type and the server configuration.  
 */
- (void)connection:(NSURLConnection *)connection 
    didReceiveData:(NSData *)data{
    //NSLog(@"get some data");
    [responseData appendData:data];
    _progress = (float)[responseData length]/(float)_expectedBytes;
    //NSLog(@"progress is %f / %f",(float)[responseData length],(float)_expectedBytes);
    dispatch_async(dispatch_get_main_queue(),^{
        if(_progressHandler){
            _progressHandler(_progress);
        }
    });
    getDataTime++;
}

/**
 * This delegate method is called if the connection cannot be established to the server.  
 * The error object will have a description of the error
 **/
- (void)connection:(NSURLConnection *)connection 
  didFailWithError:(NSError *)error{
    //NSLog(@"Load failed with error %@", [error localizedDescription]);
    self.connError = error;
    if(_completionHandler){
        _completionHandler(NO);
    }
}

/**
 * This delegate method is called when the data load is complete.  The delegate will be released 
 * following this call
 **/
- (void)connectionDidFinishLoading:(NSURLConnection *)connection{
    [responseData writeToFile:_destPath atomically:YES];
    if(_completionHandler){
        _completionHandler(YES);
    }
}

//Server evaluates client's certificate
- (BOOL) shouldTrustProtectionSpace:(NSURLProtectionSpace*)protectionSpace{
    if(sslFile == nil)
        return YES;
    //load the bundle client certificate
    NSString *certPath = [[NSBundle mainBundle] pathForResource:sslFile ofType:@"der"];
    NSData *certData = [[NSData alloc] initWithContentsOfFile:certPath];
    CFDataRef certDataRef = (__bridge CFDataRef)certData;
    SecCertificateRef cert = SecCertificateCreateWithData(NULL, certDataRef);
    
    //Establish a chain of trust anchored on our bundled certificate
    CFArrayRef certArrayRef = CFArrayCreate(NULL, (void*)&cert, 1, NULL);
    SecTrustRef serverTrust = protectionSpace.serverTrust;
    SecTrustSetAnchorCertificates(serverTrust, certArrayRef);
    
    //Verify that trust
    SecTrustResultType trustResult;
    SecTrustEvaluate(serverTrust, &trustResult);
    
    if(trustResult == kSecTrustResultRecoverableTrustFailure){
        CFDataRef errDataRef = SecTrustCopyExceptions(serverTrust);
        SecTrustSetExceptions(serverTrust, errDataRef);
        SecTrustEvaluate(serverTrust, &trustResult);
        CFRelease(errDataRef);
    }

    if (cert){
        CFRelease(cert);
    }
    if (certArrayRef){
        CFRelease(certArrayRef);
    }
    //Did our custom trust chain evaluate successfully?
    return trustResult == kSecTrustResultUnspecified || trustResult == kSecTrustResultProceed;    
}

- (void) connection:(NSURLConnection *)connection willSendRequestForAuthenticationChallenge:(NSURLAuthenticationChallenge *)challenge{
    id <NSURLAuthenticationChallengeSender> sender = challenge.sender;
    NSURLProtectionSpace *protectionSpace = challenge.protectionSpace;
    
    //Should server trust client?
    if([self shouldTrustProtectionSpace:protectionSpace]){
        SecTrustRef trust = [protectionSpace serverTrust];
        NSURLCredential *credential = [NSURLCredential credentialForTrust:trust];
        [sender useCredential:credential forAuthenticationChallenge:challenge];
    }
    else{
        [sender cancelAuthenticationChallenge:challenge];
    }
}

@end

