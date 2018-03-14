class RuleCaihongbaoDialog extends BaseDialog {

    private caihongbao: eui.Image;
    private PackageGroup: eui.Group;
    private OpenGroup: eui.Group;
    private ExitImage: eui.Image;
    private show_state: boolean;
    private backgroundImage: eui.Image;
    private HongbaoID: number;
    private NameLabel: eui.Label;
    private ItemList: any[] = null;
    private BaoId: number;
    private GameGroup: eui.Group;
    private GameScroller: eui.Scroller
    private TxteLabel: eui.Label;
    private GodlNumLabel: eui.Label;
    private TimeLabel: eui.Label;
    private TheDetailImage: eui.Label
    private gameId: number
    private roomId: number;
    private sound_on: number;
    public constructor(id: number, gameId: number, roomId: number, sound_on: number) {
        super();
        this.BaoId = id;
        this.gameId = gameId;
        this.roomId = roomId;
        this.sound_on = sound_on;
        this.skinName = "resource/skins/dialog/RuleViewCaihongbaoDlg.exml";
    }
    public createGameScene() {

        this.ExitImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeHandler, this);
        HttpEngine.getInstance().baoinfo(this.BaoId, this.updateTimerHandler, this)
        this.TheDetailImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onThedateil, this);
        this.GameScroller.viewport.validateNow();
        this.GameScroller.viewport.scrollV = 0;


    }

    private updateTimerHandler(name: string, response: ResbaoInfo): void {
        this.ItemList = new Array();
        if (response.error != 0) {
            Toast.launch(response.msg);
            return;
        }
        let info = response.info
        for (var row in response.rows) {
            var item: OpenResulbaorows = response.rows[row] as OpenResulbaorows;
            var data = {
                gameInfo: item,
                baonumber: item.bao_number,
                createtime: item.create_time,
                nickname: item.nickname,
              
            }
            this.ItemList.push(data);

        }
        this.NameLabel.text = info.nickname + "的红包";
        this.GodlNumLabel.text = item.bao_number + "元";
        this.TimeLabel.text = "抢到" + item.bao_number + "元，等待开奖"
        if(info.receive_number == info.number){
            this.TxteLabel.text = info.number + "个红包共" + info.total + "元，" + info.time + "秒被抢光"
        }else{
            this.TxteLabel.text = "已领取"+info.receive_number + "/"+ info.number+"个，共"+info.receive_price + "/" + info.total + "元";
        }
        
        this.updateRewardSelec();
    }
    private updateRewardSelec() {
        let iarray: any[] = new Array();
        iarray = this.ItemList;
        for (var i = 0; i < iarray.length; i++) {
            let item = iarray[i];
            var BtnrewardSelec = new eui.Button();
            BtnrewardSelec.skinName = "resource/skins/dialog/CommonHongbaoDialog.exml"
            BtnrewardSelec.x = 0;
            BtnrewardSelec.y = 135 * i;
            var commonGaoup: eui.Group = BtnrewardSelec.getChildByName("CommonGaoup") as (eui.Group);
            var nameLabel: eui.Label = commonGaoup.getChildByName("NameLabel") as (eui.Label);
            var timeLabel: eui.Label = commonGaoup.getChildByName("TimeLabel") as (eui.Label);
            var goldLabel: eui.Label = commonGaoup.getChildByName("GoldLabel") as (eui.Label);
            nameLabel.text = item.nickname;
            timeLabel.text = item.createtime;
            goldLabel.text = item.baonumber + "元",
                this.GameGroup.addChild(BtnrewardSelec);
        }

    }
    //红包明细
    private onThedateil(evt: egret.TouchEvent): void {

        if (this.sound_on) {
            Director.getInstance().effectPlay("click_mp3");
        }
        Director.getInstance().showRececeViewDlg(this.gameId, this.roomId, this.sound_on, this);

    }
    //private RuleNineDialog:RuleNineDialog = null;
    private closeHandler(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            Director.getInstance().effectPlay("click_mp3");
        }
        //this.parent.removeChild(this);
        this.visible = false;
    }

}


