class GameHongbaoData {

    public client_id: string;    //客户端id，连接socket后得到，退出房间后就无效了
    public initUserInfoGot: boolean = false;//是否拿到了初始化用户信息
    public socketConnected: boolean = false;//是否连接上了

    public totalBet: number; //总下注
    public area_summary: number[] = new Array();//每个区域的下注总和
    public self_bet: number[] = new Array();//每个区域自己下注总和

    public currentBet: number;  //自己下注
    public betInfoList: BetInfo[];   //下注的细节

    public bankerName: string;               //庄家名字
    public bankerTotal: number;              //庄家奖池数量
    public bankerArea: number;               //庄家区域

    public area_limit: AreaLimitInfo[];

    public bankerList: BankerInfo[];           //上庄列表

    public lastUpdateBalanceTicket;         //上次更新余额时间

    public reset() {
        this.totalBet = 0;
        this.lastUpdateBalanceTicket = 0;

        this.area_summary[1] = 0;
        this.area_summary[2] = 0;
        this.area_summary[3] = 0;
        this.area_summary[4] = 0;
        this.area_summary[5] = 0;

        this.self_bet[1] = 0;
        this.self_bet[2] = 0;
        this.self_bet[3] = 0;
        this.self_bet[4] = 0;
        this.self_bet[5] = 0;

        this.betInfoList = new Array();

        //不清理庄家信息
        /*
        //清理庄家信息
        this.bankerName = "";
        this.bankerTotal = 0;
        this.bankerArea = 0;
        */
    }

    public updateAreaSummaryAndTotalBet(betAreaSummaryList: BetAreaSummary[]) {
        let totalBet = 0;
        for (let row in betAreaSummaryList) {
            let betAreaSummary: BetAreaSummary = betAreaSummaryList[row];
            this.area_summary[Number(betAreaSummary.area)] = Number(betAreaSummary.number);//记录区域下注总金额
            totalBet += Number(betAreaSummary.number);
        }

        this.totalBet = totalBet;
    }

    public updateSelfBetAndSelfTotalBet(selfBetList: BetAreaSummary[]) {
        let selfTotalBet = 0;
        for (let row in selfBetList) {
            let betAreaSummary: BetAreaSummary = selfBetList[row];
            this.self_bet[Number(betAreaSummary.area)] = Number(betAreaSummary.number);//记录区域下注总金额
            selfTotalBet += Number(betAreaSummary.number);
        }

        this.currentBet = selfTotalBet;
    }
}

class GameHongbaoScene extends BaseScene {

    private gameData: GameHongbaoData = new GameHongbaoData();
    //音效开关
    private soundButton: eui.Button;
    private sound_on = 1;
    private sound_channel: egret.SoundChannel;
    private is_kaijiang: Number = 0;

    private backImage: eui.Image;
    private rewardResultImage: eui.Image;
    private ruleImage: eui.Image;
    private hongbaoBtn: eui.Image;
    private Sendbtn: eui.Image;
    private CloseBtn: eui.Image;
    private HongbaoGroup: eui.Group;
    private chatScroller: eui.Scroller;        //滚动聊天记录容器
    private HongbaoGame: eui.Group;
    private Sendhongbao: eui.Button;
    private VideoBtn: eui.ToggleButton;
    private chedao: eui.Group;
    private noticeLabel: eui.Label;
    private HongbaoImage: eui.Image;
    private playerListImage: eui.Image;
    private bankerListGroup: eui.Group;
    //跑车的框子
    private racecarGroup_1: eui.Group;
    private racecarGroup_2: eui.Group;
    private racecarGroup_3: eui.Group;
    private racecarGroup_4: eui.Group;
    private racecarGroup_5: eui.Group;
    private racecarGroup_6: eui.Group;
    private racecarGroup_7: eui.Group;
    private racecarGroup_8: eui.Group;
    private racecarGroup_9: eui.Group;
    private racecarGroup_10: eui.Group;

    private fireImage_1: eui.Group;
    private fireImage_2: eui.Group;
    private fireImage_3: eui.Group;
    private fireImage_4: eui.Group;
    private fireImage_5: eui.Group;
    private fireImage_6: eui.Group;
    private fireImage_7: eui.Group;
    private fireImage_8: eui.Group;
    private fireImage_9: eui.Group;
    private fireImage_10: eui.Group;
    //筹码控件
    private Money_50: eui.ToggleButton;
    private Money_80: eui.ToggleButton;
    private Money_100: eui.ToggleButton;
    private Money_150: eui.ToggleButton;
    private Money_200: eui.ToggleButton;

    //雷点
    private Num_1: eui.ToggleButton;
    private Num_2: eui.ToggleButton;
    private Num_3: eui.ToggleButton;
    private Num_4: eui.ToggleButton;
    private Num_5: eui.ToggleButton;
    private Num_6: eui.ToggleButton;
    private Num_7: eui.ToggleButton;
    private Num_8: eui.ToggleButton;
    private Num_9: eui.ToggleButton;
    private Num_10: eui.ToggleButton;

    //倍率
    private package_1: eui.ToggleButton;
    private package_2: eui.ToggleButton;
    private package_3: eui.ToggleButton;
    private package_4: eui.ToggleButton;

    //顶部号码
    private code_image_1: eui.Image;
    private code_image_2: eui.Image;
    private code_image_3: eui.Image;
    private code_image_4: eui.Image;
    private code_image_5: eui.Image;
    private code_image_6: eui.Image;
    private code_image_7: eui.Image;
    private code_image_8: eui.Image;
    private code_image_9: eui.Image;
    private code_image_10: eui.Image;

    private processState: ProcessState;       //游戏状态
    private stateTicketLabel: eui.Label;
    private stateNotifyLabel: eui.Label; //游戏状态
    private codeCalculateTimer: egret.Timer;//判断当前车的顺序做号码显示的定时器
    private commonTimer: egret.Timer; //状态机定时器
    private raceGroup: eui.Group;         //横向赛车的大框子
    private raceBgScroller: eui.Scroller; //赛车的跑道
    private raceBgScrollerGroup: eui.Group; //赛车的跑道
    private startLineImage: eui.Image;//终点线
    private startRaceTicket: number; //开始赛车的时间
    private lastTimerTicket: number = 0; //上次timer时间
    private roomType = RoomType.RoomeTypeHongbao;
    private HongbaoQiangzhuTimer: egret.Timer;       //判断红包被抢的定时器
    private raceCarGroupList: eui.Group[];
    private serverState: ServerState;         //当前服务端游戏状态
    private clientState: ClientState;         //客户端状态
    private serverStateNotify: string;        //游戏状态通知的内容
    private serverStateEndTicket: number;     //本状态服务器结束的时间
    private remaining_open_time: number;      //同步state==1的时候，剩下到开盘时间
    private serverStateOpenTicket: number;     //游戏状态：开盘时间
    private settlementResult: PacketSettlementResult;
    //触摸点位置
    private beginPositionX: number;
    private beginPositionY: number;
    private movePositionX: number;
    private movePositionY: number;
    //游戏主页面
    private gameMainGroup: eui.Group;
    private mainScroller: eui.Scroller;
    private gameId: number;
    private roomId: number;
    private roomInfo: RoomInfo;
    private responseJoinRoom: ResponseJoinRoom;

    private UserId: eui.Label;               //用户ID
    private TehUser: eui.Label;              //用户账号
    private UserName: eui.Label;              //玩家姓名
    private GoldNum: eui.Label;              //用户金币
    private NoerList: eui.Label;              //期数列表
    private NoerGold: eui.Label;              //期数金币
    private FreezingGoldNum: eui.Label;
    private dateLabel: eui.Label;            //当前日期
    private nameLabel: eui.Label;
    //分页投注明细
    private page: number = 1;
    private row: number = 10;
    private lastPageLabel: eui.Label;
    private nextPageLabel: eui.Label;
    private currentPageLabel: eui.Label;
    private totalPageLabel: eui.Label;

