class JsonBase {
    public deserialize(json, instance) {
        if (json == null || instance == null) {
            //保护
            return;
        }

        for (var prop in json) {
            if (!json.hasOwnProperty(prop))
                continue;
            if (typeof json[prop] === 'object')
                this.deserialize(json[prop], instance[prop]);
            else
                instance[prop] = json[prop];
        }
    }

    constructor(json: Object) {
        //this.deserialize(json, this);
    }
}

class ResponseLogin extends JsonBase {
    public error;
    public msg;
    public access_token;
    public refresh_token;

    constructor(json: Object) {
        super(json);
        this.deserialize(json, this);
    }
}

class ResponseSMSCode extends JsonBase {
    public error;
    public msg;
    public code;

    constructor(json: Object) {
        super(json);
        this.deserialize(json, this);
    }
}

class ResponseRegist extends JsonBase {
    public error;
    public msg;
    public access_token;

    constructor(json: Object) {
        super(json);
        this.deserialize(json, this);
    }
}

class Info extends JsonBase {

    public id;
    public content;
    public up_time;
    public state;
    public create_time;
    public status;
    public type;

    constructor(json: Object) {
        super(json);
        this.deserialize(json, this);
    }

    public seralize() {
        var json = {};
        for (let prop of Object.keys(this)) {
            json[prop] = this[prop];
        }
        return json;
    }
}

class UserInfo extends JsonBase {
    public nickname;
    public refresh_token;
    public room_id;
    public state;
    public pid;
    public create_time;
    public user_name;
    public headimg;
    public status;
    public token;
    public access_token;
    public password;
    public lasttime;
    public freeze_price;
    public client_id;
    public id;
    public up_time;
    public balance;
    public is_experi;
    public salt;

    constructor(json: Object) {
        super(json);
        this.deserialize(json, this);
    }

    public seralize() {
        var json = {};
        for (let prop of Object.keys(this)) {
            json[prop] = this[prop];
        }
        return json;
    }
}

class RoomInfo extends JsonBase {
    public id;
    public fk_game_id;
    public name;
    public up_time;
    public item_key;
    public create_time;
    public number;
    public state;//0关闭，1正常，2维护中
    public socket_server;//服务器地址

    public room_type: number;    //房间类型 牌九，牛牛， 豪车 ，龙虎 ， 单张 分别对应1-5
    public room_type_name: string;    //
    public is_official;         //是否vip

    constructor(json: Object) {
        super(json);
        this.deserialize(json, this);
    }
}

class GameInfo extends JsonBase {
    public id;
    public name;
    public up_time;
    public create_time;
    public is_open;//游戏开放状态，1开放，0关闭

    constructor(json: Object) {
        super(json);
        this.deserialize(json, this);
    }
}

class ResponseUserInfo {
    public error;
    public msg;
    public userInfo: UserInfo

    constructor(json: Object) {
        //this.deserialize(json, this);
        this.error = json['error'];
        this.msg = json['msg'];
        this.userInfo = new UserInfo(json['userInfo']);
    }
}

class ResponseNotice {
    public error;
    public msg;
    public info: Info

    constructor(json: Object) {
        //this.deserialize(json, this);
        this.error = json['error'];
        this.msg = json['msg'];
        this.info = new Info(json['info']);
    }
}

class ResponseOnlinecount {
    public error;
    public msg;
    public count: Number

    constructor(json: Object) {
        //this.deserialize(json, this);
        this.error = json['error'];
        this.msg = json['msg'];
        this.count = json['count'];
    }
}

class ResponseRoomList {
    public error;
    public msg;
    public rows: RoomInfo[];

    constructor(json: Object) {
        //this.deserialize(json, this);
        this.error = json['error'];
        this.msg = json['msg'];
        this.rows = new Array();
        for (var row in json['rows']) {
            var jsonObject = json['rows'][row];
            var roomInfo: RoomInfo = new RoomInfo(jsonObject);
            this.rows.push(roomInfo);
        }

    }
}

class ResponseGameList {
    public error;
    public msg;
    public rows: GameInfo[];

