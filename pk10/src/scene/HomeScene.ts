
class HomeScene extends BaseScene {

    private itemGroup: eui.Group;
    private codeGroup: eui.Group;
    private closeButton: eui.Button;

    private nameLabel: eui.Label;
    private balanceLabel: eui.Label;
    private cartButton: eui.Button;

    private itemList: any[] = null;
    private timeList: any[] = null;

    private tikuanImage: eui.Image;
    private chongzhiImage: eui.Image;
    private serviceImage: eui.Image;
    private codeImage: eui.Image;

    //游戏公告
    private noticeGroup: eui.Group;
    private noticeLabel: eui.Label;

    //音效开关
    private soundButton: eui.Button;
    private sound_on = 1;

    //在线人数
    private onlineCountLabel: eui.Label;
    private onlineNum_1: eui.Label;
    private onlineNum_2: eui.Label;
    private onlineNum_3: eui.Label;
    private onlineNum_4: eui.Label;
    private onlineNum_5: eui.Label;
    private onlineNum_6: eui.Label;
    private onlineNum_7: eui.Label;
    private onlineNum_8: eui.Label;


    //触摸点位置
    public beginPositionX: number;
    public beginPositionY: number;
    public movePositionX: number;
    public movePositionY: number;

    public UserId: eui.Label;               //用户ID
    public TehUser: eui.Label;              //用户账号
    public UserName: eui.Label;              //玩家姓名
    public GoldNum: eui.Label;              //用户金币
    public NoerList: eui.Label;              //期数列表
    public NoerGold: eui.Label;              //期数金币
    public FreezingGoldNum: eui.Label;         //冻结金额
    public touzhuDetailsImage: eui.Image;//投注明细
    private exitButton: eui.Button;     //退出登录
    private serviceButton: eui.Button;  //联系客服
    private todayResultLabel: eui.Label; //当日盈亏
    private todayLonghuResultLabel: eui.Label; //今日龙虎下注额

    private gameMainGroup: eui.Group;
    private mainScroller: eui.Scroller;
    private PlayerScroller: eui.Scroller;
    private betLogGroup: eui.Group

    private detailsHeadGroup: eui.Group;
    private detailsMainGroup: eui.Group;

    private timeLabel: eui.Label;
    private resultValueLabel: eui.Label;
    private gameDetailLabel: eui.Label;

    //分页投注明细
    private page: number = 1;
    private row: number = 10;
    private lastPageLabel: eui.Label;
    private nextPageLabel: eui.Label;
    private currentPageLabel: eui.Label;
    private totalPageLabel: eui.Label;

    public gameId: number;
    public roomId: number;
    public constructor() {
        super();
        this.skinName = "resource/skins/scene/HomeSceneSkin.exml";
    }

    public onPopScene() {

    }
    public setRoomData(gameId, roomInfo: RoomInfo) {
        this.gameId = gameId;
        this.roomId = roomInfo.id;

    }

    //别人弹出栈，自己重新显示
    public onSceneReshow() {
        console.log("reloadUserInfo>>>>>>>>>>>>>>>>>>>>" + 1);
        this.reloadUserInfo();
        HttpEngine.getInstance().getNewExpect(this.getNewExpectHandler, this)
    }


    //不显示加载进度
    public privodeNeedShowLoading() {
        return false;
    }


    /**
     * 创建游戏场景
     * Create a game scene
     */
    public createGameScene() {
        var userInfo = ClientStorage.getUserInfo();
        this.nameLabel.text = userInfo.nickname;
        this.balanceLabel.text = Number(userInfo.balance).toFixed(2);

        // this.PlayerDateScene();
        this.mainScroller.viewport.contentWidth = 1140;
        this.mainScroller.viewport.scrollH = 0;
        //监听游戏主页面手势，判断滑动
        this.gameMainGroup.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.swipeBeginHandler, this);


        var httpEngie: HttpEngine = HttpEngine.getInstance();
        //获取最新游戏公告
        httpEngie.getNotice(function (name: string, ResponseNotice: ResponseNotice) {
            if (ResponseNotice.error != 0) {
                Toast.launch(ResponseNotice.msg);
                return;
            }
            var info = ResponseNotice.info;
            this.noticeLabel.text = info.content;
            this.noticeLabel.x = 635;
            var targetX = 0 - Number(this.noticeLabel.width);
            var tw = egret.Tween.get(this.noticeLabel);
            tw.to({ x: targetX }, 8000).call(this.onScrollNoticeEnd, this, []);
        }, this)

        //获取当前在线总人数
        httpEngie.getOnlinecount(function (name: string, ResponseOnlinecount: ResponseOnlinecount) {
            if (ResponseOnlinecount.error != 0) {
                Toast.launch(ResponseOnlinecount.msg);
                return;
            }
            var count = ResponseOnlinecount.count;
            this.onlineCountLabel.text = count;
            Toast.launch(ResponseOnlinecount.msg);
        }, this);


