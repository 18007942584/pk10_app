
class HttpEngine {
    public static instance: HttpEngine = null;
    private urlPrefix: string = null;

    public static getInstance() {
        if (HttpEngine.instance == null) {
            HttpEngine.instance = new HttpEngine();
        }
        return HttpEngine.instance;
    }

    public constructor() {
        this.urlPrefix = CommonConfig.getUrlPrefix();
    }

    //获取手机验证码
    public sendSMSCode(phone: string, callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var url: string = this.urlPrefix + "/resource/sendsmscode.html";
        var post_data: string = "phone=" + phone;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: ResponseSMSCode = new ResponseSMSCode(data);
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResponseSMSCode = new ResponseSMSCode(json);
                observer.notify("", response);
            }
        });
    }

    public sendRegist(nickname: string, user_name: string, password: string, repassword: string, code: string, sms_code: string, callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var url: string = this.urlPrefix + "/member/register.html";
        var post_data: string = "nickname=" + nickname + "&user_name=" + user_name + "&password=" + password + "&repassword=" + repassword + "&code=" + code + "&sms_code=" + sms_code;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: ResponseRegist = new ResponseRegist(data);
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResponseRegist = new ResponseRegist(json);
                observer.notify("", response);
            }
        });
    }

    public sendLogin(user_name: string, password: String, is_tourists: number, callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var url: string = this.urlPrefix + "/member/login.html";
        var post_data: string = "user_name=" + user_name + "&password=" + password + "&is_tourists=" + is_tourists;
        //Toast.launch("开始登录:"+post_data);
        this.postRequest(url, post_data, function (response_str: string) {
            //Toast.launch("登录返回:"+response_str);
            try {
                var data = JSON.parse(response_str);
                Logger.log("parse login response");
                var response: ResponseLogin = new ResponseLogin(data);
                Logger.log("parse login response done");
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResponseLogin = new ResponseLogin(json);
                observer.notify("", response);
            }
        });
    }

    public getUserInfo(callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var access_token: string = ClientStorage.getAccessToken();
        var url: string = this.urlPrefix + "/Api/member/user_info.html";
        var post_data: string = "access_token=" + access_token;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: ResponseUserInfo = new ResponseUserInfo(data);
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResponseUserInfo = new ResponseUserInfo(json);
                observer.notify("", response);
            }
        });
    }

    //最新公告
    //当前在线总人数
    public getNotice(callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var access_token: string = ClientStorage.getAccessToken();
        var url: string = this.urlPrefix + "/resource/get_notice.html";
        var post_data: string = "access_token=" + access_token;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: ResponseNotice = new ResponseNotice(data);
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResponseNotice = new ResponseNotice(json);
                observer.notify("", response);
            }
        });
    }

    //当前在线总人数
    public getOnlinecount(callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var access_token: string = ClientStorage.getAccessToken();
        var url: string = this.urlPrefix + "/Api/game/onlinecount.html";
        var post_data: string = "access_token=" + access_token;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: ResponseOnlinecount = new ResponseOnlinecount(data);
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResponseOnlinecount = new ResponseOnlinecount(json);
                observer.notify("", response);
            }
        });
    }

    public getRoomList(gameId: number, is_fixed: number, callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var access_token: string = ClientStorage.getAccessToken();
        var url: string = this.urlPrefix + "/api/game/rooms.html";
        var post_data: string = "access_token=" + access_token + "&game_id=" + gameId + "&is_fixed=" + is_fixed;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: ResponseRoomList = new ResponseRoomList(data);
                DataEngine.getInstance().setRoomInfoList(response.rows);
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResponseRoomList = new ResponseRoomList(json);
                observer.notify("", response);
            }
        });
    }

    public getRoomListAll(gameId: number, callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var access_token: string = ClientStorage.getAccessToken();
        var url: string = this.urlPrefix + "/api/game/rooms.html";
        var post_data: string = "access_token=" + access_token + "&game_id=" + gameId;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: ResponseRoomList = new ResponseRoomList(data);
                DataEngine.getInstance().setRoomInfoList(response.rows);
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResponseRoomList = new ResponseRoomList(json);
                observer.notify("", response);
            }
        });
    }

    public getGameList(callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var access_token: string = ClientStorage.getAccessToken();
        var url: string = this.urlPrefix + "/resource/games.html";
        var post_data: string = "access_token=" + access_token;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: ResponseGameList = new ResponseGameList(data);
                DataEngine.getInstance().setGameInfoList(response.rows);
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResponseGameList = new ResponseGameList(json);
                observer.notify("", response);
            }
        });
    }

    public bindClient(clientId: number, callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var access_token: string = ClientStorage.getAccessToken();
        var url: string = this.urlPrefix + "/api/game/bindclient.html";
        var post_data: string = "client_id=" + clientId + "&access_token=" + access_token;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: ResponseBindClient = new ResponseBindClient(data);
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResponseBindClient = new ResponseBindClient(json);
                observer.notify("", response);
            }
        });
    }

    //确认下注
    public confirmBet(callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var access_token: string = ClientStorage.getAccessToken();
        var url: string = this.urlPrefix + "/api/game/confirm_bet.html";
        var post_data: string = "access_token=" + access_token;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: ResponseConfirmBet = new ResponseConfirmBet(data);
                response.responseStr = response_str;
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResponseConfirmBet = new ResponseConfirmBet(json);
                observer.notify("", response);
            }
        });
    }


    //取消下注
    public cancleBet(callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var access_token: string = ClientStorage.getAccessToken();
        var url: string = this.urlPrefix + "/api/game/cancel_bet.html";
        var post_data: string = "access_token=" + access_token;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: ResponseCancleBet = new ResponseCancleBet(data);
                response.responseStr = response_str;
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResponseCancleBet = new ResponseCancleBet(json);
                observer.notify("", response);
            }
        });
    }


    public joinRoom(roomId: number, client_id: number, callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var access_token: string = ClientStorage.getAccessToken();
        var url: string = this.urlPrefix + "/api/game/joinroom.html";
        var post_data: string = "room_id=" + roomId + "&client_id=" + client_id + "&access_token=" + access_token;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: ResponseJoinRoom = new ResponseJoinRoom(data);
                response.responseStr = response_str;
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResponseJoinRoom = new ResponseJoinRoom(json);
                observer.notify("", response);
            }
        });
    }

    public leaveRoom(roomId: number, callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var access_token: string = ClientStorage.getAccessToken();
        var url: string = this.urlPrefix + "/api/game/leaveroom.html";
        var post_data: string = "room_id=" + roomId + "&access_token=" + access_token;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: ResponseLeaveRoom = new ResponseLeaveRoom(data);
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResponseLeaveRoom = new ResponseLeaveRoom(json);
                observer.notify("", response);
            }
        });
    }

    public reservationBanker(price: number, callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var access_token: string = ClientStorage.getAccessToken();
        var url: string = this.urlPrefix + "/api/game/reservation_banker.html";
        var post_data: string = "price=" + price + "&access_token=" + access_token;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: ResponseReservationBanker = new ResponseReservationBanker(data);
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResponseReservationBanker = new ResponseReservationBanker(json);
                observer.notify("", response);
            }
        });
    }

    public underBanker(callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var access_token: string = ClientStorage.getAccessToken();
        var url: string = this.urlPrefix + "/api/game/under_banker.html";
        var post_data: string = "access_token=" + access_token;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: ResponseUnderBanker = new ResponseUnderBanker(data);
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResponseUnderBanker = new ResponseUnderBanker(json);
                observer.notify("", response);
            }
        });
    }

    public continueBanker(price: number, callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var access_token: string = ClientStorage.getAccessToken();
        var url: string = this.urlPrefix + "/api/game/continue_banker.html";
        var post_data: string = "price=" + price + "&access_token=" + access_token;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: ResponseContinueBanker = new ResponseContinueBanker(data);
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResponseContinueBanker = new ResponseContinueBanker(json);
                observer.notify("", response);
            }
        });
    }


    public getNewExpect(callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var access_token: string = ClientStorage.getAccessToken();
        var url: string = this.urlPrefix + "/resource/newExpect.html";
        var post_data: string = "access_token=" + access_token;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: ResponseNewExpect = new ResponseNewExpect(data);
                DataEngine.getInstance().setExpectInfoList(response.rows);
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResponseNewExpect = new ResponseNewExpect(json);
                observer.notify("", response);
            }
        });
    }
    //PC蛋蛋
    public getPcddRules(gameId: number, type: Number, callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var access_token: string = ClientStorage.getAccessToken();
        var url: string = this.urlPrefix + "/api/pcdd/rules.html";
        var post_data: string = "game_id=" + gameId + "&type=" + type + "&access_token=" + access_token;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: ResultPcddRules = new ResultPcddRules(data);
                DataEngine.getInstance().setExpectInfoList(response.rows);
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResultPcddRules = new ResultPcddRules(json);
                observer.notify("", response);
            }
        });
    }

    //PC蛋蛋
    public getConfirmBet(area: number, gold: string ,quickBet :string, callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var access_token: string = ClientStorage.getAccessToken();
        var url: string = this.urlPrefix + "/api/pcdd/game_bet.html";
        var post_data: string = "area=" + area + "&number=" + gold + "&quick_bet=" + quickBet + "&access_token=" + access_token;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: ResConfirmBet = new ResConfirmBet(data);
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResConfirmBet = new ResConfirmBet(json);
                observer.notify("", response);
            }
        });
    }

    public sendBet(area: number, number: number, callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var access_token: string = ClientStorage.getAccessToken();
        var url: string = this.urlPrefix + "/api/game/bet.html";
        var post_data: string = "area=" + area + "&number=" + number + "&access_token=" + access_token;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: ResponseBet = new ResponseBet(data);
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResponseBet = new ResponseBet(json);
                observer.notify("", response);
            }
        });
    }
    //发红包
    public sendbao(number: number, ray: number, type: number, callback: Function, context: any) {

        var observer: Observer = new Observer(callback, context);
        var access_token: string = ClientStorage.getAccessToken();
        var url: string = this.urlPrefix + "/api/redbao/send_bao.html";
        var post_data: string = "number=" + number + "&ray=" + ray + "&type=" + type + "&access_token=" + access_token;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: Responsebao = new Responsebao(data);
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: Responsebao = new Responsebao(json);
                observer.notify("", response);
            }
        });
    }
    //领红包
    public receive(baoid: number, callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var access_token: string = ClientStorage.getAccessToken();
        var url: string = this.urlPrefix + "/api/redbao/receive.html";
        var post_data: string = "bao_id=" + baoid + "&access_token=" + access_token;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: receive = new receive(data);
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: receive = new receive(json);
                observer.notify("", response);
            }
        });
    }
    //红包类型
    public baoTypes(callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var access_token: string = ClientStorage.getAccessToken();
        var url: string = this.urlPrefix + "/api/redbao/bao_types.html";
        var post_data: string = "access_token=" + access_token;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: ResponsebaoType = new ResponsebaoType(data);
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResponsebaoType = new ResponsebaoType(json);
                observer.notify("", response);
            }
        });
    }
    //红包列表
    public baoLists(callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var access_token: string = ClientStorage.getAccessToken();
        var url: string = this.urlPrefix + "/api/redbao/bao_lists.html";
        var post_data: string = "access_token=" + access_token;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: ResbaoLists = new ResbaoLists(data);
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResbaoLists = new ResbaoLists(json);
                observer.notify("", response);
            }
        });
    }
    //红包详情
    public baoinfo(baoid: number, callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var access_token: string = ClientStorage.getAccessToken();
        var url: string = this.urlPrefix + "/api/redbao/bao_info.html";
        var post_data: string = "bao_id=" + baoid + "&access_token=" + access_token;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: ResbaoInfo = new ResbaoInfo(data);
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResbaoInfo = new ResbaoInfo(json);
                observer.notify("", response);
            }
        });
    }
    //发送红包
    public sendLogs(date: string, page: number, row: number, callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var access_token: string = ClientStorage.getAccessToken();
        var url: string = this.urlPrefix + "/api/redbao/send_logs.html";
        var post_data: string = "date=" + date + "&page=" + page + "&row=" + row + "&access_token=" + access_token;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: RessendLogs = new RessendLogs(data);
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: RessendLogs = new RessendLogs(json);
                observer.notify("", response);
            }
        });
    }
    //红包抢到红包
    public receiveLogs(date: string, page: number, row: number, callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var access_token: string = ClientStorage.getAccessToken();
        var url: string = this.urlPrefix + "/api/redbao/receive_logs.html";
        var post_data: string = "date=" + date + "&page=" + page + "&row=" + row + "&access_token=" + access_token;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: ResReceivelogs = new ResReceivelogs(data);
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResReceivelogs = new ResReceivelogs(json);
                observer.notify("", response);
            }
        });
    }
    //奖池
    public jackpotNumber(callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var access_token: string = ClientStorage.getAccessToken();
        var url: string = this.urlPrefix + "/api/redbao/jackpot_number.html";
        var post_data: string = "access_token=" + access_token;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: ResJackpotNumber = new ResJackpotNumber(data);
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResJackpotNumber = new ResJackpotNumber(json);
                observer.notify("", response);
            }
        });
    }
    public getRoomStaffs(callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var access_token: string = ClientStorage.getAccessToken();
        var url: string = this.urlPrefix + "/api/game/roomstaffs.html";
        var post_data: string = "access_token=" + access_token;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: ResponseRoomStaff = new ResponseRoomStaff(data);
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResponseRoomStaff = new ResponseRoomStaff(json);
                observer.notify("", response);
            }
        });
    }

    //发聊天消息
    public sendTalk(message: string, callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var access_token: string = ClientStorage.getAccessToken();
        var url: string = this.urlPrefix + "/api/game/talk.html";
        var post_data: string = "message=" + message + "&access_token=" + access_token;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: ResponseTalk = new ResponseTalk(data);
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResponseTalk = new ResponseTalk(json);
                observer.notify("", response);
            }
        });
    }

    //获取下注历史
    public getBetLog(all: Number, date: string, page: number, row: number, callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var access_token: string = ClientStorage.getAccessToken();
        //var url:string = this.urlPrefix+"/api/member/betlogs.html";
        var url: string = this.urlPrefix + "/api/member/newbetlogs.html";
        var post_data: string = "date=" + date + "&access_token=" + access_token + "&page=" + page + "&row=" + row;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: ResponseBetLogs = new ResponseBetLogs(data);
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResponseBetLogs = new ResponseBetLogs(json);
                observer.notify("", response);
            }
        });
    }

    //获取今日龙虎下注额
    public getLonghuBet(room_id: Number, date: string, callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var access_token: string = ClientStorage.getAccessToken();
        var url: string = this.urlPrefix + "/api/member/bet_total.html";
        var post_data: string = "room_id=" + room_id + "&date=" + date + "&access_token=" + access_token;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: ResponseLonghuBet = new ResponseLonghuBet(data);
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResponseLonghuBet = new ResponseLonghuBet(json);
                observer.notify("", response);
            }
        });
    }

    //获取牌九的开奖历史
    public getOpenResultNine(gameId: Number, row: Number, callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var access_token: string = ClientStorage.getAccessToken();
        var url: string = this.urlPrefix + "/resource/paijiu_results.html";
        var post_data: string = "gameId=" + gameId + "&row=" + row + "&access_token=" + access_token;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: ResponeOpenResultNine = new ResponeOpenResultNine(data);
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResponeOpenResultNine = new ResponeOpenResultNine(json);
                observer.notify("", response);
            }
        });
    }


    //获取牛牛的开奖历史
    public getOpenResultNiuNiu(gameId: Number, row: Number, callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var access_token: string = ClientStorage.getAccessToken();
        var url: string = this.urlPrefix + "/resource/niuniu_result.html";
        var post_data: string = "gameId=" + gameId + "&row=" + row + "&access_token=" + access_token;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: ResponeOpenResultNiuNiu = new ResponeOpenResultNiuNiu(data);
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResponeOpenResultNiuNiu = new ResponeOpenResultNiuNiu(json);
                observer.notify("", response);
            }
        });
    }

    //获取官方开奖结果
    public getOpenOfficalResult(gameId: Number, row: Number, callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var access_token: string = ClientStorage.getAccessToken();
        var url: string = this.urlPrefix + "/resource/official_result.html";
        var post_data: string = "gameId=" + gameId + "&row=" + row + "&access_token=" + access_token;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: ResponeOpenOfficalResult = new ResponeOpenOfficalResult(data);
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResponeOpenOfficalResult = new ResponeOpenOfficalResult(json);
                observer.notify("", response);
            }
        });

    }
        //获取PC蛋蛋开奖结果
    public getOpenPcDanDanResult(gameId: Number, row: Number, callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var access_token: string = ClientStorage.getAccessToken();
        var url: string = this.urlPrefix + "/api/pcdd/game_result.html";
        var post_data: string = "gameId=" + gameId + "&row=" + row + "&access_token=" + access_token;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: ResPcDanDanResult = new ResPcDanDanResult(data);
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResPcDanDanResult = new ResPcDanDanResult(json);
                observer.notify("", response);
            }
        });

    }
    //获取龙虎斗的开奖历史
    public getOpenResultLonghu(gameId: Number, row: Number, callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var access_token: string = ClientStorage.getAccessToken();
        var url: string = this.urlPrefix + "/ssc/resource/longhudou_results.html";
        var post_data: string = "gameId=" + gameId + "&row=" + row + "&access_token=" + access_token;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: ResponeOpenResultLonghu = new ResponeOpenResultLonghu(data);
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResponeOpenResultLonghu = new ResponeOpenResultLonghu(json);
                observer.notify("", response);
            }
        });
    }
    //获取龙虎斗单张开奖结果
    public getOpenResultDanzhang(gameId: Number, row: Number, callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var access_token: string = ClientStorage.getAccessToken();
        var url: string = this.urlPrefix + "/ssc/resource/danzhang_results.html";
        var post_data: string = "gameId=" + gameId + "&row=" + row + "&access_token=" + access_token;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: ResponeOpenResultDanzhang = new ResponeOpenResultDanzhang(data);
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResponeOpenResultDanzhang = new ResponeOpenResultDanzhang(json);
                observer.notify("", response);
            }
        });
    }
    //获取龙虎斗官方开奖结果
    public getOpenOfficalResultLonghu(gameId: number, row: Number, callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var access_token: string = ClientStorage.getAccessToken();
        var url: string = this.urlPrefix + "/ssc/resource/official_result.html";
        var post_data: string = "gameId=" + gameId + "&row=" + row + "&access_token=" + access_token;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: ResponeOpenOfficalResultLonghu = new ResponeOpenOfficalResultLonghu(data);
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResponeOpenOfficalResultLonghu = new ResponeOpenOfficalResultLonghu(json);
                observer.notify("", response);
            }
        });

    }

    public getBankerList(callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);

        var access_token: string = ClientStorage.getAccessToken();
        var url: string = this.urlPrefix + "/api/game/bankers.html";
        var post_data: string = "access_token=" + access_token;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: ResponseGetBankerList = new ResponseGetBankerList(data);
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResponseGetBankerList = new ResponseGetBankerList(json);
                observer.notify("", response);
            }
        });
    }

    //获取服务器配置
    /*
    public getServerConfig(channel_name, callback: Function, context:any)
    {
        var observer:Observer = new Observer(callback, context);

        var url:string = "http://pk.kn86.cn/update_"+channel_name+"/server_config.php";
        this.getRequest(url, function(response_str:string){
            var data = JSON.parse(response_str);
            var response:ResponseServerConfig = new ResponseServerConfig(data);
            observer.notify("", response);  
        });

    }
    */

    //获取服务器配置
    public getGameConfig(channel_name, callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);
        var url: string = this.urlPrefix + "/resource/game_config.html";
        this.getRequest(url, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: ResponseGameConfig = new ResponseGameConfig(data);
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResponseGameConfig = new ResponseGameConfig(json);
                observer.notify("", response);
            }
        });

    }

    //获取某区域下注列表
    public getAreaBetList(area, callback: Function, context: any) {
        var observer: Observer = new Observer(callback, context);
        var url: string = this.urlPrefix + "/api/game/area_bets.html";

        var access_token: string = ClientStorage.getAccessToken();
        var post_data: string = "area=" + area + "&access_token=" + access_token;
        this.postRequest(url, post_data, function (response_str: string) {
            try {
                var data = JSON.parse(response_str);
                var response: ResponseAreaBetList = new ResponseAreaBetList(data);
                observer.notify("", response);
            } catch (e) {
                let json = JSON.parse("{\"error\":-1,\"msg\":\"服务器返回数据出错\"}");
                var response: ResponseAreaBetList = new ResponseAreaBetList(json);
                observer.notify("", response);
            }
        });

    }

    public postRequest(url: string, post_data: string, listener: Function) {
        //Logger.log("send to:"+url+" data:"+post_data);

        var request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        //设置为 POST 请求
        request.open(url, egret.HttpMethod.POST);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.send(post_data);
        //request.addEventListener(egret.Event.COMPLETE,this.onPostComplete,this);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onPostIOError, this);
        request.addEventListener(egret.ProgressEvent.PROGRESS, this.onPostProgress, this);

        request.addEventListener(egret.Event.COMPLETE, function (event: egret.Event) {
            var request = <egret.HttpRequest>event.currentTarget;
            //Logger.log("send done")
            //Logger.log(request.response);
            listener(request.response);
        }, this);
    }

    public getRequest(url: string, listener: Function) {
        //Logger.log("send to:"+url+" data:"+post_data);

        var request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        //设置为 GET 请求
        request.open(url, egret.HttpMethod.GET);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onPostIOError, this);
        request.addEventListener(egret.ProgressEvent.PROGRESS, this.onPostProgress, this);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.send();
        request.addEventListener(egret.Event.COMPLETE, function (event: egret.Event) {
            var request = <egret.HttpRequest>event.currentTarget;
            //Logger.log("send done")
            //Logger.log(request.response);
            listener(request.response);
        }, this);
    }

    /*
    private onPostComplete(event:egret.Event):void {
        var request = <egret.HttpRequest>event.currentTarget;
        Logger.log("response data : ",request.response);
    }
    */

    private onPostIOError(event: egret.IOErrorEvent): void {
        Toast.launch("通信失败，请稍后再试");
        Logger.log("通信失败, 服务器返回了错误");
    }
    private onPostProgress(event: egret.ProgressEvent): void {
        Logger.log("post progress : " + Math.floor(100 * event.bytesLoaded / event.bytesTotal) + "%");
    }
}