    constructor(json: Object) {
        //this.deserialize(json, this);
        this.error = json['error'];
        this.msg = json['msg'];
        this.rows = new Array();
        for (var row in json['rows']) {
            var jsonObject = json['rows'][row];
            var gameInfo: GameInfo = new GameInfo(jsonObject);
            this.rows.push(gameInfo);
        }
    }
}

class BetInfo extends JsonBase {
    public area: number;
    public number: number;
    public count: number;

    constructor(json: Object) {
        super(json);
        this.deserialize(json, this);
    }
}

//每个区域下注多少
class BetAreaSummary extends JsonBase {
    public area: number; //下注区域
    public number: number;//区域下注总金额
    constructor(json: Object) {
        super(json);
        this.deserialize(json, this);
    }
}

class JoinRoomBankerInfo extends JsonBase {
    public banker: number;
    public area: number;
    public price: number;
    public nickname: string;

    constructor(json: Object) {
        super(json);
        //this.deserialize(json, this);
        this.banker = Number(json['banker']);
        this.area = Number(json['area']);
        this.price = Number(json['price']);
        this.nickname = json['nickname'];
    }
}

class AreaLimitInfo extends JsonBase {
    public area;
    public total_limit;

    constructor(json: Object) {
        super(json);
        //this.deserialize(json, this);
        this.area = Number(json['area']);
        this.total_limit = Number(json['total_limit']);
    }
}

class ResponseConfirmBet extends JsonBase {
    public responseStr;
    public error;
    public msg;

    constructor(json: Object) {
        super(json);
        this.deserialize(json, this);
    }
}

class ResponseCancleBet {
    public responseStr;

    public error;
    public msg;
    public current_time: number;
    public balance: number;
    public rows: BetInfo[];
    public area_summary: BetAreaSummary[];

    constructor(json: Object) {
        //this.deserialize(json, this);
        this.error = json['error'];
        this.msg = json['msg'];
        this.current_time = json['current_time'];
        this.balance = json['balance'];
        this.rows = new Array();
        for (let row in json['rows']) {
            let jsonObject = json['rows'][row];
            let betInfo: BetInfo = new BetInfo(jsonObject);
            //测试数据:
            //betInfo.area = Number(row);
            this.rows.push(betInfo);
        }

        this.area_summary = new Array();
        for (let row in json['area_summary']) {
            let jsonObject = json['area_summary'][row];
            let areaSummary: BetAreaSummary = new BetAreaSummary(jsonObject);
            this.area_summary.push(areaSummary);
        }

    }
}

class ResponseJoinRoom {
    public responseStr;

    public error;
    public msg;
    public state;   //房间状态
    public time;    //状态结束时间
    public current_bet: number;
    public remaining_time: number;
    public banker_info: JoinRoomBankerInfo;
    public rows: BetInfo[];
    public area_summary: BetAreaSummary[];
    public self_bets: BetAreaSummary[];
    public area_limit: AreaLimitInfo[];

    constructor(json: Object) {
        //this.deserialize(json, this);
        this.error = json['error'];
        this.msg = json['msg'];
        this.current_bet = Number(json['current_bet']);
        this.state = Number(json['state']);
        this.time = Number(json['time']);
        this.remaining_time = Number(json['remaining_time']);
        this.banker_info = null;
        if (json['banker_info'] != null) {
            this.banker_info = new JoinRoomBankerInfo(json['banker_info'])
        }
        this.rows = new Array();
        for (let row in json['rows']) {
            let jsonObject = json['rows'][row];
            let betInfo: BetInfo = new BetInfo(jsonObject);
            //测试数据:
            //betInfo.area = Number(row);
            this.rows.push(betInfo);
        }

        this.area_summary = new Array();
        for (let row in json['area_summary']) {
            let jsonObject = json['area_summary'][row];
            let areaSummary: BetAreaSummary = new BetAreaSummary(jsonObject);
            this.area_summary.push(areaSummary);
        }

        this.self_bets = new Array();
        for (let row in json['self_bets']) {
            let jsonObject = json['self_bets'][row];
            let selfBet: BetAreaSummary = new BetAreaSummary(jsonObject);
            this.self_bets.push(selfBet);
        }

        this.area_limit = new Array();
        for (let row in json['area_limit']) {
            let jsonObject = json['area_limit'][row];
            let areaLimit: AreaLimitInfo = new AreaLimitInfo(jsonObject);
            this.area_limit.push(areaLimit);
        }

        //测试数据
        /*
        var text = '{"number":10,"count":8}';
        var obj = JSON.parse(text);
        var betInfo:BetInfo = new BetInfo(obj);
        this.rows.push(betInfo);
        */
    }
}