    private betLogGroup: eui.Group
    private touzhuDetailsImage: eui.Image;//投注明细
    private exitButton: eui.Button;     //退出登录
    private serviceButton: eui.Button;  //联系客服
    private todayResultLabel: eui.Label; //当日盈亏
    private chongzhiImage: eui.Image;
    private todayLonghuResultLabel: eui.Label; //今日龙虎下注额
    private titleLabel: eui.Label;
    private openResult: OpenResult;
    private balanceLabel: eui.Label;
    private timeLabel: eui.BitmapLabel;
    private iarray: any[];
    // private sureBetGroup: eui.Group;//确定下注
    // private cancleBetGroup: eui.Group;//取消下注
    // private sureBetTimeLabel: eui.Label;//确定下注倒计时，倒计时15s消失
    private showCancleBet: number = 0;//是否显示取消下注，第一次投注后或者有投注过、退出重进房间时显示
    private showCancleBetTicket: number = 0;//显示取消下注时的时间戳
    private showCancleBetRemainTime: number = 15;//显示取消下注时倒计时
    private packetBackBet: PacketBackBet;
    private oneself: Boolean;
    private OpenGroup: eui.Group;
    private caihongbao: eui.Image;
    private backgroundImage: eui.Image;
    private onViweCai: boolean
    private NullLabel: eui.Label;
    private SendIarray: any[];
    private dateDropLabel: eui.Label;
    private ChatNum = 0;
    private BtnOtherHongbao: eui.Button;
    private ItemList: any[] = null;
    private betLogsCount;
    private ToViewLuckImage: eui.Image;
    private bankerPriceLabel: eui.Label;
    private bankerGroup: eui.Group;

