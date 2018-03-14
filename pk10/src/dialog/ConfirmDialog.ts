class ConfirmDialog extends BaseDialog {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView: LoadingUI;

    private noticeLabel: eui.Label;
    private confirmButton: eui.Label;
    private cancelButton: eui.Label;
    private sound_on:number;
    private backgroundImage:eui.Image;
    public constructor(sound_on:number) {
        super();
        
        this.sound_on=sound_on;
        this.skinName = "resource/skins/dialog/ConfirmDialog.exml";
    }

    /**
     * 创建游戏场景
     * Create a game scene
     */
    public createGameScene() {
        //this.ruleLabel.text = text;

        this.confirmButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.confirmHandler, this);
        this.cancelButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.cancelHandler, this);
        this.backgroundImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.cancelHandler, this);
    }

    private listener:Function;
    public setNotice(notice:string, listener: Function)
    {
        this.noticeLabel.text = notice;
        this.listener = listener;
    }

    public confirmHandler(evt:egret.TouchEvent):void{
        if(this.sound_on){
            Director.getInstance().effectPlay("click_mp3");
        }
        
        this.visible = false;
        this.listener(true);
    }

    public cancelHandler(evt:egret.TouchEvent):void{
        if(this.sound_on){
            Director.getInstance().effectPlay("click_mp3");
        }
        this.visible = false;
        this.listener(false);
    }

}


