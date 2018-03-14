

class SocketEngine
{
    public static instance:SocketEngine = null;
    public client_id:number = 0;

    public static getInstance() {
        if (SocketEngine.instance == null) {
            SocketEngine.instance = new SocketEngine();
            SocketEngine.instance.prepare();
        }
        return SocketEngine.instance;
    }

    private socket:egret.WebSocket;
    private ip:string = "120.55.42.136";
    private port:number = 8282;
    private local_test = 0;

    private lastPingTicket:number = 0;
    private socketTimer:egret.Timer = null;

    private initCallback:Function;
    private initContext:any;

    public getClientId(){
        return this.client_id;
    }
    public isSocketConnected()
    {
        return this.socket.connected;
    }
    
    public prepare(){
        //120.55.42.136 2901
        this.socket = new egret.WebSocket();
		this.socket.addEventListener( egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this );
		this.socket.addEventListener( egret.Event.CONNECT, this.onSocketOpen, this );
        this.socket.addEventListener(egret.Event.CLOSE, this.onSocketClosed, this);
		
		let that:SocketEngine = this;
        this.addEventListener(SocketEngine.EventNameInit, function(name:string, packet:PacketInit){
            that.client_id = packet.client_id;
            
            if(that.initCallback!=null && that.initContext!=null)
            {
                var observer:Observer = new Observer(that.initCallback, that.initContext);
                observer.notify(name, packet);
                //{type: "init", client_id: "7f0000010b5400000005"}    
            }
        }, this);

        this.socketTimer = new egret.Timer(1000, 0);
        this.socketTimer.addEventListener(egret.TimerEvent.TIMER, this.socketTimerHandler, this);
        this.socketTimer.start();
    }
    
    //先进入房间界面
    //进入房间的时候连接socket，拿到client_id后才去走http进入房间
    //掉线后，重新调用connect走进入流程，退出房间disconnect
    public connect(ip:string, port:number, callback: Function, context:any){
        this.close();

        this.initCallback = callback;
        this.initContext = context;
        this.ip = ip;
        this.port = port;
        this.socket.connect( ip, port );
    }

    public close()
    {
        this.socket.close();
        this.local_test = 0;
        this.initCallback = null;
        this.initContext = null;
    }

    public socketTimerHandler()
    {
        if(this.socket.connected)
        {
            let currentTicket = Number(new Date());
            let usedTicket = (currentTicket-this.lastPingTicket)/1000;
            if(usedTicket<1000000 && usedTicket>22)
            {
                this.lastPingTicket = 0;
                this.socket.close();
                this.onSocketClosed(null);
            }
        }
        
    }

    private onReceiveMessage( evt:egret.ProgressEvent )
	{
        if(this.local_test==1)
        {
            //本地测试，不处理消息
            return;
        }

        var msg:string = this.socket.readUTF();
        if(msg.length>0)
        {
            //this.parseMessage(msg);
            
            //let testStr = "{\"type\":\"ping\"}{\"type\":\"ping\"}{\"type\":\"ping\"}{\"type\":\"ping\"}{\"type\":\"notify\",\"info\":{\"state\":3,\"msg\":\"\\u5c01\\u76d8\\u9636\\u6bb5\",\"time\":39,\"remaining_time\":39}}{\"type\":\"ping\"}{\"type\":\"ping\"}{\"type\":\"ping\"}{\"type\":\"init\",      \"client_id\":\"000000000b5600000060\"}";
        
            let data = "";
            let braceCount = 0;
            for(let i=0;i<msg.length;i++)
            {
                let char = msg.substr(i, 1);
                data += char;
                if(char=="{")
                {
                    braceCount++;
                }else if(char=="}")
                {
                    braceCount--;
                    if(braceCount==0)
                    {
                        this.parseMessage(data);
                        data = "";
                    }
                }
            }
            
        }

        
        
	}

	private onSocketOpen( evt:egret.Event )
	{
		Logger.log("The connection is successful!");
        this.client_id = 0;

        this.lastPingTicket = Number(new Date());
	}