class ResponseBindClient extends JsonBase {
    public error;
    public msg;

    constructor(json: Object) {
        super(json)
        //this.deserialize(json, this);
        this.error = json['error'];
        this.msg = json['msg'];

    }
}

class ResponseLeaveRoom extends JsonBase {
    public error;
    public msg;

    constructor(json: Object) {
        super(json);
        this.deserialize(json, this);
        //this.error = json['error'];
        //this.msg = json['msg'];
    }
}

class ResponseReservationBanker extends JsonBase {
    public error;
    public msg;

    constructor(json: Object) {
        super(json);
        this.deserialize(json, this);
        //this.error = json['error'];
        //this.msg = json['msg'];
    }
}

class ResponseUnderBanker extends JsonBase {
    public error;
    public msg;

    constructor(json: Object) {
        super(json);
        this.deserialize(json, this);
        //this.error = json['error'];
        //this.msg = json['msg'];
    }
}

class ResponseContinueBanker extends JsonBase {
    public error;
    public msg;

    constructor(json: Object) {
        super(json);
        this.deserialize(json, this);
        //this.error = json['error'];
        //this.msg = json['msg'];
    }
}

class ExpectInfo extends JsonBase {
    public id;              //": 580,
    public expect;          //": 653195,
    public opencode;        //": "",
    public opentime;        //": "2017-11-28 13:52:35",
    public opentimestamp;   //": "1511848355",
    public state;           //": 0,
    public up_time;         //": "2017-11-28 13:47:42",
    public create_time;     //": "2017-11-28 13:47:42"
    public next_time;       //下次开奖时间
    public fk_game_id;      //": 1,
    public name;            //": "北京赛车"
    public game_state;      //0暂停 1正常 2关闭
    public game_mark;       //
    public local_request_time;  //请求回来的本地时间
    public result: getResult;
    constructor(json: Object) {
        super(json);
        this.deserialize(json, this);
        if (json['result'] != null) {
            this.result = new getResult(json['result']);
        } else {
            this.result = null;
        }
        this.local_request_time = Math.floor(Number(new Date()) / 1000);
    }
}
class getResult extends JsonBase {
    public he;
    public ds;
    public dx;
    constructor(json: Object) {
        super(json);
        this.deserialize(json, this);
    }
}
class RoomStaff extends JsonBase {
    public id;              //": 580,
    public user_name;          //": 13800138000,
    public nickname;        //": "玩家17112521543668",
    public headimg;        //

    public local_request_time;  //请求回来的本地时间

    constructor(json: Object) {
        super(json);
        this.deserialize(json, this);
    }
}


//最新开奖情况
class ResponseNewExpect extends JsonBase {
    public error;
    public msg;
    public rows: ExpectInfo[];
    constructor(json: Object) {
        super(json);
        //this.deserialize(json, this);
        this.error = json['error'];
        this.msg = json['msg'];
        this.rows = new Array();
        for (var row in json['rows']) {
            var jsonObject = json['rows'][row];
            var expectInfo: ExpectInfo = new ExpectInfo(jsonObject);
            this.rows.push(expectInfo);
        }
    }
}

//PC蛋蛋
class ResultPcddRules extends JsonBase {
    public error;
    public msg;
    public rows: OpenResultPcddRules[];