        this.tikuanImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onServiceHandler, this);
        this.chongzhiImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onServiceHandler, this);
        this.serviceImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onServiceHandler, this);
        this.serviceButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onServiceHandler, this);
        this.exitButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.exitHandler, this);
        //投注明细弹窗监听
        this.touzhuDetailsImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouzhuDetailsHandler, this);
        HttpEngine.getInstance().getGameList(this.getGameListHandler, this);

        //投注明细翻页
        this.lastPageLabel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.lastPageHandler, this);
        this.nextPageLabel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.nextPageHandler, this);

        this.reloadUserInfo();

        var timer: egret.Timer = new egret.Timer(1000, 0);
        timer.addEventListener(egret.TimerEvent.TIMER, this.updateTimerHandler, this);
        timer.start();
    }

    public onInit() {

    }

    //监听公告单次滚动结束事件
    private onScrollNoticeEnd(): void {
        this.noticeLabel.x = 635;
        var targetX = 0 - Number(this.noticeLabel.width);
        var tw = egret.Tween.get(this.noticeLabel);
        tw.to({ x: 0 - targetX }, 8000).call(this.onScrollNoticeEnd, this, []);
    }

    //游戏主页面手势开始事件
    private swipeBeginHandler(evt: egret.TouchEvent): void {
        //记录触摸点位置
        this.beginPositionX = evt.stageX;
        this.beginPositionY = evt.stageY;
        //判断当前是否有左右滑出页面，有的话点击非滑出页面区域则复原
        if (this.mainScroller.viewport.scrollH == 500) {
            this.showCenter();

        } else {
            //监听手势滑动事件
            this.gameMainGroup.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.swipeHandler, this);
        }
    }
    private swipeHandler(evt: egret.TouchEvent): void {
        // console.log("movePositionX:", evt.stageX);
        //记录触摸点变化位置
        this.movePositionX = evt.stageX;
        this.movePositionY = evt.stageY;
        //stageY阈值控制
        if (this.movePositionY - this.beginPositionY > 100) {

            this.gameMainGroup.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.swipeHandler, this);
        }
        //stageX阈值控制
        //左滑动
        if (this.movePositionX - this.beginPositionX < -100) {
            console.log(this.mainScroller.viewport.scrollH);

            if (this.mainScroller.viewport.scrollH < 1 || this.mainScroller.viewport.scrollH >= 500) {
                console.log(1);
                this.showRight();

            } else {
                this.showCenter();
            }
            this.gameMainGroup.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.swipeHandler, this);
        }
    }
    private showCenter() {
        //console.log("中间! direction:"+this.direction+"  lastX:"+this.lastX+" currentX:"+this.currentX);
        var that = this;
        var tw = egret.Tween.get(this.mainScroller.viewport);
        tw.to({ scrollH: 0 }, 200).call(function () {

        });
    }
    private showRight() {
        var that = this;
        //console.log("右边! direction:"+this.direction+"  lastX:"+this.lastX+" currentX:"+this.currentX);
        var tw = egret.Tween.get(this.mainScroller.viewport);
        tw.to({ scrollH: 500 }, 200).call(function () {
            that.reloadBetLogList();

        });
        var userInfo: UserInfo = ClientStorage.getUserInfo();
        this.UserId.text = userInfo.id;
        this.TehUser.text = userInfo.user_name;
        this.UserName.text = userInfo.nickname;
        this.GoldNum.text = Number(userInfo.balance).toFixed(2);
        this.FreezingGoldNum.text = "（冻结:" + userInfo.freeze_price + "）";
    }

    //上一页
    private lastPageHandler() {
        if (this.currentPageLabel.text == "1") {
            return;
        }
        let todayTicket = Number(new Date());
        let ticketNeed = todayTicket;
        let dateNeed: Date = new Date(ticketNeed);
        let year = String(dateNeed.getFullYear());
        let month = (dateNeed.getMonth() + 1) >= 10 ? String(dateNeed.getMonth() + 1) : "0" + String(dateNeed.getMonth() + 1);
        let date = (dateNeed.getDate()) >= 10 ? String(dateNeed.getDate()) : "0" + String(dateNeed.getDate());
        let dateStr = year + "-" + month + "-" + date;
        this.page--;
        this.reloadBetLogList();
    }

    //下一页
    private nextPageHandler() {
        if (this.currentPageLabel.text == this.totalPageLabel.text) {
            return;
        }
        let todayTicket = Number(new Date());
        let ticketNeed = todayTicket;
        let dateNeed: Date = new Date(ticketNeed);
        let year = String(dateNeed.getFullYear());
        let month = (dateNeed.getMonth() + 1) >= 10 ? String(dateNeed.getMonth() + 1) : "0" + String(dateNeed.getMonth() + 1);
        let date = (dateNeed.getDate()) >= 10 ? String(dateNeed.getDate()) : "0" + String(dateNeed.getDate());
        let dateStr = year + "-" + month + "-" + date;
        this.page++;
        this.reloadBetLogList();
    }

    private betLogsCount;
    private reloadBetLogList() {
        let date: Date = new Date();
        let that = this;
        let year = String(date.getFullYear());
        let month = (date.getMonth() + 1 < 10) ? "0" + String(date.getMonth() + 1) : String(date.getMonth() + 1);
        let day = (date.getDate() < 10) ? "0" + String(date.getDate()) : String(date.getDate());
        let dateStr = year + "-" + month + "-" + day;
        //四海定制，个人中心显示今日龙虎下注额
        let channelName = CommonConfig.getChannelName();
        if (channelName == 'shpk10') {
            //获取今日龙虎下注额
            that.todayLonghuResultLabel.visible = true;
            let room_id: Number = 4;//龙虎固定房间id
            HttpEngine.getInstance().getLonghuBet(room_id, dateStr, function (name: string, response: ResponseLonghuBet) {
                that.todayLonghuResultLabel.text = "今日龙虎下注额：" + String(response.total) + "筹码";
            }, that);
        } else {
            that.todayLonghuResultLabel.visible = false;
            that.todayResultLabel.y = 891.66;
        }



        this.betLogGroup.removeChildren();
        var all = 1;
        let room_names = ['牌九', '牛牛', '推筒子', '龙虎', '龙虎斗', '单张', '猴赛雷', 'PC蛋蛋'];
        HttpEngine.getInstance().getBetLog(all, dateStr, this.page, this.row, function (name: string, response: ResponseBetLogs) {
            this.currentPageLabel.text = this.page;
            let count = response.count != null ? response.count : 0;
            this.totalPageLabel.text = Math.ceil(count / this.row);
            this.betLogsCount = response.rows.length != null ? response.rows.length : 0;
            for (var i = 0; i < response.rows.length; ++i) {
                let betLogInfo: BetLogInfo = response.rows[i];
                var betInfoCell: eui.Button = new eui.Button();
                //引入不同玩法投注明细皮肤
                if (betLogInfo['room_name'].indexOf(room_names[0]) >= 0 || betLogInfo['room_name'].indexOf(room_names[5]) >= 0 || betLogInfo['room_name'].indexOf(room_names[2]) >= 0) {
                    betInfoCell.skinName = "resource/skins/scene/BetPaijiuInfoCell.exml";
                    var betCellGroup: eui.Group = betInfoCell.getChildByName("betCellGroup") as (eui.Group);
                    var detailCellBgImage: eui.Image = betCellGroup.getChildByName("detailCellBgImage") as (eui.Image);
                    var detailsHeadGroup: eui.Group = betCellGroup.getChildByName("detailsHeadGroup") as (eui.Group);
                    var detailsMainGroup: eui.Group = betCellGroup.getChildByName("detailsMainGroup") as (eui.Group);
                    //头部信息
                    var detailsShowImage: eui.Image = detailsHeadGroup.getChildByName("detailsShowImage") as (eui.Image);
                    var timeLabel: eui.Label = detailsHeadGroup.getChildByName("timeLabel") as (eui.Label);
                    var resultValueLabel: eui.Label = detailsHeadGroup.getChildByName("resultValueLabel") as (eui.Label);
                    var gameDetailLabel: eui.Label = detailsHeadGroup.getChildByName("gameDetailLabel") as (eui.Label);
                    timeLabel.text = betLogInfo['opentime'];
                    resultValueLabel.text = String(betLogInfo['result']);
                    resultValueLabel.textColor = betLogInfo['result'] > 0 ? 0x3ADB0F : 0xC31616;
                    gameDetailLabel.text = "[" + betLogInfo['game_name'] + "-" + betLogInfo['expect'] + "期-" + betLogInfo['room_name'] + "]";
                    //详细信息
                    //每一门点数
                    var men_1_label: eui.Label = detailsMainGroup.getChildByName("men_1_label") as (eui.Label);
                    var men_2_label: eui.Label = detailsMainGroup.getChildByName("men_2_label") as (eui.Label);
                    var men_3_label: eui.Label = detailsMainGroup.getChildByName("men_3_label") as (eui.Label);
                    var men_4_label: eui.Label = detailsMainGroup.getChildByName("men_4_label") as (eui.Label);
                    var men_5_label: eui.Label = detailsMainGroup.getChildByName("men_5_label") as (eui.Label);

                    if (betLogInfo['room_name'].indexOf(room_names[5]) >= 0) {
                        men_1_label.text = String(betLogInfo['areas'][0]['code']);
                        men_2_label.text = String(betLogInfo['areas'][1]['code']);
                        men_3_label.text = String(betLogInfo['areas'][2]['code']);
                        men_4_label.text = String(betLogInfo['areas'][3]['code']);
                        men_5_label.text = String(betLogInfo['areas'][4]['code']);
                    } else {
                        men_1_label.text = betLogInfo['areas'][0]['code1'] + " " + betLogInfo['areas'][0]['code2'];
                        men_2_label.text = betLogInfo['areas'][1]['code1'] + " " + betLogInfo['areas'][1]['code2'];
                        men_3_label.text = betLogInfo['areas'][2]['code1'] + " " + betLogInfo['areas'][2]['code2'];
                        men_4_label.text = betLogInfo['areas'][3]['code1'] + " " + betLogInfo['areas'][3]['code2'];
                        men_5_label.text = betLogInfo['areas'][4]['code1'] + " " + betLogInfo['areas'][4]['code2'];
                    }

                    //每一门排名
                    var Men1Image: eui.Image = detailsMainGroup.getChildByName("Men1Image") as (eui.Image);
                    var Men2Image: eui.Image = detailsMainGroup.getChildByName("Men2Image") as (eui.Image);
                    var Men3Image: eui.Image = detailsMainGroup.getChildByName("Men3Image") as (eui.Image);
                    var Men4Image: eui.Image = detailsMainGroup.getChildByName("Men4Image") as (eui.Image);
                    var Men5Image: eui.Image = detailsMainGroup.getChildByName("Men5Image") as (eui.Image);

                    Men1Image.source = this.getDetailsRankImage(betLogInfo['areas'][0]['ranking']);
                    Men2Image.source = this.getDetailsRankImage(betLogInfo['areas'][1]['ranking']);
                    Men3Image.source = this.getDetailsRankImage(betLogInfo['areas'][2]['ranking']);
                    Men4Image.source = this.getDetailsRankImage(betLogInfo['areas'][3]['ranking']);
                    Men5Image.source = this.getDetailsRankImage(betLogInfo['areas'][4]['ranking']);
                    //每一门庄是否庄
                    var Men1ZhuangImage: eui.Image = detailsMainGroup.getChildByName("Men1ZhuangImage") as (eui.Image);
                    var Men2ZhuangImage: eui.Image = detailsMainGroup.getChildByName("Men2ZhuangImage") as (eui.Image);
                    var Men3ZhuangImage: eui.Image = detailsMainGroup.getChildByName("Men3ZhuangImage") as (eui.Image);
                    var Men4ZhuangImage: eui.Image = detailsMainGroup.getChildByName("Men4ZhuangImage") as (eui.Image);
                    var Men5ZhuangImage: eui.Image = detailsMainGroup.getChildByName("Men5ZhuangImage") as (eui.Image);

                    Men1ZhuangImage.visible = betLogInfo['areas'][0]['banker_area'] == 1 ? true : false;
                    Men2ZhuangImage.visible = betLogInfo['areas'][1]['banker_area'] == 1 ? true : false;
                    Men3ZhuangImage.visible = betLogInfo['areas'][2]['banker_area'] == 1 ? true : false;
                    Men4ZhuangImage.visible = betLogInfo['areas'][3]['banker_area'] == 1 ? true : false;
                    Men5ZhuangImage.visible = betLogInfo['areas'][4]['banker_area'] == 1 ? true : false;
                    //每一门区域投注总额
                    var area_1_totalbet_label: eui.Label = detailsMainGroup.getChildByName("area_1_totalbet_label") as (eui.Label);
                    var area_2_totalbet_label: eui.Label = detailsMainGroup.getChildByName("area_2_totalbet_label") as (eui.Label);
                    var area_3_totalbet_label: eui.Label = detailsMainGroup.getChildByName("area_3_totalbet_label") as (eui.Label);
                    var area_4_totalbet_label: eui.Label = detailsMainGroup.getChildByName("area_4_totalbet_label") as (eui.Label);
                    var area_5_totalbet_label: eui.Label = detailsMainGroup.getChildByName("area_5_totalbet_label") as (eui.Label);

                    area_1_totalbet_label.text = betLogInfo['areas'][0]['area_bet'] != null ? betLogInfo['areas'][0]['area_bet'] : "0";
                    area_2_totalbet_label.text = betLogInfo['areas'][1]['area_bet'] != null ? betLogInfo['areas'][1]['area_bet'] : "0";
                    area_3_totalbet_label.text = betLogInfo['areas'][2]['area_bet'] != null ? betLogInfo['areas'][2]['area_bet'] : "0";
                    area_4_totalbet_label.text = betLogInfo['areas'][3]['area_bet'] != null ? betLogInfo['areas'][3]['area_bet'] : "0";
                    area_5_totalbet_label.text = betLogInfo['areas'][4]['area_bet'] != null ? betLogInfo['areas'][4]['area_bet'] : "0";
                    //每一门自己投注金额
                    var area_1_bet_label: eui.Label = detailsMainGroup.getChildByName("area_1_bet_label") as (eui.Label);
                    var area_2_bet_label: eui.Label = detailsMainGroup.getChildByName("area_2_bet_label") as (eui.Label);
                    var area_3_bet_label: eui.Label = detailsMainGroup.getChildByName("area_3_bet_label") as (eui.Label);
                    var area_4_bet_label: eui.Label = detailsMainGroup.getChildByName("area_4_bet_label") as (eui.Label);
                    var area_5_bet_label: eui.Label = detailsMainGroup.getChildByName("area_5_bet_label") as (eui.Label);

                    area_1_bet_label.text = betLogInfo['areas'][0]['my_bet'] != null ? String(betLogInfo['areas'][0]['my_bet']) : "0";
                    area_2_bet_label.text = betLogInfo['areas'][1]['my_bet'] != null ? String(betLogInfo['areas'][1]['my_bet']) : "0";
                    area_3_bet_label.text = betLogInfo['areas'][2]['my_bet'] != null ? String(betLogInfo['areas'][2]['my_bet']) : "0";
                    area_4_bet_label.text = betLogInfo['areas'][3]['my_bet'] != null ? String(betLogInfo['areas'][3]['my_bet']) : "0";
                    area_5_bet_label.text = betLogInfo['areas'][4]['my_bet'] != null ? String(betLogInfo['areas'][4]['my_bet']) : "0";

                    area_1_bet_label.text = betLogInfo['areas'][0]['my_bet'] != null ? String(betLogInfo['areas'][0]['my_bet']) : "0";
                    area_2_bet_label.text = betLogInfo['areas'][1]['my_bet'] != null ? String(betLogInfo['areas'][1]['my_bet']) : "0";
                    area_3_bet_label.text = betLogInfo['areas'][2]['my_bet'] != null ? String(betLogInfo['areas'][2]['my_bet']) : "0";
                    area_4_bet_label.text = betLogInfo['areas'][3]['my_bet'] != null ? String(betLogInfo['areas'][3]['my_bet']) : "0";
                    area_5_bet_label.text = betLogInfo['areas'][4]['my_bet'] != null ? String(betLogInfo['areas'][4]['my_bet']) : "0";

                } else if (betLogInfo['room_name'].indexOf(room_names[1]) >= 0) {
                    betInfoCell.skinName = "resource/skins/scene/BetNiuniuInfoCell.exml";
                    var betCellGroup: eui.Group = betInfoCell.getChildByName("betCellGroup") as (eui.Group);
                    var detailCellBgImage: eui.Image = betCellGroup.getChildByName("detailCellBgImage") as (eui.Image);
                    var detailsHeadGroup: eui.Group = betCellGroup.getChildByName("detailsHeadGroup") as (eui.Group);
                    var detailsMainGroup: eui.Group = betCellGroup.getChildByName("detailsMainGroup") as (eui.Group);
                    //头部信息
                    var detailsShowImage: eui.Image = detailsHeadGroup.getChildByName("detailsShowImage") as (eui.Image);
                    var timeLabel: eui.Label = detailsHeadGroup.getChildByName("timeLabel") as (eui.Label);
                    var resultValueLabel: eui.Label = detailsHeadGroup.getChildByName("resultValueLabel") as (eui.Label);
                    var gameDetailLabel: eui.Label = detailsHeadGroup.getChildByName("gameDetailLabel") as (eui.Label);
                    timeLabel.text = betLogInfo['opentime'];
                    resultValueLabel.text = String(betLogInfo['result']);
                    resultValueLabel.textColor = betLogInfo['result'] > 0 ? 0x3ADB0F : 0xC31616;
                    gameDetailLabel.text = "[" + betLogInfo['game_name'] + "-" + betLogInfo['expect'] + "期-" + betLogInfo['room_name'] + "]";
                    //详细信息
                    //前后区结果
                    var code_qianqu_label: eui.Label = detailsMainGroup.getChildByName("code_qianqu_label") as (eui.Label);
                    var code_houqu_label: eui.Label = detailsMainGroup.getChildByName("code_houqu_label") as (eui.Label);

                    code_qianqu_label.text = String(betLogInfo['areas'][0]['poker']);
                    code_houqu_label.text = String(betLogInfo['areas'][1]['poker']);

                    //前后区牛几
                    var qianquImage: eui.Image = detailsMainGroup.getChildByName("qianquImage") as (eui.Image);
                    var houquImage: eui.Image = detailsMainGroup.getChildByName("houquImage") as (eui.Image);

                    qianquImage.source = this.getNiuImage(betLogInfo['areas'][0]['code']);
                    houquImage.source = this.getNiuImage(betLogInfo['areas'][1]['code']);

                    //前后区是否庄
                    var qianquZhuangImage: eui.Image = detailsMainGroup.getChildByName("qianquZhuangImage") as (eui.Image);
                    var houquZhuangImage: eui.Image = detailsMainGroup.getChildByName("houquZhuangImage") as (eui.Image);

                    qianquZhuangImage.visible = betLogInfo['areas'][0]['banker_area'] == 1 ? true : false;
                    houquZhuangImage.visible = betLogInfo['areas'][1]['banker_area'] == 1 ? true : false;

                    //前后区投注总额
                    var qianqu_totalbet_label: eui.Label = detailsMainGroup.getChildByName("qianqu_totalbet_label") as (eui.Label);
                    var houqu_totalbet_label: eui.Label = detailsMainGroup.getChildByName("houqu_totalbet_label") as (eui.Label);

                    qianqu_totalbet_label.text = betLogInfo['areas'][0]['area_bet'] != null ? betLogInfo['areas'][0]['area_bet'] : "0";
                    houqu_totalbet_label.text = betLogInfo['areas'][1]['area_bet'] != null ? betLogInfo['areas'][1]['area_bet'] : "0";

                    //前后区自己投注金额
                    var qianqu_bet_label: eui.Label = detailsMainGroup.getChildByName("qianqu_bet_label") as (eui.Label);
                    var houqu_bet_label: eui.Label = detailsMainGroup.getChildByName("houqu_bet_label") as (eui.Label);

                    qianqu_bet_label.text = betLogInfo['areas'][0]['my_bet'] != null ? String(betLogInfo['areas'][0]['my_bet']) : "0";
                    houqu_bet_label.text = betLogInfo['areas'][1]['my_bet'] != null ? String(betLogInfo['areas'][1]['my_bet']) : "0";

                    qianqu_bet_label.text = betLogInfo['areas'][0]['my_bet'] != null ? String(betLogInfo['areas'][0]['my_bet']) : "0";
                    houqu_bet_label.text = betLogInfo['areas'][1]['my_bet'] != null ? String(betLogInfo['areas'][1]['my_bet']) : "0";

                } else if (betLogInfo['room_name'].indexOf(room_names[3]) >= 0 || betLogInfo['room_name'].indexOf(room_names[4]) >= 0) {
                    betInfoCell.skinName = "resource/skins/scene/BetLonghuInfoCell.exml";
                    var betCellGroup: eui.Group = betInfoCell.getChildByName("betCellGroup") as (eui.Group);
                    var detailCellBgImage: eui.Image = betCellGroup.getChildByName("detailCellBgImage") as (eui.Image);
                    var detailsHeadGroup: eui.Group = betCellGroup.getChildByName("detailsHeadGroup") as (eui.Group);
                    var detailsMainGroup: eui.Group = betCellGroup.getChildByName("detailsMainGroup") as (eui.Group);
                    //头部信息
                    var detailsShowImage: eui.Image = detailsHeadGroup.getChildByName("detailsShowImage") as (eui.Image);
                    var timeLabel: eui.Label = detailsHeadGroup.getChildByName("timeLabel") as (eui.Label);
                    var resultValueLabel: eui.Label = detailsHeadGroup.getChildByName("resultValueLabel") as (eui.Label);
                    var gameDetailLabel: eui.Label = detailsHeadGroup.getChildByName("gameDetailLabel") as (eui.Label);
                    timeLabel.text = betLogInfo['opentime'];
                    resultValueLabel.text = String(betLogInfo['result']);
                    resultValueLabel.textColor = betLogInfo['result'] > 0 ? 0x3ADB0F : 0xC31616;
                    gameDetailLabel.text = "[" + betLogInfo['game_name'] + "-" + betLogInfo['expect'] + "期-" + betLogInfo['room_name'] + "]";
                    //详细信息
                    //龙虎和结果
                    var code_long_label: eui.Label = detailsMainGroup.getChildByName("code_long_label") as (eui.Label);
                    var code_hu_label: eui.Label = detailsMainGroup.getChildByName("code_hu_label") as (eui.Label);
                    var code_he_label: eui.Label = detailsMainGroup.getChildByName("code_he_label") as (eui.Label);

                    code_long_label.text = betLogInfo['areas'][0]['code1'] + betLogInfo['areas'][0]['symbol'] + betLogInfo['areas'][0]['code2'];
                    code_hu_label.text = betLogInfo['areas'][0]['code1'] + betLogInfo['areas'][0]['symbol'] + betLogInfo['areas'][0]['code2'];
                    code_he_label.text = betLogInfo['areas'][0]['code1'] + betLogInfo['areas'][0]['symbol'] + betLogInfo['areas'][0]['code2'];
                    code_long_label.visible = Number(betLogInfo['areas'][0]['result']) == 1 ? true : false;
                    code_hu_label.visible = Number(betLogInfo['areas'][0]['result']) == 2 ? true : false;
                    code_he_label.visible = Number(betLogInfo['areas'][0]['result']) == 3 ? true : false;
                    //龙虎和区域投注总额
                    var long_totalbet_label: eui.Label = detailsMainGroup.getChildByName("long_totalbet_label") as (eui.Label);
                    var hu_totalbet_label: eui.Label = detailsMainGroup.getChildByName("hu_totalbet_label") as (eui.Label);
                    var he_totalbet_label: eui.Label = detailsMainGroup.getChildByName("he_totalbet_label") as (eui.Label);

                    long_totalbet_label.text = betLogInfo['areas'][0]['area_bet'] != null ? betLogInfo['areas'][0]['area_bet'] : "0";
                    hu_totalbet_label.text = betLogInfo['areas'][1]['area_bet'] != null ? betLogInfo['areas'][1]['area_bet'] : "0";
                    he_totalbet_label.text = betLogInfo['areas'][2]['area_bet'] != null ? betLogInfo['areas'][2]['area_bet'] : "0";
                    //龙虎和自己投注金额
                    var long_bet_label: eui.Label = detailsMainGroup.getChildByName("long_bet_label") as (eui.Label);
                    var hu_bet_label: eui.Label = detailsMainGroup.getChildByName("hu_bet_label") as (eui.Label);
                    var he_bet_label: eui.Label = detailsMainGroup.getChildByName("he_bet_label") as (eui.Label);

                    long_bet_label.text = betLogInfo['areas'][0]['my_bet'] != null ? String(betLogInfo['areas'][0]['my_bet']) : "0";
                    hu_bet_label.text = betLogInfo['areas'][1]['my_bet'] != null ? String(betLogInfo['areas'][1]['my_bet']) : "0";
                    he_bet_label.text = betLogInfo['areas'][2]['my_bet'] != null ? String(betLogInfo['areas'][2]['my_bet']) : "0";
                } else if (betLogInfo['room_name'].indexOf(room_names[6]) >= 0) {//猴赛雷投注明细
                    betInfoCell.skinName = "resource/skins/scene/BetHongbaoInfoCell.exml";
                    var betCellGroup: eui.Group = betInfoCell.getChildByName("betCellGroup") as (eui.Group);
                    var detailCellBgImage: eui.Image = betCellGroup.getChildByName("detailCellBgImage") as (eui.Image);
                    var detailsHeadGroup: eui.Group = betCellGroup.getChildByName("detailsHeadGroup") as (eui.Group);
                    var detailsMainGroup: eui.Group = betCellGroup.getChildByName("detailsMainGroup") as (eui.Group);
                    //头部信息
                    var detailsShowImage: eui.Image = detailsHeadGroup.getChildByName("detailsShowImage") as (eui.Image);
                    var timeLabel: eui.Label = detailsHeadGroup.getChildByName("timeLabel") as (eui.Label);
                    var resultValueLabel: eui.Label = detailsHeadGroup.getChildByName("resultValueLabel") as (eui.Label);
                    var gameDetailLabel: eui.Label = detailsHeadGroup.getChildByName("gameDetailLabel") as (eui.Label);
                    timeLabel.text = betLogInfo['opentime'];
                    resultValueLabel.text = String(betLogInfo['result']);
                    resultValueLabel.textColor = betLogInfo['result'] > 0 ? 0x3ADB0F : 0xC31616;
                    gameDetailLabel.text = "[" + betLogInfo['game_name'] + "-" + betLogInfo['expect'] + "期-" + betLogInfo['room_name'] + "]";

                    //页面信息
                    var RayLabel: eui.Label = detailsMainGroup.getChildByName("code_ray_label") as (eui.Label);
                } else if (betLogInfo['room_name'].indexOf(room_names[7]) >= 0) {//PC蛋蛋投注明细
                    betInfoCell.skinName = "resource/skins/scene/BetPCDanDanInfoCell.exml";
                    var betCellGroup: eui.Group = betInfoCell.getChildByName("betCellGroup") as (eui.Group);
                    var detailCellBgImage: eui.Image = betCellGroup.getChildByName("detailCellBgImage") as (eui.Image);
                    var detailsHeadGroup: eui.Group = betCellGroup.getChildByName("detailsHeadGroup") as (eui.Group);
                    var detailsMainGroup: eui.Group = betCellGroup.getChildByName("detailsMainGroup") as (eui.Group);
                    //头部信息
                    var detailsShowImage: eui.Image = detailsHeadGroup.getChildByName("detailsShowImage") as (eui.Image);
                    var timeLabel: eui.Label = detailsHeadGroup.getChildByName("timeLabel") as (eui.Label);
                    var resultValueLabel: eui.Label = detailsHeadGroup.getChildByName("resultValueLabel") as (eui.Label);
                    var gameDetailLabel: eui.Label = detailsHeadGroup.getChildByName("gameDetailLabel") as (eui.Label);
                    timeLabel.text = betLogInfo['opentime'];
                    resultValueLabel.text = String(betLogInfo['result']);
                    resultValueLabel.textColor = betLogInfo['result'] > 0 ? 0x3ADB0F : 0xC31616;
                    gameDetailLabel.text = "[" + betLogInfo['game_name'] + "-" + betLogInfo['expect'] + "期-" + betLogInfo['room_name'] + "]";

                    //页面信息
                    var dsLabel: eui.Label = detailsMainGroup.getChildByName("dsLabel") as (eui.Label);
                    var dsGoldLabel: eui.Label = detailsMainGroup.getChildByName("dsGoldLabel") as (eui.Label);
                    var temaLabel: eui.Label = detailsMainGroup.getChildByName("temaLabel") as (eui.Label);
                    var TeMaGoldLabel: eui.Label = detailsMainGroup.getChildByName("TeMaGoldLabel") as (eui.Label);
        
                }


                /*var betCellGroup: eui.Group = betInfoCell.getChildByName("betCellGroup") as (eui.Group);
                var nameLabel: eui.Label = betCellGroup.getChildByName("betNameLabel") as (eui.Label);
                var valueLabel: eui.Label = betCellGroup.getChildByName("betValueLabel") as (eui.Label);

                nameLabel.text = betLogInfo.mark.replace(/<\/br>/g, "\r\n").trim();
                valueLabel.text = "本局收益：" + String(betLogInfo.result);*/

                if (i == 1) {
                    betInfoCell.height = 80;
                    betCellGroup.height = 80;
                    detailCellBgImage.height = 80;
                    detailsShowImage.source = "details_close_png";
                    detailsMainGroup.visible = false;
                    betInfoCell.x = 0;
                    betInfoCell.y = 260;
                } else if (i > 1) {
                    betInfoCell.height = 80;
                    betCellGroup.height = 80;
                    detailCellBgImage.height = 80;
                    detailsShowImage.source = "details_close_png";
                    detailsMainGroup.visible = false;
                    betInfoCell.x = 0;
                    betInfoCell.y = 260 + 90 * (i - 1);
                } else {
                    betInfoCell.x = 0;
                    betInfoCell.y = 0;
                }

                betInfoCell.name = ("betInfoCell_" + String(i));

                betInfoCell.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchShowDetails, this);
                that.betLogGroup.addChild(betInfoCell);
            }
            that.todayResultLabel.text = "当日盈亏：" + String(response.gross_profit) + "筹码";
        }, that);
    }

    private onTouchShowDetails(evt: egret.TouchEvent): void {
        Director.getInstance().effectPlay("click_mp3");
        var target: eui.Group = evt.currentTarget;
        var index_str = Number(target.name.replace("betInfoCell_", ""));
        var show_state = target.height == 80 ? 0 : 1;
        var betCellGroup: eui.Group = target.getChildByName("betCellGroup") as (eui.Group);
        var detailCellBgImage: eui.Image = betCellGroup.getChildByName("detailCellBgImage") as (eui.Image);
        var detailsHeadGroup: eui.Group = betCellGroup.getChildByName("detailsHeadGroup") as (eui.Group);
        var detailsMainGroup: eui.Group = betCellGroup.getChildByName("detailsMainGroup") as (eui.Group);
        var detailsShowImage: eui.Image = detailsHeadGroup.getChildByName("detailsShowImage") as (eui.Image);
        if (show_state == 1) {
            //当前展开，点击隐藏
            target.height = 80;
            betCellGroup.height = 80;
            detailCellBgImage.height = 80;
            detailsShowImage.source = "details_close_png";
            detailsMainGroup.visible = false;
            for (var i = index_str + 1; i < this.betLogsCount; i++) {
                let betInfoCell = this.betLogGroup.getChildByName("betInfoCell_" + i) as (eui.Group);
                betInfoCell.y = betInfoCell.y - 180; console.log("betInfoCell=================" + betInfoCell.y);
            }
        } else {
            //当前隐藏，点击展开
            target.height = 250;
            betCellGroup.height = 250;
            detailCellBgImage.height = 250;
            detailsShowImage.source = "details_open_png";
            detailsMainGroup.visible = true;
            for (var i = index_str + 1; i < this.betLogsCount; i++) {
                let betInfoCell = this.betLogGroup.getChildByName("betInfoCell_" + i) as (eui.Group);
                betInfoCell.y = betInfoCell.y + 180; console.log("betInfoCell=================" + betInfoCell.y);
            }
        }
    }

    private getDetailsRankImage(rank: number) {
        switch (rank) {
            case 1:
                return "details_1th_png";
            case 2:
                return "details_2th_png";
            case 3:
                return "details_3th_png";
            case 4:
                return "details_4th_png";
            case 5:
                return "details_5th_png";
        }
    }

    private getNiuImage(rank: number) {
        switch (rank) {
            case 0:
                return "n0_png";
            case 1:
                return "n1_png";
            case 2:
                return "n2_png";
            case 3:
                return "n3_png";
            case 4:
                return "n4_png";
            case 5:
                return "n5_png";
            case 6:
                return "n6_png";
            case 7:
                return "n7_png";
            case 8:
                return "n8_png";
            case 9:
                return "n9_png";
            case 10:
                return "n10_png";
        }
    }

    private onTouzhuDetailsHandler(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            Director.getInstance().effectPlay("click_mp3");
        }
        Director.getInstance().showTouzhuDetailsDialog(this.gameId, this.roomId, this.sound_on, this);
    }
    private getGameListHandler(name: string, response: ResponseGameList) {
        this.itemList = new Array();//console.log("this---"+response);
        for (var row in response.rows) {

            let item: GameInfo = response.rows[row] as GameInfo;
            if (item.is_open == 1 || item.is_open == 2) {
                let data = {
                    gameInfo: item,
                    id: item.id,
                    name: item.name,
                    img: "",
                }
                if (item.name == "北京赛车") {
                    data.img = "btn_beijingcar_new_png";
                } else if (item.name == "重庆时时彩") {
                    data.img = "btn_chongxingcai_new_png";
                } else if (item.name == "幸运飞艇") {
                    data.img = "btn_luckboat_new_png";
                } else if (item.name == "欧洲秒速赛车") {
                    data.img = "btn_ouzhousaiche_new_png";
                } else if (item.name == "欧洲秒速飞艇") {
                    data.img = "btn_ouzhoufeoti_new_png";
                } else if (item.name == "PC蛋蛋") {
                    data.img = "btn_PcDanDan_new_png";
                }
                this.itemList.push(data);
            }
        }

        //DataEngine.getInstance().getNewExpect(true, this.getNewExpectHandler, this)
        HttpEngine.getInstance().getNewExpect(this.getNewExpectHandler, this)
    }

    private lastRequestNewExpectTicket = 0;
    private lastRequestNewExpectRemainTicket = 0;
    private getNewExpectHandler(name: string, response: ResponseNewExpect) {
        //this.newExpect = response.info;
        let needReGet = false;
        for (let row in response.rows) {
            let expectInfo: ExpectInfo = response.rows[row];

            let currentTicket = Math.floor(Number(new Date()) / 1000);
            let usedTicket = currentTicket - expectInfo.local_request_time;
            let remainTicket: number = expectInfo.next_time - usedTicket;

            //如果有某个游戏的倒计时值是小于0，就是没更新到开奖数据，要重新抓
            if (remainTicket <= 0) {
                needReGet = true;
                break;
            }
        }

        if (needReGet) {
            //延迟5秒再取
            let that = this;
            let tw = egret.Tween.get(this);
            tw.to({}, 3000).call(function () {
                HttpEngine.getInstance().getNewExpect(that.getNewExpectHandler, that)
            });
        }

        this.reloadArray();
    }

    private reloadArray(): void {
        //this.itemGroup.removeChildren();
        for (var i = 0; i < this.itemList.length; i++) {
            let item = this.itemList[i];
            //console.log(item);
            let button: eui.Button = this.itemGroup.getChildByName(("button_" + String(i))) as eui.Button;
            if (!button) {
                button = new eui.Button();
                button.name = ("button_" + String(i));
                button.skinName = "resource/skins/scene/HomeListCell.exml";
                button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCell, this);

                button.x = 30;
                button.y = 260 * i + 20;

                this.itemGroup.addChild(button);
            }

            var bgImage: eui.Image = button.getChildByName("bgImage") as (eui.Image);
            bgImage.source = item.img;
        }
        //添加完列表马上刷新一次
        this.updateTimerHandler();
    }

    private updateTimerHandler() {
        if (this.itemList == null) {
            return;
        }
        this.timeList = new Array();
        for (let i = 0; i < this.itemList.length; i++) {
            let item = this.itemList[i];
            let gameId = item.id;

            let button: eui.Button = this.itemGroup.getChildByName(("button_" + String(i))) as eui.Button;
            if (!button) {
                return;
            }
            let timeLabel: eui.Label = button.getChildByName("timeLabel") as (eui.Label);
            let expectInfo = DataEngine.getInstance().getExpectInfo(gameId);
            if (expectInfo == null || expectInfo.opencode == null) {
                console.log("服务器数据异常，丢失了opencode参数")
                return;
            }

            //let codeGrouop:eui.Group = button.getChildByName("codeGroup") as eui.Group;
            let timeGroup: eui.Group = button.getChildByName("timeGroup") as eui.Group;

            //先隐藏数字
            for (let i = 0; i < 10; i++) {
                this.timeList[i] = i;
                let code = i + 1;
                // let resultImageName = "code_image_"+String(code);
                // let resultImage:eui.Image = codeGrouop.getChildByName(resultImageName) as eui.Image;
                // resultImage.visible = false;
            }

            if (expectInfo == null) {
                continue;
            }

            //下次开奖的倒计时数字
            let time_1: eui.Image = timeGroup.getChildByName("time_1") as eui.Image;
            let time_2: eui.Image = timeGroup.getChildByName("time_2") as eui.Image;
            let time_3: eui.Image = timeGroup.getChildByName("time_3") as eui.Image;
            let time_4: eui.Image = timeGroup.getChildByName("time_4") as eui.Image;

            //下次开奖的倒计时标题
            let nextOpenTitleLabel: eui.Label = button.getChildByName("next_open_title_label") as eui.Label;
            //暂停开奖的标题
            let pauseTitlelabel: eui.Label = button.getChildByName("pause_title_label") as eui.Label;
            //暂停开奖的时间提示
            let pauseTimeLabel: eui.Label = button.getChildByName("pause_time_label") as eui.Label;

            let currentTicket = Math.floor(Number(new Date()) / 1000);
            let usedTicket = currentTicket - expectInfo.local_request_time;
            let remainTicket: number = expectInfo.next_time - usedTicket;

            //0暂停 1正常 2关闭
            //if (expectInfo.state == 2) {//关闭
            if (item.gameInfo.is_open == 2) {//关闭
                time_1.visible = false;
                time_2.visible = false;
                time_3.visible = false;
                time_4.visible = false;
                nextOpenTitleLabel.visible = false;
                pauseTitlelabel.visible = false;
                pauseTimeLabel.visible = true;
                pauseTimeLabel.text = expectInfo.game_mark;//底部显示维护
            } else if (remainTicket > 600) {
                time_1.visible = false;
                time_2.visible = false;
                time_3.visible = false;
                time_4.visible = false;
                nextOpenTitleLabel.visible = false;
                pauseTitlelabel.visible = true;
                pauseTimeLabel.visible = true;

                if (item.name == "北京赛车") {
                    pauseTimeLabel.text = "开奖时间:09:02~23:57";
                } else if (item.name == "重庆时时彩") {
                    pauseTimeLabel.text = "开奖时间:10:02~次日01:55";
                } else if (item.name == "幸运飞艇") {
                    pauseTimeLabel.text = "开奖时间:13:05~次日04:05";
                } else if (item.name == "欧洲秒速赛车") {
                    pauseTimeLabel.text = "开奖时间:09:02~23:57";
                } else if (item.name == "欧洲秒速飞艇") {
                    pauseTimeLabel.text = "开奖时间:09:02~23:57";
                } else if (item.name == "PC蛋蛋") {
                    pauseTimeLabel.text = "开奖时间:09:02~23:57";
                }

            } else if (remainTicket <= -2) {
                time_1.visible = false;
                time_2.visible = false;
                time_3.visible = false;
                time_4.visible = false;
                nextOpenTitleLabel.visible = false;
                pauseTitlelabel.visible = false;
                pauseTimeLabel.visible = true;

                pauseTimeLabel.text = "开奖中...请稍后"
            } else {
                time_1.visible = true;
                time_2.visible = true;
                time_3.visible = true;
                time_4.visible = true;
                nextOpenTitleLabel.visible = true;
                pauseTitlelabel.visible = false;
                pauseTimeLabel.visible = false;

                //倒计时秒转为分秒
                let minute_shi = 0;
                let minute_ge = Math.floor(remainTicket / 60);
                let second_shi = Math.floor((remainTicket % 60) / 10);
                let second_ge = remainTicket % 60 % 10;

                if (minute_shi == 0 && minute_ge == 0 && second_shi == 0 && second_ge == 0) {
                    console.log("reflesh");
                    HttpEngine.getInstance().getGameList(this.getGameListHandler, this);

                    // let timer:egret.Timer = new egret.Timer(1000,0); 
                    // timer.addEventListener(egret.TimerEvent.TIMER,this.updateTimerHandler,this);
                    // timer.start();
                    // return;
                }
                //let time_1:eui.Image=timeGroup.getChildByName("time_1") as eui.Image;
                //let time_2:eui.Image=timeGroup.getChildByName("time_2") as eui.Image;
                //let time_3:eui.Image=timeGroup.getChildByName("time_3") as eui.Image;
                //let time_4:eui.Image=timeGroup.getChildByName("time_4") as eui.Image;
                if (item.name == "北京赛车") {
                    time_1.source = "blue_" + this.timeList[minute_shi] + "_png";
                    time_2.source = "blue_" + this.timeList[minute_ge] + "_png";
                    time_3.source = "blue_" + this.timeList[second_shi] + "_png";
                    time_4.source = "blue_" + this.timeList[second_ge] + "_png";
                } else if (item.name == "重庆时时彩") {
                    time_1.source = "red_" + this.timeList[minute_shi] + "_png";
                    time_2.source = "red_" + this.timeList[minute_ge] + "_png";
                    time_3.source = "red_" + this.timeList[second_shi] + "_png";
                    time_4.source = "red_" + this.timeList[second_ge] + "_png";
                } else if (item.name == "幸运飞艇") {
                    time_1.source = "red_" + this.timeList[minute_shi] + "_png";
                    time_2.source = "red_" + this.timeList[minute_ge] + "_png";
                    time_3.source = "red_" + this.timeList[second_shi] + "_png";
                    time_4.source = "red_" + this.timeList[second_ge] + "_png";
                } else if (item.name == "欧洲秒速赛车") {
                    time_1.source = "red_" + this.timeList[minute_shi] + "_png";
                    time_2.source = "red_" + this.timeList[minute_ge] + "_png";
                    time_3.source = "red_" + this.timeList[second_shi] + "_png";
                    time_4.source = "red_" + this.timeList[second_ge] + "_png";
                } else if (item.name == "欧洲秒速飞艇") {
                    time_1.source = "red_" + this.timeList[minute_shi] + "_png";
                    time_2.source = "red_" + this.timeList[minute_ge] + "_png";
                    time_3.source = "red_" + this.timeList[second_shi] + "_png";
                    time_4.source = "red_" + this.timeList[second_ge] + "_png";
                } else if (item.name == "PC蛋蛋") {
                    time_1.source = "red_" + this.timeList[minute_shi] + "_png";
                    time_2.source = "red_" + this.timeList[minute_ge] + "_png";
                    time_3.source = "red_" + this.timeList[second_shi] + "_png";
                    time_4.source = "red_" + this.timeList[second_ge] + "_png";
                }

            }

            let nameLabel: eui.Label = button.getChildByName("nameLabel") as eui.Label;
            nameLabel.text = "最新开奖" + expectInfo.expect + "期";


            //再显示数字
            let openCodeList: any[] = expectInfo.opencode.split(",");
            let codeCount: number = openCodeList.length;

            let codeGroup: eui.Group = button.getChildByName("code_group") as eui.Group;
            if (codeGroup == null) {
                codeGroup = new eui.Group();
                codeGroup.name = "code_group";
                button.addChild(codeGroup);
                codeGroup.x = 280;
                codeGroup.y = 70;
                codeGroup.width = 280;
                codeGroup.height = 41;
            }

            //全部隐藏数字
            for (let i = 1; i <= 10; i++) {
                let code = i;
                let codeImage: eui.Image = codeGroup.getChildByName(("code_" + String(i))) as eui.Image;
                if (codeImage != null) {
                    codeImage.visible = false;
                }
            }


            for (let i = 0; i < openCodeList.length; i++) {
                let code: number = Number(openCodeList[i]);
                if (code == 0) {
                    code = 10;
                }
                let codeImage: eui.Image = codeGroup.getChildByName(("code_" + String(i))) as eui.Image;
                if (codeImage == null) {
                    codeImage = new eui.Image();
                    codeGroup.addChild(codeImage);
                    codeImage.name = "code_" + String(i);
                }

                codeImage.visible = true;
                codeImage.source = code + "_png";
                codeImage.width = 28;
                codeImage.height = 28;
                codeImage.y = 6;

                //console.log(item.name+"-"+code);   

                if (item.name == "北京赛车") {
                    codeImage.x = 28 * (10 - codeCount) / 2 + 28 * i;
                } else if (item.name == "重庆时时彩") {
                    //重庆时时彩0-9
                    if (code == 10) {
                        codeImage.source = "03_png";
                    }
                    codeImage.x = 70 + i * 28;
                } else if (item.name == "幸运飞艇") {
                    codeImage.x = 28 * (10 - codeCount) / 2 + 28 * i;
                } else if (item.name == "欧洲秒速赛车") {
                    codeImage.x = 28 * (10 - codeCount) / 2 + 28 * i;
                } else if (item.name == "欧洲秒速飞艇") {
                    codeImage.x = 28 * (10 - codeCount) / 2 + 28 * i;
                } else if (item.name == "PC蛋蛋") {
                    codeImage.x = 28 * (10 - codeCount) / 2 + 28 * i;
                }
            }


        }
    }
    private onTouchCell(evt: egret.TouchEvent) {
        Director.getInstance().effectPlay("click_mp3");
        if (this.mainScroller.viewport.scrollH == 0) {
            var target: eui.Button = evt.currentTarget;
            var index_str = target.name.replace("button_", "");

            var index: number = Number(index_str);
            var item = this.itemList[index];
            var gameInfo = item.gameInfo as GameInfo;

            let expectInfo = DataEngine.getInstance().getExpectInfo(gameInfo.id);
            if (expectInfo != null) {
                let currentTicket = Math.floor(Number(new Date()) / 1000);
                let usedTicket = currentTicket - expectInfo.local_request_time;
                let remainTicket: number = expectInfo.next_time - usedTicket;


                if (ClientStorage.getUserInfo().nickname != "flynet"
                    && ClientStorage.getUserInfo().nickname != "flysec"
                    && ClientStorage.getUserInfo().nickname != "15652315420"
                    && ClientStorage.getUserInfo().nickname != "13880735420") {//测试账号不判断关闭
                    if (item.gameInfo.is_open == 2) {//关闭
                        Toast.launch(expectInfo.game_mark);
                        return;
                    } else if (remainTicket > 600) {
                        Toast.launch("游戏暂停中，请稍后再来");
                        return;
                    }
                }
            }

            if (gameInfo.name == "北京赛车") {
                //跳转到北京赛事房间：临时
                var newScene: RoomScene = new RoomScene();
                newScene.setGameId(gameInfo.id);
                Director.getInstance().pushScene(newScene);
            } else if (gameInfo.name == "重庆时时彩") {
                //跳转到重庆时时彩房间：临时

                var newScene: RoomScene = new RoomScene();
                newScene.setGameId(gameInfo.id);
                Director.getInstance().pushScene(newScene);
                /*

                var ShishicainewScene: ShishicaiRoomScene = new ShishicaiRoomScene();
                ShishicainewScene.setGameId(gameInfo.id);
                Director.getInstance().pushScene(ShishicainewScene);
                */
            } else if (gameInfo.name == "幸运飞艇") {
                //跳转到重庆时时彩房间：临时
                let roomScence: RoomScene = new RoomScene();
                roomScence.setGameId(gameInfo.id);
                Director.getInstance().pushScene(roomScence);
            } else if (gameInfo.name == "欧洲秒速赛车") {
                //跳转到重庆时时彩房间：临时
                let roomScence: RoomScene = new RoomScene();
                roomScence.setGameId(gameInfo.id);
                Director.getInstance().pushScene(roomScence);
            } else if (gameInfo.name == "欧洲秒速飞艇") {
                //跳转到重庆时时彩房间：临时
                let roomScence: RoomScene = new RoomScene();
                roomScence.setGameId(gameInfo.id);
                Director.getInstance().pushScene(roomScence);
            } else if (gameInfo.name == "PC蛋蛋") {
                //跳转到重庆时时彩房间：临时
                let roomScence: RoomScene = new RoomScene();
                roomScence.setGameId(gameInfo.id);
                Director.getInstance().pushScene(roomScence);
            }
        }
    }

    private onServiceHandler(evt: egret.TouchEvent): void {
        Director.getInstance().effectPlay("click_mp3");
        Director.getInstance().showServiceDialog(this, this.sound_on);
    }

    private exitHandler(evt: egret.TouchEvent): void {
        Director.getInstance().effectPlay("click_mp3");
        Director.getInstance().popScene();
    }

    private reloadUserInfo() {
        var httpEngine: HttpEngine = HttpEngine.getInstance();
        httpEngine.getUserInfo(function (name: string, responseUserInfo: ResponseUserInfo) {
            console.log(responseUserInfo.userInfo.nickname);
            ClientStorage.setUserInfo(responseUserInfo.userInfo);
            var userInfo: UserInfo = ClientStorage.getUserInfo();
            this.balanceLabel.text = Number(userInfo.balance).toFixed(2);
        }, this);
    }

}