    private onSocketClosed( evt:egret.Event )
	{
        this.fireEvent(SocketEngine.EventNameSocketDisconnect, this.client_id);
        this.client_id = 0;
		Logger.log("The connection is closed!");
	}

	private pushMsg( message:string, evt:egret.TouchEvent )
	{
		this.socket.writeUTF( message );	
		this.socket.flush();
        Logger.log("消息发出!");
	}

    private parseMessage(msg:string)
    {
        var jsonObject = JSON.parse(msg);
        //{type: "init", client_id: "7f0000010b5400000005"}
        //{type: "friend_join", msg: "玩家17103016474940加入了房间",nickname:"玩家17103016474940"}
        //{"type":"online_count","msg":"当前房间总人数1人",count:120} //不用了
        //{"type":"talk",uid:1,"nickname":"玩家17103016474940","msg":"你好"}
        //{"type":"leave_room","uid":"1","msg":"用户XXx离开了房间"}
        //{"type":"bet","msg":"\u73a9\u5bb617112423235566\u6295\u6ce8\u4e8610","number":"10"} 有人下注
        let needLog = true;
        if(jsonObject['type']=="ping")
        {
            needLog = false;
        }

        if(jsonObject['type']==SocketEngine.EventNameInit)//init
        {
            var packetInit:PacketInit = new PacketInit(jsonObject);
            this.fireEvent(SocketEngine.EventNameInit, packetInit);
        }else if(jsonObject['type']==SocketEngine.EventNameFriendJoin)//friend_join
        {
            var packetFriendJoin:PacketFriendJoin = new PacketFriendJoin(jsonObject);
            this.fireEvent(SocketEngine.EventNameFriendJoin, packetFriendJoin);
        }else if(jsonObject['type']==SocketEngine.EventNameOnlineCount)//online_count
        {
            //var packetOnlineCount:PacketOnlineCount = new PacketOnlineCount(jsonObject);
            //不处理
        }else if(jsonObject['type']==SocketEngine.EventNameTalk)//talk
        {
            var packetTalk:PacketTalk = new PacketTalk(jsonObject);
            this.fireEvent(SocketEngine.EventNameTalk, packetTalk);
        }else if(jsonObject['type']==SocketEngine.EventNameLeaveRoom)//leave_room
        {
            var packetLeaveRoom:PacketLeaveRoom = new PacketLeaveRoom(jsonObject);
            this.fireEvent(SocketEngine.EventNameLeaveRoom, packetLeaveRoom);
        }else if(jsonObject['type']==SocketEngine.EventNameBet)//leave_room
        {
            var packetBet:PacketBet = new PacketBet(jsonObject);
            this.fireEvent(SocketEngine.EventNameBet, packetBet);
        }else if(jsonObject['type']==SocketEngine.EventNameSettleMentResult)//leave_room
        {
            var packetSettlementResult:PacketSettlementResult = new PacketSettlementResult(jsonObject);
            this.fireEvent(SocketEngine.EventNameSettleMentResult, packetSettlementResult);
        }else if(jsonObject['type']==SocketEngine.EventNameNotify)//leave_room
        {
            var packetNotify:PacketNotify = new PacketNotify(jsonObject);
            this.fireEvent(SocketEngine.EventNameNotify, packetNotify);
        }else if(jsonObject['type']==SocketEngine.EventNameBackBet)//back_bet
        {
            var packetBackBet:PacketBackBet = new PacketBackBet(jsonObject);
            this.fireEvent(SocketEngine.EventNameBackBet, packetBackBet);
        }else if(jsonObject['type']==SocketEngine.EventNameBankerNotify)
        {
            var packetBankerNotify:PacketBankerNotify = new PacketBankerNotify(jsonObject);
            this.fireEvent(SocketEngine.EventNameBankerNotify, packetBankerNotify);
        }else if(jsonObject['type']==SocketEngine.EventNameReservationBankerNotify)
        {
            var packetReservationBankerNotify:PacketReservationBankerNotify = new PacketReservationBankerNotify(jsonObject);
            this.fireEvent(SocketEngine.EventNameReservationBankerNotify, packetReservationBankerNotify);
        }else if(jsonObject['type']==SocketEngine.EventNameUnderBankerNotify)
        {
            var packetUnderBankerNotify:PacketUnderBankerNotify = new PacketUnderBankerNotify(jsonObject);
            this.fireEvent(SocketEngine.EventNameUnderBankerNotify, packetUnderBankerNotify);
        }else if(jsonObject['type']==SocketEngine.EventNameEndBankerNotify)
        {
            var packetEndBankerNotify:PacketEndBankerNotify = new PacketEndBankerNotify(jsonObject);
            this.fireEvent(SocketEngine.EventNameEndBankerNotify, packetEndBankerNotify);
        }
        else if(jsonObject['type']==SocketEngine.EventNameLackOfMoneyNotify)
        {
            var packetLackOfMoneyNotify:PacketLackOfMoneyNotify = new PacketLackOfMoneyNotify(jsonObject);
            this.fireEvent(SocketEngine.EventNameLackOfMoneyNotify, packetLackOfMoneyNotify);
        }
        else if(jsonObject['type']==SocketEngine.EventNameContinueBankerNotify)
        {
            var packetContinueBankerNotify:PacketContinueBankerNotify = new PacketContinueBankerNotify(jsonObject);
            this.fireEvent(SocketEngine.EventNameContinueBankerNotify, packetContinueBankerNotify);
        }else if(jsonObject['type']==SocketEngine.EventNameSocketSendbao)
        {
            var packetSendbao:PacketSendbao = new PacketSendbao(jsonObject);
            this.fireEvent(SocketEngine.EventNameSocketSendbao, packetSendbao);
        }
        else if(jsonObject['type']=="ping")
        {
            this.lastPingTicket =  Number(new Date());
        }

        if(needLog)
        {
            
            let logStr = "\n"+decodeURI(msg);
            Logger.log( logStr );
        }
    }