    constructor(json: Object) {
        super(json);
        //this.deserialize(json, this);
        this.error = json['error'];
        this.msg = json['msg'];
        this.rows = new Array();
        for (var row in json['rows']) {
            var jsonObject = json['rows'][row];
            var openResultPcddRules: OpenResultPcddRules = new OpenResultPcddRules(jsonObject);
            this.rows.push(openResultPcddRules);
        }
    }
}
class ResConfirmBet extends JsonBase {
    public error;
    public msg;
    public balance;
    constructor(json: Object) {
        super(json)
        //this.deserialize(json, this);
        this.error = json['error'];
        this.msg = json['msg'];
        this.balance = json['balance'];
    }
}
//最新开奖情况
class ResponseRoomStaff extends JsonBase {
    public error;
    public msg;
    public rows: RoomStaff[];

    constructor(json: Object) {
        super(json);
        //this.deserialize(json, this);
        this.error = json['error'];
        this.msg = json['msg'];
        this.rows = new Array();
        for (var row in json['rows']) {
            var jsonObject = json['rows'][row];
            var roomStaff: RoomStaff = new RoomStaff(jsonObject);
            this.rows.push(roomStaff);
        }
    }
}

class ResponseBet extends JsonBase {
    public error;
    public msg;
    public balance: number;
    public current_time: number;

    constructor(json: Object) {
        super(json)
        //this.deserialize(json, this);
        this.error = json['error'];
        this.msg = json['msg'];
        this.balance = Number(json['balance']);
        this.current_time = Number(json['current_time']);
    }
}
class Responsebao extends JsonBase {
    public error;
    public msg;
    constructor(json: Object) {
        super(json)
        //this.deserialize(json, this);
        this.error = json['error'];
        this.msg = json['msg'];
    }
}
class ResponsebaoType extends JsonBase {
    public error;
    public msg;
    public rows: OpenResultBaoType[];
    constructor(json: Object) {
        super(json)
        //this.deserialize(json, this);
        this.error = json['error'];
        this.msg = json['msg'];
        this.rows = new Array();
        for (var row in json['rows']) {
            var jsonObject = json['rows'][row];
            var betLogInfo: OpenResultBaoType = new OpenResultBaoType(jsonObject);
            this.rows.push(betLogInfo);
        }
    }
}
class receive extends JsonBase {
    public error;
    public msg;
    constructor(json: Object) {
        super(json)
        //this.deserialize(json, this);
        this.error = json['error'];
        this.msg = json['msg'];
    }
}
class ResbaoLists extends JsonBase {
    public error;
    public msg;
    public rows: OpenResultBaoList[];
    constructor(json: Object) {
        super(json)
        //this.deserialize(json, this);
        this.error = json['error'];
        this.msg = json['msg'];
        this.rows = new Array();
        for (var row in json['rows']) {
            var jsonObject = json['rows'][row];
            var betLogInfo: OpenResultBaoList = new OpenResultBaoList(jsonObject);
            this.rows.push(betLogInfo);
        }
    }
}
//红包详情
class ResbaoInfo extends JsonBase {
    public error;
    public msg;
    public rows: OpenResulbaorows[];
    public info: OpenResulbaoInfo;
    constructor(json: Object) {
        super(json)
        //this.deserialize(json, this);
        this.error = json['error'];
        this.msg = json['msg'];
        this.info = new OpenResulbaoInfo(json['info']);
        this.rows = new Array();
        for (var row in json['rows']) {
            var jsonObject = json['rows'][row];
            var betLogInfo: OpenResulbaorows = new OpenResulbaorows(jsonObject);
            this.rows.push(betLogInfo);
        }
    }
}
//抢到的红包
class ResReceivelogs extends JsonBase {
    public error: number;
    public msg: String;
    public count: number;
    public total: number;
    public rows: OpenReceivelogs[];
    constructor(json: Object) {
        super(json)
        //this.deserialize(json, this);
        this.error = json['error'];
        this.msg = json['msg'];
        this.count = json['count'];
        this.total = Number(json['total']);
        this.rows = new Array();
        for (var row in json['rows']) {
            var jsonObject = json['rows'][row];
            var betLogInfo: OpenReceivelogs = new OpenReceivelogs(jsonObject);
            this.rows.push(betLogInfo);
        }
    }
}
//奖池
class ResJackpotNumber extends JsonBase {
    public error: number;
    public msg: String;
    public total: number;
    constructor(json: Object) {
        super(json)
        //this.deserialize(json, this);
        this.error = json['error'];
        this.msg = json['msg'];
        this.total = Number(json['total']);
    }
}
class RessendLogs extends JsonBase {
    public error: number;
    public msg: String;
    public count: number;
    public total: number;
    public rows: OpenSendlogs[];
    constructor(json: Object) {
        super(json)
        //this.deserialize(json, this);
        this.error = json['error'];
        this.msg = json['msg'];
        this.count = json['count'];
        this.total = Number(json['total']);
        this.rows = new Array();
        for (var row in json['rows']) {
            var jsonObject = json['rows'][row];
            var betLogInfo: OpenSendlogs = new OpenSendlogs(jsonObject);
            this.rows.push(betLogInfo);
        }
    }
}


