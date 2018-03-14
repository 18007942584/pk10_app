class ReceivedHongbaoDlg extends BaseDialog {


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
    public constructor(gameId: number, roomId: number, sound_on: number) {
        super();

        this.gameId = gameId;
        this.roomId = roomId;
        this.sound_on = sound_on;
        this.skinName = "resource/skins/dialog/ShoudaoHongbaoDialog.exml";
        this.GameGroup.removeChildren();
    }
    /**
     * 创建游戏场景
     * Create a game scene
     */
    public createGameScene() {

        this.ShutDownLabel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeHandler, this);
        this.ReceiveImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onNewReceveView, this);
        this.xialaImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.dropDownHandler, this);
        this.DateLabel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.dropDownHandler, this);
        this.CreateDateView();
        this.GameScroller.viewport.validateNow();
        this.GameScroller.viewport.scrollV = 0;
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
            let dateStr = year + "-" + month + "-" + date;
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
        HttpEngine.getInstance().receiveLogs(dateStr, page, row, function (name: string, response: ResReceivelogs) {
            for (var irow in response.rows) {
                let item: OpenReceivelogs = response.rows[irow] as OpenReceivelogs;
                var data = {
                    gameInfo: item,
                    nickname: item.nickname,
                    create_time: item.create_time,
                    bao_number: item.bao_number,
                    ray_code: item.ray_code,
                }
                this.ItemList.push(data);
            }
            this.ShowDataView();
        }, this)

    }
    private ShowDataView() {

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
            var rayLabel: eui.Label = commonGaoup.getChildByName("rayLabel") as (eui.Label);
            nameLabel.text = item.nickname;
            timeLabel.text = item.create_time;
            goldLabel.text = item.bao_number + "元";
            if (item.ray_code == null) {
                rayLabel.text = "无雷";
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