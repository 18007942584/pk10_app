class ServiceDialog extends BaseDialog {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView: LoadingUI;

    private closeImage: eui.Image;
    private confirmButton: eui.Button;

    private qqLabel:eui.Label;
    private weixinLabel:eui.Label;

    private sound_on:number;

    private backgroundImage: eui.Image;
    public constructor(sound_on:number) {
        super();
        this.sound_on=sound_on;

        this.skinName = "resource/skins/dialog/ServiceDialog.exml";
    }

    /**
     * 创建游戏场景
     * Create a game scene
     */
    public createGameScene() {
        this.closeImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeHandler, this);
        this.confirmButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeHandler, this);
        this.backgroundImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeHandler, this);
        
        this.qqLabel.text = "QQ:"+CommonConfig.gameConfig.cs_qq;
        this.weixinLabel.text = "微信:"+CommonConfig.gameConfig.cs_wx;console.log("CommonConfig.gameConfig.cs_wx>>>>>>>>>>>"+CommonConfig.gameConfig.cs_wx);
    }

    private closeHandler(evt:egret.TouchEvent): void {
        if(this.sound_on){
            Director.getInstance().effectPlay("click_mp3");
        }
		this.visible = false;
	}
   

}


