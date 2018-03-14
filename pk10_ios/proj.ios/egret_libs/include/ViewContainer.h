//
//  ViewContainer.h
//  EgretNativeFramework
//
//  Created by wei huang on 11/26/15.
//  Copyright © 2015 egret. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "ProgressViewDelegate.h"
#import "Deprecation.h"

@class EAGLView;

// Egret 内部API
@interface ViewContainer : UIView<UITextFieldDelegate>

@property (nonatomic) int maxLength;
// 用户自定义的进度条的Delegate
@property (nonatomic) id<ProgressViewDelegate> progressViewDelegate;

@property (nonatomic) int offsetY;
@property (nonatomic) bool isOldVersion;
@property (nonatomic) CGRect originFrame;
@property (nonatomic) NSDictionary * jsonDic;

@property (nonatomic) EAGLView* eaglView;

- (instancetype)initWithFrame:(CGRect)frame;
- (void)enterEditing:(NSString*)jsonString;
- (void)exitEditing;
- (void)updateConfig:(NSString*)jsonString;


- (void)showProgressView;
- (void)updateProgress:(int)progress length:(int)length;
- (void)hideProgressView;
- (void)onGameLoadingError:(NSString*)errMsg;

/** @Deprecation */
- (void)setDownloadProgress:(DownloadProgress)progress addView:(ViewAction)add removeView:(ViewAction)remove;

- (void)setEaglLayerOpaqueNo;

@end
