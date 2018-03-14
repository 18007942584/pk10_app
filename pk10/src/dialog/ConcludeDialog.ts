class ConcludeDialog extends BaseDialog {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView: LoadingUI;

    private closeImage: eui.Image;
    private itemGroup: eui.Group;

    private bankerRewardLabel: eui.Label;//庄家收益
    private myRewardLabel: eui.Label;   //我的收益

    private resultUserList:ResultUser[];
    private bankerReward:number;
    private sound_on:number;
    private room_type:String;    
    private backgroundImage:eui.Image;
    public constructor(gameId:number, roomId:number, bankerReward:number, resultUserList:ResultUser[], room_type:string,sound_on:number) {
        super();
        
        this.resultUserList = resultUserList;
        this.bankerReward = bankerReward;
        this.sound_on=sound_on;
        this.room_type=room_type;
        if(this.room_type=="nine"||this.room_type=="niuniu"||this.room_type=="longhu" || this.room_type=="hongbao" || this.room_type=="pcDanDan")
        {
            this.skinName = "resource/skins/dialog/ConcludeNineDialog.exml";
        }else
        {
            this.skinName = "resource/skins/dialog/ConcludeCarDialog.exml";
        }
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
        for (var i = 0; i < this.resultUserList.length; i++) {

            let resultUser = this.resultUserList[i];
            var button:eui.Button = new eui.Button();
            button.skinName = "resource/skins/dialog/ConcludeDialogCell.exml";

            var nameLabel:eui.Label = button.getChildByName("nameLabel") as (eui.Label);
            nameLabel.text = resultUser.nickname;

            var valueLabel:eui.Label = button.getChildByName("valueLabel") as (eui.Label);
            valueLabel.text = Number(resultUser.number).toFixed(2);

            button.x=0;
            button.y = 40*i;

            button.name = ("button_"+ String(i));            
            this.itemGroup.addChild(button);

            if(myId==resultUser.id)
            {
                myValue = resultUser.number;
            }
        }

        this.myRewardLabel.text = Number(myValue).toFixed(2);
        this.bankerRewardLabel.text = Number(this.bankerReward).toFixed(2);

    }
}