class ResponseTalk extends JsonBase {
    public error;
    public msg;

    constructor(json: Object) {
        super(json)
        //this.deserialize(json, this);
        this.error = json['error'];
        this.msg = json['msg'];
    }
}



class BetLogInfo extends JsonBase {
    /*
    public fk_mb_id:number;         //": 2,
    public fk_expect_id:number;     //": 2372,
    public expect:number;           //": 655291,
    public number:number;   */        //": "510"
    public result: number;
    //public mark:string;
    public opentime: string;
    public game_name: string;
    public expect: number;
    public fk_expect_id: number;
    public room_name: string;
    public room_type: number;
    public bet_model: string;
    public expect_table: string;
    public result_model: string;
    public room_id: number;
    public fk_mb_id: number;
    public areas: BetLogAreas[];
    constructor(json: Object) {
        super(json)
        this.result = Number(json['result']);
        //this.mark = json['mark'];
        this.opentime = json['opentime'];
        this.game_name = json['game_name'];
        this.expect = Number(json['expect']);
        this.fk_expect_id = Number(json['fk_expect_id']);
        this.room_name = json['room_name'];
        this.room_type = Number(json['room_type']);
        this.bet_model = json['bet_model'];
        this.expect_table = json['expect_table'];
        this.result_model = json['result_model'];
        this.room_id = Number(json['room_id']);
        this.fk_mb_id = Number(json['fk_mb_id']);
        this.areas = new Array();
        for (var area in json['areas']) {
            var jsonObject = json['areas'][area];
            var betLogAreas: BetLogAreas = new BetLogAreas(jsonObject);
            this.areas.push(betLogAreas);
        }
    }
}

class BetLogAreas extends JsonBase {
    public fk_expect_id: number;
    public area: number;
    public result: string;
    public code: number;
    public code1: number;
    public code2: number;
    public is_win: number;
    public ranking: number;
    public area_bet: string;
    public my_bet: number;
    public mark: string;
    public symbol: string;
    public hybrid: BetLoghybrid[];
    public Special: BetLogSpecialNum[];
    constructor(json: Object) {
        super(json)
        this.deserialize(json, this);
        this.hybrid = new Array();
        for (let hybri in json) {
            let jsonObject = json[hybri]
            let bethybirid: BetLoghybrid = new BetLoghybrid(jsonObject);
            this.hybrid.push(bethybirid);
        }
        this.Special = new Array();
        for (let specia in json) {
            let jsonObject = json[specia]
            let bethybirid: BetLogSpecialNum = new BetLogSpecialNum(jsonObject);
            this.Special.push(bethybirid);
        }
    }
}

class BetLoghybrid extends JsonBase {

    public bet: number;
    public title: number;
    public type: number;
    constructor(json: Object) {
        super(json)
        this.deserialize(json, this);
    }
}
class BetLogSpecialNum extends JsonBase {

    public bet;
    public title;
    public type;
    constructor(json: Object) {
        super(json)
        this.deserialize(json, this);
    }
}
class ResponseBetLogs extends JsonBase {
    public count: number;
    public error: number;
    public msg: String;
    public gross_profit: number;
    public rows: BetLogInfo[];
    constructor(json: Object) {
        super(json)
        //this.deserialize(json, this);
        this.count = json['count'];
        this.error = json['error'];
        this.msg = json['msg'];
        this.gross_profit = Number(json['gross_profit']);
        this.rows = new Array();
        for (var row in json['rows']) {
            var jsonObject = json['rows'][row];
            var betLogInfo: BetLogInfo = new BetLogInfo(jsonObject);
            this.rows.push(betLogInfo);

        }
    }
}

