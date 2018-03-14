
class GameNineData {

    public client_id:string;    //客户端id，连接socket后得到，退出房间后就无效了
    public initUserInfoGot:boolean = false;//是否拿到了初始化用户信息
    public socketConnected:boolean = false;//是否连接上了
    
    public totalBet: number; //总下注
    public area_summary: number[] = new Array();//每个区域的下注总和
    public self_bet: number[] = new Array();//每个区域自己下注总和

    public currentBet: number;  //自己下注
    public betInfoList: BetInfo[];   //下注的细节

    public bankerName:string;               //庄家名字
    public bankerTotal:number;              //庄家奖池数量
    public bankerArea:number;               //庄家区域

    public lastUpdateBalanceTicket;         //上次更新余额时间

    public area_limit:AreaLimitInfo[];

    public bankerList: BankerInfo[];           //上庄列表
    
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

class GameNineScene extends BaseScene {

    private gameData: GameNineData = new GameNineData();
    private itemGroup: eui.Group;

    public chongzhiImage: eui.Image;
    public rewardResultImage: eui.Image;
    public backImage: eui.Image;
    public ruleImage: eui.Image;
    public playerListImage: eui.Image;
   //public concoludeImage: eui.Image;
    public testLabel: eui.Label;
    public stateNotifyLabel: eui.Label; //游戏状态
    public stateTicketLabel: eui.Label;
    public touzhuDetailsImage: eui.Image;//投注明细
    private exitButton: eui.Button;     //退出登录
    private serviceButton: eui.Button;  //联系客服
    private todayResultLabel: eui.Label; //当日盈亏
    private todayLonghuResultLabel: eui.Label; //今日龙虎下注额

    private becomeBankerButton: eui.Button;//我要上庄
    private underBankerButton:eui.Button;//我要下庄
    private bankerListScrollerGroup:eui.Group;//上庄列表

    private bankerListGroup:eui.Group;
    private bankerGroup:eui.Group; //庄家信息group
    private bankerNameLabel:eui.Label;  //庄家名字
    private bankerPriceLabel:eui.Label; //庄家庄池

    //音效开关
    private soundButton: eui.Button;
    private sound_on = 1;
    private sound_channel:egret.SoundChannel;
    private is_kaijiang:Number=0;

    //分页投注明细
    private page:number=1;
    private row:number=10;
    private lastPageLabel:eui.Label;
    private nextPageLabel:eui.Label;
    private currentPageLabel:eui.Label;
    private totalPageLabel:eui.Label;
    
    //游戏公告
    private noticeGroup:eui.Group;
    private noticeLabel:eui.Label;

    private betLogGroup: eui.Group
    private betLogDemoCellGroup: eui.Group;  //下注列表的demo cell，要隐藏

    public titleLabel: eui.Label;//北京赛车--645125期-牛牛
    public nameLabel: eui.Label;
    public balanceLabel: eui.Label;
    public timeLabel: eui.BitmapLabel;
    private totalBetLabel: eui.Label;//中上位置总下注金额

    //下注区域的背景框子
    public area_image_1: eui.Image;
    public area_image_2: eui.Image;
    public area_image_3: eui.Image;
    public area_image_4: eui.Image;
    public area_image_5: eui.Image;

    //底部筹码
    public chip_toggle_1: eui.ToggleSwitch;
    public chip_toggle_10: eui.ToggleSwitch;
    public chip_toggle_50: eui.ToggleSwitch;
    public chip_toggle_100: eui.ToggleSwitch;
    public chip_toggle_500: eui.ToggleSwitch;
    public chip_toggle_1000: eui.ToggleSwitch;
    public chip_toggle_5000: eui.ToggleSwitch;

    //下注区域
    public group_bet_1: eui.Group;
    public group_bet_2: eui.Group;
    public group_bet_3: eui.Group;
    public group_bet_4: eui.Group;
    public group_bet_5: eui.Group;

    //庄家的庄字
    public banker_label_1: eui.Label;
    public banker_label_2: eui.Label;
    public banker_label_3: eui.Label;
    public banker_label_4: eui.Label;
    public banker_label_5: eui.Label;

    public point_label_1: eui.Label;
    public point_label_2: eui.Label;
    public point_label_3: eui.Label;
    public point_label_4: eui.Label;
    public point_label_5: eui.Label;

    public groupCenter: eui.Group;
    public groupBets:eui.Group;

    //信号灯
    // public lightImage1: eui.Image;
    // public lightImage2: eui.Image;
    // public lightImage3: eui.Image;
    // public lightImage4: eui.Image;
    // public lightGroup: eui.Group

    //跑车的框子
    public racecarGroup_1: eui.Group;
    public racecarGroup_2: eui.Group;
    public racecarGroup_3: eui.Group;
    public racecarGroup_4: eui.Group;
    public racecarGroup_5: eui.Group;
    public racecarGroup_6: eui.Group;
    public racecarGroup_7: eui.Group;
    public racecarGroup_8: eui.Group;
    public racecarGroup_9: eui.Group;
    public racecarGroup_10: eui.Group;

    public fireImage_1: eui.Group;
    public fireImage_2: eui.Group;
    public fireImage_3: eui.Group;
    public fireImage_4: eui.Group;
    public fireImage_5: eui.Group;
    public fireImage_6: eui.Group;
    public fireImage_7: eui.Group;
    public fireImage_8: eui.Group;
    public fireImage_9: eui.Group;
    public fireImage_10: eui.Group;

    

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

    

    //下注显示当前区域下注值，结算显示下注+赢来的
    private score_label_1: eui.Label;
    private score_label_2: eui.Label;
    private score_label_3: eui.Label;
    private score_label_4: eui.Label;
    private score_label_5: eui.Label;

    private score_self_label_1: eui.Label;
    private score_self_label_2: eui.Label;
    private score_self_label_3: eui.Label;
    private score_self_label_4: eui.Label;
    private score_self_label_5: eui.Label;



    //游戏主页面
    public gameMainGroup: eui.Group;

    //麻将
    public majiang_image_0: eui.Image;
    public majiang_image_1: eui.Image;
    public majiang_image_2: eui.Image;
    public majiang_image_3: eui.Image;
    public majiang_image_4: eui.Image;
    public majiang_image_5: eui.Image;
    public majiang_image_6: eui.Image;
    public majiang_image_7: eui.Image;
    public majiang_image_8: eui.Image;
    public majiang_image_9: eui.Image;

    //名次
    public rank_image_1: eui.Image;
    public rank_image_2: eui.Image;
    public rank_image_3: eui.Image;
    public rank_image_4: eui.Image;
    public rank_image_5: eui.Image;

    public raceCarGroupList: eui.Group[];

    public mainScroller: eui.Scroller;

    private codeCalculateTimer: egret.Timer;//判断当前车的顺序做号码显示的定时器
    public commonTimer: egret.Timer; //状态机定时器
    public raceGroup: eui.Group;         //横向赛车的大框子
    public raceBgScroller: eui.Scroller; //赛车的跑道
    public raceBgScrollerGroup: eui.Group; //赛车的跑道
    public startLineImage: eui.Image;//终点线

    public gameId: number;
    public roomId: number;
    //private currentBet:number;
    //public betInfoList:BetInfo[];

    //触摸点位置
    public beginPositionX: number;
    public beginPositionY: number;
    public movePositionX: number;
    public movePositionY: number;

    //每个区域下注的筹码图标
    public chipImageList0: eui.Image[];//公共区域,包括左上角和右下角

    public chipImageList1: eui.Image[];
    public chipImageList2: eui.Image[];
    public chipImageList3: eui.Image[];
    public chipImageList4: eui.Image[];
    public chipImageList5: eui.Image[];

    public processState: ProcessState;       //游戏状态
    public clientState: ClientState;         //客户端状态
    public serverState: ServerState;         //当前服务端游戏状态
    public serverStateNotify: string;        //游戏状态通知的内容
    public serverStateEndTicket: number;     //本状态服务器结束的时间
    public remaining_open_time: number;      //同步state==1的时候，剩下到开盘时间
    public serverStateOpenTicket: number;     //游戏状态：开盘时间

    public openResult: OpenResult;
    public settlementResult: PacketSettlementResult;
    public responseJoinRoom: ResponseJoinRoom;


    private roomType = RoomType.RoomTypeNine;

    private startRaceTicket: number; //开始赛车的时间

    private lastTimerTicket: number = 0; //上次timer时间

    private sureBetGroup:eui.Group;//确定下注
    private cancleBetGroup:eui.Group;//取消下注
    private sureBetTimeLabel:eui.Label;//确定下注倒计时，倒计时15s消失
    private showCancleBet:number=0;//是否显示取消下注，第一次投注后或者有投注过、退出重进房间时显示
    private showCancleBetTicket:number=0;//显示取消下注时的时间戳
    private showCancleBetRemainTime:number=15;//显示取消下注时倒计时
    private packetBackBet:PacketBackBet;

    private areaSelfBet1:number=0;
    private areaSelfBet2:number=0;
    private areaSelfBet3:number=0;
    private areaSelfBet4:number=0;
    private areaSelfBet5:number=0;


    //private timePrepare = 40;   //准备时间
    //private timeBet     = 150;  //下注时间
    //private timeBlock   = 40;  //封盘时间
    private local_test = 0;// 本地测试开启后，下注不花钱

    private needFastAnimation = false;//是否需要加快动画速度

    /**
     * 聊天框对象
     */
    public MsgText: eui.TextInput;           //输入框文本
    public btnMsg: eui.Button;               //发送消息按键
    // public MsgGroup:eui.Group;               //文本消息Group
    // public MsgImage:eui.Image;               //消息背景图
    // public UsereName:eui.Label;              //玩家姓名
    // public MsgLabel:eui.Label;               //显示文本Label
    public chatScroller: eui.Scroller;        //滚动聊天记录容器

    public UserId: eui.Label;               //用户ID
    public TehUser: eui.Label;              //用户账号
    public UserName: eui.Label;              //玩家姓名
    public GoldNum: eui.Label;              //用户金币
    public NoerList: eui.Label;              //期数列表
    public NoerGold: eui.Label;              //期数金币
    public FreezingGoldNum:eui.Label;
    public dateLabel: eui.Label;            //当前日期
    private roomInfo:RoomInfo;
    private enableFreeBanker:boolean;       //是否允许自由上庄

    //public chedao_image:eui.Label;          //
    public setRoomData(gameId, roomInfo:RoomInfo, enableFreeBanker:boolean) {
        this.gameId = gameId;
        this.roomId = roomInfo.id;
        this.roomInfo = roomInfo;
        
        let channelName = CommonConfig.getChannelName();
        if(channelName=='jtpk10'){
            //新濠定制，竞技场去掉上庄
            this.enableFreeBanker= false;
        }else{
            this.enableFreeBanker = enableFreeBanker;
        }
        /*
        this.serverState = response.state;

        let currentTicket = Math.floor(Number(new Date())/1000);
        this.serverStateEndTicket = currentTicket+response.time;
        */
        this.responseJoinRoom = null;
    }

    public setNeedFastAnimation(isNeed:boolean)
    {
        this.needFastAnimation = isNeed;
    }

    public constructor() {
        super();
        this.skinName = "resource/skins/scene/GameNineSceneSkin.exml";

        //this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        //this.addEventListener(egret.Event.REMOVED, this.onRemoved, this);
    }

