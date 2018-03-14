class SendHongbaoDlg extends BaseDialog {


    private gameId: number;
    private roomId: number;
    private sound_on: number;
    private ReceiveImage: eui.Image
    private ShutDownLabel: eui.Label
    private page: number = 1;
    private row: number = 10;
    private xialaImage: eui.Image;
    private DateLabel: eui.Label;
    private ItemList: any[] = null;
    private dateListGroup: eui.Group;
    private GameGroup: eui.Group;
    private dateListScrollerGroup: eui.Group;
    private GameScroller: eui.Scroller
    private NameLabel: eui.Label;
    private totalLabel: eui.Label;
    private SendLabel: eui.Label;
    private errorLebel: eui.Label;
    public constructor(gameId: number, roomId: number, sound_on: number) {
        super();

        this.gameId = gameId;
        this.roomId = roomId;
        this.sound_on = sound_on;
        this.skinName = "resource/skins/dialog/SendHongbaoDialog.exml";
        this.GameGroup.removeChildren();
    }
    /**
     * 创建游戏场景
     * Create a game scene
     */
    public createGameScene() {

        this.ShutDownLabel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeHandler, this);
        //this.ReceiveImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onNewReceveView, this);
        this.xialaImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.dropDownHandler, this);
        this.DateLabel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.dropDownHandler, this);
        this.CreateDateView();
        this.GameScroller.viewport.validateNow();
        this.GameScroller.viewport.scrollV = 0;
        this.totalLabel.visible = false;
        this.NameLabel.visible = false;
        this.SendLabel.visible = false;
        this.errorLebel.visible = false;
    }
    private CreateDateView() {

        let todayTicket = Number(new Date());
        this.dateListGroup.visible = false;
        for (let i = 0; i < 30; i++) {
            let ticketNeed = todayTicket - 86400 * 1000 * i;
            let dateNeed: Date = new Date(ticketNeed);
            let year = String(dateNeed.getFullYear());
            let month = (dateNeed.getMonth() + 1) >= 10 ? String(dateNeed.getMonth() + 1) : "0" + String(dateNeed.getMonth() + 1);
            let date = (dateNeed.getDate()) >= 10 ? String(dateNeed.getDate()) : "0" + String(dateNeed.getDate());
            var dateStr = year + "-" + month + "-" + date;
            let dateLabel: eui.Label = new eui.Label();
            dateLabel.text = dateStr;
            dateLabel.size = 20;
            dateLabel.x = 0;
            dateLabel.y = i * 44;
            dateLabel.width = this.dateListScrollerGroup.width;
            dateLabel.height = 44;
            dateLabel.textColor = 0x000000;
            dateLabel.textAlign = egret.HorizontalAlign.CENTER;
            dateLabel.name = dateStr;
            dateLabel.touchEnabled = true;
            this.dateListScrollerGroup.addChild(dateLabel);
            dateLabel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.dateClickedHandler, this)

            if (i == 0) {

                this.reloadBetLogList(dateStr, this.page, this.row);
            }
        }
    }
    private dropDownHandler(): void {
        this.dateListGroup.visible = !this.dateListGroup.visible;
    }
    private dateClickedHandler(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            Director.getInstance().effectPlay("click_mp3");
        }
        this.dropDownHandler();
        let target: eui.Label = evt.target;
        let date = target.name;
        this.GameGroup.removeChildren();
        this.GameScroller.viewport.validateNow();
        this.GameScroller.viewport.scrollV = 0;
        this.reloadBetLogList(date, this.page, this.row);
    }
    private reloadBetLogList(dateStr: string, page: number, row: number) {
        this.DateLabel.text = dateStr;
        this.ItemList = new Array();
        var userInfo: UserInfo = ClientStorage.getUserInfo();
        HttpEngine.getInstance().sendLogs(dateStr, page, row, function (name: string, response: RessendLogs) {
            if (response.rows.length != 0) {
                this.NameLabel.text = userInfo.nickname + "共发出";
                this.totalLabel.text = response.total + "元";
                this.SendLabel.text = "发出" + response.count + "个红包";
                this.totalLabel.visible = true;
                this.NameLabel.visible = true;
                this.SendLabel.visible = true;
                this.errorLebel.visible = false;
                for (var irow in response.rows) {
                    let item: OpenSendlogs = response.rows[irow] as OpenSendlogs;
                    var data = {
                        gameInfo: item,
                        title: item.title,
                        create_time: item.create_time,
                        total: item.total,
                        ray_code: item.ray_code,
                    }
                    this.ItemList.push(data);
                }
                this.ShowDataView();
            } else {
                this.totalLabel.visible = false;
                this.NameLabel.visible = false;
                this.SendLabel.visible = false;
                this.errorLebel.visible = true;
            } 
        }, this)

    }
    private ShowDataView() {
        let iarray: any[] = new Array();
        iarray = this.ItemList.reverse();
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
            var rayLabel: eui.Label = commonGaoup.getChildByName("rayLabel") as (eui.Label);

            nameLabel.text = item.title;
            timeLabel.text = item.create_time;
            goldLabel.text = item.total + "元";
            if (item.ray_code == null) {
                rayLabel.text = "请等待开奖...";
            } else {
                rayLabel.text = "雷号：" + item.ray_code;
            }
            this.GameGroup.addChild(BtnrewardSelec);
        }

    }
    private onNewReceveView(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            Director.getInstance().effectPlay("click_mp3");
        }
        Director.getInstance().showRececeViewDlg(this.gameId, this.roomId, this.sound_on, this);
    }
    //关闭当前页面
    private closeHandler(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            Director.getInstance().effectPlay("click_mp3");
        }
        this.visible = false;
    }
}