
//连接socket成功时
//{type: "init", client_id: "7f0000010b5400000005"}
class PacketInit extends JsonBase {
    public type;
    public client_id;

    constructor(json: Object) {
        super(json);
        this.deserialize(json, this);
    }
}

//其他玩家进入房间
//{type: "friend_join", msg: "玩家17103016474940加入了房间",nickname:"玩家17103016474940"}
class PacketFriendJoin extends JsonBase {
    public type;
    public msg;
    public nickname;

    constructor(json: Object) {
        super(json);
        this.deserialize(json, this);
    }
}

/*
//不用了，直接使用进入，离开房间
//当前房间在线人数播报
//{"type":"online_count","msg":"当前房间总人数1人",count:120}
class PacketOnlineCount extends JsonBase
{
    public type;
    public msg;
    //public count;
    
    constructor(json: Object){
        super(json);
        //this.deserialize(json, this);
        this.type = json['type'];
        this.msg = json['msg'];
    }
}
*/


//用户说话
//{"type":"talk",uid:1,"nickname":"玩家17103016474940","msg":"你好"}
class PacketTalk extends JsonBase {
    public type;
    public uid;
    public nickname;
    public msg;

    constructor(json: Object) {
        super(json);
        this.deserialize(json, this);
    }
}

//离开房间
//{"type":"leave_room","uid":"1","msg":"用户XXx离开了房间"}
class PacketLeaveRoom extends JsonBase {
    public type;
    public uid;
    public nickname;

    constructor(json: Object) {
        super(json);
        this.deserialize(json, this);
    }
}

//投注
//{"type":"bet","msg":"玩家17103016474940投注了100","number":"100"}
//{"type":"bet","msg":"\u73a9\u5bb617112423235566\u6295\u6ce8\u4e8610","number":"10"} 有人下注
class PacketBet extends JsonBase {
    public type;
    public msg;
    public number: number;
    public area: number;
    public area_summary: BetAreaSummary[];

    constructor(json: Object) {
        super(json);
        //this.deserialize(json, this);
        this.type = json["type"];
        this.msg = json["msg"];
        this.number = json["number"];
        this.area = json["area"];
        this.area_summary = new Array();

        for (let row in json['area_summary']) {
            let jsonObject = json['area_summary'][row];
            let areaSummary: BetAreaSummary = new BetAreaSummary(jsonObject);
            this.area_summary.push(areaSummary);
        }
    }
}
//用户发红包
//{"type":"redbao_send","msg":"123\u53d1\u4e86\u4e00\u4e2a\u7ea2\u5305","chip":"100","number":10}   
class PacketSendbao extends JsonBase {
    public type;
    public nickname;
    public msg;
    public chip: number;
    public number: number;
    constructor(json: Object) {
        super(json);
        this.deserialize(json, this);
        this.type = json["type"];
        this.msg = json["msg"];
        this.number = json["number"];
    }
}
//游戏阶段通知 public remaining_time:number;
//{"type":"notify","info":{"state":1,"msg":"等待游戏开始阶段","time":100}}
//{"type":"notify","info":{"state":2,"msg":"押注阶段","time":150}}
//{"type":"notify","info":{"state":3,"msg":"封盘阶段","time":39}}
//{"type":"notify","info":{"state":4,"msg":"上庄阶段","time":39}}

class NotifyInfo extends JsonBase {
    public state: number;
    public msg: string;
    public time: number;
    public remaining_time: number;
    constructor(json: Object) {
        super(json);
        this.deserialize(json, this);
    }
}

class PacketNotify extends JsonBase {
    public type: string;
    public info: NotifyInfo;

    constructor(json: Object) {
        super(json);
        //this.deserialize(json, this);
        this.type = json["type"];
        this.info = new NotifyInfo(json['info']);
    }
}

class PacketBackBet extends JsonBase {
    public type: string;
    public msg: string;
    public rows: BetInfo[];

    constructor(json: Object) {
        super(json);
        //this.deserialize(json, this);
        this.type = json["type"];
        this.msg = json["msg"];
        this.rows = new Array();
        for (let row in json['rows']) {
            let jsonObject = json['rows'][row]; console.log("jsonObject>>>>>>>>>>>>>>>>>>>>>>>" + jsonObject);
            let betInfo: BetInfo = new BetInfo(jsonObject);
            //测试数据:
            //betInfo.area = Number(row);
            this.rows.push(betInfo);
        }
    }
}