//房间总下注额
class ResponseLonghuBet extends JsonBase {
    public error: number;
    public msg: String;
    public total: number;
    constructor(json: Object) {
        super(json)
        this.deserialize(json, this);
    }
}
//发送红包结果
class OpenSendlogs extends JsonBase {
    public title;
    public create_time;
    public total;
    public ray_code;
    constructor(json: Object) {
        super(json)
        this.deserialize(json, this);
    }
}
//抢到的红包结果
class OpenReceivelogs extends JsonBase {
    public nickname;
    public create_time;
    public bao_number;
    public ray_code;
    constructor(json: Object) {
        super(json)
        this.deserialize(json, this);
    }
}
//红包类型返回参数
class OpenResultBaoType extends JsonBase {

    public number;              //10
    public multiple;            //1

    constructor(json: Object) {
        super(json)
        this.deserialize(json, this);
    }
}
//红包列表返回参数
class OpenResultBaoList extends JsonBase {

    public number;              //10
    public receive_number;      //1
    public id;
    public nickname;
    public fk_mb_id;
    public ray;
    public total;           //80
    constructor(json: Object) {
        super(json)
        this.deserialize(json, this);
    }
}
//发红包红包详情
class OpenResulbaoInfo extends JsonBase {

    public nickname;            //发红包的玩家
    public total;               //金额
    public create_time;         //时间
    public number;              //包数
    public time;                //抢玩时间
    public receive_number;      //
    public receive_price;
    constructor(json: Object) {
        super(json)
        this.deserialize(json, this);
    }
}
//抢红包
class OpenResulbaorows extends JsonBase {

    public nickname;            //抢红包的玩家
    public bao_number;          //抢到的金额
    public create_time;         //抢的时间

    constructor(json: Object) {
        super(json)
        this.deserialize(json, this);
    }
}
//牌九返回参数
class OpenResultNine extends JsonBase {
    public fk_expect_id;        //": 124,
    public expect;              //":655837,
    public area1;                //": 0,
    public area2;                //": 5,
    public area3;                //": 8,
    public area4;                //": 5,
    public area5;                //": 7,
    public ranking1;
    public ranking2;
    public ranking3;
    public ranking4;
    public ranking5;
    public datetime;            //": "2017-12-10 16:52:45"
    constructor(json: Object) {
        super(json)
        this.deserialize(json, this);
    }
}
//PC蛋蛋返回参数
class OpenResultPcddRules extends JsonBase {
    public create_time;
    public game_id;
    public id;
    public multiple;
    public title;
    public type;
    public type_name;
    public up_time;
    constructor(json: Object) {
        super(json)
        this.deserialize(json, this);
    }
}
//牛牛返回参数
//rows":[{"fk_expect_id":557,"expect":656269,"area1":0,"is_win1":0,"datetime":"2017-12-15 16:27:47","area2":7,"is_win2":1
class OpenResultNiuNiu extends JsonBase {
    public expect;
    public datetime;
    public area1;
    public area2;
    public is_win1;
    public is_win2;

