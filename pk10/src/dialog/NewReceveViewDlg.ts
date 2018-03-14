class NweRececeViewDlg extends BaseDialog {

    private gameId: number;
    private roomId: number;
    private sound_on: number;
    private backgroundImage: eui.Image
    private newRobGroup: eui.Group;
    private newSendGroup: eui.Group
    private backGroup: eui.Group

    public constructor(gameId: number, roomId: number, sound_on: number) {
        super();

        this.gameId = gameId;
        this.roomId = roomId;
        this.sound_on = sound_on;
        this.skinName = "resource/skins/dialog/ReceveViewDialog.exml";
    }
    /**
    * 创建游戏场景
    * Create a game scene
    */
    public createGameScene() {

        this.backgroundImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeHandler, this);
        this.backGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeHandler, this);
        this.newRobGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onNewReceveView, this);
        this.newSendGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onNewSendView, this);
    }


    private onNewReceveView(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            Director.getInstance().effectPlay("click_mp3");
        }
        Director.getInstance().showShoudaoHongbaoDlg(this.gameId, this.roomId, this.sound_on, this);
        
    }
    private onNewSendView(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            Director.getInstance().effectPlay("click_mp3");
        }
        Director.getInstance().showsendHongbaoDlg(this.gameId, this.roomId, this.sound_on, this); 
    }
    //关闭当前页面
    private closeHandler(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            Director.getInstance().effectPlay("click_mp3");
        }
        this.visible = false;
    }

}