class OpenResult extends JsonBase {
    public expect: string;
    public opencode: string;
    public opentime;

    public opentimestamp;
    constructor(json: Object) {
        super(json);
        this.deserialize(json, this);
    }
}

//"open_info":{"fk_expect_id":338,"code1":"2","code2":"9","code3":"2","he":13,"dx":1,"ds":1,"dxds":1,"jz":0,"bo":0,"baozi":0}}
class Openinfo extends JsonBase
{
    public he;
    public dx;
    public ds;
    constructor(json: Object) {
        super(json);
        this.deserialize(json, this);
    }
}


class ResultUser extends JsonBase {
    public id: number;       //1
    public nickname: string; //玩家11234
    public number: number;   //输赢

    constructor(json: Object) {
        super(json);
        this.deserialize(json, this);
    }
}

class ResultLoseArea extends JsonBase {
    public area: number;     //区域id, 1
    public bet: number;      //下注多少, 10
    public result: number;   //输了多少
    constructor(json: Object) {
        super(json);
        //this.deserialize(json, this);
        this.area = Number(json["area"]);
        this.bet = Number(json["bet"]);
        this.result = Number(json["result"]);
    }
}

class ResultWinArea extends JsonBase {
    public area: number; //区域id, 3
    public bet: number;  //下注多少, 100
    public result: number;//输赢结果, 100
    public lose_areas: ResultLoseArea[];  //输掉的区域
    constructor(json: Object) {
        super(json);
        this.area = Number(json['area']);
        this.bet = Number(json['bet']);
        this.result = Number(json['result']);

        this.lose_areas = new Array();
        for (let index in json['lose_areas']) {
            let jsonObject = json['lose_areas'][index];
            let item: ResultLoseArea = new ResultLoseArea(jsonObject);
            this.lose_areas.push(item);
        }
    }
}

//牌九的结算结果，分有庄和没有庄
class ResultInfoNineNoBanker extends JsonBase {
    public mode: number;             //0普通模式，1庄家模式
    public banker: number;           //庄家赢多少分,没用
    public area: ResultWinArea[];
    public users: ResultUser[];

    constructor(json: Object) {
        super(json);
        //this.deserialize(json, this);
        this.mode = json['mode'];
        this.banker = json['banker'];
        this.area = new Array();
        for (let index in json['area']) {
            let jsonObject = json['area'][index];
            let item: ResultWinArea = new ResultWinArea(jsonObject);
            this.area.push(item);
        }

        this.users = new Array();
        for (let index in json['users']) {
            let jsonObject = json['users'][index];
            let item: ResultUser = new ResultUser(jsonObject);
            this.users.push(item);
        }
    }
}


class ResultClientArea extends JsonBase {
    public area: number; //下注区域
    public result: number;//输赢多少
    public bet: number;  //下注多少

    constructor(json: Object) {
        super(json);
        //this.deserialize(json, this);
        this.area = Number(json["area"]);
        this.result = Number(json["result"]);
        this.bet = Number(json["bet"]);
    }
}

class ResultInfoNineHaveBanker extends JsonBase {
    public mode: number;             //0普通模式，1庄家模式
    public banker: number;           //庄家赢多少分
    public bank_area: number;        //庄家区域
    public area: ResultClientArea[];
    public users: ResultUser[];

    constructor(json: Object) {
        super(json);
        //this.deserialize(json, this);
        this.mode = Number(json['mode']);
        this.banker = Number(json['banker']);
        this.bank_area = Number(json['bank_area']);
        this.area = new Array();
        for (let index in json['area']) {
            let jsonObject = json['area'][index];
            let item: ResultClientArea = new ResultClientArea(jsonObject);
            this.area.push(item);
        }

        this.users = new Array();
        for (let index in json['users']) {
            let jsonObject = json['users'][index];
            let item: ResultUser = new ResultUser(jsonObject);
            this.users.push(item);
        }
    }
}

class ResultNiuniuWinLose extends JsonBase {
    public id: number;
    public area: number;
    public bet: number;      //下注多少
    public result: number;//输赢多少

    constructor(json: Object) {
        super(json);
        this.deserialize(json, this);
    }
}

