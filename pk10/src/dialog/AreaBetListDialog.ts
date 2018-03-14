class AreaBetListDialog extends BaseDialog {

    private closeImage: eui.Image;
    private itemGroup: eui.Group;

    private areaBetList:AreaBet[];
    private sound_on:boolean;

    private backgroundImage:eui.Image;
    public constructor(areaBetList:AreaBet[], sound_on:boolean) {
        super();
        
        this.areaBetList = areaBetList;
        this.skinName = "resource/skins/dialog/AreaBetListDialog.exml";
    }

    /**
     * 创建游戏场景
     * Create a game scene
     */
    public createGameScene() {
        this.closeImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeHandler, this);
        this.backgroundImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeHandler, this);
        this.loadArray();
    }

    private closeHandler(evt:egret.TouchEvent): void {
        if(this.sound_on){
            Director.getInstance().effectPlay("click_mp3");
        }
		this.visible = false;
	}
   
    private loadArray(): void {
        let myId = ClientStorage.getUserInfo().id;
        let myValue = 0;
        //let arr = GlobalData.configData.game.hallbtns;
        for (var i = 0; i < this.areaBetList.length; i++) {

            let areaBet:AreaBet = this.areaBetList[i];console.log("areaBet>>>>>>>>>>>>>>>>"+areaBet.bet_rate);
            var button:eui.Button = new eui.Button();
            button.skinName = "resource/skins/dialog/AreaBetListDialogCell.exml";

            var nameLabel:eui.Label = button.getChildByName("nameLabel") as (eui.Label);
            nameLabel.text = areaBet.nickname;

            var valueLabel:eui.Label = button.getChildByName("valueLabel") as (eui.Label);
            valueLabel.text = String(areaBet.bet);

            var betRateLabel:eui.Label = button.getChildByName("betRateLabel") as (eui.Label);
            betRateLabel.text = String(areaBet.bet_rate)+"%";

            button.x=0;
            button.y = 40*i;

            button.name = ("button_"+ String(i));            
            this.itemGroup.addChild(button);

        }

    }
}


