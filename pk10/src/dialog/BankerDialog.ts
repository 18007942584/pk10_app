class BankerDialog extends BaseDialog {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView: LoadingUI;

    //private closeImage: eui.Image;
    private itemGroup: eui.Group;

    private bankerRewardLabel: eui.Label;//庄家收益
    private myRewardLabel: eui.Label;   //我的收益

    private resultUserList:ResultUser[];
    private bankerReward:number;
    private sound_on:number;
    private room_type:String;    
    private backgroundImage:eui.Image;

    private confirmButton:eui.Button;
    private cancelButton:eui.Button;

    private bankCounTextInput: egret.TextField;

    public constructor(room_type:string) {
        super();
        
        //this.resultUserList = resultUserList;
        //this.bankerReward = bankerReward;
        //this.sound_on=sound_on;
        this.room_type=room_type;
        if(this.room_type=="nine"||this.room_type=="niuniu"||this.room_type=="longhu")
        {
            this.skinName = "resource/skins/dialog/BankerNineDialog.exml";
        }else
        {
            this.skinName = "resource/skins/dialog/BankerNineDialog.exml";
        }
    }

    /**
     * 创建游戏场景
     * Create a game scene
     */
    public createGameScene() {
        //this.closeImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeHandler, this);
        this.backgroundImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeHandler, this);
        this.confirmButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.confirmHandler, this);
        this.cancelButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.cancelHandler, this);
        
    }

    private closeHandler(evt:egret.TouchEvent): void {
        if(this.sound_on){
            Director.getInstance().effectPlay("click_mp3");
        }
		this.visible = false;
	}

    private listener:Function;
    private context;
    public setListener(listener: Function, context:any)
    {
        this.listener = listener;
        this.context = context;
    }

    public confirmHandler(evt:egret.TouchEvent):void{
        if(this.sound_on){
            Director.getInstance().effectPlay("click_mp3");
        }
        
        let str = this.bankCounTextInput.text;
        let count = Number(str);
        this.visible = false;
        //this.listener(str);

        var observer:Observer = new Observer(this.listener, this.listener);
        observer.notify(name, count);
    }

    public cancelHandler(evt:egret.TouchEvent):void{
        if(this.sound_on){
            Director.getInstance().effectPlay("click_mp3");
        }
        this.visible = false;
        //this.listener("");

        var observer:Observer = new Observer(this.listener, this.context);
        observer.notify(name, 0);
    }
   
}