class ResultNiuniuNoBankerArea extends JsonBase {
    public win: ResultNiuniuWinLose;
    public lose: ResultNiuniuWinLose;

    constructor(json: Object) {
        super(json);
        //this.deserialize(json, this);
        this.win = null;
        this.lose = null;

        if (json['win'] != null) {
            this.win = new ResultNiuniuWinLose(json['win']);
        }

        if (json['lose'] != null) {
            this.lose = new ResultNiuniuWinLose(json['lose']);
        }
    }
}

//结算牛牛无庄
class ResultInfoNiuniuNoBanker extends JsonBase {
    public mode: number;             //0普通模式，1庄家模式
    public banker: number;           //庄家赢多少分
    public area: ResultNiuniuNoBankerArea;   //输赢区域
    public users: ResultUser[];

    constructor(json: Object) {
        super(json);
        //this.deserialize(json, this);
        this.mode = json['mode'];
        this.banker = json['banker'];
        this.area = null;
        if (json['area'] != null) {
            this.area = new ResultNiuniuNoBankerArea(json['area']);
        }


        this.users = new Array();
        for (let index in json['users']) {
            let jsonObject = json['users'][index];
            let item: ResultUser = new ResultUser(jsonObject);
            this.users.push(item);
        }
    }
}
/*
class ResultNiuniuHaveBankerArea extends JsonBase
{
    public win:number;

    constructor(json: Object){
        super(json);
        this.deserialize(json, this);
    }
}
*/
//结算牛牛有庄,改成和牌九有庄一样了
class ResultInfoNiuniuHaveBanker extends JsonBase {
    public mode: number;             //0普通模式，1庄家模式
    public banker: number;           //庄家赢多少分
    public bank_area: number;        //庄家区域
    public area: ResultClientArea[];
    public users: ResultUser[];

    constructor(json: Object) {
        super(json);
        //this.deserialize(json, this);
        this.mode = Number(json['mode']);
        this.banker = Number(json['banker']);
        this.bank_area = Number(json['bank_area']);
        this.area = new Array();
        for (let index in json['area']) {
            let jsonObject = json['area'][index];
            let item: ResultClientArea = new ResultClientArea(jsonObject);
            this.area.push(item);
        }

        this.users = new Array();
        for (let index in json['users']) {
            let jsonObject = json['users'][index];
            let item: ResultUser = new ResultUser(jsonObject);
            this.users.push(item);
        }
    }

    /*
    public mode:number;             //0普通模式，1庄家模式
    public banker:number;           //庄家赢多少分
    public area:ResultNiuniuHaveBankerArea;   //输赢区域
    public users:ResultUser[];

    constructor(json: Object){
        super(json);
        //this.deserialize(json, this);
        this.mode=json['mode'];
        this.banker=json['banker'];
        this.area = new ResultNiuniuHaveBankerArea(json['area']);

        this.users = new Array();
        for(let index in json['users']) {
            let jsonObject = json['users'][index];
            let item:ResultUser = new ResultUser(jsonObject);
            this.users.push(item);
        }
    }
    */
}

//豪车俱乐部
class ResultInfoCar extends JsonBase {
    public users: ResultUser[];

    constructor(json: Object) {
        super(json);
        //this.deserialize(json, this);

        this.users = new Array();
        for (let index in json['users']) {
            let jsonObject = json['users'][index];
            let item: ResultUser = new ResultUser(jsonObject);
            this.users.push(item);
        }
    }
}

//重庆时时彩-龙虎斗
class ResultInfoLonghu extends JsonBase {
    public mode: number;             //0普通模式，1庄家模式
    public banker: number;           //庄家赢多少分,没用
    public area: ResultWinArea[];
    public users: ResultUser[];

    constructor(json: Object) {
        super(json);
        //this.deserialize(json, this);
        this.mode = json['mode'];
        this.banker = json['banker'];
        this.area = new Array();
        /*for(let index in json['area']) {
            let jsonObject = json['area'][index];
            let item:ResultWinArea = new ResultWinArea(jsonObject);
            this.area.push(item);
        }*/

        this.users = new Array();
        for (let index in json['users']) {
            let jsonObject = json['users'][index];
            let item: ResultUser = new ResultUser(jsonObject);
            this.users.push(item);
        }
    }
}

