class PlayerListDialog extends BaseDialog {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView: LoadingUI;

    private closeImage: eui.Image;

    private cellGroup: eui.Group;//需要删除
    private nameLeftLabel: eui.Label;//模板而已,取颜色
    private nameRightLabel: eui.Label;

    private userCountLabel: eui.Label;
    private itemGroup: eui.Group;//容器
    
    private nickNameList:string[] = null;
    private sound_on:number;
    private backgroundImage:eui.Image;
    public constructor(nicknameList:string[], gameId:number, roomId:number, room_type:string,sound_on:number) {
        super();

        this.sound_on=sound_on;
        this.nickNameList = nicknameList;

        if(room_type=="nine"||room_type=="niuniu")
        {
            this.skinName = "resource/skins/dialog/PlayerListNineDialog.exml";
        }else
        {
            this.skinName = "resource/skins/dialog/PlayerListCarDialog.exml";
        }
        
    }


    /**
     * 创建游戏场景
     * Create a game scene
     */
    public createGameScene() {
        this.closeImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeHandler, this);
        this.backgroundImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeHandler, this);
        this.cellGroup.visible = false;
        this.loadArray();
    }

    private loadArray(): void {
        
        if(this.nickNameList.length!=undefined){
            this.userCountLabel.text = String(this.nickNameList.length>0?this.nickNameList.length:0);
            //双列显示
            let userLeftList=new Array();
            let userRightList=new Array();
            let countLeft=0;
            let countRight=0;
            for (var i = 0; i < this.nickNameList.length; i++) {
                if(i%2==0){
                    userLeftList[countLeft]=this.nickNameList[i];
                    countLeft++;
                }else{
                    userRightList[countRight]=this.nickNameList[i];
                    countRight++;
                }
                
            }
            /*for(var j=0;j<userLeftList.length;j++){
                var left=userLeftList[j];
                if(userRightList[j]){
                    var right=userRightList[j];
                }
                
                var button:eui.Button = new eui.Button();
                button.skinName = "resource/skins/dialog/PlayerListDialogCell.exml";
                //左列
                var nameLeftLabel:eui.Label = button.getChildByName("nameLeftLabel") as (eui.Label);
                nameLeftLabel.textColor = this.nameLeftLabel.textColor;console.log("nameLeftLabel-----------------------------"+nameLeftLabel.textColor);
                nameLeftLabel.text = (j*2+1)+"."+left;console.log("user1-----------------------------"+nameLeftLabel.text);
                //右列
                if(userRightList[j]){
                    var nameRightLabel:eui.Label = button.getChildByName("nameRightLabel") as (eui.Label);
                    nameRightLabel.textColor = this.nameRightLabel.textColor;
                    nameRightLabel.text = (j*2+2)+"."+right;console.log("user2-----------------------------"+right);
                }
                

                button.x=0;
                button.y = 40*i;

                button.name = ("button_"+ String(i));
                
                this.itemGroup.addChild(button);
        }*/
            for (var i = 0; i < userLeftList.length; i++) {
                
                var button:eui.Button = new eui.Button();
                button.skinName = "resource/skins/dialog/PlayerListDialogCell.exml";
                //左列
                var nameLeftLabel:eui.Label = button.getChildByName("nameLeftLabel") as (eui.Label);
                    nameLeftLabel.textColor = this.nameLeftLabel.textColor;
                    nameLeftLabel.text = (2*i+1)+" : "+userLeftList[i];
                //右列
                if(userRightList[i]){
                    var nameRightLabel:eui.Label = button.getChildByName("nameRightLabel") as (eui.Label);
                    nameRightLabel.textColor = this.nameRightLabel.textColor;
                    nameRightLabel.text = (2*i+2)+" : "+userRightList[i];
                }

                button.x=0;
                button.y = 40*i;

                button.name = ("button_"+ String(i));
                
                this.itemGroup.addChild(button);
            }
        }
        

    }

    private closeHandler(evt:egret.TouchEvent): void {
        if(this.sound_on){
            Director.getInstance().effectPlay("click_mp3");
        }
        
		this.visible = false;
	}
   

}