    public static EventNameInit = "init";
    public static EventNameFriendJoin = "friend_join";
    public static EventNameOnlineCount = "online_count";
    public static EventNameTalk = "talk";
    public static EventNameLeaveRoom = "leave_room";
    public static EventNameBet = "bet";
    public static EventNameOpenResult = "open_result";
    public static EventNameSettleMentResult = "settlement_result";
    public static EventNameNotify = "notify";
    public static EventNameBackBet = "bet_back";
    public static EventNameBankerNotify = "banker_notify";
    public static EventNameReservationBankerNotify = "reservation_banker_notify";
    public static EventNameUnderBankerNotify = "under_banker_notify";
    public static EventNameEndBankerNotify = "end_banker_notify";
    public static EventNameLackOfMoneyNotify = "lack_of_money";
    public static EventNameContinueBankerNotify = "continue_banker_notify";
    public static EventNameSocketDisconnect = "socket_disconnect";
    public static EventNameSocketSendbao = "redbao_send";

    private listeners:any[] = new Array();
    public addEventListener(name:string, callback: Function, context: any)
    {
        if(this.listeners[name]==null)
        {
            this.listeners[name] = new Array();
        }
        (this.listeners[name] as any[]).push(new Observer(callback, context))
    }

    public removeEventListener(name:string, callback: Function, context: any)
    {
        if(this.listeners[name]==null){
            return;
        }
        let observers: Observer[] = this.listeners[name];
        for (let i = 0; i < observers.length; i++) {  
            let observer = observers[i];  
            if (observer.compar(context)) {  
                observers.splice(i, 1);  
                break;  
            }  
        }  
        if (observers.length == 0) {  
            delete this.listeners[name];  
        }  
    }

    public fireEvent(name: string, ...args: any[]) {  
        let observers: Observer[] = this.listeners[name];  
        if (!observers) return;  
        let length = observers.length;  
        for (let i = 0; i < length; i++) {  
            let observer = observers[i];  
            observer.notify(name, ...args);  
        }  
    }  

