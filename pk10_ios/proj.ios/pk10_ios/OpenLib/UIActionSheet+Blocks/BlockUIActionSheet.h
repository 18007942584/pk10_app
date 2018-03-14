//
//  BlockUIActionSheet.h
//  GameRaiders
//
//  Created by 辜智科 on 13-9-26.
//  Copyright (c) 2013年 guzhike. All rights reserved.
//

#import <UIKit/UIKit.h>

typedef void(^ActionBlock)(NSInteger);

@interface BlockUIActionSheet : UIActionSheet<UIActionSheetDelegate>

@property(nonatomic,copy)ActionBlock block;


- (id)initWithTitle:(NSString *)title
  cancelButtonTitle:(NSString *)cancelButtonTitle
        clickButton:(ActionBlock)_block
  otherButtonTitles:(NSString *)otherButtonTitles;

- (id)initWithTitle:(NSString *)title
  cancelButtonTitle:(NSString *)cancelButtonTitle
        clickButton:(ActionBlock)_block
  otherButtonTitle1:(NSString *)otherButtonTitle1
  otherButtonTitle2:(NSString *)otherButtonTitle2;
@end