    public setRoomData(gameId, roomInfo: RoomInfo, enableFreeBanker: boolean) {
        this.gameId = gameId;
        this.roomId = roomInfo.id;
        this.roomInfo = roomInfo;
        /*
        this.serverState = response.state;

        let currentTicket = Math.floor(Number(new Date())/1000);
        this.serverStateEndTicket = currentTicket+response.time;
        */
        this.responseJoinRoom = null;
    }
    public constructor() {
        super();
        this.skinName = "resource/skins/scene/GameHongbaoSceneSkin.exml";

    }
    public onPopScene() {

        if (this.sound_channel != null) {
            this.sound_channel.stop();
            this.sound_channel = null;
        }

        egret.Tween.removeTweens(this);
        egret.Tween.removeTweens(this.noticeLabel);
        egret.Tween.removeTweens(this.raceBgScroller.viewport);
        egret.Tween.removeTweens(this.startLineImage);
        egret.Tween.removeTweens(this.mainScroller.viewport);
        egret.Tween.removeTweens(this.bankerPriceLabel);
        for (let i = 0; i < 10; i++) {
            // 停止赛车动画
            let raceCarGroup: eui.Group = this.raceCarGroupList[i];
            egret.Tween.removeTweens(raceCarGroup);
        }
        egret.Tween.removeTweens(this.noticeLabel);

        if (this.concludeTimer != null) {
            this.concludeTimer.stop();
            this.concludeTimer.removeEventListener(egret.TimerEvent.TIMER, this.concludeTimerHandler, this);
        }

        this.hongbaoBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onCreateHongbao, this);
        this.Sendbtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendhongbao, this);
        this.CloseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.VideoBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onViewChendao, this);
        this.Money_50.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.chipToggleTouchHandle, this);
        this.Money_80.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.chipToggleTouchHandle, this);
        this.Money_100.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.chipToggleTouchHandle, this);
        this.Money_150.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.chipToggleTouchHandle, this);
        this.Money_200.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.chipToggleTouchHandle, this);

        this.Num_1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.leidianToggleTouchHandle, this);
        this.Num_2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.leidianToggleTouchHandle, this);
        this.Num_3.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.leidianToggleTouchHandle, this);
        this.Num_4.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.leidianToggleTouchHandle, this);
        this.Num_5.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.leidianToggleTouchHandle, this);
        this.Num_6.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.leidianToggleTouchHandle, this);
        this.Num_7.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.leidianToggleTouchHandle, this);
        this.Num_8.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.leidianToggleTouchHandle, this);
        this.Num_9.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.leidianToggleTouchHandle, this);
        this.Num_10.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.leidianToggleTouchHandle, this);

        this.package_1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.RatioToggleTouchHandle, this);
        this.package_2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.RatioToggleTouchHandle, this);
        this.package_3.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.RatioToggleTouchHandle, this);
        this.package_4.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.RatioToggleTouchHandle, this);

        this.backImage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.backHandler, this);
        this.soundButton.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.soundChangeControlHandler, this);
        this.playerListImage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onPlayerListHandler, this);
        this.gameMainGroup.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.swipeHandler, this);
        //投注明细弹窗监听
        this.touzhuDetailsImage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouzhuDetailsHandler, this);
        //投注明细翻页
        this.lastPageLabel.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.lastPageHandler, this);
        this.nextPageLabel.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.nextPageHandler, this);
        this.exitButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.exitHandler, this);
        this.serviceButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.serviceHandler, this);
        // this.chongzhiImage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.serviceHandler, this);
        this.rewardResultImage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onRewardResultHandler, this);
        this.ruleImage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onRuleHandler, this);
        this.caihongbao.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onCaihongbao, this);
        this.ToViewLuckImage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.ToViewHongbao, this);
        this.backgroundImage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.closeHandler, this);
        if (this.codeCalculateTimer != null) {
            this.codeCalculateTimer.stop();
            this.codeCalculateTimer.removeEventListener(egret.TimerEvent.TIMER, this.codeCalculateTimerHandler, this);
        }
        if (this.commonTimer != null) {
            this.commonTimer.removeEventListener(egret.TimerEvent.TIMER, this.commonTimerHandler, this);
            this.commonTimer.stop();
        }
        //更新抢红后显示包数的状态
        if (this.HongbaoQiangzhuTimer != null) {

            this.HongbaoQiangzhuTimer.removeEventListener(egret.TimerEvent.TIMER, this.UpdatebaoSate, this);
            this.HongbaoQiangzhuTimer.stop();
        }
        SocketEngine.getInstance().removeEventListener(SocketEngine.EventNameNotify, this.onPacketNotify, this);
        SocketEngine.getInstance().removeEventListener(SocketEngine.EventNameSettleMentResult, this.onPacketSettlementResult, this);
        SocketEngine.getInstance().removeEventListener(SocketEngine.EventNameSocketDisconnect, this.onSocketDisconnect, this);
    }
    //显示加载进度
    public privodeNeedShowLoading() {
        return false;
    }

    //别人弹出栈，自己重新显示
    public onSceneReshow() {

    }
    public onInit() {
        //获取最新游戏公告
        HttpEngine.getInstance().getNotice(function (name: string, ResponseNotice: ResponseNotice) {
            if (ResponseNotice.error != 0) {
                Toast.launch(ResponseNotice.msg);
                return;
            }
            let info = ResponseNotice.info;
            this.noticeLabel.text = info.content;
            this.noticeLabel.x = 380;
            let targetX = 0 - Number(this.noticeLabel.width);
            let tw = egret.Tween.get(this.noticeLabel);
            tw.to({ x: targetX }, 12000).call(this.onScrollNoticeEnd, this, []);
        }, this)
        this.initUserInfo();
    }

    /**
     * 创建游戏场景
     * Create a game scene
     */
    public createGameScene() {

        //this.loadArray();

        this.mainScroller.viewport.contentWidth = 1140;
        this.mainScroller.viewport.scrollH = 0;
        this.Sendhongbao.visible = false;
        this.chedao.visible = false;
        this.OpenGroup.visible = false;
        this.NullLabel.visible = false;
        this.bankerGroup.visible = true;
        this.GetjackpotNumber();
        this.hongbaoBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCreateHongbao, this);
        this.Sendbtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendhongbao, this);
        this.CloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);

        this.VideoBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onViewChendao, this);
        this.Money_50.addEventListener(egret.TouchEvent.TOUCH_TAP, this.chipToggleTouchHandle, this);
        this.Money_80.addEventListener(egret.TouchEvent.TOUCH_TAP, this.chipToggleTouchHandle, this);
        this.Money_100.addEventListener(egret.TouchEvent.TOUCH_TAP, this.chipToggleTouchHandle, this);
        this.Money_150.addEventListener(egret.TouchEvent.TOUCH_TAP, this.chipToggleTouchHandle, this);
        this.Money_200.addEventListener(egret.TouchEvent.TOUCH_TAP, this.chipToggleTouchHandle, this);

        this.Num_1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.leidianToggleTouchHandle, this);
        this.Num_2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.leidianToggleTouchHandle, this);
        this.Num_3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.leidianToggleTouchHandle, this);
        this.Num_4.addEventListener(egret.TouchEvent.TOUCH_TAP, this.leidianToggleTouchHandle, this);
        this.Num_5.addEventListener(egret.TouchEvent.TOUCH_TAP, this.leidianToggleTouchHandle, this);
        this.Num_6.addEventListener(egret.TouchEvent.TOUCH_TAP, this.leidianToggleTouchHandle, this);
        this.Num_7.addEventListener(egret.TouchEvent.TOUCH_TAP, this.leidianToggleTouchHandle, this);
        this.Num_8.addEventListener(egret.TouchEvent.TOUCH_TAP, this.leidianToggleTouchHandle, this);
        this.Num_9.addEventListener(egret.TouchEvent.TOUCH_TAP, this.leidianToggleTouchHandle, this);
        this.Num_10.addEventListener(egret.TouchEvent.TOUCH_TAP, this.leidianToggleTouchHandle, this);

        this.package_1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.RatioToggleTouchHandle, this);
        this.package_2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.RatioToggleTouchHandle, this);
        this.package_3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.RatioToggleTouchHandle, this);
        this.package_4.addEventListener(egret.TouchEvent.TOUCH_TAP, this.RatioToggleTouchHandle, this);
        this.backgroundImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeHandler, this);
        this.backImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.backHandler, this);
        this.soundButton.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.soundChangeControlHandler, this);
        this.playerListImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPlayerListHandler, this);
        this.exitButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.exitHandler, this);
        this.serviceButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.serviceHandler, this);
        //  this.chongzhiImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.serviceHandler, this);
        this.rewardResultImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRewardResultHandler, this);
        this.ruleImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRuleHandler, this);
        this.ToViewLuckImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ToViewHongbao, this);
        this.caihongbao.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCaihongbao, this);
        //投注明细翻页
        this.lastPageLabel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.lastPageHandler, this);
        this.nextPageLabel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.nextPageHandler, this);
        //投注明细弹窗监听
        this.touzhuDetailsImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouzhuDetailsHandler, this);

        //监听游戏主页面手势，判断滑动
        this.gameMainGroup.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.swipeBeginHandler, this);

        let expectInfo: ExpectInfo = DataEngine.getInstance().getExpectInfo(this.gameId);
        this.setOpenCodeWithStr(expectInfo.opencode)

        let title = DataEngine.getInstance().getGameRoomTitle(this.gameId, this.roomId);
        this.titleLabel.text = title;

        let userInfo: UserInfo = ClientStorage.getUserInfo();
        this.nameLabel.text = userInfo.nickname;
        this.balanceLabel.text = Number(userInfo.balance).toFixed(2);
        this.timeLabel.text = "";

        this.raceCarGroupList = new Array();
        this.raceCarGroupList.push(this.racecarGroup_1);
        this.raceCarGroupList.push(this.racecarGroup_2);
        this.raceCarGroupList.push(this.racecarGroup_3);
        this.raceCarGroupList.push(this.racecarGroup_4);
        this.raceCarGroupList.push(this.racecarGroup_5);
        this.raceCarGroupList.push(this.racecarGroup_6);
        this.raceCarGroupList.push(this.racecarGroup_7);
        this.raceCarGroupList.push(this.racecarGroup_8);
        this.raceCarGroupList.push(this.racecarGroup_9);
        this.raceCarGroupList.push(this.racecarGroup_10);

        //this.stateNotifyLabel.text = "";
        this.stateTicketLabel.text = "";
        //需要提示登录中
        this.stateNotifyLabel.text = "进入房间中,请稍等...";

        //创建跑道
        for (let i = 0; i < 20; i++) {

            let image = new eui.Image();
            image.source = "chedao_new_png";//"Map_png";
            image.width = 920;
            image.height = 340;
            image.x = i * 920;
            image.y = 0;
            this.raceBgScrollerGroup.addChild(image);
        }

        this.raceBgScroller.visible = false;
        this.raceBgScroller.viewport.contentWidth = 18400;
        //初始化数据
        this.resetViews(false);


        this.commonTimerHandler();
        this.commonTimer = new egret.Timer(1000, 0);
        this.commonTimer.addEventListener(egret.TimerEvent.TIMER, this.commonTimerHandler, this);
        this.commonTimer.start();

        this.codeCalculateTimer = new egret.Timer(100, 0);
        this.codeCalculateTimer.addEventListener(egret.TimerEvent.TIMER, this.codeCalculateTimerHandler, this);
        this.codeCalculateTimer.stop();

        //更新抢红后显示包数的状态
        this.HongbaoQiangzhuTimer = new egret.Timer(2000, 0);
        this.HongbaoQiangzhuTimer.addEventListener(egret.TimerEvent.TIMER, this.UpdatebaoSate, this);
        this.HongbaoQiangzhuTimer.stop();

        SocketEngine.getInstance().addEventListener(SocketEngine.EventNameNotify, this.onPacketNotify, this);
        SocketEngine.getInstance().addEventListener(SocketEngine.EventNameSettleMentResult, this.onPacketSettlementResult, this);
        SocketEngine.getInstance().addEventListener(SocketEngine.EventNameSocketSendbao, this.onPacketHongbao, this);
        SocketEngine.getInstance().addEventListener(SocketEngine.EventNameSocketDisconnect, this.onSocketDisconnect, this);

    }
    public onPacketNotify(name: string, packet: PacketNotify) {
        this.onNotifyPacketNotify(packet)
    }
    public onPacketSettlementResult(name: string, packet: PacketSettlementResult) {
        this.onNotifySettlementResult(packet)
    }
    public onPacketHongbao(name: string, packet: PacketSendbao) {
        this.SendHongbao(packet);
    }
    private initUserInfo() {
        this.gameData.initUserInfoGot = false;
        let that = this;
        let httpEngine: HttpEngine = HttpEngine.getInstance();
        httpEngine.getUserInfo(function (name: string, responseUserInfo: ResponseUserInfo) {
            if (responseUserInfo.error != 0) {
                Toast.launch(responseUserInfo.msg);
                that.forceExit();
                return;
            }

            that.gameData.initUserInfoGot = true;
            Logger.log(responseUserInfo.userInfo.nickname);
            ClientStorage.setUserInfo(responseUserInfo.userInfo);
            var userInfo: UserInfo = ClientStorage.getUserInfo();
            that.balanceLabel.text = Number(userInfo.balance).toFixed(2);

            that.connectServer(false);
        }, this);
    }
    //自己关闭socket，不会马上响应SocketEngine的onSocketClosed事件，所以这个地方不会来
    //断开网络的时候，白鹭没有触发onSocketClosed事件，还需要检查，可以用ping做检查
    public onSocketDisconnect(name: string, client_id: string) {
        let that = this;
        if (this.gameData.client_id == client_id) {//此房间socket意外中断
            this.forceExit();
            Toast.launch("网络通信中断，请重新进入房间", 2000);
        }
    }

    //如果是重连才传true
    private connectServer(isReconnect: boolean) {
        let needStopTweens = false;
        if (isReconnect) {
            needStopTweens = true;
        }

        let that = this;
        this.resetViews(needStopTweens);
        this.gameData.socketConnected = false;
        this.processState = ProcessState.ProcessStateInit;

        let tw = egret.Tween.get(this);
        tw.to({}, 500).call(function () {
            that.internalConnectServer();
        });

    }
    //连接服务器，先连接socket
    public internalConnectServer() {
        this.processState = ProcessState.ProcessStateInit;

        let that = this;
        //SocketEngine.getInstance().close();
        let socketInfo = this.roomInfo.socket_server.split(":");
        let ip = socketInfo[0];
        let port = Number(socketInfo[1]);
        SocketEngine.getInstance().connect(ip, port, function (name: string, packet: PacketInit) {
            that.gameData.socketConnected = true;
            HttpEngine.getInstance().joinRoom(that.roomId, packet.client_id, function (httpName: string, response: ResponseJoinRoom) {
                that.responseJoinRoom = response;
                if (that.responseJoinRoom.error != 0) {
                    Toast.launch(that.responseJoinRoom.msg);
                    that.forceExit();
                    return;
                }
                that.initServerParam(packet.client_id);
            }, that);
        }, that);
    }
    public initServerParam(client_id) {
        Logger.log("initServerParam with join state: " + this.responseJoinRoom.state);
        let that = this;
        //如果ServerStateRun=4，setNotifyState会激活跑车
        this.setNotifyState(this.responseJoinRoom.state, "", this.responseJoinRoom.time, this.responseJoinRoom.remaining_time, true);
        this.gameData.currentBet = this.responseJoinRoom.current_bet;
        this.gameData.client_id = client_id;

        HttpEngine.getInstance().getRoomStaffs(function (name: string, response: ResponseRoomStaff) {
            for (let row in response.rows) {
                let item: RoomStaff = response.rows[row];
                that.appendStaff(item.nickname);
            }
        }, this);
        HttpEngine.getInstance().baoLists(function (name: string, response: ResbaoLists) {
            if (response.rows.length != 0) {
                this.StartHongbao(response);
            } else {
                //如果当前服务器返回的红包列表数据为NULL那么就清除当前的红包以免出错。
                if (this.HongbaoGroup && this.BtnOtherHongbao) {
                    this.HongbaoGroup.removeChildren();
                    this.BtnOtherHongbao.visible = false;
                    this.chatScroller.viewport.scrollV = 0;
                    this.HongbaoQiangzhuTimer.stop();
                }

            }
        }, this)
    }
    public staffList: string[] = new Array();

    public appendStaff(nickname: string) {
        this.staffList.push(nickname);
    }

    private onNotifyPacketNotify(result: PacketNotify) {
        this.setNotifyState(result.info.state, result.info.msg, result.info.time, result.info.remaining_time, false);
    }

    //流程：先跑startRaceStepOneStart,开始往上跑
    //然后startRaceStepTwoRun跑出去，远一点
    //然后反复startRaceCircle，一直跑，直到状态为Conclude, startRaceStepThreeEnd冲到终点结算

    private concludeTimer: egret.Timer;//显示结算的timer
    private startRaceStepOneStart()//第二步，开始跑车
    {
        if (this.sound_on) {
            this.is_kaijiang = 1;
            this.sound_channel = Director.getInstance().soundPlay("car_mp3");
        }

        //this.bankerListGroup.visible = false;

        let currentTicket = Math.floor(Number(new Date()) / 1000);
        this.startRaceTicket = currentTicket;

        this.raceGroup.visible = true;
        this.raceBgScroller.visible = true;
        let runOneTime = 1000;//每次运动的时间长度

        let firstStartPos = 180;
        let firstEndPos = 250;
        //重置赛车的位置
        for (let i = 0; i < 10; i++) {
            // 设置初始位置
            let raceCarGroup: eui.Group = this.raceCarGroupList[i];
            raceCarGroup.x = this.raceGroup.width - raceCarGroup.width;

            //随机第一次跑出去出现的位置
            let rand1 = this.rand(firstStartPos, firstEndPos);
            let tw = egret.Tween.get(raceCarGroup);
            let step1 = tw.to({ x: rand1 }, runOneTime);

            let fireImage: eui.Image = this.getFireImage(i);
            fireImage.visible = true;
        }

        //终点线退后
        let startLineImageTw = egret.Tween.get(this.startLineImage);
        startLineImageTw.to({ x: this.raceGroup.width }, this.raceGroup.width);

        //跑道背景滚动
        this.raceBgScroller.viewport.scrollH = 920 * 20;
        let raceBgScrollerTw = egret.Tween.get(this.raceBgScroller.viewport);
        raceBgScrollerTw.to({ scrollH: this.raceBgScroller.viewport.scrollH - 500 }, runOneTime).call(this.startRaceCircle, this);

        this.codeCalculateTimer.start();
    }
    //每次循环跑,直到有结果
    private startRaceCircle() {

        let currentTicket = Math.floor(Number(new Date()) / 1000);
        let usedTicket = currentTicket - this.startRaceTicket;

        if (this.processState == ProcessState.ProcessStateRun || usedTicket < 10)//如果状态是run，或者跑了少于10秒，都继续跑
        {
            //继续跑
            let runOneTime = 1000;//每次运动的时间长度

            let startPos = 250;
            let endPos = 350;
            //重置赛车的位置
            for (let i = 0; i < 10; i++) {
                // 设置初始位置
                let raceCarGroup: eui.Group = this.raceCarGroupList[i];

                //随机每次跑出去出现的位置
                let rand = this.rand(startPos, endPos);
                let tw = egret.Tween.get(raceCarGroup);
                let step1 = tw.to({ x: rand }, runOneTime)

                let fireImage: eui.Image = this.getFireImage(i);
                if (raceCarGroup.x < rand) {
                    fireImage.visible = false;
                } else {
                    fireImage.visible = true;
                }
            }

            //跑道背景滚动
            let raceBgScrollerTw = egret.Tween.get(this.raceBgScroller.viewport);
            raceBgScrollerTw.to({ scrollH: this.raceBgScroller.viewport.scrollH - 500 }, runOneTime).call(this.startRaceCircle, this);
        } else if (this.openResult != null) {
            //跑到终点
            this.startRaceStepThreeEnd();
        } else {
            //没给开奖结果就切换状态了,直接reset
            this.switchStatus(ProcessState.ProcessStateWait);
        }

    }

    private onNotifySettlementResult(result: PacketSettlementResult) {
        if (result.room_type != this.roomType) {
            return;
        }

        this.settlementResult = result;
        this.openResult = result.open_result;

        //状态改为开奖中,如果是车没跑完，跑完车结算，如果没有跑车，直接结算
        this.switchStatus(ProcessState.ProcessStateConclude);
    }
    private startRaceStepThreeEnd() {
        let openCodeList = this.openResult.opencode.split(",");//名次， 第几名是哪个车
        let carRank: number[] = new Array();//每个车是第几名
        //把名次反转
        for (let i = 0; i < 10; i++) {
            let rank = i;
            let car = Number(openCodeList[i]) - 1;//车编号从1开始，但是索引从0开始
            carRank[car] = rank;
        }

        let runOneTime = 1000;//每次运动的时间长度
        let that = this;
        for (let i = 0; i < 10; i++) {
            let raceCarGroup: eui.Group = this.raceCarGroupList[i];

            let rank = carRank[i];
            let resultPos = 110 + rank * 20;//终点位置计算
            //冲终点500ms，停留2秒，然后花500ms冲过去
            let tw = egret.Tween.get(raceCarGroup);
            tw.to({ x: resultPos }, 100).to({}, 100).call(function () {
                that.codeCalculateTimer.stop();//先停止计算开奖位置，防止跑到终点归零
            }).to({ x: -100 }, 300);

            let fireImage: eui.Image = this.getFireImage(i);
            fireImage.visible = true;
        }

        //1000ms后停止声音，2000ms后开启声音，过500ms后再停止声音
        let twStopSound = egret.Tween.get(this);
        // twStopSound.to({}, 1000).call(function(){
        //     that.sound_channel.stop();
        // }, this);
        twStopSound.to({}, 100).call(function () {
            if (that.sound_channel != null) {
                that.sound_channel.stop();
            }
        }, this).to({}, 100).call(function () {
            if (that.sound_on) {
                that.sound_channel = Director.getInstance().soundPlay("car_mp3");
            }
        }, this).to({}, 500).call(function () {
            if (that.sound_channel != null) {
                that.sound_channel.stop();
            }
        }, that);
        //终点线出现
        this.startLineImage.x = -20;
        let startLineImageTw = egret.Tween.get(this.startLineImage);
        startLineImageTw.to({}, 0).to({ x: 100 }, 500);

        let raceBgScrollerTw = egret.Tween.get(this.raceBgScroller.viewport);
        raceBgScrollerTw.to({ scrollH: this.raceBgScroller.viewport.scrollH - 500 }, runOneTime);

        // //结算在3秒后开始
        let concludeTime = 3000;//1000;//8000;
        this.concludeTimer = new egret.Timer(concludeTime, 1);
        this.concludeTimer.addEventListener(egret.TimerEvent.TIMER, this.concludeTimerHandler, this);
        this.concludeTimer.start();
    }
    private concludeTimerHandler() {
        if (this.openResult == null) {
            Toast.launch("游戏状态出错，请退出房间再进");
            return;
        }

        this.setOpenCodeWithStr(this.openResult.opencode);
        this.goOpenConcludeDialog();
        let delay = 0;
        let openCodeList = this.openResult.opencode.split(",");
        let areaRankList: AreaRank[] = new Array();//评分表
        //let rankAreaIdList = number[];//根据排名1-5的areaid列表
    }
    private goOpenConcludeDialog() {
        this.reloadUserInfo();

        //弹出结算框，重置游戏状态到等待阶段
        this.concludeHandler();
        this.switchStatus(ProcessState.ProcessStateWait);

    }
    private rand(start, end) {
        return Math.floor(Math.random() * (end - start) + start);
    }
    private resetViews(stopTweens: boolean) {
        //停止动画
        if (stopTweens) {
            egret.Tween.removeTweens(this);
            egret.Tween.removeTweens(this.raceBgScroller.viewport);
            egret.Tween.removeTweens(this.startLineImage);
            egret.Tween.removeTweens(this.mainScroller);
            for (let i = 0; i < 10; i++) {
                // 停止赛车动画
                let raceCarGroup: eui.Group = this.raceCarGroupList[i];
                egret.Tween.removeTweens(raceCarGroup);
            }
        }

        //显示大倒计时
        this.timeLabel.visible = true;
        this.timeLabel.text = "";           //大倒计时
        this.stateTicketLabel.text = "";    //小倒计时
        //重置赛道位置
        this.raceBgScroller.viewport.scrollH = 920 * 20;
        this.raceBgScroller.visible = false;


        //重置赛车位置，在最右边
        for (let i = 0; i < 10; i++) {
            let raceCarGroup: eui.Group = this.raceCarGroupList[i];
            raceCarGroup.x = this.raceGroup.width - raceCarGroup.width;
        }
        //终点线初始化
        this.startLineImage.x = this.raceGroup.width - 120;

        if (this.codeCalculateTimer != null) {
            this.codeCalculateTimer.stop();//先停止计算开奖位置，防止跑到终点归零    
        }

        if (this.sound_channel != null) {
            this.sound_channel.stop();
        }

    }
    private setNotifyState(state: number, notify: string, remain_ticket: number, remaining_open_time: number, forceUserRemainingOpenTime: boolean) {
        this.serverState = state;
        this.serverStateNotify = notify;
        //this.stateNotifyLabel.text = notify;

        let currentTicket = Math.floor(Number(new Date()) / 1000);
        this.serverStateEndTicket = currentTicket + remain_ticket;
        if (state == ServerState.StateWait || forceUserRemainingOpenTime) {
            this.remaining_open_time = remaining_open_time;
            this.serverStateOpenTicket = currentTicket + remaining_open_time;
        }


        //切换流程状态机
        switch (this.serverState) {
            case ServerState.StateWait:
                {//等待开始
                    //因为客户端有可能在做结算,这里要特殊处理
                    if (this.processState == ProcessState.ProcessStateConclude) {
                        //暂不处理
                    } else {
                        this.switchStatus(ProcessState.ProcessStateWait);
                    }
                    break;
                }
            case ServerState.StateBet:
                {//开始下注
                    this.switchStatus(ProcessState.ProcessStateBeting);
                    break;
                }
            case ServerState.StateBlock:
                {//封盘

                    this.switchStatus(ProcessState.ProcessStateBlocking)
                    break;
                }
            case ServerState.StateStartRun:
                {
                    //开始跑车
                    this.switchStatus(ProcessState.ProcessStateRun)
                }


        }
    }
    private switchStatus(processState: ProcessState) {
        if (this.processState == processState) {//状态不变就不动，防止joinRoom4的时候再次发socket的state4消息
            return;
        }

        switch (processState) {
            case ProcessState.ProcessStateWait:
                {//等待开始

                    this.resetViews(true);
                    this.bankerGroup.visible = true;
                    //  this.updateBanker(false);
                    break;
                }
            case ProcessState.ProcessStateBeting:
                {//下注中
                    Toast.launch("开始发红包");
                    break;
                }
            case ProcessState.ProcessStateBlocking:
                {//封盘中
                    //this.updateBanker(false);
                    break;
                }
            case ProcessState.ProcessStateRun:
                {
                    //开始跑车
                    this.startRaceStepOneStart();
                    this.bankerGroup.visible = false;
                    break;
                }
            case ProcessState.ProcessStateConclude:
                {//结算中
                    //结算只给状态，跑的过程中判断结算是否该显示了(跑完十秒后)
                    if (this.processState == ProcessState.ProcessStateRun) {//跑车过程中跳过消息
                        //skip
                        Logger.log("服务器给出结算信息，正在跑车，稍后结算")
                    } else {
                        Logger.log("服务器给出结算信息，没有跑车，丢了跑车state4通知")
                        Toast.launch("服务器状态错误，丢失了结算消息");
                        //重置状态机为初始状态
                        this.reloadUserInfo();
                        //弹出结算框，重置游戏状态到等待阶段
                        this.concludeHandler();

                        //this.switchStatus(ProcessState.ProcessStateWait);//这样改不行，后面又被覆盖了
                        //改状态为等待中
                        processState = ProcessState.ProcessStateWait;

                        // this.updateBanker(false);
                    }
                    break;
                }
        }
        this.processState = processState;
    }
    //一局之后重新拉余额
    private reloadUserInfo() {
        let that = this;

        let httpEngine: HttpEngine = HttpEngine.getInstance();
        httpEngine.getUserInfo(function (name: string, responseUserInfo: ResponseUserInfo) {
            Logger.log(responseUserInfo.userInfo.nickname);
            ClientStorage.setUserInfo(responseUserInfo.userInfo);
            var userInfo: UserInfo = ClientStorage.getUserInfo();
            that.balanceLabel.text = Number(userInfo.balance).toFixed(2);
        }, this);

        HttpEngine.getInstance().getNewExpect(function (name: string, response: ResponseNewExpect) {
            DataEngine.getInstance().setExpectInfoList(response.rows);
            let title = DataEngine.getInstance().getGameRoomTitle(that.gameId, that.roomId);
            that.titleLabel.text = title

            let expectInfo: ExpectInfo = DataEngine.getInstance().getExpectInfo(that.gameId);
            this.NoerList.text = "第" + expectInfo.expect + "期";
        }, this);

    }
    //公共倒计时
    private commonTimerHandler() {
        let currentTicket = Math.floor(Number(new Date()) / 1000);
        let deltaTicket = currentTicket - this.lastTimerTicket;
        let isFirstTicket = this.lastTimerTicket > 0 ? false : true;
        this.lastTimerTicket = currentTicket;
        if (!isFirstTicket && deltaTicket > 30) {
            //切后台了
            Toast.launch("后台返回了");
            this.lastTimerTicket = 0;
            //this.connectServer(true);

            this.forceExit();
            return;
        }

        switch (this.processState) {
            case ProcessState.ProcessStateInit:
                {
                    //需要提示登录中
                    if (!this.gameData.initUserInfoGot) {
                        this.stateNotifyLabel.text = "初始化用户信息,请稍等...";
                    }
                    else if (!this.gameData.socketConnected) {
                        if (SocketEngine.getInstance().isSocketConnected()) {
                            this.stateNotifyLabel.text = "连接房间中,请稍等...";
                        } else {
                            this.stateNotifyLabel.text = "房间初始化,请稍等...";
                        }
                    } else {
                        this.stateNotifyLabel.text = "请求房间数据,请稍等...";
                    }

                    this.stateTicketLabel.text = "";
                    break;
                }
            case ProcessState.ProcessStateWait://等待开始
                {//等待开始倒计时
                    this.stateNotifyLabel.text = "等待游戏开始";
                    this.ChatNum = 0;

                    if (this.serverStateEndTicket - currentTicket < 0) {
                        this.stateTicketLabel.text = "";
                    } else {
                        this.stateTicketLabel.text = String(this.serverStateEndTicket - currentTicket);//倒计时秒数  
                    }
                    if (this.serverStateOpenTicket - currentTicket < 0) {
                        this.timeLabel.text = "";
                    } else {
                        let remainTicket = this.serverStateOpenTicket - currentTicket;
                        this.timeLabel.text = String(remainTicket) + "s";
                    }

                    break;
                }
            case ProcessState.ProcessStateBeting://下注阶段
                {//下注阶段没有倒计时
                    if (currentTicket - this.showCancleBetTicket >= 15) {
                        //取消下注倒计时15s后消失
                        this.showCancleBet = 0;
                        // this.cancleBetGroup.visible = false;
                        // this.sureBetGroup.visible = false;
                        this.showCancleBetTicket = 0;
                        this.showCancleBetRemainTime = 15;
                    }

                    if (this.serverStateEndTicket - currentTicket < 3) {
                        this.stateNotifyLabel.text = "发红包倒计时";
                        this.showCancleBet = 0;
                        // this.cancleBetGroup.visible = false;
                        // this.sureBetGroup.visible = false;
                        this.showCancleBetTicket = 0;
                        this.showCancleBetRemainTime = 15;
                        //this.stateTicketLabel.text = String(this.serverStateEndTicket - currentTicket);//倒计时3秒
                    } else {
                        this.stateNotifyLabel.text = "发包中";

                        //this.stateTicketLabel.text = String(this.serverStateEndTicket - currentTicket);//倒计时3秒
                    }
                    if (this.serverStateEndTicket - currentTicket < 0) {
                        this.stateTicketLabel.text = "";
                        this.showCancleBet = 0;
                        // this.cancleBetGroup.visible = false;
                        // this.sureBetGroup.visible = false;
                        this.showCancleBetTicket = 0;
                        this.showCancleBetRemainTime = 15;
                    } else {
                        this.stateTicketLabel.text = String(this.serverStateEndTicket - currentTicket);//倒计时秒数
                        // this.sureBetTimeLabel.text = "(" + String(this.showCancleBetRemainTime--) + ")";//取消投注倒计时秒数    
                    }
                    /*
                    let expectInfo:ExpectInfo = DataEngine.getInstance().getExpectInfo(this.gameId);
                    let currentTicket = Math.floor(Number(new Date())/1000);
                    let usedTicket = currentTicket-expectInfo.local_request_time;
                    let remainTicket:number = expectInfo.next_time-usedTicket;
                    */
                    if (this.serverStateOpenTicket - currentTicket < 0) {
                        this.timeLabel.text = "";
                    } else {
                        let remainTicket = this.serverStateOpenTicket - currentTicket;
                        this.timeLabel.text = String(remainTicket) + "s";
                    }

                    break;
                }
            case ProcessState.ProcessStateBlocking://封盘阶段
                {//封盘倒计时
                    this.showCancleBet = 0;
                    // this.cancleBetGroup.visible = false;
                    // this.sureBetGroup.visible = false;
                    this.showCancleBetTicket = 0;
                    this.showCancleBetRemainTime = 15;
                    this.stateNotifyLabel.text = "封盘中";
                    if (this.serverStateEndTicket - currentTicket < 0) {
                        this.stateTicketLabel.text = "";
                    } else {
                        this.stateTicketLabel.text = String(this.serverStateEndTicket - currentTicket);//倒计时秒数  
                    }
                    if (this.serverStateOpenTicket - currentTicket < 0) {
                        this.timeLabel.text = "";
                    } else {
                        let remainTicket = this.serverStateOpenTicket - currentTicket;
                        this.timeLabel.text = String(remainTicket) + "s";
                    }

                    //这里不开始，等服务器发OpenResult消息才开始
                    break;
                }
            case ProcessState.ProcessStateRun://开奖中
                {
                    this.timeLabel.text = "";
                    this.stateNotifyLabel.text = "等待游戏结束";
                    this.stateTicketLabel.text = "";
                    break;
                }
            case ProcessState.ProcessStateConclude://结算中
                {//结算没有倒计时
                    this.timeLabel.text = "";
                    this.stateNotifyLabel.text = "结算中";
                    this.stateTicketLabel.text = "";
                    break;
                }
        }
    }
    private concludeHandler(): void {
        if (this.settlementResult == null) {
            Toast.launch("暂无结算信息");
            return;
        }
        let resultUserList: ResultUser[] = null;
        let bankerReward: number = 0;
        if (this.settlementResult.resultInfoHongBao != null) {
            resultUserList = this.settlementResult.resultInfoHongBao.users;
            bankerReward = 0;
        }
        Director.getInstance().showConcludeDialog(this, this.gameId, this.roomId, bankerReward, resultUserList, "hongbao", this.sound_on);
    }
    private onViewChendao(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            Director.getInstance().effectPlay("click_mp3");
        }
        if (this.VideoBtn.selected) {
            this.chedao.visible = true;
            //this.chatScroller.height = 900; 
        } else {
            this.chedao.visible = false;
            //this.chatScroller.height = 550; 
        }
    }

    //创建奖池
    private GetjackpotNumber() {
        HttpEngine.getInstance().jackpotNumber(function (name: string, response: ResJackpotNumber) {

            this.bankerPriceLabel.text = response.total;
        }, this)

    }
    // 创建红包
    private onCreateHongbao(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            Director.getInstance().effectPlay("click_mp3");
        }
        this.oneself = false;
        this.Sendhongbao.visible = true;
        //获取红包类型
        HttpEngine.getInstance().baoTypes(this.getNewbaoType, this)
    }


    //监听公告单次滚动结束事件
    private onScrollNoticeEnd(): void {
        this.noticeLabel.x = 380;
        var targetX = 0 - Number(this.noticeLabel.width);
        var tw = egret.Tween.get(this.noticeLabel);
        tw.to({ x: 0 - targetX }, 12000).call(this.onScrollNoticeEnd, this, []);
    }
    private onClose(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            Director.getInstance().effectPlay("click_mp3");
        }
        this.Sendhongbao.visible = false;
    }
    //发送红包
    private onSendhongbao(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            Director.getInstance().effectPlay("click_mp3");
        }
        if (this.processState == ProcessState.ProcessStateWait) {
            //等待游戏开始，不能下注
            Toast.launch("等待游戏开始，请稍后在发红包");
            return;
        } else if (this.processState == ProcessState.ProcessStateBlocking) {
            //等待游戏开始，不能下注
            Toast.launch("封盘中，请稍后在发红包");
            return;
        } else if (this.processState != ProcessState.ProcessStateBeting)//最后保护状态
        {
            Toast.launch("当前不能发红包,请等待游戏开始");
            return;
        }

        //对area_id下注
        let selectedChip = this.getSelectedChip();
        if (selectedChip <= 0) {
            Toast.launch("请先选择下注的筹码");
            return;
        }
        let seletedRay = this.getSelectedRay();
        if (seletedRay <= 0) {
            Toast.launch("请先选择雷号");
            return;
        }
        let seletedType = this.getSelectedType();
        if (seletedType <= 0) {
            Toast.launch("请先选择倍数");
            return;
        }
        evt.touchDown = true;
        this.oneself = evt.touchDown;
        this.sendbao(selectedChip, seletedRay, seletedType);
    }

    private sendbao(selectedChip, seletedRay, seletedType) {

        let that = this;
        //发包
        HttpEngine.getInstance().sendbao(selectedChip, seletedRay, seletedType, function (name: string, response: ResponseBet) {
            //发包结果
            if (response.error != 0) {
                Toast.launch(response.msg);
                //this.connectServer(); //not sure about what errors will hanppen here
            } else {
                let userInfo: UserInfo = ClientStorage.getUserInfo();
                userInfo.balance = userInfo.balance - selectedChip;
                ClientStorage.setUserInfo(userInfo);
                that.balanceLabel.text = Number(userInfo.balance).toFixed(2);
            }
        }, this);
    }
    private PacketsNumber = 0;
    //获取红包的类型
    private getNewbaoType(name: string, response: ResponsebaoType): void {
        this.iarray = new Array();
        for (var row in response.rows) {
            let item: OpenResultBaoType = response.rows[row] as OpenResultBaoType;
            var data = {
                gameInfo: item,
                multiple: item.multiple,
                number: item.number,
            }
            this.iarray.push(data);
        }
        this.package_1.label = this.iarray[0].number + "包" + this.iarray[0].multiple + "倍";
        this.package_2.label = this.iarray[1].number + "包" + this.iarray[1].multiple + "倍";
        this.package_3.label = this.iarray[2].number + "包" + this.iarray[2].multiple + "倍";
        this.package_4.label = this.iarray[3].number + "包" + this.iarray[3].multiple + "倍";
    }
    private SendHongbao(packet: PacketSendbao) {
        HttpEngine.getInstance().baoLists(function (name: string, response: ResbaoLists) {
            if (response.rows.length != 0) {
                this.StartHongbao(response);
                this.HongbaoQiangzhuTimer.start();

            }
        }, this)
    }
    private StartHongbao(response: ResbaoLists) {

        this.ItemList = new Array();
        //获取红包列表
        this.betLogsCount = response.rows.length != null ? response.rows.length : 0;
        if (response.error != 0) {
            Toast.launch(response.msg);
            //this.connectServer(); //not sure about what errors will hanppen here
        } else {
            for (var row in response.rows) {
                var item: OpenResultBaoList = response.rows[row] as OpenResultBaoList;
                var date = {
                    
                    gameInfo: item,
                    number: item.number,
                    receive_number: item.receive_number,
                    id: item.id,
                    fkMbId: item.fk_mb_id,
                    nickname: item.nickname,
                    total: item.total,
                    ray: item.ray,
                }
                this.ItemList.push(date);
            }
        }
        this.showHongbao();
    }
    //显示红包
    private TextHeight = 0;
    private showHongbao() {
        let iarray: any[] = new Array();
        iarray = this.ItemList;
        this.ChatNum += 1;
        let userInfo: UserInfo = ClientStorage.getUserInfo();
        for (var i = 0; i < iarray.length; i++) {
            let item = iarray[i];
            // this.Sendhongbao.visible = false;
            this.onViweCai = false;
            this.BtnOtherHongbao = new eui.Button();
            if (item.fkMbId == userInfo.id) {
                this.BtnOtherHongbao.skinName = "resource/skins/dialog/CreateOneselfHongbao.exml";
                this.BtnOtherHongbao.x = 310;
            } else {
                this.BtnOtherHongbao.skinName = "resource/skins/dialog/CreateOtherHongbao.exml";
                this.BtnOtherHongbao.x = 0;
            }
            this.BtnOtherHongbao.name = ("betInfoCell_" + String(i)); 
            let honGroup: eui.Group = this.BtnOtherHongbao.getChildByName("honGroup") as (eui.Group);
            let HongbaoImage = honGroup.getChildByName("HongbaoImage") as (eui.Image);
            let DataLabel0: eui.Label = honGroup.getChildByName("DataLabel0") as (eui.Label)
            let NameLabel: eui.Label = honGroup.getChildByName("NameLabel") as (eui.Label);
            let DataLabel: eui.Label = honGroup.getChildByName("DataLabel") as (eui.Label);
            let dataLabel3: eui.Label = honGroup.getChildByName("DataLabel3") as (eui.Label);
            //let rayImage: eui.Image = honGroup.getChildByName("rayImage") as (eui.Image);
            this.BtnOtherHongbao.y = 170 * i;
            DataLabel.text = item.total + "筹码";
            NameLabel.text = item.nickname;
            dataLabel3.text = item.ray;
            // rayImage.source = this.getRayIamge(item.ray);
            var receiveNumber = item.number - item.receive_number;
            DataLabel0.text = item.number + "包/剩" + receiveNumber + "包";
            if (receiveNumber == 0) {
                HongbaoImage.source = "Grab_the_2_png";
            }
            //文本高度大于滚动容器高度时，将视口置于文本最后一行
            this.TextHeight = honGroup.height * this.ChatNum;
            if (this.TextHeight > this.chatScroller.height) {
                this.chatScroller.viewport.scrollV = this.TextHeight - this.chatScroller.height;
            }
            this.HongbaoGroup.addChild(this.BtnOtherHongbao)
            this.BtnOtherHongbao.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onViweCaihongbao, this);
        }
    }
    //更新包状态
    private UpdatebaoSate() {
        HttpEngine.getInstance().baoLists(function (name: string, response: ResbaoLists) {
            if (response.rows.length != 0) {
                for (var row in response.rows) {
                    var item: OpenResultBaoList = response.rows[row] as OpenResultBaoList;
                }
                for (var i = 0; i < response.rows.length; i++) {
                    let honGroup: eui.Group = this.BtnOtherHongbao.getChildByName("honGroup") as (eui.Group);
                    let DataLabel0: eui.Label = honGroup.getChildByName("DataLabel0") as (eui.Label)
                    var receiveNumber = item.number - item.receive_number;
                    DataLabel0.text = item.number + "包/剩" + receiveNumber + "包";
                }
            } else {
                //如果服务器返回的红包列表数据为NULL那么就清除当前的红包以免出错。
                if (this.HongbaoGroup && this.BtnOtherHongbao) {
                    this.HongbaoGroup.removeChildren();
                    this.BtnOtherHongbao.visible = false;
                    this.chatScroller.viewport.scrollV = 0;
                    this.HongbaoQiangzhuTimer.stop();
                }
                //Toast.launch(response.msg);
            }
        }, this)
    }

    //显示拆红包控件
    private target: eui.Group;
    private onViweCaihongbao(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            Director.getInstance().effectPlay("click_mp3");
        }
        this.target = evt.currentTarget;
        var index_str = Number(this.target.name.replace("betInfoCell_", ""));
        var userInfo: UserInfo = ClientStorage.getUserInfo();
        let iarray: any[] = new Array();
        iarray = this.ItemList;
        for (var i = 0; i < iarray.length; i++) {
            var item = iarray[index_str];
            if (this.onViweCai && item.fkMbId != userInfo.id) {
                this.OpenGroup.visible = false;
                var CaihongbaoDialog: RuleCaihongbaoDialog = new RuleCaihongbaoDialog(item.id, this.gameId, this.roomId, this.sound_on);
                this.addChild(CaihongbaoDialog)
            } else {
                this.OpenGroup.visible = true;
            }
        }
    }
    //拆红包
    private onCaihongbao(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            Director.getInstance().effectPlay("click_mp3");
        }
        let iarray: any[] = new Array();
        iarray = this.ItemList;
        var userInfo: UserInfo = ClientStorage.getUserInfo();;
        var index_str = Number(this.target.name.replace("betInfoCell_", ""));
        for (var i = 0; i < iarray.length; i++) {
            var item = iarray[index_str];
            let betInfoCell = this.HongbaoGroup.getChildByName("betInfoCell_" + i) as (eui.Group);
        }

        HttpEngine.getInstance().receive(item.id, function (name: string, response: ResponseBet) {
            if (response.error != 0) {
                Toast.launch(response.msg);
                //this.connectServer(); //not sure about what errors will hanppen here
            } else
                if (item.fkMbId != userInfo.id) {
                    //显示抢红包的状态
                    evt.touchDown = true;
                    this.onViweCai = evt.touchDown;
                    this.OpenGroup.visible = false;
                    var CaihongbaoDialog: RuleCaihongbaoDialog = new RuleCaihongbaoDialog(item.id, this.gameId, this.roomId, this.sound_on);
                    this.addChild(CaihongbaoDialog);

                }
        }, this)
    }
    //查看手气
    private ToViewHongbao(evt: egret.TouchEvent) {
        if (this.sound_on) {
            Director.getInstance().effectPlay("click_mp3");
        }
        let iarray: any[] = new Array();
        iarray = this.ItemList;
        var userInfo: UserInfo = ClientStorage.getUserInfo();;
        var index_str = Number(this.target.name.replace("betInfoCell_", ""));
        for (var i = 0; i < iarray.length; i++) {
            var item = iarray[index_str];
            let betInfoCell = this.HongbaoGroup.getChildByName("betInfoCell_" + i) as (eui.Group);
        }
        var toViewHongbaoDlg: ToViewHongbaoDlg = new ToViewHongbaoDlg(item.id, this.gameId, this.roomId, this.sound_on);
        this.addChild(toViewHongbaoDlg);

    }
    //private RuleNineDialog:RuleNineDialog = null;
    private closeHandler(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            Director.getInstance().effectPlay("click_mp3");
        }
        //this.parent.removeChild(this);
        this.OpenGroup.visible = false;
    }

    //游戏主页面手势开始事件
    private swipeBeginHandler(evt: egret.TouchEvent): void {
        console.log("beginPositionX:", evt.stageX);
        //记录触摸点位置
        this.beginPositionX = evt.stageX;
        this.beginPositionY = evt.stageY;
        //判断当前是否有左右滑出页面，有的话点击非滑出页面区域则复原
        console.log("this-------" + this.mainScroller.viewport.scrollH);
        if (this.mainScroller.viewport.scrollH == 500) {
            this.showCenter();

        } else {
            //监听手势滑动事件
            this.gameMainGroup.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.swipeHandler, this);
        }
    }
    private swipeHandler(evt: egret.TouchEvent): void {
        console.log("movePositionX:", evt.stageX);
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
        let all = 1;
        let room_names = ['牌九', '牛牛', '推筒子', '龙虎', '龙虎斗', '单张', '猴赛雷','PC蛋蛋'];
        HttpEngine.getInstance().getBetLog(all, dateStr, this.page, this.row, function (name: string, response: ResponseBetLogs) {
            this.currentPageLabel.text = this.page;
            let count = response.count != null ? response.count : 0;
            this.totalPageLabel.text = Math.ceil(count / this.row);
            this.betLogsCount = response.rows.length != null ? response.rows.length : 0;
            for (let i = 0; i < response.rows.length; ++i) {
                let betLogInfo: BetLogInfo = response.rows[i];
                let betInfoCell: eui.Button = new eui.Button();
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
                }else if (betLogInfo['room_name'].indexOf(room_names[7]) >= 0) {//PC蛋蛋投注明细
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
                /*let betCellGroup: eui.Group = betInfoCell.getChildByName("betCellGroup") as (eui.Group);
                let nameLabel: eui.Label = betCellGroup.getChildByName("betNameLabel") as (eui.Label);
                let valueLabel: eui.Label = betCellGroup.getChildByName("betValueLabel") as (eui.Label);
    
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
    private onTouchEend(evt: egret.TouchEvent): void {
        var newScene: RoomScene = new RoomScene();
        Director.getInstance().pushScene(newScene);
    }
    private chipToggleTouchHandle(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            Director.getInstance().soundPlay("chip_click_mp3");
        }
        let selectedToggle = evt.target;

        if (!(selectedToggle === this.Money_50)) {
            this.Money_50.$setSelected(false);
        }

        if (!(selectedToggle === this.Money_80)) {
            this.Money_80.$setSelected(false);
        }

        if (!(selectedToggle === this.Money_100)) {
            this.Money_100.$setSelected(false);
        }

        if (!(selectedToggle === this.Money_150)) {
            this.Money_150.$setSelected(false);
        }

        if (!(selectedToggle === this.Money_200)) {
            this.Money_200.$setSelected(false);
        }
    }

    private getSelectedChip() {

        if (this.Money_50.selected)
            return 50;
        else if (this.Money_80.selected)
            return 80;
        else if (this.Money_100.selected)
            return 100;
        else if (this.Money_150.selected)
            return 150;
        else if (this.Money_200.selected)
            return 200;
        return 0;
    }
    private getSelectedRay() {
        if (this.Num_1.selected)
            return 1;
        else if (this.Num_2.selected)
            return 2;
        else if (this.Num_3.selected)
            return 3
        else if (this.Num_4.selected)
            return 4;
        else if (this.Num_5.selected)
            return 5;
        else if (this.Num_6.selected)
            return 6;
        else if (this.Num_7.selected)
            return 7;
        else if (this.Num_8.selected)
            return 8;
        else if (this.Num_9.selected)
            return 9;
        else if (this.Num_10.selected)
            return 10;
        return 0;
    }
    private getSelectedType() {
        if (this.package_1.selected)
            return 1;
        else if (this.package_2.selected)
            return 2;
        else if (this.package_3.selected)
            return 3
        else if (this.package_4.selected)
            return 4;
        return 0;
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
    private getRayIamge(rank: number) {
        switch (rank) {
            case 1:
                return "1_1_png";
            case 2:
                return "1_2_png";
            case 3:
                return "1_3_png";
            case 4:
                return "1_4_png";
            case 5:
                return "1_5_png";
            case 6:
                return "1_6_png";
            case 7:
                return "1_7_png";
            case 8:
                return "1_8_png";
            case 9:
                return "1_9_png";
            case 10:
                return "1_10_png";
        }

    }
    private leidianToggleTouchHandle(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            Director.getInstance().soundPlay("chip_click_mp3");
        }
        let selectedToggle = evt.target;

        if (!(selectedToggle === this.Num_1)) {
            this.Num_1.$setSelected(false);
        }

        if (!(selectedToggle === this.Num_2)) {
            this.Num_2.$setSelected(false);
        }

        if (!(selectedToggle === this.Num_3)) {
            this.Num_3.$setSelected(false);
        }

        if (!(selectedToggle === this.Num_4)) {
            this.Num_4.$setSelected(false);
        }

        if (!(selectedToggle === this.Num_5)) {
            this.Num_5.$setSelected(false);
        }
        if (!(selectedToggle === this.Num_6)) {
            this.Num_6.$setSelected(false);
        }
        if (!(selectedToggle === this.Num_7)) {
            this.Num_7.$setSelected(false);
        }
        if (!(selectedToggle === this.Num_8)) {
            this.Num_8.$setSelected(false);
        }
        if (!(selectedToggle === this.Num_9)) {
            this.Num_9.$setSelected(false);
        }
        if (!(selectedToggle === this.Num_10)) {
            this.Num_10.$setSelected(false);
        }

    }
    private RatioToggleTouchHandle(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            Director.getInstance().soundPlay("chip_click_mp3");
        }
        let selectedToggle = evt.target;

        if (!(selectedToggle === this.package_1)) {
            this.package_1.$setSelected(false);
        }
        if (!(selectedToggle === this.package_2)) {
            this.package_2.$setSelected(false);
        }
        if (!(selectedToggle === this.package_3)) {
            this.package_3.$setSelected(false);
        }
        if (!(selectedToggle === this.package_4)) {
            this.package_4.$setSelected(false);
        }
    }
    //获取开奖对应数字的图标
    private getResultImage(result: number) {
        switch (result) {
            case 1:
                return this.code_image_1;
            case 2:
                return this.code_image_2;
            case 3:
                return this.code_image_3;
            case 4:
                return this.code_image_4;
            case 5:
                return this.code_image_5;
            case 6:
                return this.code_image_6;
            case 7:
                return this.code_image_7;
            case 8:
                return this.code_image_8;
            case 9:
                return this.code_image_9;
            case 10:
                return this.code_image_10;
        }
    }
    private getFireImage(index: number) {
        let targetFireImage = null;
        switch (index) {
            case 0:
                targetFireImage = this.fireImage_1;
                break;
            case 1:
                targetFireImage = this.fireImage_2;
                break;
            case 2:
                targetFireImage = this.fireImage_3;
                break;
            case 3:
                targetFireImage = this.fireImage_4;
                break;
            case 4:
                targetFireImage = this.fireImage_5;
                break;
            case 5:
                targetFireImage = this.fireImage_6;
                break;
            case 6:
                targetFireImage = this.fireImage_7;
                break;
            case 7:
                targetFireImage = this.fireImage_8;
                break;
            case 8:
                targetFireImage = this.fireImage_9;
                break;
            case 9:
                targetFireImage = this.fireImage_10;
                break;
            case 10:
                targetFireImage = this.fireImage_4;
                break;
        }
        return targetFireImage;
    }
    //10,9,8这样
    private setOpenCodeWithStr(opencode: String) {
        let openCodeList = opencode.split(",");//名次， 第几名是哪个车
        this.setOpenCode(openCodeList);
    }
    private setOpenCode(openCodeList: any[]) {
        for (let i = 0; i < openCodeList.length; i++) {
            let code: number = Number(openCodeList[i]);
            let resultImage = this.getResultImage(code);
            resultImage.x = 40 * i;
        }
    }
    private codeCalculateTimerHandler() {
        //racecarGroup_1
        let carCodeArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        let that = this;
        //排序chip
        carCodeArray.sort((a, b) => {
            let raceCarGroupA: eui.Group = that.raceCarGroupList[a - 1];
            let raceCarGroupB: eui.Group = that.raceCarGroupList[b - 1];

            if (raceCarGroupA.x < raceCarGroupB.x) {
                return -1;
            }
            if (raceCarGroupA.x > raceCarGroupB.x) {
                return 1;
            }
            return 0
        });
        this.setOpenCode(carCodeArray);
    }
    private forceExit() {
        if (Director.getInstance().getCurrentScene() === this) {
            HttpEngine.getInstance().leaveRoom(this.roomId, null, null);
            this.popSceneWithoutAnimate();
            SocketEngine.getInstance().close();
            //this.onPopScene();
            //Director.getInstance().popScene();
        }
        return;
    }
    private onPlayerListHandler(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            Director.getInstance().effectPlay("click_mp3");
        }
        //每次打开重新请求房间玩家数据
        let that = this;
        HttpEngine.getInstance().getRoomStaffs(function (name: string, response: ResponseRoomStaff) {
            this.staffList = [];
            for (let row in response.rows) {
                //清空旧数据
                let item: RoomStaff = response.rows[row];
                that.appendStaff(item.nickname);
            }
            Director.getInstance().showPlayerListDialog(this, this.staffList, this.gameId, this.roomId, "nine", this.sound_on);
        }, this);
    }
    //音效开关
    private soundChangeControlHandler(): void {
        var soundImage: eui.Image = this.soundButton.getChildByName("soundImage") as eui.Image;
        //console.log("soundImage-------------------------"+soundImage.source);
        if (soundImage.source == "sound_off_png") {
            this.sound_on = 1;
        } else {
            this.sound_on = 0;
        }
    }
    private backHandler(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            //停止开奖音效
            if (this.is_kaijiang) {
                this.sound_channel.stop();
            }

            Director.getInstance().effectPlay("click_mp3");
        }
        var that = this;
        //Director.getInstance().showConfirmDialog("您的资金将在本局结算后返还，确定退出？", this, function(confirmed:boolean){
        //if(confirmed)
        //{
        HttpEngine.getInstance().leaveRoom(that.roomId, function (name: string, response: ResponseLeaveRoom) {


            //Director.getInstance().popScene();
            that.popScene();
            SocketEngine.getInstance().close();
            /*
            let layer=Director.getInstance().getCurrentScene();
    
            if (response.error == 0) {
                //todo: 这个提示打印不出来，待查
                //延迟打印错误消息
                var tw = egret.Tween.get(Director.getInstance().getCurrentScene());
                tw.to({}, 500).call(function () {
                    Toast.launch(response.msg, 2000);
                });
            }
            */
        }, that);
        //}
        //});
    }
    private exitHandler(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            Director.getInstance().effectPlay("click_mp3");
        }
        let that = this;
        Director.getInstance().showConfirmDialog("您确定要返回登录？", this.sound_on, this, function (confirmed: boolean) {
            if (confirmed) {
                HttpEngine.getInstance().leaveRoom(that.roomId, function (name: string, response: ResponseLeaveRoom) {

                    ClientStorage.setLoginName("");
                    ClientStorage.setLoginPassword("");
                    Director.getInstance().popToRoot();
                    SocketEngine.getInstance().close();
                }, that);
            }
        });
    }
    private serviceHandler(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            Director.getInstance().effectPlay("click_mp3");
        }
        Director.getInstance().showServiceDialog(this, this.sound_on);
    }
    private onTouzhuDetailsHandler(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            Director.getInstance().effectPlay("click_mp3");
        }
        Director.getInstance().showTouzhuDetailsDialog(this.gameId, this.roomId, this.sound_on, this);
    }
    private onRewardResultHandler(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            Director.getInstance().effectPlay("click_mp3");
        }
        Director.getInstance().showRuleHonebaoDialog(this, "officalResult", "hongbao", this.sound_on, this.gameId, this.roomInfo.is_official);
    }

    private onRuleHandler(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            Director.getInstance().effectPlay("click_mp3");
        }
        Director.getInstance().showRececeViewDlg(this.gameId, this.roomId, this.sound_on, this);
    }
}