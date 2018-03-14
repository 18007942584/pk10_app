class GamePcDanDanData {
    public client_id: string;    //客户端id，连接socket后得到，退出房间后就无效了
    public initUserInfoGot: boolean = false;//是否拿到了初始化用户信息
    public socketConnected: boolean = false;//是否连接上了

    public totalBet: number; //总下注
    public area_summary: number[] = new Array();//每个区域的下注总和
    public self_bet: number[] = new Array();//每个区域自己下注总和

    public currentBet: number;  //自己下注
    public betInfoList: BetInfo[];   //下注的细节

    public area_limit: AreaLimitInfo[];//下注单门限额

    public lastUpdateBalanceTicket;         //上次更新余额时间

    public reset() {
        this.totalBet = 0;
        this.lastUpdateBalanceTicket = 0;

        this.area_summary[1] = 0;
        this.area_summary[2] = 0;
        this.area_summary[3] = 0;

        this.self_bet[1] = 0;
        this.self_bet[2] = 0;
        this.self_bet[3] = 0;

        this.betInfoList = new Array();
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

class GamePcDanDanScene extends BaseScene {


    private gameData: GamePcDanDanData = new GamePcDanDanData();
    private balanceLabel: eui.Label;
    private processState: ProcessState;       //游戏状态
    private clientState: ClientState;         //客户端状态
    private commonTimer: egret.Timer; //状态机定时器
    private serverState: ServerState;         //当前服务端游戏状态
    private serverStateNotify: string;        //游戏状态通知的内容
    private serverStateEndTicket: number;     //本状态服务器结束的时间
    private remaining_open_time: number;      //同步state==1的时候，剩下到开盘时间
    private serverStateOpenTicket: number;     //游戏状态：开盘时间
    private startRaceTicket: number; //开始赛车的时间
    private roomInfo: RoomInfo;
    private gameId: number;
    private roomId: number;
    private titleLabel: eui.Label;
    private titleLabel_1: eui.Label;
    private titleLabel_2: eui.Label;
    private nameLabel: eui.Label;
    private timeLabel: eui.BitmapLabel;
    //音效开关
    private soundButton: eui.Button;
    private sound_on = 1;
    private sound_channel: egret.SoundChannel;
    private is_kaijiang: Number = 0;
    private responseJoinRoom: ResponseJoinRoom;
    //游戏公告
    private noticeGroup: eui.Group;
    private noticeLabel: eui.Label;

    //游戏主页面
    private gameMainGroup: eui.Group;
    //获取图片
    private winImage: eui.Image;

    //顶部号码
    private code_image_1: eui.Image;
    private code_image_2: eui.Image;
    private code_image_3: eui.Image;
    private code_image_4: eui.Image;
    private dxImage: eui.Image;
    private dsImage: eui.Image;

    private OptionsBtn_1: eui.ToggleButton;
    private OptionsBtn_2: eui.ToggleButton;
    private OptionsBtn_3: eui.ToggleButton;
    private OptionsBtn_4: eui.ToggleButton;
    private OptionsBtn_5: eui.ToggleButton;
    private OptionsBtn_6: eui.ToggleButton;
    private OptionsBtn_7: eui.ToggleButton;
    private OptionsBtn_8: eui.ToggleButton;
    private OptionsBtn_9: eui.ToggleButton;
    private OptionsBtn_10: eui.ToggleButton;
    private OptionsBtn_11: eui.ToggleButton;
    private OptionsBtn_12: eui.ToggleButton;
    private OptionsBtn_13: eui.ToggleButton;
    private OptionsBtn_14: eui.ToggleButton;

    private TeMaBtn_0: eui.ToggleButton;
    private TeMaBtn_1: eui.ToggleButton;
    private TeMaBtn_2: eui.ToggleButton;
    private TeMaBtn_3: eui.ToggleButton;
    private TeMaBtn_4: eui.ToggleButton;
    private TeMaBtn_5: eui.ToggleButton;
    private TeMaBtn_6: eui.ToggleButton;
    private TeMaBtn_7: eui.ToggleButton;
    private TeMaBtn_8: eui.ToggleButton;
    private TeMaBtn_9: eui.ToggleButton;
    private TeMaBtn_10: eui.ToggleButton;
    private TeMaBtn_11: eui.ToggleButton;
    private TeMaBtn_12: eui.ToggleButton;
    private TeMaBtn_13: eui.ToggleButton;
    private TeMaBtn_14: eui.ToggleButton;
    private TeMaBtn_15: eui.ToggleButton;
    private TeMaBtn_16: eui.ToggleButton;
    private TeMaBtn_17: eui.ToggleButton;
    private TeMaBtn_18: eui.ToggleButton;
    private TeMaBtn_19: eui.ToggleButton;
    private TeMaBtn_20: eui.ToggleButton;
    private TeMaBtn_21: eui.ToggleButton;
    private TeMaBtn_22: eui.ToggleButton;
    private TeMaBtn_23: eui.ToggleButton;
    private TeMaBtn_24: eui.ToggleButton;
    private TeMaBtn_25: eui.ToggleButton;
    private TeMaBtn_26: eui.ToggleButton;
    private TeMaBtn_27: eui.ToggleButton;

    private Calss_1: eui.ToggleButton;
    private Calss_2: eui.ToggleButton;
    private betImage: eui.Image;
    private MixtureLabel_1_1: eui.Label;
    private MixtureGroup: eui.Group;
    private TeMaGaroup: eui.Group;

    private showCancleBet: number = 0;//是否显示取消下注，第一次投注后或者有投注过、退出重进房间时显示
    private showCancleBetTicket: number = 0;//显示取消下注时的时间戳
    private showCancleBetRemainTime: number = 15;//显示取消下注时倒计时
    private packetBackBet: PacketBackBet;

    private playerListImage: eui.Image;
    private ruleImage: eui.Image;
    private backImage: eui.Image;
    private ItemList: any[] = null;
    //摇奖号码长图
    private code_images_1: eui.Image;
    private code_images_2: eui.Image;
    private code_images_3: eui.Image;
    private TotalNumberImage: eui.Image;

    private openResult: OpenResult;
    private openinfo: Openinfo;
    private settlementResult: PacketSettlementResult;
    private roomType = RoomType.RoomeTypePcDanDan;

    private stateNotifyLabel: eui.Label
    private stateTicketLabel: eui.Label;
    private touzhuDetailsImage: eui.Image;//投注明细
    private exitButton: eui.Button;     //退出登录
    private serviceButton: eui.Button;  //联系客服
    private todayResultLabel: eui.Label; //当日盈亏
    private todayLonghuResultLabel: eui.Label; //今日龙虎下注额
    private GoldInput: egret.TextField;
    private ResetImage: eui.Image;

    //触摸点位置
    private beginPositionX: number;
    private beginPositionY: number;
    private movePositionX: number;
    private movePositionY: number;

    //游戏主页面
    private mainScroller: eui.Scroller;
    //分页投注明细
    private page: number = 1;
    private row: number = 10;
    private lastPageLabel: eui.Label;
    private nextPageLabel: eui.Label;
    private currentPageLabel: eui.Label;
    private totalPageLabel: eui.Label;

    private UserId: eui.Label;               //用户ID
    private TehUser: eui.Label;              //用户账号
    private UserName: eui.Label;              //玩家姓名
    private GoldNum: eui.Label;              //用户金币
    private NoerList: eui.Label;              //期数列表
    private NoerGold: eui.Label;              //期数金币
    private FreezingGoldNum: eui.Label;
    private dateLabel: eui.Label;            //当前日期
    private betLogGroup: eui.Group
    private rewardResultImage: eui.Image;
    private code_image: eui.Image;
    private betLogsCount;
    private betGroup: eui.Group;             //跳转到下注界面
    private ChatGroup: eui.Group;            //跳转到聊天界面
    private groupCenter: eui.Group;          //下住界面
    private chatScroller: eui.Scroller;      //滚动聊天界面
    private ToChatImage: eui.Image;          //跳转到聊天界面控件
    private ToBetImage: eui.Image;
    private chatInput: eui.TextInput;
    private sendImage: eui.Image;
    //设置房间资料
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
        this.skinName = "resource/skins/scene/GamePcDanDanSceneSkin.exml";

    }
    public onPopScene() {


        egret.Tween.removeTweens(this.noticeLabel);
        egret.Tween.removeTweens(this);
        egret.Tween.removeTweens(this.noticeLabel);
        //老虎机开奖动画
        egret.Tween.removeTweens(this.code_image_1);
        egret.Tween.removeTweens(this.code_image_2);
        egret.Tween.removeTweens(this.code_image_3);

        this.OptionsBtn_1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.MixtureToggleTouchHandle, this);
        this.OptionsBtn_2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.MixtureToggleTouchHandle, this);
        this.OptionsBtn_3.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.MixtureToggleTouchHandle, this);
        this.OptionsBtn_4.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.MixtureToggleTouchHandle, this);
        this.OptionsBtn_5.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.MixtureToggleTouchHandle, this);
        this.OptionsBtn_6.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.MixtureToggleTouchHandle, this);
        this.OptionsBtn_7.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.MixtureToggleTouchHandle, this);
        this.OptionsBtn_8.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.MixtureToggleTouchHandle, this);
        this.OptionsBtn_9.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.MixtureToggleTouchHandle, this);
        this.OptionsBtn_10.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.MixtureToggleTouchHandle, this);
        this.OptionsBtn_11.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.MixtureToggleTouchHandle, this);
        this.OptionsBtn_12.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.MixtureToggleTouchHandle, this);
        this.OptionsBtn_13.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.MixtureToggleTouchHandle, this);
        this.OptionsBtn_14.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.MixtureToggleTouchHandle, this);


        this.Calss_1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.CalssToggleTouchHandle, this);
        this.Calss_2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.CalssToggleTouchHandle, this);
        this.backImage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.backHandler, this);
        this.Calss_1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.getReset, this);
        this.Calss_2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.getReset, this);
        this.ResetImage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.getReset, this);
        this.betImage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.ConfirmBet, this);
        this.TeMaBtn_0.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_3.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_4.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_5.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_6.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_7.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_8.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_9.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_10.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_11.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_12.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_13.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_14.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_15.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_16.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_17.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_18.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_19.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_20.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_21.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_22.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_23.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_24.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_25.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_26.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_27.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);

        this.playerListImage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onPlayerListHandler, this);
        this.ruleImage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onRuleHandler, this);
        this.rewardResultImage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onRewardResultHandler, this);
        this.soundButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.soundChangeControlHandler, this);
        this.soundButton.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.soundChangeControlHandler, this);
        //投注明细弹窗监听
        this.touzhuDetailsImage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouzhuDetailsHandler, this);
        //投注明细翻页
        this.lastPageLabel.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.lastPageHandler, this);
        this.nextPageLabel.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.nextPageHandler, this);
        this.exitButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.exitHandler, this);
        this.serviceButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.serviceHandler, this);
        this.sendImage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.ConfirmBet, this);
        if (this.commonTimer != null) {
            this.commonTimer.removeEventListener(egret.TimerEvent.TIMER, this.commonTimerHandler, this);
            this.commonTimer.stop();
        }
        if (this.concludeTimer != null) {
            this.concludeTimer.stop();
            this.concludeTimer.removeEventListener(egret.TimerEvent.TIMER, this.concludeTimerHandler, this);
        }
        SocketEngine.getInstance().removeEventListener(SocketEngine.EventNameNotify, this.onPacketNotify, this);
        SocketEngine.getInstance().removeEventListener(SocketEngine.EventNameSettleMentResult, this.onPacketSettlementResult, this);
        SocketEngine.getInstance().removeEventListener(SocketEngine.EventNameSocketDisconnect, this.onSocketDisconnect, this);
        SocketEngine.getInstance().removeEventListener(SocketEngine.EventNameSettleMentResult, this.onPacketSettlementResult, this);
        SocketEngine.getInstance().removeEventListener(SocketEngine.EventNameTalk, this.onSendtalk, this);

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
            this.noticeLabel.x = 635;
            let targetX = 0 - Number(this.noticeLabel.width);
            let tw = egret.Tween.get(this.noticeLabel);
            tw.to({ x: targetX }, 12000).call(this.onScrollNoticeEnd, this, []);
        }, this)
        this.initUserInfo();

        //获取最近一次时时彩开奖号码
        HttpEngine.getInstance().getNewExpect(function (name: string, response: ResponseNewExpect) {
            for (let row in response.rows) {
                if (response.rows[row].name == "PC蛋蛋") {

                    let openCode = response.rows[row].opencode;
                    let openCodeList: any[] = openCode.split(",");
                    let codeCount: number = openCodeList.length;
                    let he = response.rows[row].result.he;
                    let dx = response.rows[row].result.dx;
                    let ds = response.rows[row].result.ds;
                    for (let i = 0; i < openCodeList.length; i++) {
                        let code = openCodeList[i];
                        if (i == 0) {
                            this.code_image_1.source = String("1_1_" + code + "_png");
                        } else if (i == 1) {
                            this.code_image_2.source = String("1_1_" + code + "_png");
                        } else if (i == 2) {
                            this.code_image_3.source = String("1_1_" + code + "_png");
                        }
                    }
                    this.code_image_4.source = "1_1_" + he + "_png";
                    this.code_image.source = "1_1_" + he + "_png";
                    if (dx == 1) {
                        this.dxImage.source = "ic_x_png";
                    } else if (dx == 2) {
                        this.dxImage.source = "ic_d_png";
                    }
                    if (ds == 1) {
                        this.dsImage.source = "ic_d1_png";
                    } else if (ds == 2) {
                        this.dsImage.source = "ic_s_png";
                    }
                }
            }
        }, this);
    }

    /**
     * 创建游戏场景
     * Create a game scene
     */
    public createGameScene() {

        //this.loadArray();
        //初始化数据
        this.resetViews(false);
        // this.getCalssRay();
        this.MixtureGroup.visible = true;
        this.TeMaGaroup.visible = false;
        this.Calss_1.$setSelected(true);
        this.Calss_2.$setSelected(false);
        this.betGroup.visible = false;
        this.groupCenter.visible = false;
        if (this.Calss_1.selected) {
            this.Calss_1.$setTouchEnabled(false);
            this.Calss_2.$setTouchEnabled(true);
            //进入游戏初始一次配置
            this.setPCDanDanDate()
        }

        var userInfo: UserInfo = ClientStorage.getUserInfo();
        this.nameLabel.text = userInfo.nickname;
        this.balanceLabel.text = Number(userInfo.balance).toFixed(2);
        let title = DataEngine.getInstance().getGameRoomTitle(this.gameId, this.roomId);
        this.titleLabel.text = title;

        let expectInfo: ExpectInfo = DataEngine.getInstance().getExpectInfo(this.gameId);
        this.titleLabel_1.text = expectInfo.expect + "期";;
        this.titleLabel_2.text = expectInfo.expect + "期";;
        this.setOpenCodeWithStr(expectInfo.opencode)

        this.OptionsBtn_1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.MixtureToggleTouchHandle, this);
        this.OptionsBtn_2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.MixtureToggleTouchHandle, this);
        this.OptionsBtn_3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.MixtureToggleTouchHandle, this);
        this.OptionsBtn_4.addEventListener(egret.TouchEvent.TOUCH_TAP, this.MixtureToggleTouchHandle, this);
        this.OptionsBtn_5.addEventListener(egret.TouchEvent.TOUCH_TAP, this.MixtureToggleTouchHandle, this);
        this.OptionsBtn_6.addEventListener(egret.TouchEvent.TOUCH_TAP, this.MixtureToggleTouchHandle, this);
        this.OptionsBtn_7.addEventListener(egret.TouchEvent.TOUCH_TAP, this.MixtureToggleTouchHandle, this);
        this.OptionsBtn_8.addEventListener(egret.TouchEvent.TOUCH_TAP, this.MixtureToggleTouchHandle, this);
        this.OptionsBtn_9.addEventListener(egret.TouchEvent.TOUCH_TAP, this.MixtureToggleTouchHandle, this);
        this.OptionsBtn_10.addEventListener(egret.TouchEvent.TOUCH_TAP, this.MixtureToggleTouchHandle, this);
        this.OptionsBtn_11.addEventListener(egret.TouchEvent.TOUCH_TAP, this.MixtureToggleTouchHandle, this);
        this.OptionsBtn_12.addEventListener(egret.TouchEvent.TOUCH_TAP, this.MixtureToggleTouchHandle, this);
        this.OptionsBtn_13.addEventListener(egret.TouchEvent.TOUCH_TAP, this.MixtureToggleTouchHandle, this);
        this.OptionsBtn_14.addEventListener(egret.TouchEvent.TOUCH_TAP, this.MixtureToggleTouchHandle, this);

        this.TeMaBtn_0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_4.addEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_5.addEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_6.addEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_7.addEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_8.addEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_9.addEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_10.addEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_11.addEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_12.addEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_13.addEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_14.addEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_15.addEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_16.addEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_17.addEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_18.addEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_19.addEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_20.addEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_21.addEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_22.addEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_23.addEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_24.addEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_25.addEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_26.addEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);
        this.TeMaBtn_27.addEventListener(egret.TouchEvent.TOUCH_TAP, this.TeMaToggleTouchHandle, this);

        this.Calss_1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.CalssToggleTouchHandle, this);
        this.Calss_2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.CalssToggleTouchHandle, this);


        this.ToChatImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ToChat, this);
        this.ToBetImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.TobetGroup, this);
        this.sendImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ConfirmBet, this);
        this.ResetImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getReset, this);
        this.Calss_1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getReset, this);
        this.Calss_2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getReset, this);
        this.betImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ConfirmBet, this);
        this.playerListImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPlayerListHandler, this);
        this.exitButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.exitHandler, this);
        this.serviceButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.serviceHandler, this);
        this.soundButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.soundChangeControlHandler, this);
        this.backImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.backHandler, this);

        this.ruleImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRuleHandler, this);
        this.rewardResultImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRewardResultHandler, this);


        //投注明细翻页
        this.lastPageLabel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.lastPageHandler, this);
        this.nextPageLabel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.nextPageHandler, this);
        //投注明细弹窗监听
        this.touzhuDetailsImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouzhuDetailsHandler, this);

        //监听游戏主页面手势，判断滑动
        this.gameMainGroup.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.swipeBeginHandler, this);
        this.commonTimerHandler();
        this.commonTimer = new egret.Timer(1000, 0);
        this.commonTimer.addEventListener(egret.TimerEvent.TIMER, this.commonTimerHandler, this);
        this.commonTimer.start();


        //需要提示登录中
        this.stateTicketLabel.text = "";
        this.stateNotifyLabel.text = "进入房间中,请稍等...";

        SocketEngine.getInstance().addEventListener(SocketEngine.EventNameNotify, this.onPacketNotify, this);
        SocketEngine.getInstance().addEventListener(SocketEngine.EventNameSettleMentResult, this.onPacketSettlementResult, this);
        SocketEngine.getInstance().addEventListener(SocketEngine.EventNameSocketDisconnect, this.onSocketDisconnect, this);
        SocketEngine.getInstance().addEventListener(SocketEngine.EventNameTalk, this.onSendtalk, this);

    }
    public onPacketNotify(name: string, packet: PacketNotify) {
        this.onNotifyPacketNotify(packet)
    }
    public onPacketSettlementResult(name: string, packet: PacketSettlementResult) {
        this.onNotifySettlementResult(packet)
    }
    public onSendtalk(name: string, packet: PacketTalk) {
        this.StartTalk(packet);
        //  this.Sendtalk(packet);
    }
    private setPCDanDanDate() {
        this.ItemList = new Array();
        let getCalssRay = this.getCalssRay();
        HttpEngine.getInstance().getPcddRules(this.gameId, getCalssRay, function (Name: string, response: ResultPcddRules) {
            if (response.error != 0) {
                Toast.launch(response.msg);
                //this.connectServer(); //not sure about what errors will hanppen here
            } else {
                for (var row in response.rows) {
                    var item: OpenResultPcddRules = response.rows[row] as OpenResultPcddRules;
                    if (item.type == 1) {
                        switch (item.id) {
                            case 1:
                                this.OptionsBtn_1.label = item.title;
                                this.MixtureLabel_1.text = item.multiple;
                                break;
                            case 2:
                                this.OptionsBtn_2.label = item.title;
                                this.MixtureLabel_2.text = item.multiple;
                                break;
                            case 3:
                                this.OptionsBtn_3.label = item.title;
                                this.MixtureLabel_3.text = item.multiple;
                                break;
                            case 4:
                                this.OptionsBtn_4.label = item.title;
                                this.MixtureLabel_4.text = item.multiple;
                                break;
                            case 5:
                                this.OptionsBtn_5.label = item.title;
                                this.MixtureLabel_5.text = item.multiple;
                                break;
                            case 6:
                                this.OptionsBtn_6.label = item.title;
                                this.MixtureLabel_6.text = item.multiple;
                                break;
                            case 7:
                                this.OptionsBtn_7.label = item.title;
                                this.MixtureLabel_7.text = item.multiple;
                                break;
                            case 8:
                                this.OptionsBtn_8.label = item.title;
                                this.MixtureLabel_8.text = item.multiple;
                                break;
                            case 9:
                                this.OptionsBtn_9.label = item.title;
                                this.MixtureLabel_9.text = item.multiple;
                                break;
                            case 10:
                                this.OptionsBtn_10.label = item.title;
                                this.MixtureLabel_10.text = item.multiple;
                                break;
                            case 11:
                                this.OptionsBtn_11.label = item.title;
                                this.MixtureLabel_11.text = item.multiple;
                                break;
                            case 12:
                                this.OptionsBtn_12.label = item.title;
                                this.MixtureLabel_12.text = item.multiple;
                                break;
                            case 13:
                                this.OptionsBtn_13.label = item.title;
                                this.MixtureLabel_13.text = item.multiple;
                                break;
                            case 14:
                                this.OptionsBtn_14.label = item.title;
                                this.MixtureLabel_14.text = item.multiple;
                                break;

                        }
                    } else if (item.type == 2) {
                        switch (item.id) {
                            case 15:
                                this.TeMaBtn_0.label = item.title
                                this.RatioLabel_0.text = item.multiple;
                                break;
                            case 16:
                                this.TeMaBtn_1.label = item.title
                                this.RatioLabel_1.text = item.multiple;
                                break;
                            case 17:
                                this.TeMaBtn_2.label = item.title
                                this.RatioLabel_2.text = item.multiple;
                                break;
                            case 18:
                                this.TeMaBtn_3.label = item.title
                                this.RatioLabel_3.text = item.multiple;
                                break;
                            case 19:
                                this.TeMaBtn_4.label = item.title
                                this.RatioLabel_4.text = item.multiple;
                                break;
                            case 20:
                                this.TeMaBtn_5.label = item.title
                                this.RatioLabel_5.text = item.multiple;
                                break;
                            case 21:
                                this.TeMaBtn_6.label = item.title
                                this.RatioLabel_6.text = item.multiple;
                                break;
                            case 22:
                                this.TeMaBtn_7.label = item.title
                                this.RatioLabel_7.text = item.multiple;
                                break;
                            case 23:
                                this.TeMaBtn_8.label = item.title
                                this.RatioLabel_8.text = item.multiple;
                                break;
                            case 24:
                                this.TeMaBtn_9.label = item.title
                                this.RatioLabel_9.text = item.multiple;
                                break;
                            case 25:
                                this.TeMaBtn_10.label = item.title
                                this.RatioLabel_10.text = item.multiple;
                                break;
                            case 26:
                                this.TeMaBtn_11.label = item.title
                                this.RatioLabel_11.text = item.multiple;
                                break;
                            case 27:
                                this.TeMaBtn_12.label = item.title
                                this.RatioLabel_12.text = item.multiple;
                                break;
                            case 28:
                                this.TeMaBtn_13.label = item.title
                                this.RatioLabel_13.text = item.multiple;
                                break;
                            case 29:
                                this.TeMaBtn_14.label = item.title
                                this.RatioLabel_14.text = item.multiple;
                                break;
                            case 30:
                                this.TeMaBtn_15.label = item.title
                                this.RatioLabel_15.text = item.multiple;
                                break;
                            case 31:
                                this.TeMaBtn_16.label = item.title
                                this.RatioLabel_16.text = item.multiple;
                                break;
                            case 32:
                                this.TeMaBtn_17.label = item.title
                                this.RatioLabel_17.text = item.multiple;
                                break;
                            case 33:
                                this.TeMaBtn_18.label = item.title
                                this.RatioLabel_18.text = item.multiple;
                                break;
                            case 34:
                                this.TeMaBtn_19.label = item.title
                                this.RatioLabel_19.text = item.multiple;
                                break;
                            case 35:
                                this.TeMaBtn_20.label = item.title
                                this.RatioLabel_20.text = item.multiple;
                                break;
                            case 36:
                                this.TeMaBtn_21.label = item.title
                                this.RatioLabel_21.text = item.multiple;
                                break;
                            case 37:
                                this.TeMaBtn_22.label = item.title
                                this.RatioLabel_22.text = item.multiple;
                                break;
                            case 38:
                                this.TeMaBtn_23.label = item.title
                                this.RatioLabel_23.text = item.multiple;
                                break;
                            case 39:
                                this.TeMaBtn_24.label = item.title
                                this.RatioLabel_24.text = item.multiple;
                                break;
                            case 40:
                                this.TeMaBtn_25.label = item.title
                                this.RatioLabel_25.text = item.multiple;
                                break;
                            case 41:
                                this.TeMaBtn_26.label = item.title
                                this.RatioLabel_26.text = item.multiple;
                                break;
                            case 42:
                                this.TeMaBtn_27.label = item.title
                                this.RatioLabel_27.text = item.multiple;
                                break;
                        }
                    }
                }
            }
        }, this);


    }
    //监听公告单次滚动结束事件
    private onScrollNoticeEnd(): void {
        this.noticeLabel.x = 380;
        var targetX = 0 - Number(this.noticeLabel.width);
        var tw = egret.Tween.get(this.noticeLabel);
        tw.to({ x: 0 - targetX }, 12000).call(this.onScrollNoticeEnd, this, []);
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
            // ClientStorage.setUserInfo(responseUserInfo.userInfo);
            // var userInfo: UserInfo = ClientStorage.getUserInfo();
            // that.balanceLabel.text = Number(userInfo.balance).toFixed(2);
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
    //停止动画
    private resetViews(stopTweens: boolean) {

        //清理下注信息
        this.gameData.reset();
        //显示大倒计时
        this.timeLabel.visible = true;
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
    }
    public staffList: string[] = new Array();

    public appendStaff(nickname: string) {
        this.staffList.push(nickname);
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
                    //开始摇奖
                    this.switchStatus(ProcessState.ProcessStateRun)
                }
        }
    }
    private switchStatus(processState: ProcessState) {
        if (this.processState == processState) {//状态不变就不动，防止joinRoom4的时候再次发socket的state4消息
            return;
        }

        console.log("conclude processState===========================" + processState);
        switch (processState) {
            case ProcessState.ProcessStateWait:
                {//等待开始
                    this.resetViews(true);
                    break;
                }
            case ProcessState.ProcessStateBeting:
                {//下注中
                    Toast.launch("开始下注");
                    break;
                }
            case ProcessState.ProcessStateBlocking:
                {//封盘中
                    break;
                }
            case ProcessState.ProcessStateRun:
                {//启动开奖
                    this.startRaceStepOneStart();
                    break;
                }
            case ProcessState.ProcessStateConclude:
                {//结算中
                    //结算只给状态，开奖过程中判断结算是否该显示了(开奖十秒后)
                    if (this.processState == ProcessState.ProcessStateRun) {//开奖过程中跳过消息
                        //skip
                    } else {
                        console.log("服务器给出结算信息，没有跑车，丢了跑车state4通知")
                        Toast.launch("服务器状态错误，丢失了结算消息");
                        //重置状态机为初始状态
                        this.reloadUserInfo();
                        //弹出结算框，重置游戏状态到等待阶段
                        this.concludeHandler();
                        //this.switchStatus(ProcessState.ProcessStateWait);//这样改不行，后面又被覆盖了
                        //改状态为等待中
                        processState = ProcessState.ProcessStateWait;
                    }
                    break;
                }
        }
        this.processState = processState;
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
            this.sound_channel = Director.getInstance().soundPlay("slot_mp3");
        }
        let currentTicket = Math.floor(Number(new Date()) / 1000);
        this.startRaceTicket = currentTicket;
        let runOneTime = 1000;//每次运动的时间长度
        let code_1 = 1;
        let code_2 = 2;
        let code_3 = 3;
        this.code_images_1.y = -660;
        this.code_images_2.y = -515;
        this.code_images_3.y = -365;
        var tw1 = egret.Tween.get(this.code_images_1);
        tw1.to({ y: 0 }, 100).call(this.ronOneRunComplete, this, [code_1]);
        var tw2 = egret.Tween.get(this.code_images_2);
        tw2.to({ y: 0 }, 200).call(this.ronOneRunComplete, this, [code_2]);
        var tw3 = egret.Tween.get(this.code_images_3);
        tw2.to({ y: 0 }, 300).call(this.ronOneRunComplete, this, [code_3]);
    }
    //一局之后重新拉余额
    private reloadUserInfo() {
        let that = this;

        var httpEngine: HttpEngine = HttpEngine.getInstance();
        httpEngine.getUserInfo(function (name: string, responseUserInfo: ResponseUserInfo) {
            console.log(responseUserInfo.userInfo.nickname);
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

            this.titleLabel_1.text = expectInfo.expect + "期";;
            this.titleLabel_2.text = expectInfo.expect + "期";;
            if (this.openinfo.dx == 1) {
                this.dxImage.source = "ic_x_png";
            } else if (this.openinfo.dx == 2) {
                this.dxImage.source = "ic_d_png";
            }
            if (this.openinfo.ds == 1) {
                this.dsImage.source = "ic_d1_png";
            } else if (this.openinfo.ds == 2) {
                this.dsImage.source = "ic_s_png";
            }
        }, this);
    }

    private ronOneRunComplete(code_image_id: Number): void {
        //console.log("ronOneRunComplete processState==================="+this.processState);
        let currentTicket = Math.floor(Number(new Date()) / 1000);
        let usedTicket = currentTicket - this.startRaceTicket;
        if (this.processState == ProcessState.ProcessStateRun || usedTicket < 8)//如果状态是run，或者跑了少于10秒，都继续跑
        {
            switch (code_image_id) {
                case 1:
                    this.code_images_1.y = -1320;
                    var tw = egret.Tween.get(this.code_images_1);
                    break;
                case 2:
                    this.code_images_2.y = -1320;
                    var tw = egret.Tween.get(this.code_images_2);
                    break;
                case 3:
                    this.code_images_3.y = -1320;
                    var tw = egret.Tween.get(this.code_images_3);
                    break;
            }
            tw.to({ y: 0 }, 500).call(this.ronOneRunComplete, this, [code_image_id]);
        } else if (this.openResult != null) {
            //跑到终点
            switch (code_image_id) {
                case 1:
                    this.code_images_1.y = -660;
                    break;
                case 2:
                    this.code_images_2.y = -660;
                    break;
                case 3:
                    this.code_images_3.y = -660;
                    break;
            }
            if (this.sound_channel != null) {
                this.sound_channel.stop();
            }
            let openCodeList = this.openResult.opencode.split(",");
            //显示开奖号码
            let codeImages = new Array();
            codeImages.push(this.code_images_1);
            codeImages.push(this.code_images_2);
            codeImages.push(this.code_images_3);
            this.TotalNumberImage.source = String("2_1_" + this.openinfo.he + "_png")
            for (var i = 0; i < openCodeList.length; i++) {
                if (Number(openCodeList[i]) == 0) {
                    codeImages[i].y = -660;
                } else if (Number(openCodeList[i]) == 1) {
                    codeImages[i].y = -585;
                } else if (Number(openCodeList[i]) == 2) {
                    codeImages[i].y = -515;
                } else if (Number(openCodeList[i]) == 3) {
                    codeImages[i].y = -440;
                } else if (Number(openCodeList[i]) == 4) {
                    codeImages[i].y = -367;
                } else if (Number(openCodeList[i]) == 5) {
                    codeImages[i].y = -295;
                } else if (Number(openCodeList[i]) == 6) {
                    codeImages[i].y = -220;
                } else if (Number(openCodeList[i]) == 7) {
                    codeImages[i].y = -148;
                } else if (Number(openCodeList[i]) == 8) {
                    codeImages[i].y = -75;
                } else if (Number(openCodeList[i]) == 9) {
                    codeImages[i].y = -0;
                }
            }
            if (code_image_id == 1) {
                this.startRaceStepThreeEnd();
            }

        } else {
            //没给开奖结果就切换状态了,直接reset
            switch (code_image_id) {
                case 1:
                    this.code_images_1.y = -660;
                    break;
                case 2:
                    this.code_images_2.y = -660;
                    break;
                case 3:
                    this.code_images_3.y = -660;
                    break;
            }
            this.TotalNumberImage.source = "2_1_0_png";
            this.switchStatus(ProcessState.ProcessStateWait);
        }

    }

    private startRaceStepThreeEnd() {
        this.setOpenCodeWithStr(this.openResult.opencode);

        let delay = 0;
        let openCodeList = this.openResult.opencode.split(",");
        //更新顶部最新一期开奖号码
        this.code_image_4.source = String("1_1_" + this.openinfo.he + "_png");
        this.code_image.source = String("1_1_" + this.openinfo.he + "_png");
        for (let i = 0; i < openCodeList.length; i++) {
            let code = openCodeList[i];
            if (i == 0) {
                this.code_image_1.source = "1_1_" + code + "_png";
            } else if (i == 1) {
                this.code_image_2.source = "1_1_" + code + "_png";
            } else if (i == 2) {
                this.code_image_3.source = "1_1_" + code + "_png";
            }
        }
        //显示开奖号码
        let codeImages = new Array();
        codeImages.push(this.code_images_1);
        codeImages.push(this.code_images_2);
        codeImages.push(this.code_images_3);
        this.TotalNumberImage.source = String("2_1_" + this.openinfo.he + "_png")
        for (var i = 0; i < openCodeList.length; i++) {
            if (Number(openCodeList[i]) == 0) {
                codeImages[i].y = -660;
            } else if (Number(openCodeList[i]) == 1) {
                codeImages[i].y = -585;
            } else if (Number(openCodeList[i]) == 2) {
                codeImages[i].y = -515;
            } else if (Number(openCodeList[i]) == 3) {
                codeImages[i].y = -440;
            } else if (Number(openCodeList[i]) == 4) {
                codeImages[i].y = -367;
            } else if (Number(openCodeList[i]) == 5) {
                codeImages[i].y = -295;
            } else if (Number(openCodeList[i]) == 6) {
                codeImages[i].y = -220;
            } else if (Number(openCodeList[i]) == 7) {
                codeImages[i].y = -148;
            } else if (Number(openCodeList[i]) == 8) {
                codeImages[i].y = -75;
            } else if (Number(openCodeList[i]) == 9) {
                codeImages[i].y = -0;
            }
        }

        //结算在3秒后开始
        let concludeTime = 3000;//1000;//8000;
        this.concludeTimer = new egret.Timer(concludeTime, 1);
        this.concludeTimer.addEventListener(egret.TimerEvent.TIMER, this.concludeTimerHandler, this);
        this.concludeTimer.start();
    }
    //开始结算，这时候开始显示扑克结果
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
    private onNotifySettlementResult(result: PacketSettlementResult) {
        if (result.room_type != this.roomType) {
            return;
        }

        this.settlementResult = result;
        this.openResult = result.open_result;
        this.openinfo = result.open_info;
        //状态改为开奖中
        this.switchStatus(ProcessState.ProcessStateConclude);
    }
    //10,9,8这样
    private setOpenCodeWithStr(opencode: String) {
        let openCodeList = opencode.split(",");//名次， 第几名是哪个车
        //this.setOpenCode(openCodeList);
    }

    private setOpenCode(openCodeList: any[]) {
        for (let i = 0; i < openCodeList.length; i++) {
            let code: number = Number(openCodeList[i]);
            let resultImage = this.getResultImage(code);
            resultImage.x = 40 * i;
        }
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

    private showResultCodeTimer: egret.Timer;//显示开奖结果的timer
    private goOpenConcludeDialog() {
        this.reloadUserInfo();
        // //10秒后重置开奖机器为00000
        // let showResultCodeTime = 10000;//1000;//8000;
        // this.showResultCodeTimer = new egret.Timer(showResultCodeTime, 1);
        // this.showResultCodeTimer.addEventListener(egret.TimerEvent.TIMER, this.showResultCodeTimerHandler, this);
        // this.showResultCodeTimer.start();

        //弹出结算框，重置游戏状态到等待阶段
        this.concludeHandler();
        this.switchStatus(ProcessState.ProcessStateWait);
    }
    private showResultCodeTimerHandler(): void {
        this.code_images_1.y = -660;
        this.code_images_2.y = -660;
        this.code_images_3.y = -660;
        this.TotalNumberImage.source = "2_1_0_png";
    }
    private Sendtalk(packet: ResConfirmBet) {
        this.StartTalk(packet.msg);
    }
    //下注
    private ConfirmBet(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            Director.getInstance().soundPlay("chip_click_mp3");
        }

        let getSelectedRay = this.getSelectedRay();
        let quickBet;
        let Gold;
        if (Number(this.GoldInput.text) > 0) {
            quickBet = "";
            Gold = String(this.GoldInput.text);
        } else {
            Gold = "";
            if (this.GoldInput.text) {
                quickBet = String(this.GoldInput.text);
            } else {
                quickBet = String(this.chatInput.text);
            }
        }
        HttpEngine.getInstance().getConfirmBet(getSelectedRay, Gold, quickBet, function (Name: string, response: ResConfirmBet) {
            if (response.error != 0) {
                Toast.launch(response.msg);
                //this.connectServer(); //not sure about what errors will hanppen here
            } else {
                this.balanceLabel.text = Number(response.balance).toFixed(2);
                Toast.launch(response.msg);
            }
        }, this)
    }

    //公共倒计时
    private commonTimerHandler() {
        let currentTicket = Math.floor(Number(new Date()) / 1000);
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

                    break;
                }
            case ProcessState.ProcessStateWait://等待开始
                {//等待开始倒计时
                    this.stateNotifyLabel.text = "等待游戏开始";
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
                        // this.cancleBetGroup.visible=false;
                        // this.sureBetGroup.visible=false;
                        this.showCancleBetTicket = 0;
                        this.showCancleBetRemainTime = 15;
                    }

                    if (this.serverStateEndTicket - currentTicket < 3) {
                        this.stateNotifyLabel.text = "投注倒计时";
                        //this.showCancleBet=0;
                        // this.cancleBetGroup.visible=false;
                        //this.sureBetGroup.visible=false;
                        this.showCancleBetTicket = 0;
                        this.showCancleBetRemainTime = 15;
                        //this.stateTicketLabel.text = String(this.serverStateEndTicket - currentTicket);//倒计时3秒
                    } else {
                        this.stateNotifyLabel.text = "投注中";
                        //this.stateTicketLabel.text = String(this.serverStateEndTicket - currentTicket);//倒计时3秒
                    }
                    if (this.serverStateEndTicket - currentTicket < 0) {
                        this.stateTicketLabel.text = "";
                        this.showCancleBet = 0;
                        //this.cancleBetGroup.visible=false;
                        // this.sureBetGroup.visible=false;
                        this.showCancleBetTicket = 0;
                        this.showCancleBetRemainTime = 15;
                    } else {
                        this.stateTicketLabel.text = String(this.serverStateEndTicket - currentTicket);//倒计时秒数  
                        //this.sureBetTimeLabel.text = "("+String(this.showCancleBetRemainTime--)+")";//取消投注倒计时秒数 
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
                    //this.cancleBetGroup.visible=false;
                    //this.sureBetGroup.visible=false;
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
                    this.stateNotifyLabel.text = "开奖中";
                    this.stateTicketLabel.text = "";
                    this.TotalNumberImage.source = "2_1_0_png";
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

    private ToChat(evt: egret.TouchEvent): void {
        this.ChatGroup.visible = true;
        this.betGroup.visible = false;
        this.groupCenter.visible = false;
        this.chatScroller.visible = true;
        this.chatInput.text = "";
    }
    private TobetGroup(evt: egret.TouchEvent): void {
        this.ChatGroup.visible = false;
        this.betGroup.visible = true;
        this.groupCenter.visible = true;
        this.chatScroller.visible = false;
        this.GoldInput.text = "";
    }
    public ChatNum = 0;
    private chatGroup: eui.Group;
    private StartTalk(packet: PacketTalk) {
        if (packet.msg != "") {
            this.ChatNum += 1;
            var userInfo: UserInfo = ClientStorage.getUserInfo();
            for (let i = this.ChatNum; i <= this.ChatNum; ++i) {
                let msgSkin: eui.Button = new eui.Button();

                if (packet.uid == 0 || packet.uid == userInfo.id) {
                    msgSkin.skinName = "resource/skins/scene/LMsgDlg.exml";
                    msgSkin.x = 0;
                    msgSkin.y = 0;
                } else {
                    msgSkin.skinName = "resource/skins/scene/MsgDlg.exml";
                    msgSkin.x = 0;
                    msgSkin.y = 0;
                }
                let MsgGroup: eui.Group = msgSkin.getChildByName("MsgGroup") as (eui.Group);
                let UsereName: eui.Label = MsgGroup.getChildByName("UsereName") as (eui.Label);
                UsereName.text = packet.nickname;

                let MsgLabel: eui.Label = MsgGroup.getChildByName("MsgLabel") as (eui.Label);
                let MsgImage: eui.Image = MsgGroup.getChildByName("MsgImage") as (eui.Image);
                MsgLabel.text = packet.msg;
                if (packet.uid == 0 || packet.uid == userInfo.id) {
                    MsgImage.scale9Grid = new egret.Rectangle(8, 18, 9, 38);
                    MsgImage.width = MsgLabel.width + 16;
                    MsgImage.height = MsgLabel.height + 40
                } else {
                    MsgImage.scale9Grid = new egret.Rectangle(40, 20, 12, 33);
                    MsgImage.width = MsgLabel.width + 16;
                    MsgImage.height = MsgLabel.height + 40;
                }

                if (MsgLabel.text != "") {
                    this.chatGroup.addChild(msgSkin);
                    msgSkin.top = MsgGroup.height * (i - 1);
                }
                if (MsgLabel.width >= 410) {
                    MsgLabel.width = 410;
                    MsgLabel.height = 18 * MsgLabel.numLines;
                    MsgLabel.wordWrap = true;
                    if (MsgLabel.height >= MsgImage.height) {
                        MsgImage.height += MsgLabel.height;
                    } else {
                        MsgImage.height = MsgImage.height + MsgLabel.height;
                    }
                }
                //文本高度大于滚动容器高度时，将视口置于文本最后一行
                let TextHeight = MsgGroup.height * i;
                if (TextHeight > this.chatScroller.height) {
                    this.chatScroller.viewport.scrollV = TextHeight - this.chatScroller.height;
                }
                //清空输入文本
                this.chatInput.text = "";
            }
        }
    }
    /// 布局定义

    private getSelectedRay() {
        if (this.OptionsBtn_1.selected)
            return 1;
        else if (this.OptionsBtn_2.selected)
            return 2;
        else if (this.OptionsBtn_3.selected)
            return 3
        else if (this.OptionsBtn_4.selected)
            return 4;
        else if (this.OptionsBtn_5.selected)
            return 5;
        else if (this.OptionsBtn_6.selected)
            return 6;
        else if (this.OptionsBtn_7.selected)
            return 7;
        else if (this.OptionsBtn_8.selected)
            return 8;
        else if (this.OptionsBtn_9.selected)
            return 9;
        else if (this.OptionsBtn_10.selected)
            return 10;
        else if (this.OptionsBtn_11.selected)
            return 11;
        else if (this.OptionsBtn_12.selected)
            return 12;
        else if (this.OptionsBtn_13.selected)
            return 13;
        else if (this.OptionsBtn_14.selected)
            return 14;
        else if (this.TeMaBtn_0.selected)
            return 15;
        else if (this.TeMaBtn_1.selected)
            return 16;
        else if (this.TeMaBtn_2.selected)
            return 17;
        else if (this.TeMaBtn_3.selected)
            return 18;
        else if (this.TeMaBtn_4.selected)
            return 19;
        else if (this.TeMaBtn_5.selected)
            return 20;
        else if (this.TeMaBtn_6.selected)
            return 21;
        else if (this.TeMaBtn_7.selected)
            return 22;
        else if (this.TeMaBtn_8.selected)
            return 23;
        else if (this.TeMaBtn_9.selected)
            return 24;
        else if (this.TeMaBtn_10.selected)
            return 25;
        else if (this.TeMaBtn_11.selected)
            return 26;
        else if (this.TeMaBtn_12.selected)
            return 27;
        else if (this.TeMaBtn_13.selected)
            return 28;
        else if (this.TeMaBtn_14.selected)
            return 29;
        else if (this.TeMaBtn_15.selected)
            return 30;
        else if (this.TeMaBtn_16.selected)
            return 31;
        else if (this.TeMaBtn_17.selected)
            return 32;
        else if (this.TeMaBtn_18.selected)
            return 33;
        else if (this.TeMaBtn_19.selected)
            return 34;
        else if (this.TeMaBtn_20.selected)
            return 35;
        else if (this.TeMaBtn_21.selected)
            return 36;
        else if (this.TeMaBtn_22.selected)
            return 37;
        else if (this.TeMaBtn_23.selected)
            return 38;
        else if (this.TeMaBtn_24.selected)
            return 39;
        else if (this.TeMaBtn_25.selected)
            return 40;
        else if (this.TeMaBtn_26.selected)
            return 41;
        else if (this.TeMaBtn_27.selected)
            return 42;

        return 0;
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
        }
    }
    private CalssToggleTouchHandle(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            Director.getInstance().soundPlay("chip_click_mp3");
        }

        let selectedToggle = evt.target;
        if (!(selectedToggle === this.Calss_1)) {
            this.Calss_1.$setSelected(false);
            this.TeMaGaroup.visible = true;
            this.MixtureGroup.visible = false;
            if (this.Calss_2.selected) {
                this.Calss_1.$setTouchEnabled(true);
                this.Calss_2.$setTouchEnabled(false);
                //更新游戏配置
                this.setPCDanDanDate();
            }
        }
        if (!(selectedToggle === this.Calss_2)) {
            this.Calss_2.$setSelected(false);
            this.TeMaGaroup.visible = false;
            this.MixtureGroup.visible = true;
            if (this.Calss_1.selected) {
                this.Calss_1.$setTouchEnabled(false);
                this.Calss_2.$setTouchEnabled(true);
                //更新游戏配置
                this.setPCDanDanDate();
            }
        }
    }
    private MixtureToggleTouchHandle(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            Director.getInstance().soundPlay("chip_click_mp3");
        }
        let selectedToggle = evt.target;
        if (!(selectedToggle === this.OptionsBtn_1)) {
            this.OptionsBtn_1.$setSelected(false);
        }
        if (!(selectedToggle === this.OptionsBtn_2)) {
            this.OptionsBtn_2.$setSelected(false);
        }
        if (!(selectedToggle === this.OptionsBtn_3)) {
            this.OptionsBtn_3.$setSelected(false);
        }
        if (!(selectedToggle === this.OptionsBtn_4)) {
            this.OptionsBtn_4.$setSelected(false);
        }
        if (!(selectedToggle === this.OptionsBtn_5)) {
            this.OptionsBtn_5.$setSelected(false);
        }
        if (!(selectedToggle === this.OptionsBtn_6)) {
            this.OptionsBtn_6.$setSelected(false);
        }
        if (!(selectedToggle === this.OptionsBtn_7)) {
            this.OptionsBtn_7.$setSelected(false);
        }
        if (!(selectedToggle === this.OptionsBtn_8)) {
            this.OptionsBtn_8.$setSelected(false);
        }
        if (!(selectedToggle === this.OptionsBtn_9)) {
            this.OptionsBtn_9.$setSelected(false);
        }
        if (!(selectedToggle === this.OptionsBtn_10)) {
            this.OptionsBtn_10.$setSelected(false);
        }
        if (!(selectedToggle === this.OptionsBtn_11)) {
            this.OptionsBtn_11.$setSelected(false);
        }
        if (!(selectedToggle === this.OptionsBtn_12)) {
            this.OptionsBtn_12.$setSelected(false);
        }
        if (!(selectedToggle === this.OptionsBtn_13)) {
            this.OptionsBtn_13.$setSelected(false);
        }
        if (!(selectedToggle === this.OptionsBtn_14)) {
            this.OptionsBtn_14.$setSelected(false);
        }
    }
    private TeMaToggleTouchHandle(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            Director.getInstance().soundPlay("chip_click_mp3");
        }
        let selectedToggle = evt.target;

        if (!(selectedToggle === this.TeMaBtn_0)) {
            this.TeMaBtn_0.$setSelected(false);
        }
        if (!(selectedToggle === this.TeMaBtn_1)) {
            this.TeMaBtn_1.$setSelected(false);
        }
        if (!(selectedToggle === this.TeMaBtn_2)) {
            this.TeMaBtn_2.$setSelected(false);
        }
        if (!(selectedToggle === this.TeMaBtn_3)) {
            this.TeMaBtn_3.$setSelected(false);
        }
        if (!(selectedToggle === this.TeMaBtn_4)) {
            this.TeMaBtn_4.$setSelected(false);
        }
        if (!(selectedToggle === this.TeMaBtn_5)) {
            this.TeMaBtn_5.$setSelected(false);
        }
        if (!(selectedToggle === this.TeMaBtn_6)) {
            this.TeMaBtn_6.$setSelected(false);
        }
        if (!(selectedToggle === this.TeMaBtn_7)) {
            this.TeMaBtn_7.$setSelected(false);
        }
        if (!(selectedToggle === this.TeMaBtn_8)) {
            this.TeMaBtn_8.$setSelected(false);
        }
        if (!(selectedToggle === this.TeMaBtn_9)) {
            this.TeMaBtn_9.$setSelected(false);
        }
        if (!(selectedToggle === this.TeMaBtn_10)) {
            this.TeMaBtn_10.$setSelected(false);
        }
        if (!(selectedToggle === this.TeMaBtn_12)) {
            this.TeMaBtn_11.$setSelected(false);
        }
        if (!(selectedToggle === this.TeMaBtn_12)) {
            this.TeMaBtn_12.$setSelected(false);
        }
        if (!(selectedToggle === this.TeMaBtn_13)) {
            this.TeMaBtn_13.$setSelected(false);
        }
        if (!(selectedToggle === this.TeMaBtn_14)) {
            this.TeMaBtn_14.$setSelected(false);
        }
        if (!(selectedToggle === this.TeMaBtn_15)) {
            this.TeMaBtn_15.$setSelected(false);
        }
        if (!(selectedToggle === this.TeMaBtn_16)) {
            this.TeMaBtn_16.$setSelected(false);
        }
        if (!(selectedToggle === this.TeMaBtn_17)) {
            this.TeMaBtn_17.$setSelected(false);
        }
        if (!(selectedToggle === this.TeMaBtn_18)) {
            this.TeMaBtn_18.$setSelected(false);
        }
        if (!(selectedToggle === this.TeMaBtn_19)) {
            this.TeMaBtn_19.$setSelected(false);
        }
        if (!(selectedToggle === this.TeMaBtn_20)) {
            this.TeMaBtn_20.$setSelected(false);
        }
        if (!(selectedToggle === this.TeMaBtn_21)) {
            this.TeMaBtn_21.$setSelected(false);
        }
        if (!(selectedToggle === this.TeMaBtn_22)) {
            this.TeMaBtn_22.$setSelected(false);
        }
        if (!(selectedToggle === this.TeMaBtn_23)) {
            this.TeMaBtn_23.$setSelected(false);
        }
        if (!(selectedToggle === this.TeMaBtn_24)) {
            this.TeMaBtn_24.$setSelected(false);
        }
        if (!(selectedToggle === this.TeMaBtn_25)) {
            this.TeMaBtn_25.$setSelected(false);
        }
        if (!(selectedToggle === this.TeMaBtn_26)) {
            this.TeMaBtn_26.$setSelected(false);
        }
        if (!(selectedToggle === this.TeMaBtn_27)) {
            this.TeMaBtn_27.$setSelected(false);
        }
    }
    //重置
    private getReset(evt: egret.TouchEvent) {
        if (this.sound_on) {
            Director.getInstance().soundPlay("chip_click_mp3");
        }
        if (this.OptionsBtn_1.selected) {
            this.OptionsBtn_1.$setSelected(false);
        } else if (this.OptionsBtn_2.selected) {
            this.OptionsBtn_2.$setSelected(false);
        } else if (this.OptionsBtn_3.selected) {
            this.OptionsBtn_3.$setSelected(false);
        } else if (this.OptionsBtn_4.selected) {
            this.OptionsBtn_4.$setSelected(false);
        } else if (this.OptionsBtn_5.selected) {
            this.OptionsBtn_5.$setSelected(false);
        } else if (this.OptionsBtn_6.selected) {
            this.OptionsBtn_6.$setSelected(false);
        } else if (this.OptionsBtn_7.selected) {
            this.OptionsBtn_7.$setSelected(false);
        } else if (this.OptionsBtn_8.selected) {
            this.OptionsBtn_8.$setSelected(false);
        } else if (this.OptionsBtn_9.selected) {
            this.OptionsBtn_9.$setSelected(false);
        } else if (this.OptionsBtn_10.selected) {
            this.OptionsBtn_10.$setSelected(false);
        } else if (this.OptionsBtn_11.selected) {
            this.OptionsBtn_11.$setSelected(false);
        } else if (this.OptionsBtn_12.selected) {
            this.OptionsBtn_12.$setSelected(false);
        } else if (this.OptionsBtn_13.selected) {
            this.OptionsBtn_13.$setSelected(false);
        } else if (this.OptionsBtn_14.selected) {
            this.OptionsBtn_14.$setSelected(false);
        }

        if (this.TeMaBtn_0.selected) {
            this.TeMaBtn_0.$setSelected(false);
        } else if (this.TeMaBtn_1.selected) {
            this.TeMaBtn_1.$setSelected(false);
        } else if (this.TeMaBtn_2.selected) {
            this.TeMaBtn_2.$setSelected(false);
        } else if (this.TeMaBtn_3.selected) {
            this.TeMaBtn_3.$setSelected(false);
        } else if (this.TeMaBtn_4.selected) {
            this.TeMaBtn_4.$setSelected(false);
        } else if (this.TeMaBtn_5.selected) {
            this.TeMaBtn_5.$setSelected(false);
        } else if (this.TeMaBtn_6.selected) {
            this.TeMaBtn_6.$setSelected(false);
        } else if (this.TeMaBtn_7.selected) {
            this.TeMaBtn_7.$setSelected(false);
        } else if (this.TeMaBtn_8.selected) {
            this.TeMaBtn_8.$setSelected(false);
        } else if (this.TeMaBtn_9.selected) {
            this.TeMaBtn_9.$setSelected(false);
        } else if (this.TeMaBtn_10.selected) {
            this.TeMaBtn_10.$setSelected(false);
        } else if (this.TeMaBtn_11.selected) {
            this.TeMaBtn_11.$setSelected(false);
        } else if (this.TeMaBtn_12.selected) {
            this.TeMaBtn_12.$setSelected(false);
        } else if (this.TeMaBtn_13.selected) {
            this.TeMaBtn_13.$setSelected(false);
        } else if (this.TeMaBtn_14.selected) {
            this.TeMaBtn_14.$setSelected(false);
        } else if (this.TeMaBtn_15.selected) {
            this.TeMaBtn_15.$setSelected(false);
        } else if (this.TeMaBtn_16.selected) {
            this.TeMaBtn_16.$setSelected(false);
        } else if (this.TeMaBtn_17.selected) {
            this.TeMaBtn_17.$setSelected(false);
        } else if (this.TeMaBtn_18.selected) {
            this.TeMaBtn_18.$setSelected(false);
        } else if (this.TeMaBtn_19.selected) {
            this.TeMaBtn_19.$setSelected(false);
        } else if (this.TeMaBtn_20.selected) {
            this.TeMaBtn_20.$setSelected(false);
        } else if (this.TeMaBtn_21.selected) {
            this.TeMaBtn_21.$setSelected(false);
        } else if (this.TeMaBtn_22.selected) {
            this.TeMaBtn_22.$setSelected(false);
        } else if (this.TeMaBtn_23.selected) {
            this.TeMaBtn_23.$setSelected(false);
        } else if (this.TeMaBtn_24.selected) {
            this.TeMaBtn_24.$setSelected(false);
        } else if (this.TeMaBtn_25.selected) {
            this.TeMaBtn_25.$setSelected(false);
        } else if (this.TeMaBtn_26.selected) {
            this.TeMaBtn_26.$setSelected(false);
        } else if (this.TeMaBtn_27.selected) {
            this.TeMaBtn_27.$setSelected(false);
        }
    }
    private getCalssRay() {
        if (this.Calss_1.selected)
            return 1;
        else if (this.Calss_2.selected)
            return 2;
        return 0;
    }
    private concludeHandler(): void {
        if (this.settlementResult == null) {
            Toast.launch("暂无结算信息");
            return;
        }

        let resultUserList: ResultUser[] = null;
        let bankerReward: number = 0;
        //console.log("结算------------------------------------------------"+this.settlementResult.resultInfoDanzhang);
        if (this.settlementResult.resultInfoPcDanDan != null) {
            resultUserList = this.settlementResult.resultInfoPcDanDan.users;
            bankerReward = 0;
        }
        Director.getInstance().showConcludeDialog(this, this.gameId, this.roomId, bankerReward, resultUserList, "pcDanDan", this.sound_on);
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
    //在线玩家信息
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

    private onRewardResultHandler(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            Director.getInstance().effectPlay("click_mp3");
        }
        Director.getInstance().showRulePCDanDanDialog(this, "officalResult", "pcDanDan", this.sound_on, this.gameId, this.roomInfo.is_official);
    }
    //开奖结果
    private onRuleHandler(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            Director.getInstance().effectPlay("click_mp3");
        }
        Director.getInstance().showRulePCDanDanDialog(this, "officalResult", "pcDanDan", this.sound_on, this.gameId, this.roomInfo.is_official);
    }
    private onTouzhuDetailsHandler(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            Director.getInstance().effectPlay("click_mp3");
        }
        Director.getInstance().showTouzhuDetailsDialog(this.gameId, this.roomId, this.sound_on, this);
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
        let room_names = ['牌九', '牛牛', '推筒子', '龙虎', '龙虎斗', '单张', '猴赛雷', 'PC蛋蛋'];
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

                    // for (let u = 0;; u++) {
                    // var LogAreas: BetLogAreas = betLogInfo['areas'][0];
                    // for (let v = 0; v < LogAreas.hybirid.length; ++v) {
                    //     let iSpecial: BetLogSpecialNum = LogAreas.hybirid[v];
                    //     if (iSpecial) {
                    //  dsLabel.text =  betLogInfo['areas']['hybrid'][0]['bet'];
                    //         dsGoldLabel.text = String(iSpecial.title);
                    //     } else {
                    //         dsLabel.text = "";
                    //         dsGoldLabel.text = "";
                    //     }
                    // }
                    // }
                    //  dsLabel.text = betLogInfo['areas']['hybrid'][0]['bet'];
                    // if (betspecial.special_num.length >= 0) {
                    //     TeMaGoldLabel.text = ibetspecial.title;
                    //     temaLabel.text = ibetspecial.bet;
                    // } else {
                    //     TeMaGoldLabel.text = "";
                    //     temaLabel.text = "";
                    // }
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
}