//
//  EGTPhotoPicker.h
//  EgretNativeFramework
//
//  Created by Knight on 2016/12/26.
//  Copyright © 2016年 egret. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface EGTPhotoPicker : NSObject<UINavigationControllerDelegate,UIImagePickerControllerDelegate>
- (void)start:(void(^)(NSData *data))completionHandler;
+ (BOOL)isSwitchIntoPhotoPicker;
+ (BOOL)isSwitchFromPhotoPicker;
+ (void)setIsSwitchFromPhotoPicker:(BOOL) value;
+ (EGTPhotoPicker*) getInstance;
@end