    public test()
    {
        this.test_open_result();
        //this.test_conclude_nine_no_banker();
        this.test_conclude_nine_have_banker();
    }

    public test_send_message(str:string)
    {
        //启动本地测试
        this.local_test = 1;
        this.parseMessage(str);
    }

    public test_open_result()
    {
        let str="{\"type\":\"open_result\",\"info\":{\"expect\":\"653194\",\"opencode\":\"08,03,01,04,09,10,05,07,02,06\",\"opentime\":\"2017-11-28 13:47:40\",\"opentimestamp\":\"1511848060\"}}";
        this.parseMessage(str);
    }

    public test_conclude_nine_no_banker(){
        let str = "{\"type\":\"settlement_result\",\"room_type\":\"1\",\"info\":{\"mode\":0,\"banker\":0,\"area\":[{\"area\":3,\"bet\":\"100\",\"result\":100,\"lose_areas\":[{\"area\":1,\"bet\":\"10\",\"result\":\"10\"},{\"area\":4,\"bet\":\"50\",\"result\":\"50\"},{\"area\":2,\"bet\":\"50\",\"result\":40}]}],\"users\":[{\"id\":1,\"nickname\":\"玩家17111920193170\",\"number\":200},{\"id\":2,\"nickname\":\"玩家17112423235566\",\"number\":-70},{\"id\":3,\"nickname\":\"玩家17112521543668\",\"number\":-80}]}}";
        this.parseMessage(str);
    }

    public test_conclude_nine_have_banker(){
        let str = "{\"type\":\"settlement_result\",\"room_type\":\"1\",\"info\":{\"mode\":1,\"banker\":-350,\"area\":[{\"area\":2,\"result\":\"50\"},{\"area\":3,\"result\":\"100\"},{\"area\":4,\"result\":\"50\"},{\"area\":5,\"result\":\"150\"}],\"users\":[{\"id\":1,\"nickname\":\"\\u73a9\\u5bb617111920193170\",\"number\":250},{\"id\":2,\"nickname\":\"\\u73a9\\u5bb617112423235566\",\"number\":50},{\"id\":3,\"nickname\":\"\\u73a9\\u5bb617112521543668\",\"number\":50}],\"bank_area\":1}}";
        this.parseMessage(str);
    }
    public test_conclude_niuniu_no_banker(){
        let str = "{\"type\":\"settlement_result\",\"room_type\":\"2\",\"info\":{\"mode\":0,\"banker\":0,\"area\":{\"win\":{\"id\":579,\"area\":1,\"bet\":\"200\",\"total\":\"200\"},\"lose\":{\"id\":579,\"area\":2,\"bet\":\"150\",\"total\":\"150\"}},\"users\":[{\"id\":1,\"nickname\":\"\\u73a9\\u5bb617111920193170\",\"number\":300},{\"id\":2,\"nickname\":\"\\u73a9\\u5bb617112423235566\",\"number\":-100},{\"id\":3,\"nickname\":\"\\u73a9\\u5bb617112521543668\",\"number\":-200}]}}";
        this.parseMessage(str);
    }
    
    public test_conclude_niuniu_have_banker(){
        let str = "{\"type\":\"settlement_result\",\"room_type\":\"2\",\"info\":{\"mode\":1,\"banker\":150,\"area\":{\"win\":1},\"users\":[{\"id\":2,\"nickname\":\"\\u73a9\\u5bb617112423235566\",\"number\":\"-50\"},{\"id\":3,\"nickname\":\"\\u73a9\\u5bb617112521543668\",\"number\":\"-100\"}]}}";
        this.parseMessage(str);
    }

    public test_conclude_car(){
        let str = "{\"type\":\"settlement_result\",\"room_type\":\"3\",\"info\":{\"users\":[{\"id\":1,\"nickname\":\"\\u73a9\\u5bb617111920193170\",\"number\":-200},{\"id\":2,\"nickname\":\"\\u73a9\\u5bb617112423235566\",\"number\":-100}]}}";
        this.parseMessage(str);
    }
}