    constructor(json: Object) {
        super(json)
        this.deserialize(json, this);
    }
}
class OpenOfficalResults extends JsonBase {
    public id;
    public expect;
    public opencode;
    public opentime;
    public opentimestamp;
    public state;
    public up_time;
    public datetime;
    constructor(json: Object) {
        super(json)
        this.deserialize(json, this);
    }
}
//PC蛋蛋
class OpenPcDanDanResults extends JsonBase {
    public id;
    public expect;
    public code1;
    public code2;
    public code3;
    public he;
    public dx;              //大小 1小 2大
    public ds;              //单双 1单 2双
    public opentime;
    public opentimestamp;
    public state;
    public up_time;
    public datetime;
    constructor(json: Object) {
        super(json)
        this.deserialize(json, this);
    }
}
//龙虎斗开奖结果
class OpenResultLonghu extends JsonBase {
    public id;                  //": 17232,
    public fk_expect_id;        //": 2460,
    public result;              //": "3",
    public mark;                //": 4,
    public code1;               //": 3,
    public code2;               //": 10,
    public symbol;              //": >
    public up_time;             //": "2017-12-10 16:52:45",
    public datetime;            //": "2017-12-10 16:52:45"
    constructor(json: Object) {
        super(json)
        this.deserialize(json, this);
    }
}
//龙虎斗开奖结果
class OpenResultDanzhang extends JsonBase {
    public fk_expect_id;        //": 2460,
    public expect;
    public area1;                //": 0,
    public area2;                //": 5,
    public area3;                //": 8,
    public area4;                //": 5,
    public area5;                //": 7,
    public ranking1;
    public ranking2;
    public ranking3;
    public ranking4;
    public ranking5;
    public datetime;
    constructor(json: Object) {
        super(json)
        this.deserialize(json, this);
    }
}
class OpenOfficalResultsLonghu extends JsonBase {
    public id;
    public expect;
    public opencode;
    public opentime;
    public opentimestamp;
    public state;
    public up_time;
    public create_time;
    constructor(json: Object) {
        super(json)
        this.deserialize(json, this);
    }
}
//牌九开奖结果
class ResponeOpenResultNine extends JsonBase {
    public error: number;
    public msg: String;
    public rows: OpenResultNine[];

    constructor(json: Object) {
        super(json)
        //this.deserialize(json, this);
        this.error = json['error'];
        this.msg = json['msg'];
        this.rows = new Array();
        for (var row in json['rows']) {
            var jsonObject = json['rows'][row];
            var openResultNine: OpenResultNine = new OpenResultNine(jsonObject);
            this.rows.push(openResultNine);
        }
    }
}
//牛牛开奖结果
class ResponeOpenResultNiuNiu extends JsonBase {
    public error: number;
    public msg: String;
    public rows: OpenResultNiuNiu[];

    constructor(json: Object) {
        super(json)
        //this.deserialize(json, this);
        this.error = json['error'];
        this.msg = json['msg'];
        this.rows = new Array();
        for (var row in json['rows']) {
            var jsonObject = json['rows'][row];
            var openResultNiuNiu: OpenResultNiuNiu = new OpenResultNiuNiu(jsonObject);
            this.rows.push(openResultNiuNiu);
        }
    }
}
//赛车官方结果
class ResponeOpenOfficalResult extends JsonBase {
    public error: number;
    public msg: String;
    public rows: OpenOfficalResults[];

    constructor(json: Object) {
        super(json)
        //this.deserialize(json, this);
        this.error = json['error'];
        this.msg = json['msg'];
        this.rows = new Array();
        for (var row in json['rows']) {
            var jsonObject = json['rows'][row];
            var openOfficalResults: OpenOfficalResults = new OpenOfficalResults(jsonObject);
            this.rows.push(openOfficalResults);
        }
    }
}
//赛车PC蛋蛋结果
class ResPcDanDanResult extends JsonBase {
    public error: number;
    public msg: String;
    public rows: OpenPcDanDanResults[];

    constructor(json: Object) {
        super(json)
        //this.deserialize(json, this);
        this.error = json['error'];
        this.msg = json['msg'];
        this.rows = new Array();
        for (var row in json['rows']) {
            var jsonObject = json['rows'][row];
            var openPcDanDanResults: OpenPcDanDanResults = new OpenPcDanDanResults(jsonObject);
            this.rows.push(openPcDanDanResults);
        }
    }
}
//龙虎斗开奖结果
class ResponeOpenResultLonghu extends JsonBase {
    public error: number;
    public msg: String;
    public rows: OpenResultLonghu[];

    constructor(json: Object) {
        super(json)
        //this.deserialize(json, this);
        this.error = json['error'];
        this.msg = json['msg'];
        this.rows = new Array();
        for (var row in json['rows']) {
            var jsonObject = json['rows'][row];
            var openResultLonghu: OpenResultLonghu = new OpenResultLonghu(jsonObject);
            this.rows.push(openResultLonghu);
        }
    }
}
//龙虎斗单张开奖结果
class ResponeOpenResultDanzhang extends JsonBase {
    public error: number;
    public msg: String;
    public rows: OpenResultDanzhang[];