//重庆时时彩-单张
class ResultInfoDanzhang extends JsonBase {
    public mode: number;             //0普通模式，1庄家模式
    public banker: number;           //庄家赢多少分,没用
    public area: ResultWinArea[];
    public users: ResultUser[];

    constructor(json: Object) {
        super(json);
        //this.deserialize(json, this);
        this.mode = json['mode'];
        this.banker = json['banker'];
        this.area = new Array();
        for (let index in json['area']) {
            let jsonObject = json['area'][index];
            let item: ResultWinArea = new ResultWinArea(jsonObject);
            this.area.push(item);
        }

        this.users = new Array();
        for (let index in json['users']) {
            let jsonObject = json['users'][index];
            let item: ResultUser = new ResultUser(jsonObject);
            this.users.push(item);
        }
    }
}
//欧洲豪车-红包
class ResultInfoHongBao extends JsonBase {
    public mode: number;             //0普通模式，1庄家模式
    public banker: number;           //庄家赢多少分,没用
    public area: ResultWinArea[];
    public users: ResultUser[];

    constructor(json: Object) {
        super(json);
        //this.deserialize(json, this);
        this.mode = json['mode'];
        this.banker = json['banker'];
        this.area = new Array();
        // for (let index in json['area']) {
        //     let jsonObject = json['area'][index];
        //     let item: ResultWinArea = new ResultWinArea(jsonObject);
        //     this.area.push(item);
        // }

        this.users = new Array();
        for (let index in json['users']) {
            let jsonObject = json['users'][index];
            let item: ResultUser = new ResultUser(jsonObject);
            this.users.push(item);
        }
    }
}
//pc蛋蛋
class ResultInfoPcDanDan extends JsonBase {
    public mode: number;             //0普通模式，1庄家模式
    public banker: number;           //庄家赢多少分,没用
    public area: ResultWinArea[];
    public users: ResultUser[];

    constructor(json: Object) {
        super(json);
        //this.deserialize(json, this);
        this.mode = json['mode'];
        this.banker = json['banker'];
        this.area = new Array();
        // for (let index in json['area']) {
        //     let jsonObject = json['area'][index];
        //     let item: ResultWinArea = new ResultWinArea(jsonObject);
        //     this.area.push(item);
        // }

        this.users = new Array();
        for (let index in json['users']) {
            let jsonObject = json['users'][index];
            let item: ResultUser = new ResultUser(jsonObject);
            this.users.push(item);
        }
    }
}

//牌九结算结果（自由模式）
//{"type":"settlement_result","room_type":"1","info":{"mode":0,"banker":0,"area":[{"area":3,"bet":"100","result":100,"lose_areas":[{"area":1,"bet":"10","result":"10"},{"area":4,"bet":"50","result":"50"},{"area":2,"bet":"50","result":40}]}],"users":[{"id":1,"nickname":"\u73a9\u5bb617111920193170",//"number":200},{"id":2,"nickname":"\u73a9\u5bb617112423235566","number":-70},{"id":3,"nickname":"\u73a9\u5bb617112521543668","number":-80}]}}

//牌九结算结果（庄家模式）
//{"type":"settlement_result","room_type":"1","info":{"mode":1,"banker":-350,"area":[{"area":2,"result":"50"},{"area":3,"result":"100"},{"area":4,"result":"50"},{"area":5,"result":"150"}],"users":[{"id":1,"nickname":"\u73a9\u5bb617111920193170","number":250},{"id":2,//"nickname":"\u73a9\u5bb617112423235566","number":50},{"id":3,"nickname":"\u73a9\u5bb617112521543668","number":50}],"bank_area":1}}

//牛牛结算结果（自由模式）
//{"type":"settlement_result","room_type":"2","info":{"mode":0,"banker":0,"area":{"win":{"id":579,"area":1,"bet":"200","total":"200"},"lose":{"id":579,"area":2,"bet":"150","total":"150"}},"users":[{"id":1,"nickname":"\u73a9\u5bb617111920193170","number":300},{"id":2,//"nickname":"\u73a9\u5bb617112423235566","number":-100},{"id":3,"nickname":"\u73a9\u5bb617112521543668","number":-200}]}}

