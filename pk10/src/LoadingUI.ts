//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class LoadingUI extends eui.Component {
 
    private loadingLabel: eui.Label;
    private loadingGroup: eui.Group;
    private loadingLength: number = 500;
    private loadingBgImag:eui.Image;
    private stripBgImage:eui.Image;
    private progressImage:eui.Image;
    
    public constructor() {
        super();
        this.skinName = "resource/skins/scene/LoadingUISkin.exml";

        this.loadingBgImag = new eui.Image();
        this.loadingGroup=new eui.Group();
        this.stripBgImage = new eui.Image();
        this.progressImage = new eui.Image();
        this.loadingLabel = new eui.Label();

        let channelName = CommonConfig.getChannelName();
        if(channelName=="mfpk10"){
            //明发加载背景图
            this.loadingBgImag.source="loading_bg_mf_png";
        }else{
            this.loadingBgImag.source="loading_bg_new_1_png";
        }
        
        this.loadingBgImag.width=640;
        this.loadingBgImag.height=1136;
        this.loadingGroup.x=70;
        this.loadingGroup.y=540;
        this.loadingGroup.width-500;
        this.loadingGroup.height=20;
        this.stripBgImage.x=1;
        this.stripBgImage.y=1;
        this.stripBgImage.width=500;
        this.stripBgImage.height=20;
        this.stripBgImage.source="";
        this.progressImage.x=1;
        this.progressImage.y=410;
        this.progressImage.width=0;
        this.progressImage.height=20;
        this.progressImage.source="strip_length_png";
        this.loadingLabel.x=170;
        this.loadingLabel.y=480;
        //this.loadingLabel.width=160;
        this.loadingLabel.height=30;
        this.loadingLabel.textAlign="center";
        this.loadingLabel.fontFamily="SimHei";

        this.addChild(this.loadingBgImag);
        this.addChild(this.loadingGroup);
        
        this.loadingGroup.addChild(this.stripBgImage);
        this.loadingGroup.addChild(this.progressImage);
        this.loadingGroup.addChild(this.loadingLabel);
    }

    public setProgress(current,total): void {
        //this.loadingLabel.text = "" + Math.floor((current / total) * 100) + "%";
        //this.loadingGroup.x += Math.floor(this.loadingLength / total);
        this.loadingLabel.text = (current % 20==1)? "正在加载资源.":((current % 20 ==10)?"正在加载资源..":(current % 20 ==19)?"正在加载资源...":"正在加载资源.");//current+"/"+total;
        this.progressImage.width=Math.floor((current / total) * 500);
    }
}
