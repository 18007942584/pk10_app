//
//  BlockUIActionSheet.m
//  GameRaiders
//
//  Created by 辜智科 on 13-9-26.
//  Copyright (c) 2013年 guzhike. All rights reserved.
//

#import "BlockUIActionSheet.h"

@implementation BlockUIActionSheet

@synthesize block;

- (id)initWithTitle:(NSString *)title
  cancelButtonTitle:(NSString *)cancelButtonTitle
        clickButton:(ActionBlock)_block
  otherButtonTitles:(NSString *)otherButtonTitles {
    
    self = [super initWithTitle:title delegate:self cancelButtonTitle:cancelButtonTitle destructiveButtonTitle:nil otherButtonTitles:otherButtonTitles, nil];
    
    if (self) {
        self.block = _block;
    }
    
    return self;
}

- (id)initWithTitle:(NSString *)title
  cancelButtonTitle:(NSString *)cancelButtonTitle
        clickButton:(ActionBlock)_block
  otherButtonTitle1:(NSString *)otherButtonTitle1
  otherButtonTitle2:(NSString *)otherButtonTitle2{
    
    self = [super initWithTitle:title delegate:self cancelButtonTitle:cancelButtonTitle destructiveButtonTitle:nil otherButtonTitles:otherButtonTitle1, otherButtonTitle2, nil];
    
    if (self) {
        self.block = _block;
    }
    
    return self;
}

- (void)actionSheet:(UIActionSheet *)actionSheet clickedButtonAtIndex:(NSInteger)buttonIndex
{
    self.block(buttonIndex);
}

@end