    public onPopScene() {
        Logger.log("onPopScene");

        if(this.sound_channel!=null)
        {
            this.sound_channel.stop();
            this.sound_channel = null;
        }
        
        egret.Tween.removeTweens(this);
        egret.Tween.removeTweens(this.raceBgScroller.viewport);
        egret.Tween.removeTweens(this.startLineImage);
        egret.Tween.removeTweens(this.mainScroller.viewport);
        for (let i = 0; i < 10; i++) {
            // 停止赛车动画
            let raceCarGroup: eui.Group = this.raceCarGroupList[i];
            egret.Tween.removeTweens(raceCarGroup);
        }

        for(let i=0;i<10;i++)
        {
            let majiangImage = this.getMajiangImage(i);
            egret.Tween.removeTweens(majiangImage);
        }

        egret.Tween.removeTweens(this.noticeLabel);
        
        SocketEngine.getInstance().removeEventListener(SocketEngine.EventNameFriendJoin, this.onPacketFriendJoin, this);
        SocketEngine.getInstance().removeEventListener(SocketEngine.EventNameLeaveRoom, this.onPacketLeaveRoom, this);
        SocketEngine.getInstance().removeEventListener(SocketEngine.EventNameBet, this.onPacketBet, this);
        SocketEngine.getInstance().removeEventListener(SocketEngine.EventNameSettleMentResult, this.onPacketSettlementResult, this);
        SocketEngine.getInstance().removeEventListener(SocketEngine.EventNameNotify, this.onPacketNotify, this);
        SocketEngine.getInstance().removeEventListener(SocketEngine.EventNameBackBet, this.onPacketBackBet, this);
        SocketEngine.getInstance().removeEventListener(SocketEngine.EventNameReservationBankerNotify, this.onPacketReservationBankerNotify, this);
        SocketEngine.getInstance().removeEventListener(SocketEngine.EventNameUnderBankerNotify, this.onPacketUnderBankerNotify, this);
        SocketEngine.getInstance().removeEventListener(SocketEngine.EventNameBankerNotify, this.onPacketBankerNotify, this);
        SocketEngine.getInstance().removeEventListener(SocketEngine.EventNameTalk, this.onPacketTalk, this);
        SocketEngine.getInstance().removeEventListener(SocketEngine.EventNameEndBankerNotify, this.onPacketEndBanker, this);
        SocketEngine.getInstance().removeEventListener(SocketEngine.EventNameLackOfMoneyNotify, this.onPacketLackOfMoney, this);
        SocketEngine.getInstance().removeEventListener(SocketEngine.EventNameContinueBankerNotify, this.onPacketContinueBanker, this);

        SocketEngine.getInstance().removeEventListener(SocketEngine.EventNameSocketDisconnect, this.onSocketDisconnect, this);

         //开奖结果
        this.rewardResultImage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onRewardResultHandler, this);
        this.ruleImage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onRuleHandler, this);
        this.playerListImage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onPlayerListHandler, this);
        this.backImage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.backHandler, this);
        this.exitButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.exitHandler, this);
        this.serviceButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.serviceHandler, this);
        this.chongzhiImage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.serviceHandler, this);

        this.testLabel.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.testHandler, this);

        //this.concoludeImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.concludeHandler, this);

        this.area_image_1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.areaTouchHandler, this);
        this.area_image_2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.areaTouchHandler, this);
        this.area_image_3.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.areaTouchHandler, this);
        this.area_image_4.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.areaTouchHandler, this);
        this.area_image_5.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.areaTouchHandler, this);

        this.chip_toggle_1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.chipToggleTouchHandle, this);
        this.chip_toggle_10.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.chipToggleTouchHandle, this);
        this.chip_toggle_50.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.chipToggleTouchHandle, this);
        this.chip_toggle_100.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.chipToggleTouchHandle, this);
        this.chip_toggle_500.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.chipToggleTouchHandle, this);
        this.chip_toggle_1000.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.chipToggleTouchHandle, this);
        this.chip_toggle_5000.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.chipToggleTouchHandle, this);

        this.score_label_1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.scoreLabelTouchHandler, this);
        this.score_label_2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.scoreLabelTouchHandler, this);
        this.score_label_3.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.scoreLabelTouchHandler, this);
        this.score_label_4.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.scoreLabelTouchHandler, this);
        this.score_label_5.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.scoreLabelTouchHandler, this);

        this.score_self_label_1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.scoreLabelTouchHandler, this);
        this.score_self_label_2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.scoreLabelTouchHandler, this);
        this.score_self_label_3.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.scoreLabelTouchHandler, this);
        this.score_self_label_4.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.scoreLabelTouchHandler, this);
        this.score_self_label_5.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.scoreLabelTouchHandler, this);

        this.becomeBankerButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.becomeBankerTouchHandler, this);
        this.underBankerButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.underBankerTouchHandler, this);

        //监听游戏主页面手势，判断滑动
        this.gameMainGroup.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.swipeBeginHandler, this);
        //投注明细弹窗监听
        this.touzhuDetailsImage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouzhuDetailsHandler, this);
        //音效开关
        this.soundButton.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.soundChangeControlHandler, this);
        //确定下注
        this.sureBetGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.sureBetHandler, this);
        //取消下注
        this.cancleBetGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.cancleBetDialog, this);

        //投注明细翻页
        this.lastPageLabel.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.lastPageHandler, this);
        this.nextPageLabel.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.nextPageHandler, this);

        if(this.commonTimer!=null)
        {
            this.commonTimer.removeEventListener(egret.TimerEvent.TIMER, this.commonTimerHandler, this);
            this.commonTimer.stop();
        }
        

        this.gameMainGroup.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.swipeHandler, this);
        if(this.concludeTimer!=null)
        {
            this.concludeTimer.stop();
            this.concludeTimer.removeEventListener(egret.TimerEvent.TIMER, this.concludeTimerHandler, this);
        }
        
        if(this.codeCalculateTimer!=null)
        {
            this.codeCalculateTimer.stop();
            this.codeCalculateTimer.removeEventListener(egret.TimerEvent.TIMER, this.codeCalculateTimerHandler, this);
        }
        if(this.btnMsg)
        {
            this.btnMsg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChatDlg, this);
        }

    }

    

    //显示加载进度
    public privodeNeedShowLoading() {
        return false;
    }

    //别人弹出栈，自己重新显示
    public onSceneReshow() {

    }


    /**
     * 创建游戏场景
     * Create a game scene
     */
    public createGameScene() {
        this.lastTimerTicket = 0;
        if (CommonConfig.getIsEnableTest() == true) {
            this.testLabel.visible = true;
        } else {
            this.testLabel.visible = false;
        }

        this.betLogDemoCellGroup.visible = false;
        this.cancleBetGroup.visible=false;
        this.sureBetGroup.visible=false;
        //this.loadArray();

        this.mainScroller.viewport.contentWidth = 1140;
        this.mainScroller.viewport.scrollH = 0;

        this.becomeBankerButton.x = 0;
        //this.becomeBankerButton.visible = false;
        this.underBankerButton.x = 0;
        let channelName = CommonConfig.getChannelName();
        if(channelName=='jtpk10'){
            //新濠定制，竞技场去掉上庄
            this.becomeBankerButton.visible = false;
        }
        
        this.chipImageList0 = new Array();
        this.chipImageList1 = new Array();
        this.chipImageList2 = new Array();
        this.chipImageList3 = new Array();
        this.chipImageList4 = new Array();
        this.chipImageList5 = new Array();

        //开奖结果
        this.rewardResultImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRewardResultHandler, this);
        this.ruleImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRuleHandler, this);
        this.playerListImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPlayerListHandler, this);
        this.backImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.backHandler, this);
        this.exitButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.exitHandler, this);
        this.serviceButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.serviceHandler, this);
        this.chongzhiImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.serviceHandler, this);

        this.testLabel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.testHandler, this);

        //this.concoludeImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.concludeHandler, this);

        this.area_image_1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.areaTouchHandler, this);
        this.area_image_2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.areaTouchHandler, this);
        this.area_image_3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.areaTouchHandler, this);
        this.area_image_4.addEventListener(egret.TouchEvent.TOUCH_TAP, this.areaTouchHandler, this);
        this.area_image_5.addEventListener(egret.TouchEvent.TOUCH_TAP, this.areaTouchHandler, this);

        let chipToggleList = {"chip_1":this.chip_toggle_1,"chip_10":this.chip_toggle_10, "chip_50":this.chip_toggle_50,
            "chip_100":this.chip_toggle_100, "chip_500":this.chip_toggle_500,
            "chip_1000":this.chip_toggle_1000, "chip_5000":this.chip_toggle_5000};
        
        let chipWidth = 95;//this.chip_toggle_10.width;
        for(let chipName in chipToggleList)
        {
            let chipToggle:eui.ToggleSwitch = chipToggleList[chipName];
            chipToggle.visible = false;
        }
        
        let index = 0;
        for(let i = 0;i<CommonConfig.gameConfig.chip_rows.length;i++)
        {
            let chipRowInfo:ChipRowInfo = CommonConfig.gameConfig.chip_rows[i];
            let chipName = chipRowInfo.config_sign;
            let chipToggle:eui.ToggleSwitch = chipToggleList[chipName];
            if(chipToggle==null)
            {
                continue;
            }
            chipToggle.x = 95*index;
            chipToggle.visible = true;
            index++;
        }

        this.chip_toggle_1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.chipToggleTouchHandle, this);
        this.chip_toggle_10.addEventListener(egret.TouchEvent.TOUCH_TAP, this.chipToggleTouchHandle, this);
        this.chip_toggle_50.addEventListener(egret.TouchEvent.TOUCH_TAP, this.chipToggleTouchHandle, this);
        this.chip_toggle_100.addEventListener(egret.TouchEvent.TOUCH_TAP, this.chipToggleTouchHandle, this);
        this.chip_toggle_500.addEventListener(egret.TouchEvent.TOUCH_TAP, this.chipToggleTouchHandle, this);
        this.chip_toggle_1000.addEventListener(egret.TouchEvent.TOUCH_TAP, this.chipToggleTouchHandle, this);
        this.chip_toggle_5000.addEventListener(egret.TouchEvent.TOUCH_TAP, this.chipToggleTouchHandle, this);

        this.score_label_1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.scoreLabelTouchHandler, this);
        this.score_label_2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.scoreLabelTouchHandler, this);
        this.score_label_3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.scoreLabelTouchHandler, this);
        this.score_label_4.addEventListener(egret.TouchEvent.TOUCH_TAP, this.scoreLabelTouchHandler, this);
        this.score_label_5.addEventListener(egret.TouchEvent.TOUCH_TAP, this.scoreLabelTouchHandler, this);

        this.score_self_label_1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.scoreLabelTouchHandler, this);
        this.score_self_label_2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.scoreLabelTouchHandler, this);
        this.score_self_label_3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.scoreLabelTouchHandler, this);
        this.score_self_label_4.addEventListener(egret.TouchEvent.TOUCH_TAP, this.scoreLabelTouchHandler, this);
        this.score_self_label_5.addEventListener(egret.TouchEvent.TOUCH_TAP, this.scoreLabelTouchHandler, this);

        this.becomeBankerButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.becomeBankerTouchHandler, this);
        this.underBankerButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.underBankerTouchHandler, this);

        //监听游戏主页面手势，判断滑动
        this.gameMainGroup.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.swipeBeginHandler, this);
        //投注明细弹窗监听
        this.touzhuDetailsImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouzhuDetailsHandler, this);
        //音效开关
        this.soundButton.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.soundChangeControlHandler, this);
        //确定下注
        this.sureBetGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.sureBetHandler, this);
        //取消下注
        this.cancleBetGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.cancleBetDialog, this);

        //投注明细翻页
        this.lastPageLabel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.lastPageHandler, this);
        this.nextPageLabel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.nextPageHandler, this);

        let userInfo: UserInfo = ClientStorage.getUserInfo();
        this.nameLabel.text = userInfo.nickname;
            this.balanceLabel.text = Number(userInfo.balance).toFixed(2);

        let title = DataEngine.getInstance().getGameRoomTitle(this.gameId, this.roomId);
        this.titleLabel.text = title;

        let expectInfo: ExpectInfo = DataEngine.getInstance().getExpectInfo(this.gameId);
        this.setOpenCodeWithStr(expectInfo.opencode)

        this.timeLabel.text = "";
        this.totalBetLabel.text = "";

        this.bankerNameLabel.text = "";
        this.bankerPriceLabel.text = "";
        this.bankerGroup.visible = false;//庄家信息group

        // this.MsgGroup.visible = false;
        // this.MsgLabel.text = "";

        // this.lightImage1.source = "light_2_png";
        // this.lightImage2.source = "light_2_png";
        // this.lightImage3.source = "light_2_png";
        // this.lightImage4.source = "light_2_png";

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

        this.majiang_image_0.visible = false;
        this.majiang_image_1.visible = false;
        this.majiang_image_2.visible = false;
        this.majiang_image_3.visible = false;
        this.majiang_image_4.visible = false;
        this.majiang_image_5.visible = false;
        this.majiang_image_6.visible = false;
        this.majiang_image_7.visible = false;
        this.majiang_image_8.visible = false;
        this.majiang_image_9.visible = false;

        this.rank_image_1.visible = false;
        this.rank_image_2.visible = false;
        this.rank_image_3.visible = false;
        this.rank_image_4.visible = false;
        this.rank_image_5.visible = false;

        this.hideAllBanker();
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

        //this.codeCalculateTimerHandler();
        this.codeCalculateTimer = new egret.Timer(100, 0);
        this.codeCalculateTimer.addEventListener(egret.TimerEvent.TIMER, this.codeCalculateTimerHandler, this);
        this.codeCalculateTimer.stop();

        let that = this;
        SocketEngine.getInstance().addEventListener(SocketEngine.EventNameFriendJoin, this.onPacketFriendJoin, this);
        SocketEngine.getInstance().addEventListener(SocketEngine.EventNameLeaveRoom, this.onPacketLeaveRoom, this);
        SocketEngine.getInstance().addEventListener(SocketEngine.EventNameBet, this.onPacketBet, this);
        SocketEngine.getInstance().addEventListener(SocketEngine.EventNameSettleMentResult, this.onPacketSettlementResult, this);
        SocketEngine.getInstance().addEventListener(SocketEngine.EventNameNotify, this.onPacketNotify, this);
        SocketEngine.getInstance().addEventListener(SocketEngine.EventNameBackBet, this.onPacketBackBet, this);
        SocketEngine.getInstance().addEventListener(SocketEngine.EventNameReservationBankerNotify, this.onPacketReservationBankerNotify, this);
        SocketEngine.getInstance().addEventListener(SocketEngine.EventNameUnderBankerNotify, this.onPacketUnderBankerNotify, this);
        SocketEngine.getInstance().addEventListener(SocketEngine.EventNameBankerNotify, this.onPacketBankerNotify, this);
        SocketEngine.getInstance().addEventListener(SocketEngine.EventNameTalk, this.onPacketTalk, this);
        SocketEngine.getInstance().addEventListener(SocketEngine.EventNameEndBankerNotify, this.onPacketEndBanker, this);
        SocketEngine.getInstance().addEventListener(SocketEngine.EventNameLackOfMoneyNotify, this.onPacketLackOfMoney, this);
        SocketEngine.getInstance().addEventListener(SocketEngine.EventNameContinueBankerNotify, this.onPacketContinueBanker, this);

        SocketEngine.getInstance().addEventListener(SocketEngine.EventNameSocketDisconnect, this.onSocketDisconnect, this);
        
        
    }

    public onInit()
    {
        //获取最新游戏公告
        HttpEngine.getInstance().getNotice(function (name: string, ResponseNotice: ResponseNotice) {
            if (ResponseNotice.error != 0) {
                Toast.launch(ResponseNotice.msg);
                return;
            }
            let info=ResponseNotice.info;
            this.noticeLabel.text=info.content;
            this.noticeLabel.x=635;
            let targetX=0-Number(this.noticeLabel.width);
            let tw=egret.Tween.get(this.noticeLabel);
            tw.to({x:targetX},12000).call(this.onScrollNoticeEnd,this,[]);
        },this)

        this.initUserInfo();
    }

    
     //监听公告单次滚动结束事件
    private onScrollNoticeEnd():void{
        this.noticeLabel.x=635;
        let targetX=0-Number(this.noticeLabel.width);
        let tw=egret.Tween.get(this.noticeLabel);
        tw.to({x:0-targetX},12000).call(this.onScrollNoticeEnd,this,[]);
    }

    private initUserInfo() {
        this.gameData.initUserInfoGot = false;
        let that = this;
        let httpEngine: HttpEngine = HttpEngine.getInstance();
        httpEngine.getUserInfo(function (name: string, responseUserInfo: ResponseUserInfo) {
            if(responseUserInfo.error!=0)
            {
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

    //游戏主页面手势开始事件
    private swipeBeginHandler(evt: egret.TouchEvent): void {
        //Logger.log("beginPositionX:", evt.stageX);
        //记录触摸点位置
        this.beginPositionX = evt.stageX;
        this.beginPositionY = evt.stageY;
        //判断当前是否有左右滑出页面，有的话点击非滑出页面区域则复原
        //Logger.log("this-------" + this.mainScroller.viewport.scrollH);
        if (this.mainScroller.viewport.scrollH == 500) {
            this.showCenter();

        } else {
            //监听手势滑动事件
            this.gameMainGroup.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.swipeHandler, this);
        }

    }

    private swipeHandler(evt: egret.TouchEvent): void {
        //Logger.log("movePositionX:", evt.stageX);
        //记录触摸点变化位置
        this.movePositionX = evt.stageX;
        this.movePositionY = evt.stageY;
        //stageY阈值控制
        if (this.movePositionY - this.beginPositionY > 100) {
            this.gameMainGroup.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.swipeHandler, this);
        }
        //stageX阈值控制
        //左滑动
        if (this.movePositionX - this.beginPositionX < -20) {
            //Logger.log(this.mainScroller.viewport.scrollH);
            if (this.mainScroller.viewport.scrollH < 1|| this.mainScroller.viewport.scrollH > 500) {
                this.showRight();

            } else {
                this.showCenter();
            }
            this.gameMainGroup.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.swipeHandler, this);
        }
        //右滑动
        // if (this.movePositionX - this.beginPositionX > 20) {
        //     //Logger.log(this.mainScroller.viewport.scrollH);
        //     if (this.mainScroller.viewport.scrollH < 1000 && this.mainScroller.viewport.scrollH > 400 || this.mainScroller.viewport.scrollH <= 0) {
        //         this.showLeft();
        //     } else {
        //         this.showCenter();
        //     }
        //     this.gameMainGroup.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.swipeHandler, this);
        // }
    }


    public onPacketFriendJoin(name: string, packet: PacketFriendJoin) {
        this.appendStaff(packet.nickname);
    }
    public onPacketLeaveRoom(name: string, packet: PacketLeaveRoom) {
        this.removeStaff(packet.nickname);
    }
    public onPacketBet(name: string, packet: PacketBet) {
        this.onNotifyBet(packet)
    }
    public onPacketSettlementResult(name: string, packet: PacketSettlementResult) {
        this.onNotifySettlementResult(packet)
    }
    public onPacketNotify(name: string, packet: PacketNotify) {
        this.onNotifyPacketNotify(packet)
    }
    //玩家撤回投注
    public onPacketBackBet(name: string, packet: PacketBackBet) {
        this.onNotifyPacketBackBet(packet)
    }
    public onPacketReservationBankerNotify(name: string, packet: PacketReservationBankerNotify) {
        this.onNotifyPacketReservationBankerNotify(packet)
    }
    public onPacketUnderBankerNotify(name: string, packet: PacketUnderBankerNotify) {
        this.onNotifyPacketUnderBankerNotify(packet)
    }
    public onPacketBankerNotify(name: string, packet: PacketBankerNotify) {
        this.onNotifyPacketBankerNotify(packet)
    }
    public onPacketTalk(name: string, packet: PacketTalk) {
        this.StartTalk(packet);
    }

    public onPacketEndBanker(name: string, packet: PacketEndBankerNotify) {
        this.onNotifyPacketEndBankerNotify(packet)
    }
    public onPacketLackOfMoney(name: string, packet: PacketLackOfMoneyNotify) {
        this.onNotifyPacketLackOfMoney(packet)
    }
    public onPacketContinueBanker(name: string, packet: PacketContinueBankerNotify) {
        this.onNotifyPacketContinueBanker(packet);
    }

    //自己关闭socket，不会马上响应SocketEngine的onSocketClosed事件，所以这个地方不会来
    //断开网络的时候，白鹭没有触发onSocketClosed事件，还需要检查，可以用ping做检查
    public onSocketDisconnect(name:string, client_id:string){
        let that = this;
        if(this.gameData.client_id == client_id)
        {//此房间socket意外中断
            this.forceExit();
            Toast.launch("网络通信中断，请重新进入房间", 2000);    
        }
    } 

    //如果是重连才传true
    private connectServer(isReconnect:boolean)
    {
        let needStopTweens = false;
        if(isReconnect)
        {
            needStopTweens = true;
        }

        let that = this;
        this.resetViews(needStopTweens);
        this.gameData.socketConnected = false;
        this.processState = ProcessState.ProcessStateInit;
        
        let tw = egret.Tween.get(this);
        tw.to({},500).call(function(){
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
                if(that.responseJoinRoom.error!=0)
                {
                    Toast.launch(that.responseJoinRoom.msg);
                    that.forceExit();
                    return;
                }
                that.initServerParam(packet.client_id);
            }, that);
        }, that);
    }

    public initServerParam(client_id) {
        //this.processState = ProcessState.ProcessStateWait;
        Logger.log("initServerParam with join state: "+this.responseJoinRoom.state);
        //如果ServerStateRun=4，setNotifyState会激活跑车
        this.setNotifyState(this.responseJoinRoom.state, "", this.responseJoinRoom.time, this.responseJoinRoom.remaining_time, true);
        this.gameData.currentBet = this.responseJoinRoom.current_bet;
        this.gameData.client_id = client_id;

        this.gameData.betInfoList = this.responseJoinRoom.rows;

        //单门限额
        this.gameData.area_limit = this.responseJoinRoom.area_limit;
        
        //this.totalBetLabel.text = String(this.currentBet);
        if (this.responseJoinRoom.banker_info != null) {
            let bankerInfo = this.responseJoinRoom.banker_info;
            //更新庄家
            this.gameData.bankerArea = bankerInfo.area;
            this.gameData.bankerTotal = bankerInfo.price;
            this.gameData.bankerName = bankerInfo.nickname;
            let needSezi = false;
            if (this.responseJoinRoom.state == ServerState.StateBet || this.responseJoinRoom.state == ServerState.StateWait) {
                if(this.enableFreeBanker)
                {
                    needSezi = true;
                }
            }
            this.updateBanker(needSezi);
        } else {
            this.gameData.bankerArea = 0;
            this.gameData.bankerTotal = 0;
            this.gameData.bankerName = "";
            this.updateBanker(false);
        }

        //更新下注金额
        this.gameData.updateAreaSummaryAndTotalBet(this.responseJoinRoom.area_summary);
        for (let i = 0; i < 5; i++) {
            let area = i + 1;
            let areaBet = this.gameData.area_summary[area];

            //区域下注
            let areaScoreLabel = this.getAreaScoreLabel(area);
            if (areaBet > 0) {
                areaScoreLabel.text = String(areaBet);
            }

        }
        this.totalBetLabel.text = String(this.gameData.totalBet);
        //更新自己下注金额
        this.gameData.updateSelfBetAndSelfTotalBet(this.responseJoinRoom.self_bets);
        for (let i = 0; i < 5; i++) {
            let area = i + 1;
            let areaBet = this.gameData.self_bet[area];

            if (areaBet > 0) {
                //有投过住，显示取消投注
                //this.showCancleBet=1;
                //区域下注
                let areaScoreLabel = this.getAreaSelfScoreLabel(area);
                areaScoreLabel.text = String(areaBet);
            }
        }
        /*if(this.showCancleBet&&this.responseJoinRoom.state==2){
            //记录当前时间
            this.showCancleBetTicket = Math.floor(Number(new Date()) / 1000);
            this.showCancleBetRemainTime=15;
            //下注阶段，且投过注，则直接显示取消投注
            this.cancleBetGroup.visible=true;
            this.sureBetGroup.visible=true;
            this.sureBetTimeLabel.text="(15)";
        }*/
        //自己下注总金额不显示
        //this.selfTotalBetLabel.text = String(this.gameData.totalBet);

        let that = this;
        let tw = egret.Tween.get(this);
        tw.to({}, 500).call(function () {
            that.showInitAnimation();
        });

        HttpEngine.getInstance().getRoomStaffs(function (name: string, response: ResponseRoomStaff) {
            for (let row in response.rows) {
                let item: RoomStaff = response.rows[row];
                that.appendStaff(item.nickname);
            }
        }, this);

        HttpEngine.getInstance().getBankerList(function (name: string, response: ResponseGetBankerList) {
            that.updateBankerList(response.rows);
        }, this);
    }

    public staffList: string[] = new Array();

    public appendStaff(nickname: string) {
        this.staffList.push(nickname);
    }
    public removeStaff(nickname: string) {

    }
    public onNotifyBet(packet: PacketBet) {
        //this.connectServer(true);
        let foundBet = false;
        for (let row in this.gameData.betInfoList) {//找到一个已经有的位置插入
            let betInfo: BetInfo = this.gameData.betInfoList[row];
            if (Number(betInfo.area) == Number(packet.area) && Number(betInfo.number) == Number(packet.number)) {
                //let area_id = this.getarea
                this.gameData.betInfoList[row].count++;
                foundBet = true;
                break;
            }
        }

        if (!foundBet) {//没找到位置，新建一个BetInfo存储下注信息
            let json = JSON.parse("{}");
            let betInfo: BetInfo = new BetInfo(json);
            betInfo.area = Number(packet.area);
            betInfo.number = Number(packet.number);
            betInfo.count = 1;
            this.gameData.betInfoList.push(betInfo);
        }
        //更新下注金额
        this.gameData.updateAreaSummaryAndTotalBet(packet.area_summary);
        for (let i = 0; i < 5; i++) {
            let area = i + 1;
            let areaBet = this.gameData.area_summary[area];

            //区域下注
            let areaScoreLabel = this.getAreaScoreLabel(area);
            if (areaBet != 0) {
                if(!this.showCancleBet&&packet.msg.indexOf(this.nameLabel.text)>=0){
                    this.showCancleBet=1;
                    //记录当前时间
                    this.showCancleBetTicket = Math.floor(Number(new Date()) / 1000);
                    this.showCancleBetRemainTime=15;
                    //下注阶段，且投过注，则直接显示取消投注
                    this.cancleBetGroup.visible=true;
                    this.sureBetGroup.visible=true;
                    //this.sureBetTimeLabel.text="";
                }
                areaScoreLabel.text = String(areaBet);
            }

        }

        this.totalBetLabel.text = String(this.gameData.totalBet); 

        this.throwChip(Number(packet.area), Number(packet.number), false, true, true);
        this.updateChipVisibility(Number(packet.area));
    }

    private onNotifySettlementResult(result: PacketSettlementResult) {
        if (result.room_type != this.roomType) {
            return;
        }

        this.settlementResult = result;
        this.openResult = result.open_result;

        if (this.settlementResult.resultInfoNineHaveBanker != null) {
            //更新庄池分数
            this.gameData.bankerTotal = this.gameData.bankerTotal + this.settlementResult.resultInfoNineHaveBanker.banker;
            this.updateBanker(false);
        }
        /*结算
        //显示庄家
        if (this.settlementResult.resultInfoNineHaveBanker != null) {
            this.setBanker(this.settlementResult.resultInfoNineHaveBanker.bank_area, false);
        } else {
            this.hideAllBanker();
        }
        */

        //状态改为开奖中,如果是车没跑完，跑完车结算，如果没有跑车，直接结算
        this.switchStatus(ProcessState.ProcessStateConclude);
    }

    private onNotifyPacketNotify(result: PacketNotify) {
        this.setNotifyState(result.info.state, result.info.msg, result.info.time, result.info.remaining_time, false);
    }

    private onNotifyPacketBackBet(result: PacketBackBet) {
        //有人撤回押注，更新押注
        this.packetBackBet=result;
        if(result.msg.indexOf(this.nameLabel.text)<0){
            Toast.launch(result.msg);
            this.backBetHandler();
        }
    }


    private onNotifyPacketReservationBankerNotify(result: PacketReservationBankerNotify) {
        //有人上庄，更新队列
        this.updateBankerList(result.banker_list);
    }
    private onNotifyPacketUnderBankerNotify(result: PacketUnderBankerNotify) {
        //有人下庄，进入队列
        this.updateBankerList(result.banker_list);
    }
    private onNotifyPacketBankerNotify(result: PacketBankerNotify) {
        //局里通知庄家
        this.gameData.bankerArea = result.area;
        this.gameData.bankerTotal = result.price;
        this.gameData.bankerName = result.nickname;
        this.updateBanker(this.enableFreeBanker?true:false);
    }

    private onNotifyPacketEndBankerNotify(result: PacketEndBankerNotify) {
        //通知下庄
        this.gameData.bankerArea = 0;
        this.gameData.bankerTotal = 0;
        this.gameData.bankerName = "";
        this.updateBanker(false);

        this.updateBankerList(result.banker_list);
    }

    private onNotifyPacketLackOfMoney(result: PacketLackOfMoneyNotify) {
        //请求续庄
        let that = this;
        let price: number = 10000;
        Director.getInstance().showConfirmDialog(result.msg, this.sound_on, this, function (confirmed: boolean) {
            if (confirmed) {
                let userInfo: UserInfo = ClientStorage.getUserInfo();
                if (Number(userInfo.balance) < price) {
                    Toast.launch("需要有" + price + "资金才能上庄");
                    return;
                }

                HttpEngine.getInstance().continueBanker(price, function (name: string, response: ResponseContinueBanker) {
                    Toast.launch(response.msg);
                }, that);
            }
        });
    }

    private onNotifyPacketContinueBanker(result: PacketContinueBankerNotify) {
        //续庄成功
        if(result.area!=NaN && result.area!=null)
        {
            this.gameData.bankerArea = result.area;
            this.gameData.bankerTotal = result.price;
            this.gameData.bankerName = result.nickname;
        }else
        {
            Toast.launch("服务器推送续庄数据错误，请联系管理员");
        }
        
        //更新庄的数据，但是不显示庄家
        //this.updateBanker(true);
    }

    private resetViews(stopTweens:boolean) {

        //停止动画
        if(stopTweens)
        {
            egret.Tween.removeTweens(this);
            egret.Tween.removeTweens(this.raceBgScroller.viewport);
            egret.Tween.removeTweens(this.startLineImage);
            egret.Tween.removeTweens(this.mainScroller);
            for (let i = 0; i < 10; i++) {
                // 停止赛车动画
                let raceCarGroup: eui.Group = this.raceCarGroupList[i];
                egret.Tween.removeTweens(raceCarGroup);
            }

            for(let i=0;i<10;i++)
            {
                let majiangImage = this.getMajiangImage(i);
                egret.Tween.removeTweens(majiangImage);
            }
        }      

        //清理下注信息
        this.gameData.reset();
        //清理筹码
        this.clearAllChipImages();
        //清理计分
        this.hideAllScoreLabel();
        this.hideAllSelfScoreLabel();
        //清理麻将点数
        this.hideAllPointLabel();
        //麻将隐藏
        this.hideAllMajiang();
        //排名隐藏
        this.hideAllRank();
        //显示大倒计时
        this.timeLabel.visible = true;

        //重置赛道位置
        this.raceBgScroller.viewport.scrollH = 920 * 20;
        this.raceBgScroller.visible = false;

        this.timeLabel.text = "";           //大倒计时
        this.stateTicketLabel.text = "";    //小倒计时
        this.totalBetLabel.text = "";       //总下注

        this.bankerNameLabel.text = "";     //庄家名字
        this.bankerPriceLabel.text = "";    //奖池
        this.bankerGroup.visible = false;   //

        if(!this.enableFreeBanker)
        {
            this.bankerListGroup.visible = false;
        }else
        {
            this.bankerListGroup.visible = true;
        }

        //重置赛车位置，在最右边
        for (let i = 0; i < 10; i++) {
            let raceCarGroup: eui.Group = this.raceCarGroupList[i];
            raceCarGroup.x = this.raceGroup.width - raceCarGroup.width;
        }
        //终点线初始化
        this.startLineImage.x = this.raceGroup.width - 120;

        if(this.codeCalculateTimer!=null)
        {
            this.codeCalculateTimer.stop();//先停止计算开奖位置，防止跑到终点归零    
        }
        
        if(this.sound_channel!=null)
        {
            this.sound_channel.stop();
        }

        this.totalBetLabel.text = "0";
        //this.selfTotalBetLabel.text = String(this.currentBet);
    }

    private switchStatus(processState: ProcessState) {
        if (this.processState == processState) {//状态不变就不动，防止joinRoom4的时候再次发socket的state4消息
            return;
        }

        switch (processState) {
            case ProcessState.ProcessStateWait:
                {//等待开始
                    this.resetViews(true);
                    this.updateBanker(false);
                    break;
                }
            case ProcessState.ProcessStateBeting:
                {//下注中
                    Toast.launch("开始下注");
                    break;
                }
            case ProcessState.ProcessStateBlocking:
                {//封盘中
                    this.updateBanker(false);
                    break;
                }
            case ProcessState.ProcessStateRun:
                {//启动赛车
                    this.updateBanker(false);
                    this.startRaceStepOneStart();
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
                        this.updateBanker(false);
                    }
                    break;
                }
        }
        this.processState = processState;
    }

    private getAreaLimit(area_id)
    {
        for(let i=0;i<this.gameData.area_limit.length;i++)
        {
            let areaLimitInfo:AreaLimitInfo = this.gameData.area_limit[i];
            if(areaLimitInfo.area == area_id)
            {
                return areaLimitInfo.total_limit;
            }
        }

        return 0;
    }
    
    private areaTouchHandler(evt: egret.TouchEvent): void {
        if (this.processState == ProcessState.ProcessStateWait) {
            //等待游戏开始，不能下注
            Toast.launch("等待游戏开始，请稍后下注");
            return;
        } else if (this.processState == ProcessState.ProcessStateBlocking) {
            //等待游戏开始，不能下注
            Toast.launch("封盘中，请稍后下注");
            return;
        } else if (this.processState != ProcessState.ProcessStateBeting)//最后保护状态
        {
            Toast.launch("当前不能下注,请等待游戏开始");
            return;
        }

        let target: eui.Image = evt.target;
        let area_id = Number(target.name.replace("area_image_", ""));
        if (this.gameData.bankerArea == area_id) {
            Toast.launch("庄家区域不能下注，请下注到其他区域");
            return;
        }

        //对area_id下注
        let selectedChip = this.getSelectedChip();
        if (selectedChip <= 0) {
            Toast.launch("请先选择下注的筹码");
            return;
        }

        if(this.gameData.bankerTotal>0 && this.gameData.totalBet+selectedChip>this.gameData.bankerTotal)
        {
            Toast.launch("不能下注超过奖池上限:"+this.gameData.bankerTotal);
            return;
        }

        let areaTotal:number = this.gameData.area_summary[area_id];
        let areaLimit = this.getAreaLimit(area_id);
        if(areaLimit>0 && areaTotal+selectedChip>areaLimit)
        {
            Toast.launch("不能下注超过单门上限:"+areaLimit);
            return;
        }

        let tip = "下注" + selectedChip + "到区域" + area_id;
        //Toast.launch(tip);
        Logger.log(tip);

        let that = this;
        if (this.local_test == 1) {//本地测试下注
            that.throwChip(area_id, selectedChip, false, true, true);
            this.updateChipVisibility(Number(area_id));
            that.gameData.currentBet += selectedChip;

            //this.selfTotalBetLabel.text = String(this.currentBet);
            let userInfo: UserInfo = ClientStorage.getUserInfo();
            that.balanceLabel.text = Number(userInfo.balance).toFixed(2);
            return;
        }
        if(CommonConfig.gameConfig.bet_confirm==1)
        {
            Director.getInstance().showConfirmDialog("确定下注吗？", this.sound_on, this, function (confirmed: boolean) {
                if (confirmed) {
                    that.sendBet(area_id, selectedChip);
                }
            });
        }else
        {
            this.sendBet(area_id, selectedChip);
        }
    }

    private sendBet(area_id, selectedChip)
    {
        let that = this;
        //下注
        HttpEngine.getInstance().sendBet(area_id, selectedChip, function (name: string, response: ResponseBet) {
            //下注结果
            if (response.error != 0) {
                Toast.launch(response.msg);
                //this.connectServer(); //not sure about what errors will hanppen here
            } else {
                //that.throwChip(area_id, selectedChip, false); //自己下注这里不做动画，因为socket会再推送一次
                that.gameData.currentBet += selectedChip;
                that.gameData.self_bet[area_id] += selectedChip;
                let selfScoreLabel: eui.Label = that.getAreaSelfScoreLabel(area_id);
                selfScoreLabel.text = String(that.gameData.self_bet[area_id]);

                //this.selfTotalBetLabel.text = String(this.currentBet);
                //userInfo.balance = userInfo.balance - selectedChip;
                if(that.gameData.lastUpdateBalanceTicket==0 ||
                    response.current_time>that.gameData.lastUpdateBalanceTicket)
                {
                    let userInfo: UserInfo = ClientStorage.getUserInfo();
                    userInfo.balance = response.balance;
                    ClientStorage.setUserInfo(userInfo);
                    that.balanceLabel.text = Number(userInfo.balance).toFixed(2);
                    that.gameData.lastUpdateBalanceTicket =response.current_time;
                }
            }
        }, this);
    }

    private showInitAnimation() {
        let needSound = true;
        let totalCount = 0;
        for (let row in this.gameData.betInfoList) {
            let betInfo = this.gameData.betInfoList[row];
            totalCount+=betInfo.count;
        }
        let needAnimation = totalCount<300?true:false;

        for (let row in this.gameData.betInfoList) {
            let betInfo = this.gameData.betInfoList[row];
            for (let i = 0; i < betInfo.count; i++) {
                this.throwChip(betInfo.area, betInfo.number, true, needSound, needAnimation);
                needSound = false;
            }
        }
        this.updateChipVisibility(1);
        this.updateChipVisibility(2);
        this.updateChipVisibility(3);
        this.updateChipVisibility(4);
        this.updateChipVisibility(5);
    }


    //投注筹码
    private throwChip(area_id, chip, is_init: boolean, needSound:boolean, needAnimation:boolean) {
        if (this.sound_on && needSound) {
            Director.getInstance().effectPlay("chip_bet_mp3");
        }

        let areaChipImageList:eui.Image[] = this.getChipImageList(area_id);

        let toggle: eui.ToggleSwitch = this.getChipToggle(chip);
        let targetGroup: eui.Group = this.getAreaGroup(area_id);
        let chipImageSource = this.getChipImageSource(chip);
        if (targetGroup == null) {
            return;
        }

        let fromX = 0;
        let fromY = 0;

        if (is_init) {
            fromX = this.groupBets.width
            fromY = this.groupBets.height;
        } else {
            if (toggle == null) {
                return;
            }

            fromX = toggle.x;
            fromY = toggle.y;

            let globalFromPoint = toggle.localToGlobal(fromX, fromY);
            let localFromPoint = this.groupBets.globalToLocal(globalFromPoint.x, globalFromPoint.y);
            //fromX = localFromPoint.x+toggle.width/2;//这个坐标有问题
            fromX = fromX + toggle.width / 2
            fromY = localFromPoint.y + toggle.height / 2;
        }


        let startX: number = targetGroup.x;          //左边界
        let endX: number = startX + targetGroup.width; //右边界
        let startY: number = targetGroup.y;          //上边界
        let endY: number = startY + targetGroup.height;//下边界

        let targetX: number = this.rand(startX + 30, endX - 30);
        let targetY: number = this.rand(startY + 30, endY - 30);


        let chipImage:eui.Image = null;
        if(areaChipImageList.length>this.areaChipShowCount)
        {
            chipImage = areaChipImageList.shift();
            this.groupBets.removeChild(chipImage);
        }else
        {
            chipImage = new eui.Image;
        }
        this.groupBets.addChild(chipImage);
        areaChipImageList.push(chipImage);

        chipImage.source = chipImageSource;
        chipImage.width = 50;
        chipImage.height = 50;
        chipImage.anchorOffsetX = 25;
        chipImage.anchorOffsetY = 25;
        chipImage.x = fromX;
        chipImage.y = fromY;
        chipImage.touchEnabled = false;
        
        chipImage.name = "chip_" + String(chip);


        if(needAnimation)
        {
            let tw = egret.Tween.get(chipImage);
            tw.to({ x: targetX, y: targetY }, 300);
        }else
        {
            chipImage.x = targetX;
            chipImage.y = targetY;
        }
    }

    //最多显示筹码数，0为此功能不开启
    private areaChipShowCount:number = CommonConfig.gameConfig.area_chip_show_count;
    private updateChipVisibility(areaId:number)
    {
        if(this.areaChipShowCount==0)
        {
            return;
        }

        let currentIndex = 0;
        //每个区域只显示前面150个币
        let chipImageList:eui.Image[] = this.getChipImageList(areaId);
        
        let firstShowIndex = chipImageList.length-this.areaChipShowCount;
        //查找筹码，200个之前的都隐藏
        for (let i = 0; i <chipImageList.length ; i++) {
            let image: eui.Image = chipImageList[i];
            if(i>=firstShowIndex)
            {
                image.visible = true;
            }else
            {
                image.visible = false;
            }
        }
    }

    private updateChipAllVisible(areaId)
    {
        if(this.areaChipShowCount==0)
        {
            return;
        }

        let chipImageList:eui.Image[] = this.getChipImageList(areaId);
        for (let i = 0; i <chipImageList.length ; i++) {
            let image: eui.Image = chipImageList[i];
            image.visible = true;
        }
    }

    //流程：先跑startRaceStepOneStart,开始往上跑
    //然后startRaceStepTwoRun跑出去，远一点
    //然后反复startRaceCircle，一直跑，直到状态为Conclude, startRaceStepThreeEnd冲到终点结算

    private concludeTimer: egret.Timer;//显示结算的timer
    private startRaceStepOneStart()//第二步，开始跑车
    {
        if (this.sound_on) {
            this.is_kaijiang = 1;
            this.sound_channel=Director.getInstance().soundPlay("car_mp3");
        }

        this.bankerListGroup.visible = false;
        
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

            let fireImage:eui.Image = this.getFireImage(i);
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

        let smallestRunTicket = 0;
        if(!this.needFastAnimation)
        {
            smallestRunTicket = 10;
        }else
        {
            smallestRunTicket = 5;
        }

        if (this.processState == ProcessState.ProcessStateRun || usedTicket < smallestRunTicket)//如果状态是run，或者跑了少于10秒，都继续跑
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

                let fireImage:eui.Image = this.getFireImage(i);
                if(raceCarGroup.x<rand)
                {
                    fireImage.visible = false;
                }else
                {
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

            let fireImage:eui.Image = this.getFireImage(i);
            fireImage.visible = true;
        }

        //1000ms后停止声音，2000ms后开启声音，过500ms后再停止声音
        let twStopSound = egret.Tween.get(this);
        // twStopSound.to({}, 1000).call(function(){
        //     that.sound_channel.stop();
        // }, this);
        twStopSound.to({}, 100).call(function(){
            if(that.sound_channel!=null)
            {
                that.sound_channel.stop();
            }
        }, this).to({}, 100).call(function(){
            if(that.sound_on)
            {
                that.sound_channel=Director.getInstance().soundPlay("car_mp3");
            }
        }, this).to({}, 500).call(function(){
            if(that.sound_channel!=null)
            {
                that.sound_channel.stop();
            }
        }, that);

        //终点线出现
        this.startLineImage.x = -20;
        let startLineImageTw = egret.Tween.get(this.startLineImage);
        startLineImageTw.to({}, 0).to({ x: 100 }, 500);

        let raceBgScrollerTw = egret.Tween.get(this.raceBgScroller.viewport);
        raceBgScrollerTw.to({ scrollH: this.raceBgScroller.viewport.scrollH - 500 }, runOneTime);

        //结算在3秒后开始
        let concludeTime = 3000;//1000;//8000;
        this.concludeTimer = new egret.Timer(concludeTime, 1);
        this.concludeTimer.addEventListener(egret.TimerEvent.TIMER, this.concludeTimerHandler, this);
        this.concludeTimer.start();
    }

    //开始结算，这时候开始显示麻将结果
    private concludeTimerHandler() {
        if (this.openResult == null) {
            Toast.launch("游戏状态出错，请退出房间再进");
            return;
        }

        let that = this;
        this.setOpenCodeWithStr(this.openResult.opencode);

        let delay = 0;
        let openCodeList = this.openResult.opencode.split(",");
        let areaRankList: AreaRank[] = new Array();//评分表
        //let rankAreaIdList = number[];//根据排名1-5的areaid列表

        for (let i = 0; i < 5; i++) {
            let code1 = Number(openCodeList[i * 2 + 0]);
            let code2 = Number(openCodeList[i * 2 + 1]);
            let value = code1 + code2;
            let checkedValue = value <= 10 ? value : (value - 10);
            let area = i + 1;

            let areaRank: AreaRank = new AreaRank();
            areaRank.area = area;
            areaRank.value = checkedValue;

            areaRankList.push(areaRank);

            this.showMajiangAnimation(code1, 0, area, delay);
            this.showMajiangAnimation(code2, 1, area, delay);

            let majiangAnimationTime = 0;
            if(!this.needFastAnimation)
            {
                majiangAnimationTime = 2500
            }else
            {
                majiangAnimationTime = 500
            }

            delay += majiangAnimationTime;
            let tw = egret.Tween.get(this);
            tw.to({}, delay).call(function () {
                let pointAreaLabel = that.getAreaPointLabel(area);
                pointAreaLabel.text = String(checkedValue) + " 点";
            })
        }

        //排序
        areaRankList.sort((a, b) => {
            if (a.value < b.value) {
                return -1;
            }
            if (a.value > b.value) {
                return 1;
            }
            return 0
        });

        let tw1 = egret.Tween.get(this);
        tw1.to({}, delay).call(function () {
            for (let i = 0; i < 5; i++) {
                let rank = i + 1;
                let areaRank: AreaRank = areaRankList[i];
                let rankImage = that.getRankImage(rank);
                let betGroup: eui.Group = that.getAreaGroup(areaRank.area);
                rankImage.x = betGroup.x;
                rankImage.y = betGroup.y;
                rankImage.visible = true;
            }

            that.showChipAnimation();
        });

    }

    //把所有的筹码都收到右下角去,只在无庄的时候才用
    private showChipAnimation() {

        this.sortChipImageList(this.chipImageList1);
        this.sortChipImageList(this.chipImageList2);
        this.sortChipImageList(this.chipImageList3);
        this.sortChipImageList(this.chipImageList4);
        this.sortChipImageList(this.chipImageList5);

        this.updateChipAllVisible(1);
        this.updateChipAllVisible(2);
        this.updateChipAllVisible(3);
        this.updateChipAllVisible(4);
        this.updateChipAllVisible(5);
        

        if (!this.settlementResult) {
            return;
        }

        let that = this;
        if (this.settlementResult.resultInfoNineNoBanker != null) {//无庄
            let delay = 0;
            let areaRemainList:number[] = [];
            areaRemainList[1] = this.gameData.area_summary[1];
            areaRemainList[2] = this.gameData.area_summary[1];
            areaRemainList[3] = this.gameData.area_summary[1];
            areaRemainList[4] = this.gameData.area_summary[1];
            areaRemainList[5] = this.gameData.area_summary[1];

            for (let win_row in this.settlementResult.resultInfoNineNoBanker.area) {//
                let winArea = this.settlementResult.resultInfoNineNoBanker.area[win_row];
                for (let lose_row in winArea.lose_areas) {
                    let loseArea = winArea.lose_areas[lose_row];

                    let loseAreaRemain = loseArea.bet - loseArea.result;
                    let winAreaRemain = winArea.bet + winArea.result;

                    if(loseAreaRemain>0)
                    {
                        let needMoveValue = areaRemainList[loseArea.area] / 2;
                        //移动一部分的币
                        this.showCoinAnimation(loseArea.area, winArea.area, needMoveValue, loseAreaRemain, winAreaRemain, delay);
                        areaRemainList[loseArea.area] = areaRemainList[loseArea.area] - needMoveValue;
                    }else
                    {
                        //移动全部的币,传0表示移动全部的币
                        this.showCoinAnimation(loseArea.area, winArea.area, 0, loseAreaRemain, winAreaRemain, delay);
                        areaRemainList[loseArea.area] = 0;
                    }
                    
                    let needDelay = 0;
                    if(!this.needFastAnimation)
                    {
                        needDelay = 800;
                    }else
                    {
                        needDelay = 200;
                    }
                    delay += needDelay;
                }
            }

            let that = this;
            //显示每个区域的最终金额
            let twShow = egret.Tween.get(this);
            twShow.to({}, delay).call(function () {
                for (let win_row in that.settlementResult.resultInfoNineNoBanker.area) {//
                    let winArea: ResultWinArea = that.settlementResult.resultInfoNineNoBanker.area[win_row];
                    for (let lose_row in winArea.lose_areas) {
                        let loseArea: ResultLoseArea = winArea.lose_areas[lose_row];

                        let loseAreaRemain = Number(loseArea.bet) - Number(loseArea.result);
                        let winAreaRemain = Number(winArea.bet) + Number(winArea.result);

                        let loseScoreLabel = that.getAreaScoreLabel(Number(winArea.area));
                        loseScoreLabel.text = String(loseAreaRemain);

                        let areaScoreLabel = that.getAreaScoreLabel(Number(loseArea.area));
                        areaScoreLabel.text = String(winAreaRemain);
                    }
                }
            });
            delay += 1000;

            //隐藏筹码

            if (this.chipImageList1.length > 0) {
                let twDelay1 = egret.Tween.get(this);
                twDelay1.to({}, delay).call(function () { that.animationRemoveChipImageList(that.chipImageList1, 800); });
                delay += 800;
            }
            if (this.chipImageList2.length > 0) {
                let twDelay2 = egret.Tween.get(this);
                twDelay2.to({}, delay).call(function () { that.animationRemoveChipImageList(that.chipImageList2, 800); });
                delay += 800;
            }
            if (this.chipImageList3.length > 0) {
                let twDelay3 = egret.Tween.get(this);
                twDelay3.to({}, delay).call(function () { that.animationRemoveChipImageList(that.chipImageList3, 800); });
                delay += 800;
            }
            if (this.chipImageList4.length > 0) {
                let twDelay1 = egret.Tween.get(this);
                twDelay1.to({}, delay).call(function () { that.animationRemoveChipImageList(that.chipImageList4, 800); });
                delay += 800;
            }
            if (this.chipImageList5.length > 0) {
                let twDelay5 = egret.Tween.get(this);
                twDelay5.to({}, delay).call(function () { that.animationRemoveChipImageList(that.chipImageList5, 800); });
                delay += 800;
            }

            delay += 1000;
            let tw = egret.Tween.get(this);
            tw.to({}, delay).call(function () {
                that.goOpenConcludeDialog();
            });

        } else if (this.settlementResult.resultInfoNineHaveBanker != null) {//有庄
            let delay = 0;
            let bankArea: number = this.settlementResult.resultInfoNineHaveBanker.bank_area;

            for (let area_row in this.settlementResult.resultInfoNineHaveBanker.area) {
                let area: ResultClientArea = this.settlementResult.resultInfoNineHaveBanker.area[area_row];
                let winAreaRemain = this.settlementResult.resultInfoNineHaveBanker.banker;
                let loseAreaRemain = area.bet - area.result;

                //如果玩家赢了，就移动到右下角，如果庄家赢了，就移动到左上角
                let bankerX = this.becomeBankerButton.x + this.becomeBankerButton.width / 2;
                let bankerY = this.becomeBankerButton.y + this.becomeBankerButton.height / 2;
                let playerX = this.playerListImage.x + this.playerListImage.width / 2;
                let playerY = this.playerListImage.y + this.playerListImage.height / 2;
                //庄家是全赢全输，不存在只输赢一半的情况，所以就不管有多少隐藏了，用全额移动，移动完筹码就行
                if (area.result > 0) {
                    //移动投的币
                    this.showCoinAnimationToPos(area.area, playerX, playerY, area.result, delay, true);//移动后隐藏
                } else if (area.result < 0) {
                    this.showCoinAnimationToPos(area.area, bankerX, bankerY, 0 - area.result, delay, true);//移动后隐藏
                }

                let needDelay = 0;
                if(!this.needFastAnimation)
                {
                    needDelay = 800;
                }else
                {
                    needDelay = 200;
                }
                delay += needDelay;
            }
            //不显示区域最终金额，也不需要归集筹码了

            delay += 1000;
            let tw = egret.Tween.get(this);
            tw.to({}, delay).call(function () {
                that.goOpenConcludeDialog();
            });
        }
    }

    //取消下注，玩家自己的筹码归集到左下角
    private animationCancleRemoveChipImageList(chipImageList: eui.Image[], needTime: number) {
        let toX = this.balanceLabel.x + this.balanceLabel.width / 2;
        let toY = this.balanceLabel.y + this.balanceLabel.height / 2;
        //所有筹码归集到左下角
        for (let row in chipImageList) {
            let chipImage: eui.Image = chipImageList[row];
            let tw = egret.Tween.get(chipImage);
            tw.to({ x: toX, y: toY }, needTime);
            let delay=800;
            let tw1 = egret.Tween.get(this);
            tw.to({}, delay).call(function () {
                chipImage.visible=false;
            });
            
        }
        
    }

    private animationRemoveChipImageList(chipImageList: eui.Image[], needTime: number) {
        let toX = this.playerListImage.x + this.playerListImage.width / 2;
        let toY = this.playerListImage.y + this.playerListImage.height / 2;
        //所有筹码归集到右下角
        for (let row in chipImageList) {
            let chipImage: eui.Image = chipImageList[row];
            let tw = egret.Tween.get(chipImage);
            tw.to({ x: toX, y: toY }, needTime);
        }
    }

    private goOpenConcludeDialog() {
        this.reloadUserInfo();

        //弹出结算框，重置游戏状态到等待阶段
        this.concludeHandler();
        this.switchStatus(ProcessState.ProcessStateWait);

    }

    private showCoinAnimation(fromArea: number, toArea: number, needMoveValue, loseAreaRemain: number, winAreaRemain: number, delay: number) {
        if (this.sound_on) {
            Director.getInstance().soundPlay("chip_more_mp3");
        }
        let remainValue = needMoveValue;

        let chipImageList = this.getChipImageList(fromArea);
        //循环查找输的区域里的硬币，移动到赢的区域去
        for (let i = chipImageList.length - 1; i >= 0; i--) {
            let image: eui.Image = chipImageList[i];
            let chip = Number(image.name.replace("chip_", ""));
            if (chip <= remainValue || needMoveValue==0) {//如果needMoveValue为0，表示全部移动一个不剩
                this.moveChip(image, toArea, delay);
                chipImageList.pop();
                let toChipImageList = this.getChipImageList(toArea);
                toChipImageList.push(image);
                remainValue -= chip;
            }
        }

        /*
        let that = this;
        //显示此区域的最终金额
        let tw = egret.Tween.get( this );
        tw.to({}, delay).call(function(){
            let loseScoreLabel = that.getAreaScoreLabel(fromArea);
            loseScoreLabel.text = String(loseAreaRemain);

            let areaScoreLabel = that.getAreaScoreLabel(toArea);
            areaScoreLabel.text = String(winAreaRemain);
        });
        */
    }

    private showCoinAnimationToPos(fromArea: number, toX: number, toY: number, needMoveValue: number, delay: number, needHideAtLast: boolean) {
        if (this.sound_on) {
            Director.getInstance().soundPlay("chip_more_mp3");
        }
        let remainValue = needMoveValue;
        let chipImageList = this.getChipImageList(fromArea);
        //循环查找输的区域里的硬币，移动到赢的区域去
        for (let i = chipImageList.length - 1; i >= 0; i--) {
            let image: eui.Image = chipImageList[i];
            let chip = Number(image.name.replace("chip_", ""));
            if (chip <= remainValue) {
                this.moveChipToPos(image, toX, toY, delay, needHideAtLast);
                chipImageList.pop();
                let toChipImageList = this.getChipImageList(0);//加入到公共区域
                toChipImageList.push(image);
                remainValue -= chip;
            }
        }

        //有庄家的时候，分数不显示了
        let areaScoreLabel = this.getAreaScoreLabel(fromArea);
        areaScoreLabel.text = "";

        let areaSelfScoreLabel = this.getAreaSelfScoreLabel(fromArea);
        areaSelfScoreLabel.text = "";
    }

    private moveChip(chipImage: eui.Image, toArea: number, delay: number) {
        let targetGroup: eui.Group = this.getAreaGroup(toArea);
        let startX: number = targetGroup.x;          //左边界
        let endX: number = startX + targetGroup.width; //右边界
        let startY: number = targetGroup.y;          //上边界
        let endY: number = startY + targetGroup.height;//下边界

        let targetX: number = this.rand(startX + 30, endX - 30);
        let targetY: number = this.rand(startY + 30, endY - 30);
        this.moveChipToPos(chipImage, targetX, targetY, delay, false);
    }

    private moveChipToPos(chipImage: eui.Image, targetX: number, targetY: number, delay: number, needHideAtLast: boolean) {
        let tw = egret.Tween.get(chipImage);

        let moveTime = 0;
        if(!this.needFastAnimation)
        {
            moveTime = 500;
        }else
        {
            moveTime = 100;
        }

        let twRun = tw.to({}, delay).to({ x: targetX, y: targetY }, moveTime);
        if (needHideAtLast) {
            twRun.to({ visible: false }, 100);
        }
    }


    //pos0表示左边否则右边
    private showMajiangAnimation(point: number, pos: number, area: number, delay: number) {
        let smallWidth = 50;
        let smallHeight = 75;
        let xPos = pos == 0 ? (this.group_bet_1.x) : (this.group_bet_1.x + this.group_bet_1.width);
        let fromXPos = pos == 0 ? 800 : 1050;
        let betGroup: eui.Group = this.getAreaGroup(area);

        let majiangImage = this.getMajiangImage(point);
        let tempMajiangSource = majiangImage.source;
        majiangImage.visible = true;
        majiangImage.width = 100;
        majiangImage.height = 150;
        majiangImage.anchorOffsetX = 50;
        majiangImage.anchorOffsetY = 75;
        majiangImage.x = fromXPos;
        majiangImage.y = -100;
        majiangImage.source = "majiang_bg_png";//majiang_7_png
        this.groupCenter.addChild(majiangImage);

        let majiangTimeXMove = 0;
        let majiangTimeFlip = 0;
        let majiangTimeDelay = 0;
        let majiangTimeDown = 0;
        if(!this.needFastAnimation)
        {
            majiangTimeXMove = 1000;
            majiangTimeFlip = 500;
            majiangTimeDelay = 300;
            majiangTimeDown = 500;
        }else
        {
            majiangTimeXMove = 200;
            majiangTimeFlip = 100;
            majiangTimeDelay = 100;
            majiangTimeDown = 100;
        }
        

        let that = this;
        let tw1TargetX = pos == 0 ? betGroup.x +smallWidth: betGroup.x + smallWidth*2;
        let tw1TargetY = betGroup.y + betGroup.height;
        let tw1 = egret.Tween.get(majiangImage);
        tw1.to({}, delay).to({ x: xPos }, majiangTimeXMove).to({ source: tempMajiangSource, skewY: 360 }, majiangTimeFlip).to({}, majiangTimeDelay).
            to({ x: tw1TargetX, y: tw1TargetY, width: smallWidth, height: smallHeight }, majiangTimeDown);
    }

    private rand(start, end) {
        return Math.floor(Math.random() * (end - start) + start);
    }

    private showLeft() {
        //Logger.log("左边! direction:"+this.direction+"  lastX:"+this.lastX+" currentX:"+this.currentX);
        let that = this;
        let tw = egret.Tween.get(this.mainScroller.viewport);
        tw.to({ scrollH: 0 }, 200).call(function () {

        });

        this.btnMsg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChatDlg, this);

    }
    public chatGroup: eui.Group;
    public ChatNum = 0;
    private onChatDlg(evt: egret.TouchEvent): void {
        let message = this.MsgText.text;
        Logger.log(message);
        HttpEngine.getInstance().sendTalk(message, function (name: string, response: ResponseTalk) {

            if (response.error != 0) {
                Toast.launch(response.msg);
            }
        }, this);
    }
    private StartTalk(packet: PacketTalk) {

        if (packet.msg != "") {
            this.ChatNum += 1;

            for (let i = this.ChatNum; i <= this.ChatNum; ++i) { 
                let msgSkin: eui.Button = new eui.Button();
                msgSkin.skinName = "resource/skins/scene/MsgDlg.exml";
                let MsgGroup: eui.Group = msgSkin.getChildByName("MsgGroup") as (eui.Group);

                let UsereName: eui.Label = MsgGroup.getChildByName("UsereName") as (eui.Label);
                UsereName.text = packet.nickname + ":";

                let MsgLabel: eui.Label = MsgGroup.getChildByName("MsgLabel") as (eui.Label);   
                let MsgImage: eui.Image = MsgGroup.getChildByName("MsgImage") as (eui.Image);
                MsgLabel.text = packet.msg;

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
                this.MsgText.text = "";
            }
        }
    }
    private showCenter() {
        //Logger.log("中间! direction:"+this.direction+"  lastX:"+this.lastX+" currentX:"+this.currentX);
        let that = this;
        let tw = egret.Tween.get(this.mainScroller.viewport);
        tw.to({ scrollH: 0 }, 200).call(function () {

        });
    }
    // public UserId: eui.Label;               //用户ID
    // public TehUser: eui.Label;              //用户账号
    // public UserName:eui.Label;              //玩家姓名
    // public GoldNum: eui.Label;              //用户金币
    // public NoerList:eui.Label;              //期数列表
    // public NoerGold:eui.Label;              //期数金币
    private showRight() {
        let that = this;
        //Logger.log("右边! direction:"+this.direction+"  lastX:"+this.lastX+" currentX:"+this.currentX);
        let tw = egret.Tween.get(this.mainScroller.viewport);
        tw.to({ scrollH: 500 }, 200).call(function () {
            that.reloadBetLogList();
        });
        let userInfo: UserInfo = ClientStorage.getUserInfo();
        this.UserId.text = userInfo.id;
        this.TehUser.text = userInfo.user_name;
        this.UserName.text = userInfo.nickname;
        this.GoldNum.text = Number(userInfo.balance).toFixed(2);
        let title = DataEngine.getInstance().getExpectInfo(this.gameId);
        this.FreezingGoldNum.text = "（冻结:" + userInfo.freeze_price + "）";
        this.NoerList.text = "第" + title.expect + "期";

    }

    private onTouchEend(evt: egret.TouchEvent): void {
        let newScene: RoomScene = new RoomScene();
        Director.getInstance().pushScene(newScene);
    }

    //音效开关
    private soundChangeControlHandler(): void {
        let soundImage: eui.Image = this.soundButton.getChildByName("soundImage") as eui.Image;
        //Logger.log("soundImage-------------------------" + soundImage.source);
        if (soundImage.source == "sound_off_png") {
            this.sound_on = 1;
        } else {
            this.sound_on = 0;
            //停止音效播放
            Director.getInstance().soundClose();
        }

    }

    //其他玩家取消下注，撤回筹码
    private backBetHandler():void{
        if(this.packetBackBet){
            let delay=0;
            let that=this;
            let chipCancleImageList1 = new Array();
                let chipCancleImageList2 = new Array();
                let chipCancleImageList3 = new Array();
                let chipCancleImageList4 = new Array();
                let chipCancleImageList5 = new Array();
                let totalSelfBet:number=0;
                let betBetInfo:BetInfo[]=this.packetBackBet.rows;
                for(let i=0;i<betBetInfo.length;i++){
                    let area=betBetInfo[i]['area'];
                    let number=betBetInfo[i]['number'];
                    let area_count=betBetInfo[i]['count'];
                    let count:number=0;
                    let chipImageList = this.getChipImageList(area);
                        for (let j = chipImageList.length - 1; j >= 0; j--) {
                            let image: eui.Image = chipImageList[j];
                            let chip = Number(image.name.replace("chip_", ""));
                            if(chip==number&&count<area_count){
                                chipImageList.pop();
                                totalSelfBet+=chip;
                                count++;
                                this.setareaSelfbet(area,chip);
                                if(area==1){
                                    chipCancleImageList1.push(image);
                                }else if(area==2){
                                    chipCancleImageList2.push(image);
                                }else if(area==3){
                                    chipCancleImageList3.push(image);
                                }else if(area==4){
                                    chipCancleImageList4.push(image);
                                }else if(area==5){
                                    chipCancleImageList5.push(image);
                                }
                                
                            }else if(count==area_count){
                                break;
                            }
                        }
                }

                //更新区域下注
                for(var i=0;i<5;i++){
                    let area=i+1;
                    let areaSelfBet=this.getareaSelfbet(area);
                    let areaScoreLabel = this.getAreaScoreLabel(area);
                    this.gameData.area_summary[area] -= areaSelfBet;
                    areaScoreLabel.text = (Number(areaScoreLabel.text)-areaSelfBet!=0)?String(Number(areaScoreLabel.text)-areaSelfBet):"";

                    //清零
                    this.setareaSelfbet(area,-areaSelfBet);
                }
                //更新总下注金额
                this.totalBetLabel.text = String(Number(this.totalBetLabel.text)-totalSelfBet);
                
                this.sortChipImageList(chipCancleImageList1);
                this.sortChipImageList(chipCancleImageList2);
                this.sortChipImageList(chipCancleImageList3);
                this.sortChipImageList(chipCancleImageList4);
                this.sortChipImageList(chipCancleImageList5);

                if (chipCancleImageList1.length > 0) {
                        let twDelay1 = egret.Tween.get(this);
                        twDelay1.to({}, delay).call(function () { that.animationRemoveChipImageList(chipCancleImageList1, 800); });
                        delay += 0;
                    }
                    if (chipCancleImageList2.length > 0) {
                        let twDelay2 = egret.Tween.get(this);
                        twDelay2.to({}, delay).call(function () { that.animationRemoveChipImageList(chipCancleImageList2, 800); });
                        delay += 0;
                    }
                    if (chipCancleImageList3.length > 0) {
                        let twDelay3 = egret.Tween.get(this);
                        twDelay3.to({}, delay).call(function () { that.animationRemoveChipImageList(chipCancleImageList3, 800); });
                        delay += 0;
                    }
                    if (chipCancleImageList4.length > 0) {
                        let twDelay1 = egret.Tween.get(this);
                        twDelay1.to({}, delay).call(function () { that.animationRemoveChipImageList(chipCancleImageList4, 800); });
                        delay += 0;
                    }
                    if (chipCancleImageList5.length > 0) {
                        let twDelay5 = egret.Tween.get(this);
                        twDelay5.to({}, delay).call(function () { that.animationRemoveChipImageList(chipCancleImageList5, 800); });
                        delay += 0;
                    }
        }
    }

    //确定下注
    private sureBetHandler():void{
        //隐藏投注的确定和取消
        let that=this;
        HttpEngine.getInstance().confirmBet(function (name: string, response: ResponseConfirmBet) {
            if(response.error==0){
                this.showCancleBet=0;
                this.sureBetGroup.visible=false;
                this.cancleBetGroup.visible=false;
            }else{
                Toast.launch(response.msg);
            }
        },that);
        
    }

    private cancleBetDialog():void{
        if (this.sound_on) {
            Director.getInstance().effectPlay("click_mp3");
        }
        let that=this;
        Director.getInstance().showConfirmDialog("您确定要取消下注吗？", this.sound_on, this, function (confirmed: boolean) {
            if (confirmed) {
               that.cancleBetHandler();
            }
        });
    }

    //取消下注
    private cancleBetHandler(){
        let delay=0;
        let that=this;
        let chipCancleImageList1 = new Array();
                let chipCancleImageList2 = new Array();
                let chipCancleImageList3 = new Array();
                let chipCancleImageList4 = new Array();
                let chipCancleImageList5 = new Array();
                let totalSelfBet:number=0;
        HttpEngine.getInstance().cancleBet(function (name: string, response: ResponseCancleBet) {
                let betBetInfo:BetInfo[]=response.rows;
                for(let i=0;i<betBetInfo.length;i++){
                    let area=betBetInfo[i]['area'];
                    let number=betBetInfo[i]['number'];
                    let area_count=betBetInfo[i]['count'];
                    let count:number=0;
                    let chipImageList = this.getChipImageList(area);
                        for (let j = chipImageList.length - 1; j >= 0; j--) {
                            let image: eui.Image = chipImageList[j];
                            let chip = Number(image.name.replace("chip_", ""));
                            if(chip==number&&count<area_count){
                                chipImageList.pop();
                                totalSelfBet+=chip;
                                count++;
                                this.setareaSelfbet(area,chip);
                                if(area==1){
                                    chipCancleImageList1.push(image);
                                }else if(area==2){
                                    chipCancleImageList2.push(image);
                                }else if(area==3){
                                    chipCancleImageList3.push(image);
                                }else if(area==4){
                                    chipCancleImageList4.push(image);
                                }else if(area==5){
                                    chipCancleImageList5.push(image);
                                }
                                
                            }else if(count==area_count){
                                break;
                            }
                        }
                }
                //更新区域总下注和区域个人下注
                for(var i=0;i<5;i++){
                    let area=i+1;
                    let areaSelfBet=this.getareaSelfbet(area);
                    let areaScoreLabel = this.getAreaScoreLabel(area);
                    this.gameData.area_summary[area] -= areaSelfBet;
                    areaScoreLabel.text = (Number(areaScoreLabel.text)-areaSelfBet!=0)?Number(areaScoreLabel.text)-areaSelfBet:"";

                    let areaSelfScoreLabel = this.getAreaSelfScoreLabel(area);
                    this.gameData.self_bet[area] -= areaSelfBet;
                    areaSelfScoreLabel.text = (Number(areaSelfScoreLabel.text)-areaSelfBet!=0)?Number(areaSelfScoreLabel.text)-areaSelfBet:"";
                    //清零
                    this.setareaSelfbet(area,-areaSelfBet);
                }
                //更新总下注金额
                this.totalBetLabel.text = String(Number(this.totalBetLabel.text)-totalSelfBet);

                this.sortChipImageList(chipCancleImageList1);
                this.sortChipImageList(chipCancleImageList2);
                this.sortChipImageList(chipCancleImageList3);
                this.sortChipImageList(chipCancleImageList4);
                this.sortChipImageList(chipCancleImageList5);

                if (chipCancleImageList1.length > 0) {
                        let twDelay1 = egret.Tween.get(this);
                        twDelay1.to({}, delay).call(function () { that.animationCancleRemoveChipImageList(chipCancleImageList1, 800); });
                        delay += 0;
                    }
                    if (chipCancleImageList2.length > 0) {
                        let twDelay2 = egret.Tween.get(this);
                        twDelay2.to({}, delay).call(function () { that.animationCancleRemoveChipImageList(chipCancleImageList2, 800); });
                        delay += 0;
                    }
                    if (chipCancleImageList3.length > 0) {
                        let twDelay3 = egret.Tween.get(this);
                        twDelay3.to({}, delay).call(function () { that.animationCancleRemoveChipImageList(chipCancleImageList3, 800); });
                        delay += 0;
                    }
                    if (chipCancleImageList4.length > 0) {
                        let twDelay1 = egret.Tween.get(this);
                        twDelay1.to({}, delay).call(function () { that.animationCancleRemoveChipImageList(chipCancleImageList4, 800); });
                        delay += 0;
                    }
                    if (chipCancleImageList5.length > 0) {
                        let twDelay5 = egret.Tween.get(this);
                        twDelay5.to({}, delay).call(function () { that.animationCancleRemoveChipImageList(chipCancleImageList5, 800); });
                        delay += 0;
                    }
                    
                    //更新账户余额
                    if(that.gameData.lastUpdateBalanceTicket==0 ||
                        response.current_time>that.gameData.lastUpdateBalanceTicket)
                    {
                        let userInfo: UserInfo = ClientStorage.getUserInfo();
                        userInfo.balance = response.balance;
                        ClientStorage.setUserInfo(userInfo);
                        that.balanceLabel.text = Number(userInfo.balance).toFixed(2);
                        that.gameData.lastUpdateBalanceTicket =response.current_time;
                    }
                    //this.balanceLabel.text=Number(Number(this.balanceLabel.text)+totalSelfBet).toFixed(2);
                    //var userInfo: UserInfo = ClientStorage.getUserInfo();
                    //userInfo.balance = Number(userInfo.balance + totalSelfBet).toFixed(2);
                    //ClientStorage.setUserInfo(userInfo);
                    this.showCancleBet=0;
                    this.cancleBetGroup.visible=false;
                    this.sureBetGroup.visible=false;
                    this.showCancleBetTicket=0;
                    this.showCancleBetRemainTime=15;
        }, that);
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
        Director.getInstance().showRuleNineDialog(this, "rewardResult", "nine", this.sound_on,this.gameId,this.roomInfo.is_official);
    }

    private onRuleHandler(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            Director.getInstance().effectPlay("click_mp3");
        }
        Director.getInstance().showRuleNineDialog(this, "gameRule", "nine", this.sound_on,this.gameId,this.roomInfo.is_official);
    }

    private onPlayerListHandler(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            Director.getInstance().effectPlay("click_mp3");
        }
        //每次打开重新请求房间玩家数据
        let that=this;
        HttpEngine.getInstance().getRoomStaffs(function (name: string, response: ResponseRoomStaff) {
            this.staffList=[];
            for (let row in response.rows) {
                //清空旧数据
                let item: RoomStaff = response.rows[row];
                that.appendStaff(item.nickname);
            }
            Director.getInstance().showPlayerListDialog(this, this.staffList, this.gameId, this.roomId, "nine", this.sound_on);
        }, this);
        
    }

    //上一页
    private lastPageHandler(){
        if(this.currentPageLabel.text=="1"){
            return;
        }
        let todayTicket = Number(new Date());
        let ticketNeed = todayTicket;
            let dateNeed:Date = new Date(ticketNeed);
            let year = String(dateNeed.getFullYear());
            let month = (dateNeed.getMonth()+1)>=10?String(dateNeed.getMonth()+1):"0"+String(dateNeed.getMonth()+1);
            let date = (dateNeed.getDate())>=10?String(dateNeed.getDate()):"0"+String(dateNeed.getDate());
            let dateStr = year+"-"+month+"-"+date;
            this.page--;
        this.reloadBetLogList();
    }

    //下一页
    private nextPageHandler(){
        if(this.currentPageLabel.text==this.totalPageLabel.text){
            return;
        }
        let todayTicket = Number(new Date());
        let ticketNeed = todayTicket;
            let dateNeed:Date = new Date(ticketNeed);
            let year = String(dateNeed.getFullYear());
            let month = (dateNeed.getMonth()+1)>=10?String(dateNeed.getMonth()+1):"0"+String(dateNeed.getMonth()+1);
            let date = (dateNeed.getDate())>=10?String(dateNeed.getDate()):"0"+String(dateNeed.getDate());
            let dateStr = year+"-"+month+"-"+date;
            this.page++;
        this.reloadBetLogList();
    }

    private betLogsCount;
    private reloadBetLogList() {
        let date: Date = new Date();
        let that = this;
        let year=String(date.getFullYear());
        let month=(date.getMonth() + 1 < 10)?"0"+String(date.getMonth() + 1):String(date.getMonth() + 1) ;
        let day=(date.getDate()<10)?"0"+String(date.getDate()):String(date.getDate());
        let dateStr = year+"-"+month+"-"+day;

        //四海定制，个人中心显示今日龙虎下注额
        let channelName = CommonConfig.getChannelName();
        if(channelName=='shpk10'){
            //获取今日龙虎下注额
            that.todayLonghuResultLabel.visible=true;
            let room_id:Number=4;//龙虎固定房间id
            HttpEngine.getInstance().getLonghuBet(room_id, dateStr, function (name: string, response: ResponseLonghuBet) {
                that.todayLonghuResultLabel.text = "今日龙虎下注额：" + String(response.total) + "筹码";
            }, that);
        }else{
            that.todayLonghuResultLabel.visible=false;
            that.todayResultLabel.y=891.66;
        }


        this.betLogGroup.removeChildren();
        let all  = 1;
        let room_names=['牌九','牛牛','推筒子','龙虎','龙虎斗','单张','猴赛雷','PC蛋蛋'];
        HttpEngine.getInstance().getBetLog(all, dateStr, this.page,this.row,function (name: string, response: ResponseBetLogs) {
            this.currentPageLabel.text=this.page;
            let count=response.count!=null?response.count:0;
            this.totalPageLabel.text=Math.ceil(count/this.row);
            this.betLogsCount=response.rows.length!=null?response.rows.length:0;
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
                    let men_1_label: eui.Label = detailsMainGroup.getChildByName("men_1_label") as (eui.Label);
                    let men_2_label: eui.Label = detailsMainGroup.getChildByName("men_2_label") as (eui.Label);
                    let men_3_label: eui.Label = detailsMainGroup.getChildByName("men_3_label") as (eui.Label);
                    let men_4_label: eui.Label = detailsMainGroup.getChildByName("men_4_label") as (eui.Label);
                    let men_5_label: eui.Label = detailsMainGroup.getChildByName("men_5_label") as (eui.Label);

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
                }else if (betLogInfo['room_name'].indexOf(room_names[6]) >= 0) {//猴赛雷投注明细
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
                
                /*let betCellGroup: eui.Group = betInfoCell.getChildByName("betCellGroup") as (eui.Group);
                let nameLabel: eui.Label = betCellGroup.getChildByName("betNameLabel") as (eui.Label);
                let valueLabel: eui.Label = betCellGroup.getChildByName("betValueLabel") as (eui.Label);

                nameLabel.text = betLogInfo.mark.replace(/<\/br>/g, "\r\n").trim();
                valueLabel.text = "本局收益：" + String(betLogInfo.result);*/

                if(i==1){
                    betInfoCell.height=80;
                    betCellGroup.height=80;
                    detailCellBgImage.height=80;
                    detailsShowImage.source="details_close_png";
                    detailsMainGroup.visible=false;
                    betInfoCell.x = 0;
                    betInfoCell.y = 260;
                } else if(i > 1){
                    betInfoCell.height=80;
                    betCellGroup.height=80;
                    detailCellBgImage.height=80;
                    detailsShowImage.source="details_close_png";
                    detailsMainGroup.visible=false;
                    betInfoCell.x = 0;
                    betInfoCell.y = 260+90 * (i-1);
                }else{
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

    private onTouchShowDetails(evt:egret.TouchEvent):void{
         Director.getInstance().effectPlay("click_mp3");
         let target: eui.Group = evt.currentTarget;
         let index_str = Number(target.name.replace("betInfoCell_", ""));
         let show_state=target.height==80?0:1;
         let betCellGroup: eui.Group = target.getChildByName("betCellGroup") as (eui.Group);
         let detailCellBgImage: eui.Image = betCellGroup.getChildByName("detailCellBgImage") as (eui.Image);
         let detailsHeadGroup: eui.Group = betCellGroup.getChildByName("detailsHeadGroup") as (eui.Group);
         let detailsMainGroup: eui.Group = betCellGroup.getChildByName("detailsMainGroup") as (eui.Group);
         let detailsShowImage:eui.Image = detailsHeadGroup.getChildByName("detailsShowImage") as (eui.Image);
         if(show_state==1){
             //当前展开，点击隐藏
             target.height=80;
             betCellGroup.height=80;
             detailCellBgImage.height=80;
             detailsShowImage.source="details_close_png";
             detailsMainGroup.visible=false;
             for(let i=index_str+1;i<this.betLogsCount;i++){
                let betInfoCell=this.betLogGroup.getChildByName("betInfoCell_"+i) as (eui.Group);
                betInfoCell.y=betInfoCell.y-180;Logger.log("betInfoCell================="+betInfoCell.y);
            }
         }else{
             //当前隐藏，点击展开
             target.height=250;
             betCellGroup.height=250;
             detailCellBgImage.height=250;
             detailsShowImage.source="details_open_png";
             detailsMainGroup.visible=true;
             for(let i=index_str+1;i<this.betLogsCount;i++){
                let betInfoCell=this.betLogGroup.getChildByName("betInfoCell_"+i) as (eui.Group);
                betInfoCell.y=betInfoCell.y+180;Logger.log("betInfoCell================="+betInfoCell.y);
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

    private concludeHandler(): void {
        if (this.settlementResult == null) {
            Toast.launch("暂无结算信息");
            return;
        }

        if(this.enableFreeBanker)
        {
            this.bankerListGroup.visible = true;
        }
        
        let resultUserList: ResultUser[] = null;
        let bankerReward: number = 0;
        if (this.settlementResult.resultInfoNineNoBanker != null) {
            resultUserList = this.settlementResult.resultInfoNineNoBanker.users;
            bankerReward = 0;
        } else if (this.settlementResult.resultInfoNineHaveBanker != null) {
            resultUserList = this.settlementResult.resultInfoNineHaveBanker.users;
            bankerReward = this.settlementResult.resultInfoNineHaveBanker.banker;
        }
        Director.getInstance().showConcludeDialog(this, this.gameId, this.roomId, bankerReward, resultUserList, "nine", this.sound_on);
    }

    private backHandler(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            //停止开奖音效
            if (this.is_kaijiang && this.sound_channel!=null) {
                this.sound_channel.stop();
            }
            Director.getInstance().effectPlay("click_mp3");
        }
        let that = this;
        //Director.getInstance().showConfirmDialog("您的资金将在本局结算后返还，确定退出？", this, function(confirmed:boolean){
        //if(confirmed)
        //{
        HttpEngine.getInstance().leaveRoom(that.roomId, function (name: string, response: ResponseLeaveRoom) {
            
            //that.onPopScene();
            //SocketEngine.getInstance().removeEventListener(SocketEngine.EventNameBet, this.onPacketBet, this);
            //Director.getInstance().popScene();
            that.popScene();
            SocketEngine.getInstance().close();
            /*
            if (response.error == 0) {
                //todo: 这个提示打印不出来，待查
                //延迟打印错误消息
                let tw = egret.Tween.get(Director.getInstance().getCurrentScene());
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
    
    private getSelectedChip() {
        if (this.chip_toggle_1.selected)
            return 1;
        else if (this.chip_toggle_10.selected)
            return 10;
        else if (this.chip_toggle_50.selected)
            return 50;
        else if (this.chip_toggle_100.selected)
            return 100;
        else if (this.chip_toggle_500.selected)
            return 500;
        else if (this.chip_toggle_1000.selected)
            return 1000;
        else if (this.chip_toggle_5000.selected)
            return 5000;
        return 0;
    }

    private scoreLabelTouchHandler(evt:egret.TouchEvent): void{
        let area:number = 0;
        if(evt.target===this.score_label_1 || evt.target===this.score_self_label_1)
        {
            area = 1;
        }else if(evt.target===this.score_label_2 || evt.target===this.score_self_label_2)
        {
            area = 2;
        }else if(evt.target===this.score_label_3 || evt.target===this.score_self_label_3)
        {
            area = 3;
        }else if(evt.target===this.score_label_4 || evt.target===this.score_self_label_4)
        {
            area = 4;
        }else if(evt.target===this.score_label_5 || evt.target===this.score_self_label_5)
        {
            area = 5;
        }
        let that = this;
        HttpEngine.getInstance().getAreaBetList(area, function(name:string, response:ResponseAreaBetList){
            Director.getInstance().showAreaBetListDialog(that, response.rows, true);
        }, this);
    }
    private chipToggleTouchHandle(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            Director.getInstance().soundPlay("chip_click_mp3");
        }
        let selectedToggle = evt.target;
        if (!(selectedToggle === this.chip_toggle_1)) {
            this.chip_toggle_1.$setSelected(false);
        }

        if (!(selectedToggle === this.chip_toggle_10)) {
            this.chip_toggle_10.$setSelected(false);
        }

        if (!(selectedToggle === this.chip_toggle_50)) {
            this.chip_toggle_50.$setSelected(false);
        }

        if (!(selectedToggle === this.chip_toggle_100)) {
            this.chip_toggle_100.$setSelected(false);
        }

        if (!(selectedToggle === this.chip_toggle_500)) {
            this.chip_toggle_500.$setSelected(false);
        }

        if (!(selectedToggle === this.chip_toggle_1000)) {
            this.chip_toggle_1000.$setSelected(false);
        }

        if (!(selectedToggle === this.chip_toggle_5000)) {
            this.chip_toggle_5000.$setSelected(false);
        }
    }

    private getChipToggle(chip: number) {
        let toggle = null;
        switch (chip) {
            case 1:
                toggle = this.chip_toggle_1;
                break;
            case 10:
                toggle = this.chip_toggle_10;
                break;
            case 50:
                toggle = this.chip_toggle_50;
                break;
            case 100:
                toggle = this.chip_toggle_100;
                break;
            case 500:
                toggle = this.chip_toggle_500;
                break;
            case 1000:
                toggle = this.chip_toggle_1000;
                break;
            case 5000:
                toggle = this.chip_toggle_5000;
                break;
        }
        return toggle;
    }

    private getAreaGroup(area_id: number) {
        let targetGroup = null;
        switch (area_id) {
            case 1:
                targetGroup = this.group_bet_1;
                break;
            case 2:
                targetGroup = this.group_bet_2;
                break;
            case 3:
                targetGroup = this.group_bet_3;
                break;
            case 4:
                targetGroup = this.group_bet_4;
                break;
            case 5:
                targetGroup = this.group_bet_5;
                break;
        }
        return targetGroup;
    }

    private getAreaScoreLabel(area_id: number) {
        let scoreLabel: eui.Label = null;
        switch (area_id) {
            case 1:
                scoreLabel = this.score_label_1;
                break;
            case 2:
                scoreLabel = this.score_label_2;
                break;
            case 3:
                scoreLabel = this.score_label_3;
                break;
            case 4:
                scoreLabel = this.score_label_4;
                break;
            case 5:
                scoreLabel = this.score_label_5;
                break;
        }
        return scoreLabel;
    }

    private hideAllScoreLabel() {
        this.score_label_1.text = "";
        this.score_label_2.text = "";
        this.score_label_3.text = "";
        this.score_label_4.text = "";
        this.score_label_5.text = "";
    }

    private getAreaSelfScoreLabel(area_id: number) {
        let scoreLabel: eui.Label = null;
        switch (area_id) {
            case 1:
                scoreLabel = this.score_self_label_1;
                break;
            case 2:
                scoreLabel = this.score_self_label_2;
                break;
            case 3:
                scoreLabel = this.score_self_label_3;
                break;
            case 4:
                scoreLabel = this.score_self_label_4;
                break;
            case 5:
                scoreLabel = this.score_self_label_5;
                break;
        }
        return scoreLabel;
    }

    private hideAllSelfScoreLabel() {
        this.score_self_label_1.text = "";
        this.score_self_label_2.text = "";
        this.score_self_label_3.text = "";
        this.score_self_label_4.text = "";
        this.score_self_label_5.text = "";
    }

    private getAreaPointLabel(area: number) {
        switch (area) {
            case 1:
                return this.point_label_1;
            case 2:
                return this.point_label_2;
            case 3:
                return this.point_label_3;
            case 4:
                return this.point_label_4;
            case 5:
                return this.point_label_5;
        }
    }

    private hideAllPointLabel() {
        this.point_label_1.text = "";
        this.point_label_2.text = "";
        this.point_label_3.text = "";
        this.point_label_4.text = "";
        this.point_label_5.text = "";
    }

    private getChipImageSource(chip: number) {
        let chipImage = "";
        switch (chip) {
            case 1:
                chipImage = "money_1-2_png";
                break;
            case 10:
                chipImage = "money_10-2_png";
                break;
            case 50:
                chipImage = "money_50-2_png";
                break;
            case 100:
                chipImage = "money_100-2_png";
                break;
            case 500:
                chipImage = "money_500-2_png";
                break;
            case 1000:
                chipImage = "money_1000-2_png";
                break;
            case 5000:
                chipImage = "money_5000-2_png";
                break;
        }
        return chipImage;
    }

    private getMajiangImage(point: number) {
        switch (point) {
            case 0:
            case 10:
                return this.majiang_image_0;
            case 1:
                return this.majiang_image_1;
            case 2:
                return this.majiang_image_2;
            case 3:
                return this.majiang_image_3;
            case 4:
                return this.majiang_image_4;
            case 5:
                return this.majiang_image_5;
            case 6:
                return this.majiang_image_6;
            case 7:
                return this.majiang_image_7;
            case 8:
                return this.majiang_image_8;
            case 9:
                return this.majiang_image_9;
        }
    }

    private hideAllMajiang() {
        this.majiang_image_0.visible = false;
        this.majiang_image_1.visible = false;
        this.majiang_image_2.visible = false;
        this.majiang_image_3.visible = false;
        this.majiang_image_4.visible = false;
        this.majiang_image_5.visible = false;
        this.majiang_image_6.visible = false;
        this.majiang_image_7.visible = false;
        this.majiang_image_8.visible = false;
        this.majiang_image_9.visible = false;

        this.majiang_image_0.skewY = 0;
        this.majiang_image_1.skewY = 0;
        this.majiang_image_2.skewY = 0;
        this.majiang_image_3.skewY = 0;
        this.majiang_image_4.skewY = 0;
        this.majiang_image_5.skewY = 0;
        this.majiang_image_6.skewY = 0;
        this.majiang_image_7.skewY = 0;
        this.majiang_image_8.skewY = 0;
        this.majiang_image_9.skewY = 0;

    }

    private getRankImage(rank: number) {
        switch (rank) {
            case 1:
                return this.rank_image_1;
            case 2:
                return this.rank_image_2;
            case 3:
                return this.rank_image_3;
            case 4:
                return this.rank_image_4;
            case 5:
                return this.rank_image_5;
        }
    }

    private hideAllRank() {
        this.rank_image_1.visible = false;
        this.rank_image_2.visible = false;
        this.rank_image_3.visible = false;
        this.rank_image_4.visible = false;
        this.rank_image_5.visible = false;
    }

    private setareaSelfbet(area: number,chip:number) {
        switch (area) {
            case 1:
                this.areaSelfBet1+=chip;
                break;
            case 2:
                this.areaSelfBet2+=chip;
                break;
            case 3:
                this.areaSelfBet3+=chip;
                break;
            case 4:
                this.areaSelfBet4+=chip;
                break;
            case 5:
                this.areaSelfBet5+=chip;
                break;
        }
    }

    private getareaSelfbet(area: number) {
        switch (area) {
            case 1:
                return this.areaSelfBet1;
            case 2:
                return this.areaSelfBet2;
            case 3:
                return this.areaSelfBet3;
            case 4:
                return this.areaSelfBet4;
            case 5:
                return this.areaSelfBet5;
        }
    }

    private getChipImageList(area: number) {
        switch (area) {
            case 0://公共区域
                return this.chipImageList0;
            case 1:
                return this.chipImageList1;
            case 2:
                return this.chipImageList2;
            case 3:
                return this.chipImageList3;
            case 4:
                return this.chipImageList4;
            case 5:
                return this.chipImageList5;
        }
    }

    private sortChipImageList(chipImageList: eui.Image[]) {
        //排序chip
        chipImageList.sort((a, b) => {
            let valueA = Number(a.name.replace("chip_", ""));
            let valueB = Number(b.name.replace("chip_", ""));
            if (valueA < valueB) {
                return 1;
            }
            if (valueA > valueB) {
                return -1;
            }
            return 0
        });
    }
    private clearAllChipImages() {
        for (let i = 0; i <= 5; i++) { //6组
            let chipImageList: eui.Image[] = this.getChipImageList(i);
            for (let j = 0; j < chipImageList.length; j++) {
                let chipImage: eui.Image = chipImageList[j];
                if (chipImage.parent != null) {
                    chipImage.parent.removeChild(chipImage);
                }
            }
        }
        this.chipImageList0 = new Array();
        this.chipImageList1 = new Array();
        this.chipImageList2 = new Array();
        this.chipImageList3 = new Array();
        this.chipImageList4 = new Array();
        this.chipImageList5 = new Array();
    }

    private hideAllBanker() {
        this.banker_label_1.visible = false;
        this.banker_label_2.visible = false;
        this.banker_label_3.visible = false;
        this.banker_label_4.visible = false;
        this.banker_label_5.visible = false;
    }



    private setRaceLight(remainTicket: number) {
        // this.lightImage1.source = "light_2_png";
        // this.lightImage2.source = "light_2_png";
        // this.lightImage3.source = "light_2_png";
        // this.lightImage4.source = "light_2_png";
        // if (remainTicket <= 3)
        //     this.lightImage1.source = "light_1_png";
        // if (remainTicket <= 2)
        //     this.lightImage2.source = "light_1_png";
        // if (remainTicket <= 1)
        //     this.lightImage3.source = "light_1_png";
        // if (remainTicket <= 0)
        //     this.lightImage4.source = "light_1_png";
    }

    private updateBanker(needSezi: boolean) {
        this.hideAllBanker();

        let banker_area = this.gameData.bankerArea;
        let banker_price = this.gameData.bankerTotal;
        let banker_name = this.gameData.bankerName;

        let delay = 0;
        if (needSezi && banker_area != 0 && banker_area != NaN && banker_area != null) {
            let onlineStorage = OnlineStorage.getInstance();
            let pointMap: PointMap = onlineStorage.pointMap[banker_area];

            delay = this.showBankerAnimation(pointMap.value1, 0, 0);
            this.showBankerAnimation(pointMap.value2, 1, 0);
        }
        let that = this;
        let tw = egret.Tween.get(this);
        tw.to({}, delay).call(function () {
            that.updateBankerLabel();
        });
    }

    private updateBankerLabel() {
        let banker_area = this.gameData.bankerArea;
        let banker_price = this.gameData.bankerTotal;
        let banker_name = this.gameData.bankerName;

        //如果是等待中才显示上庄的人
        if (banker_area != 0 && banker_area != NaN && banker_area != null &&
            (this.processState == ProcessState.ProcessStateWait || this.processState == ProcessState.ProcessStateBeting)) {
            this.bankerGroup.visible = true;
        } else {
            this.bankerGroup.visible = false;
        }

        this.bankerNameLabel.text = banker_name;
        this.bankerPriceLabel.text = String(banker_price);
        switch (banker_area) {
            case 1:
                this.banker_label_1.visible = true;
                break;
            case 2:
                this.banker_label_2.visible = true;
                break;
            case 3:
                this.banker_label_3.visible = true;
                break;
            case 4:
                this.banker_label_4.visible = true;
                break;
            case 5:
                this.banker_label_5.visible = true;
                break;
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
    
    private forceExit()
    {
        if(Director.getInstance().getCurrentScene()===this)
        {
            HttpEngine.getInstance().leaveRoom(this.roomId, null, null);
            this.popSceneWithoutAnimate();
            SocketEngine.getInstance().close();
            //this.onPopScene();
            //Director.getInstance().popScene();
        }
        return;
    }
    
    //公共倒计时
    private commonTimerHandler() {
        let currentTicket = Math.floor(Number(new Date()) / 1000);
        let deltaTicket = currentTicket - this.lastTimerTicket;
        let isFirstTicket = this.lastTimerTicket>0?false:true;
        this.lastTimerTicket = currentTicket; 
        if(!isFirstTicket && deltaTicket>30)
        {
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
                    if(!this.gameData.initUserInfoGot)
                    {
                        this.stateNotifyLabel.text = "初始化用户信息,请稍等...";
                    }
                    else if(!this.gameData.socketConnected)
                    {
                        if(SocketEngine.getInstance().isSocketConnected())
                        {
                            this.stateNotifyLabel.text = "连接房间中,请稍等...";
                        }else
                        {
                            this.stateNotifyLabel.text = "房间初始化,请稍等...";
                        }
                    }else
                    {
                        this.stateNotifyLabel.text = "请求房间数据,请稍等...";
                    }

                    this.stateTicketLabel.text = "";
                    break;
                }
            case ProcessState.ProcessStateWait://等待开始
                {//等待开始倒计时
                    this.stateNotifyLabel.text = "等待游戏开始";
                    if(this.serverStateEndTicket - currentTicket < 0){
                        this.stateTicketLabel.text="";
                    }else{
                        this.stateTicketLabel.text = String(this.serverStateEndTicket - currentTicket);//倒计时秒数  
                    }
                    if(this.serverStateOpenTicket - currentTicket < 0){
                         this.timeLabel.text = "";   
                    }else{
                        let remainTicket = this.serverStateOpenTicket - currentTicket;
                        this.timeLabel.text = String(remainTicket) + "s";
                    }
                    
                    break;
                }
            case ProcessState.ProcessStateBeting://下注阶段
                {//下注阶段没有倒计时

                    if(currentTicket-this.showCancleBetTicket >= 15){
                        //取消下注倒计时15s后消失
                        this.showCancleBet=0;
                        this.cancleBetGroup.visible=false;
                        this.sureBetGroup.visible=false;
                        this.showCancleBetTicket=0;
                        this.showCancleBetRemainTime=15;
                    }

                    if (this.serverStateEndTicket - currentTicket < 3) {
                        this.stateNotifyLabel.text = "下注倒计时";
                        this.showCancleBet=0;
                        this.cancleBetGroup.visible=false;
                        this.sureBetGroup.visible=false;
                        this.showCancleBetTicket=0;
                        this.showCancleBetRemainTime=15;
                        //this.stateTicketLabel.text = String(this.serverStateEndTicket - currentTicket);//倒计时3秒
                    } else {
                        this.stateNotifyLabel.text = "下注中";
                        //this.stateTicketLabel.text = String(this.serverStateEndTicket - currentTicket);//倒计时3秒
                    }
                    if(this.serverStateEndTicket - currentTicket < 0){
                        this.stateTicketLabel.text="";
                        this.showCancleBet=0;
                        this.cancleBetGroup.visible=false;
                        this.sureBetGroup.visible=false;
                        this.showCancleBetTicket=0;
                        this.showCancleBetRemainTime=15;
                    }else{
                        this.stateTicketLabel.text = String(this.serverStateEndTicket - currentTicket);//倒计时秒数
                        this.sureBetTimeLabel.text = "("+String(this.showCancleBetRemainTime--)+")";//取消投注倒计时秒数    
                    }
                    /*
                    let expectInfo:ExpectInfo = DataEngine.getInstance().getExpectInfo(this.gameId);
                    let currentTicket = Math.floor(Number(new Date())/1000);
                    let usedTicket = currentTicket-expectInfo.local_request_time;
                    let remainTicket:number = expectInfo.next_time-usedTicket;
                    */
                    if(this.serverStateOpenTicket - currentTicket < 0){
                         this.timeLabel.text = "";   
                    }else{
                        let remainTicket = this.serverStateOpenTicket - currentTicket;
                        this.timeLabel.text = String(remainTicket) + "s";
                    }

                    break;
                }
            case ProcessState.ProcessStateBlocking://封盘阶段
                {//封盘倒计时
                    this.showCancleBet=0;
                        this.cancleBetGroup.visible=false;
                        this.sureBetGroup.visible=false;
                        this.showCancleBetTicket=0;
                        this.showCancleBetRemainTime=15;
                        this.stateNotifyLabel.text = "封盘中";
                    if(this.serverStateEndTicket - currentTicket < 0){
                        this.stateTicketLabel.text="";
                    }else{
                        this.stateTicketLabel.text = String(this.serverStateEndTicket - currentTicket);//倒计时秒数  
                    }
                    if(this.serverStateOpenTicket - currentTicket < 0){
                         this.timeLabel.text = "";   
                    }else{
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

    private becomeBankerTouchHandler() {
        //let area = 1;
        let that = this;
        /*
        Director.getInstance().showBankerDialog(this, "nine", function(name:string, count){
            let httpEngine: HttpEngine = HttpEngine.getInstance();
            httpEngine.reservationBanker(count, function(name: string, response: ResponseReservationBanker) {
                let log = response.error+":"+response.msg;
                Logger.log(log);
                Toast.launch(log);
            }, that);
        }, this);
        */

        let count = 10000;
        let userInfo: UserInfo = ClientStorage.getUserInfo();
        if (Number(userInfo.balance) < count) {
            Toast.launch("需要有" + count + "资金才能上庄");
            return;
        }

        Director.getInstance().showConfirmDialog("上庄至少账户10000以上", this.sound_on, this, function (confirmed: boolean) {
            if (confirmed) {
                let httpEngine: HttpEngine = HttpEngine.getInstance();
                httpEngine.reservationBanker(count, function (name: string, response: ResponseReservationBanker) {
                    let log = response.error + ":" + response.msg;
                    Logger.log(log);
                    Toast.launch(log);
                }, that);
            }
        });
    }

    private underBankerTouchHandler() {
        //let area = 1;
        let that = this;
        let httpEngine: HttpEngine = HttpEngine.getInstance();
        httpEngine.underBanker(function (name: string, response: ResponseUnderBanker) {
            let log = response.error + ":" + response.msg;
            Logger.log(log);
            Toast.launch(log);
        }, that);
    }

    private updateBankerList(bankerList: BankerInfo[]) {

        let haveSelf: boolean = false;
        this.gameData.bankerList = bankerList;
        this.bankerListScrollerGroup.removeChildren();
        for (let i = 0; i < bankerList.length; i++) {
            let bankerInfo = bankerList[i];

            let label:eui.Label = new eui.Label();
            label.x = 20;
            label.y = i*30+5;
            label.size = 22;
            label.text = bankerInfo.nickname;
            this.bankerListScrollerGroup.addChild(label);

            let userInfo: UserInfo = ClientStorage.getUserInfo();
            if (bankerInfo.id == userInfo.id) {
                haveSelf = true;
            }
        }

        if (this.enableFreeBanker) {
            if (haveSelf) {
                this.becomeBankerButton.visible = false;
                this.underBankerButton.visible = true;
            } else {
                this.becomeBankerButton.visible = true;
                this.underBankerButton.visible = false;
            }
        } else {
            this.becomeBankerButton.visible = false;
            this.underBankerButton.visible = false;
        }
    }

    //丢色子，index是0或者1表示哪一个
    private showBankerAnimation(banker: number, index: number, delay: number) {

        let x = this.groupCenter.width / 2 + (index == 0 ? -100 : 100);
        let dropX = this.groupCenter.width / 2 + (index == 0 ? -60 : 60);
        let imageView = new eui.Image("sezi_1d_png");
        imageView.width = 100;
        imageView.height = 100;
        imageView.anchorOffsetX = 50;
        imageView.anchorOffsetY = 50;
        imageView.x = x;
        imageView.y = this.groupCenter.height / 2;
        imageView.scaleX = 2.0;
        imageView.scaleY = 2.0;

        let totalDelay = delay;

        this.groupCenter.addChild(imageView);
        let tw = egret.Tween.get(imageView);
        tw.to({}, delay);
        tw.to({}, 1000); totalDelay += 1000;
        tw.to({ x: dropX, scaleX: 1, scaleY: 1 }, 500); totalDelay += 500;
        for (let j = 0; j < 1; j++) {
            for (let i = 11; i <= 28; i++) {
                tw.to({ source: "sezi_ani_" + i + "_png" }, 50); totalDelay += 50;
            }
        }

        tw.to({ source: "sezi_" + banker + "d_png" })
            .to({}, 2000)
            .call(function () {
                imageView.parent.removeChild(imageView);
            });

        //totalDelay+=2000;//延迟不计最后的2000
        return totalDelay;
    }

    private testHandler(evt: egret.TouchEvent): void {
        //测试
        //alert("123");
        //SocketEngine.getInstance().test();
        /*
        let testWaitTime    = 40;
        let testBetTime     = 40;
        let testBlockTime   = 40;
        let testRestartTime = 40;
        */

        //this.reconnect();
        //return;

        let testWaitTime = 5; let testWaitRemainTime = 15;
        let testBetTime = 5; let testBetRemainTime = 10;
        let testBlockTime = 5; let testBlockRemainTime = 5;
        let testRestartTime = 500; let testRestartRemainTime = 500;


        this.local_test = 1;
        Toast.launch("开始测试,测试中下注不花费筹码");
        let tw = egret.Tween.get(this);
        tw.to({}, 0).call(function () {
            //先推送消息：等待游戏开始5秒 remaining_time
            let msg_wait_start = "{\"type\":\"notify\",\"info\":{\"state\":1,\"msg\":\"等待游戏开始阶段\",\"time\":" + String(testWaitTime) + ",\"remaining_time\":" + String(testWaitTime) + "}}";
            SocketEngine.getInstance().test_send_message(msg_wait_start);

            //再推送消息：上庄
            //let msg_banker = "{\"type\":\"banker_notify\",\"banker_id\":1,\"banker_area\":1,\"banker_time\":\"2017-12-03 11:22:20\",\"msg\":\"用户XXx上庄成功\"}";
            let msg_banker = "{\"type\":\"banker_notify\",\"uid\":1,\"price\":10000,\"room_id\":1,\"area\":\"5\",\"nickname\":\"秧歌\",\"msg\":\"本局庄家为秧歌\"}";
            SocketEngine.getInstance().test_send_message(msg_banker);
        }).to({}, testWaitTime * 1000)
            .call(function () {
                //在推送消息：押注阶段10秒
                let msg_bet = "{\"type\":\"notify\",\"info\":{\"state\":2,\"msg\":\"等待下注\",\"time\":" + String(testBetTime) + ",\"remaining_time\":" + String(testBetRemainTime) + "}}";
                SocketEngine.getInstance().test_send_message(msg_bet);
            }).to({}, 500)
            .call(function () {
                //玩家下注
                let msg_bet_1 = "{\"type\":\"bet\",\"msg\":\"\",\"area\":\"1\",\"number\":\"10\",\"area_summary\":[{\"area\":1,\"number\":\"10\"}]}";
                let msg_bet_2 = "{\"type\":\"bet\",\"msg\":\"\",\"area\":\"2\",\"number\":\"10\",\"area_summary\":[{\"area\":2,\"number\":\"10\"}]}";
                SocketEngine.getInstance().test_send_message(msg_bet_1);
                SocketEngine.getInstance().test_send_message(msg_bet_2);
            }).to({}, 500)
            .call(function () {
                //玩家下注
                let msg_bet_3 = "{\"type\":\"bet\",\"msg\":\"\",\"area\":\"3\",\"number\":\"10\",\"area_summary\":[{\"area\":3,\"number\":\"10\"}]}";
                let msg_bet_4 = "{\"type\":\"bet\",\"msg\":\"\",\"area\":\"4\",\"number\":\"10\",\"area_summary\":[{\"area\":4,\"number\":\"10\"}]}";
                SocketEngine.getInstance().test_send_message(msg_bet_3);
                SocketEngine.getInstance().test_send_message(msg_bet_4);
            }).to({}, (testBetTime - 1) * 1000)
            .call(function () {
                //再推送消息: 封盘阶段10秒
                let msg_block = "{\"type\":\"notify\",\"info\":{\"state\":3,\"msg\":\"封盘中\",\"time\":" + String(testBlockTime) + ",\"remaining_time\":" + String(testBlockRemainTime) + "}}";
                SocketEngine.getInstance().test_send_message(msg_block);
            }).to({}, testBlockTime * 1000)
            .call(function () {
                //再推送消息: 开奖
                let msg_end = "{\"type\":\"notify\",\"info\":{\"state\":4,\"msg\":\"开奖阶段\",\"time\":" + String(0) + "}}";
                SocketEngine.getInstance().test_send_message(msg_end);
            }).to({}, 2000)//5000*2
            .call(function () {
                //再推送消息: 开奖结算:牌九无庄家
                let msg_conclude = "{\"type\":\"settlement_result\",\"room_type\":\"1\",\"info\":{\"mode\":0,\"banker\":0,\"area\":[{\"area\":3,\"bet\":\"100\",\"result\":100,\"lose_areas\":[{\"area\":1,\"bet\":\"10\",\"result\":\"10\"},{\"area\":4,\"bet\":\"50\",\"result\":\"50\"},{\"area\":2,\"bet\":\"50\",\"result\":40}]}],\"users\":[{\"id\":1,\"nickname\":\"\\u73a9\\u5bb617111920193170\",\"number\":200},{\"id\":2,\"nickname\":\"\\u73a9\\u5bb617112423235566\",\"number\":-70},{\"id\":3,\"nickname\":\"\\u73a9\\u5bb617112521543668\",\"number\":-80}]},\"open_result\":{\"expect\":\"653194\",\"opencode\":\"08,03,01,04,09,10,05,07,02,06\",\"opentime\":\"2017-11-28 13:47:40\",\"opentimestamp\":\"1511848060\"}}";

                //结算消息：牌九有庄家
                /*
                let msg_conclude_banker = "{\"type\":\"settlement_result\",\"room_type\":\"1\",\"info\":{\"mode\":1,\"banker\":-350,\"area\":[{\"area\":2,\"result\":\"50\",\"bet\":100},{\"area\":3,\"result\":\"100\",\"bet\":100},{\"area\":4,\"result\":\"50\",\"bet\":100},{\"area\":5,\"result\":\"150\",\"bet\":300}],\"users\":[{\"id\":1,\"nickname\":\"玩家17111920193170\",\"number\":250},{\"id\":2,\"nickname\":\"玩家17112423235566\",\"number\":50},{\"id\":3,\"nickname\":\"玩家17112521543668\",\"number\":50}],\"bank_area\":1},\"open_result\":{\"expect\":\"653194\",\"opencode\":\"08,03,01,04,09,10,05,07,02,06\",\"opentime\":\"2017-11-28 13:47:40\",\"opentimestamp\":\"1511848060\"}}";
                */
                let msg_conclude_banker = "{\"type\":\"settlement_result\",\"room_type\":\"1\",\"open_result\":{\"expect\":\"653194\",\"opencode\":\"08,03,01,04,09,10,05,07,02,06\",\"opentime\":\"2017-11-28 13:47:40\",\"opentimestamp\":\"1511848060\"},\"info\":{\"mode\":1,\"banker\":-350,\"area\":[{\"area\":2,\"result\":\"50\"},{\"area\":3,\"result\":\"100\"},{\"area\":4,\"result\":\"50\"},{\"area\":5,\"result\":\"150\"}],\"users\":[{\"id\":1,\"nickname\":\"玩家17111920193170\",\"number\":250},{\"id\":2,\"nickname\":\"玩家17112423235566\",\"number\":50},{\"id\":3,\"nickname\":\"玩家17112521543668\",\"number\":50}],\"bank_area\":1}}";
                //SocketEngine.getInstance().test_send_message(msg_conclude_banker);
            }).to({}, 5000)
            .call(function () {
                //再推送消息: 开始等待下一局
                let msg_wait_start = "{\"type\":\"notify\",\"info\":{\"state\":1,\"msg\":\"等待游戏开始阶段\",\"time\":" + String(testRestartTime) + ",\"remaining_time\":" + String(testRestartRemainTime) + "}}";
                SocketEngine.getInstance().test_send_message(msg_wait_start);
            }).to({}, 500);

    }

    private testHandler1() {
        //this.startRaceStepOne();
        this.local_test = 1;
        let msg_open_result = "{\"type\":\"open_result\",\"info\":{\"expect\":\"653194\",\"opencode\":\"08,03,01,04,09,10,05,07,02,06\",\"opentime\":\"2017-11-28 13:47:40\",\"opentimestamp\":\"1511848060\"}}";
        SocketEngine.getInstance().test_send_message(msg_open_result);

        let msg_conclude = "{\"type\":\"settlement_result\",\"room_type\":\"1\",\"info\":{\"mode\":0,\"banker\":0,\"area\":[{\"area\":3,\"bet\":\"100\",\"result\":100,\"lose_areas\":[{\"area\":1,\"bet\":\"10\",\"result\":\"10\"},{\"area\":4,\"bet\":\"50\",\"result\":\"50\"},{\"area\":2,\"bet\":\"50\",\"result\":40}]}],\"users\":[{\"id\":1,\"nickname\":\"玩家17111920193170\",\"number\":200},{\"id\":2,\"nickname\":\"玩家17112423235566\",\"number\":-70},{\"id\":3,\"nickname\":\"玩家17112521543668\",\"number\":-80}]}}";
        SocketEngine.getInstance().test_send_message(msg_conclude);
    }
}