//牛牛结算结果（庄家模式）
//{"type":"settlement_result","room_type":"2","info":{"mode":1,"banker":150,"area":{"win":1},"users":[{"id":2,"nickname":"\u73a9\u5bb617112423235566","number":"-50"},{"id":3,"nickname":"\u73a9\u5bb617112521543668","number":"-100"}]}}

//豪车俱乐部（自由模式）
//{"type":"settlement_result","room_type":"3","info":{"users":[{"id":1,"nickname":"\u73a9\u5bb617111920193170","number":-200},{"id":2,"nickname":"\u73a9\u5bb617112423235566","number":-100}]}}

//红包
//{"type":"settlement_result","room_type":6,"info":{"mode":0,"banker":0,"area":null,"users":[]},"open_result":{"opencode":"03,07,04,05,09,06,01,02,10,08","state":4,"expect":"20180207265","opentime":"2018-02-07 13:00:18","opentimestamp":"1517979618","id":6702}}
//room_type, 牌九1，牛牛2，豪车3 重庆时时彩4
//pc蛋蛋
//{"type":"settlement_result","room_type":7,"info":{"mode":0,"banker":0,"area":null,"users":[]},"open_result":{"opencode":"2,8,6","state":4,"expect":"875834","opentime":"2018-03-08 15:00:11","opentimestamp":"1520492411","id":341}
//,"open_info":{"fk_expect_id":341,"code1":"2","code2":"8","code3":"6","he":16,"dx":2,"ds":2,"dxds":4,"jz":0,"bo":2,"baozi":0}} 
class PacketSettlementResult extends JsonBase {
    public type;
    public room_type: number;
    public open_result: OpenResult;
    public open_info: Openinfo;
    public resultInfoNineNoBanker: ResultInfoNineNoBanker;
    public resultInfoNineHaveBanker: ResultInfoNineHaveBanker;

    public resultInfoNiuniuNoBanker: ResultInfoNiuniuNoBanker;
    public resultInfoNiuniuHaveBanker: ResultInfoNiuniuHaveBanker;

    public resultInfoCar: ResultInfoCar;
    public resultInfoLonghu: ResultInfoLonghu;
    public resultInfoDanzhang: ResultInfoDanzhang;
    public resultInfoHongBao: ResultInfoHongBao;
    public resultInfoPcDanDan: ResultInfoPcDanDan;
    constructor(json: Object) {
        super(json);
        //this.deserialize(json, this);
        this.type = json['type'];
        this.room_type = Number(json['room_type']);
        this.open_result = new OpenResult(json['open_result']);
        this.open_info = new Openinfo(json['open_info']);
        let info = json['info'];
        switch (this.room_type) {
            case 1: //牌九
                {
                    if (info['mode'] == 0)//没庄
                    {
                        this.resultInfoNineNoBanker = new ResultInfoNineNoBanker(info);
                    } else {
                        this.resultInfoNineHaveBanker = new ResultInfoNineHaveBanker(info);
                    }
                    break;
                }
            case 2:
                {
                    if (info['mode'] == 0) {
                        this.resultInfoNiuniuNoBanker = new ResultInfoNiuniuNoBanker(info);
                    } else {
                        this.resultInfoNiuniuHaveBanker = new ResultInfoNiuniuHaveBanker(info);
                    }
                    break;
                }
            case 3:
                {
                    this.resultInfoCar = new ResultInfoCar(info);
                    break;
                }
            case 4:
                {
                    this.resultInfoLonghu = new ResultInfoLonghu(info);
                    break;
                }
            case 5:
                {
                    this.resultInfoDanzhang = new ResultInfoDanzhang(info);
                    break;
                }
            case 6:
                {
                    this.resultInfoHongBao = new ResultInfoHongBao(info);
                    break;
                }
            case 7:
                {
                    this.resultInfoPcDanDan = new ResultInfoPcDanDan(info);
                    break;
                }
        }
    }
}

class BankerInfo extends JsonBase {
    public id: number;
    public nickname: string;
    public price: number;
    public create_time: string;

    constructor(json: Object) {
        super(json);
        //this.deserialize(json, this);
        this.id = Number(json['id']);
        this.nickname = json['nickname'];
        this.price = Number(json['price']);
        this.create_time = json['create_time'];
    }
}