    constructor(json: Object) {
        super(json)
        //this.deserialize(json, this);
        this.error = json['error'];
        this.msg = json['msg'];
        this.rows = new Array();
        for (var row in json['rows']) {
            var jsonObject = json['rows'][row];
            var openResultDanzhang: OpenResultDanzhang = new OpenResultDanzhang(jsonObject);
            this.rows.push(openResultDanzhang);
        }

    }
}
//龙虎斗官方结果
class ResponeOpenOfficalResultLonghu extends JsonBase {
    public error: number;
    public msg: String;
    public rows: OpenOfficalResultsLonghu[];

    constructor(json: Object) {
        super(json)
        //this.deserialize(json, this);
        this.error = json['error'];
        this.msg = json['msg'];
        this.rows = new Array();
        for (var row in json['rows']) {
            var jsonObject = json['rows'][row];
            var openOfficalResultsLonghu: OpenOfficalResultsLonghu = new OpenOfficalResultsLonghu(jsonObject);
            this.rows.push(openOfficalResultsLonghu);
        }
    }
}

//http://pk.kn86.cn/api/game/bankers.html
class ResponseGetBankerList extends JsonBase {
    public error;
    public msg;
    public rows: BankerInfo[];

    constructor(json: Object) {
        super(json);
        //this.deserialize(json, this);
        this.error = json['error'];
        this.msg = json['msg'];

        this.rows = new Array();
        for (let index in json['rows']) {
            let jsonObject = json['rows'][index];
            let item: BankerInfo = new BankerInfo(jsonObject);
            this.rows.push(item);
        }

    }
}

//服务器配置
class ResponseServerConfig extends JsonBase {
    public service_qq: string;
    public service_weixin: string;

    constructor(json: Object) {
        super(json)
        //this.deserialize(json, this);
        this.service_qq = json['service_qq'];
        this.service_weixin = json['service_weixin'];

    }
}

class ChipRowInfo extends JsonBase {
    public id: Number;           //20
    public config_sign: string;  //chip_10
    public config_name: string;  //10筹码
    public config_value: string; //1

    constructor(json: Object) {
        super(json);
        this.id = Number(json["id"]);
        this.config_sign = json["config_sign"];
        this.config_name = json["config_name"];
        this.config_value = json["config_value"];

    }
}
//服务器配置
class ResponseGameConfig extends JsonBase {
    public cs_qq: string;
    public cs_wx: string;
    public bet_confirm: Number;//下注是否需要确认
    public chip_rows: ChipRowInfo[];
    public area_chip_show_count;

    constructor(json: Object) {
        super(json)
        //this.deserialize(json, this);
        this.cs_qq = json['cs_qq'];
        this.cs_wx = json['cs_wx'];
        this.bet_confirm = Number(json['bet_confirm']);
        if (json['area_chip_show_count'] == null || json['area_chip_show_count'] == NaN) {
            this.area_chip_show_count = 100;
        } else {
            this.area_chip_show_count = Number(json['area_chip_show_count']);
        }


        this.chip_rows = new Array();
        for (var row in json['chip_rows']) {
            var jsonObject = json['chip_rows'][row];
            var chipRowInfo: ChipRowInfo = new ChipRowInfo(jsonObject);
            this.chip_rows.push(chipRowInfo);
        }
    }
}

class AreaBet extends JsonBase {
    constructor(json: Object) {
        super(json)
        //this.deserialize(json, this);
        this.bet = json['bet'];
        this.bet_rate = json['bet_rate'];
        this.nickname = json['nickname'];
    }
    public bet: number;
    public bet_rate: string;
    public nickname: string;

}

//服务器配置
class ResponseAreaBetList extends JsonBase {
    public rows: AreaBet[];

    constructor(json: Object) {
        super(json)
        //this.deserialize(json, this);
        this.rows = new Array();
        for (var row in json['rows']) {
            var jsonObject = json['rows'][row];
            var areaBet: AreaBet = new AreaBet(jsonObject);
            this.rows.push(areaBet);
        }
    }
}