//上庄通知
class PacketReservationBankerNotify extends JsonBase {
    public type: string;       //banker_notify
    public uid: number;        //1
    public nickname: number;   //昵称
    public price: string;      //20000
    public msg: string;        //用户XXX上庄成功
    public banker_list: BankerInfo[]; //上庄列表

    constructor(json: Object) {
        super(json);
        //this.deserialize(json, this);
        this.type = json['type'];
        this.msg = json['msg'];
        this.uid = Number(json['uid']);
        this.nickname = json['nickname'];

        this.banker_list = new Array();
        for (let index in json['banker_list']) {
            let jsonObject = json['banker_list'][index];
            let item: BankerInfo = new BankerInfo(jsonObject);
            this.banker_list.push(item);
        }

    }
}

//取消预约上庄通知
class PacketUnderBankerNotify extends JsonBase {
    public type: string;       //banker_notify
    public uid: number;        //1
    public nickname: number;   //昵称
    public msg: string;        //用户XXX上庄成功
    public banker_list: BankerInfo[]; //上庄列表

    constructor(json: Object) {
        super(json);
        //this.deserialize(json, this);
        this.type = json['type'];
        this.msg = json['msg'];
        this.uid = Number(json['uid']);
        this.nickname = json['nickname'];

        this.banker_list = new Array();
        for (let index in json['banker_list']) {
            let jsonObject = json['banker_list'][index];
            let item: BankerInfo = new BankerInfo(jsonObject);
            this.banker_list.push(item);
        }

    }
}

//庄局通知
class PacketBankerNotify extends JsonBase {
    public type: string;         //banker_notify
    public msg: string;          //用户XXX上庄成功

    public uid: number;          //1
    public price: number;        //上庄区域
    public room_id: number;      //上庄时间
    public area: number;         //1
    public nickname: string;     //1


    constructor(json: Object) {
        super(json);
        //this.deserialize(json, this);

        this.type = json['type'];
        this.msg = json['msg'];

        this.uid = Number(json['uid']);
        this.price = Number(json['price']);
        this.room_id = Number(json['room_id']);
        this.area = Number(json['area']);
        this.nickname = json['nickname'];

    }
}

//下庄通知
class PacketEndBankerNotify extends JsonBase {
    public type: string;       //banker_notify
    public uid: number;        //1
    public msg: string;        //用户XXX上庄成功
    public banker_list: BankerInfo[]; //上庄列表

    constructor(json: Object) {
        super(json);
        //this.deserialize(json, this);
        this.type = json['type'];
        this.msg = json['msg'];
        this.uid = Number(json['uid']);

        this.banker_list = new Array();
        for (let index in json['banker_list']) {
            let jsonObject = json['banker_list'][index];
            let item: BankerInfo = new BankerInfo(jsonObject);
            this.banker_list.push(item);
        }

    }
}

//询问续庄
class PacketLackOfMoneyNotify extends JsonBase {
    public type: string;       //banker_notify
    public price: number;        //现在的钱
    public bankerLimit: number;  //坐庄需要的钱
    public time: number;         //等待秒数
    public uid: number;          //uid
    public msg: string;          //您的做庄余额不足10000已被系统自动下庄，是否续庄？

    constructor(json: Object) {
        super(json);
        //this.deserialize(json, this);
        this.type = json['type'];
        this.price = Number(json['uid']);
        this.bankerLimit = Number(json['uid']);
        this.time = Number(json['uid']);
        this.uid = Number(json['uid']);
        this.msg = json['msg'];
    }
}

//续庄通知
class PacketContinueBankerNotify extends JsonBase {
    public type: string;       //banker_notify
    public uid: number;        //1
    public nickname: string;   //昵称
    public price: number;
    public area: number;         //1
    public msg: string;        //用户XXX续庄成功
    public banker_list: BankerInfo[]; //上庄列表

    constructor(json: Object) {
        super(json);
        //this.deserialize(json, this);
        this.type = json['type'];
        this.msg = json['msg'];
        this.uid = Number(json['uid']);
        this.nickname = json['nickname'];
        this.price = Number(json['price']);
        this.area = Number(json['area']);

        this.banker_list = new Array();
        for (let index in json['banker_list']) {
            let jsonObject = json['banker_list'][index];
            let item: BankerInfo = new BankerInfo(jsonObject);
            this.banker_list.push(item);
        }

    }
}