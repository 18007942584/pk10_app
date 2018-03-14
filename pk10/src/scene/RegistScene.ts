class RegistScene extends BaseScene {

    
    private backButton: eui.Button;
    private nextStepButton: eui.Button;
    private getCodeButton:eui.Button;
    //倒计时
    private remainTimeLabel:eui.Label;
    public remainTimer: egret.Timer; //验证码倒计时计时器
    private lastTimerTicket: number = 60; //上次timer时间
    private ontimer:number=1;

    private nicknameLabel: eui.Label;
    private phoneLabel: eui.Label;
    private passwordLabel: eui.Label;
    private repasswordLabel: eui.Label;
    private verifyLabel: eui.Label;//验证码
    private codeLabel:eui.Label;//安全码

    private sms_code:string;

    public constructor() {
        super();

        this.skinName = "resource/skins/scene/RegistScene.exml";
    }


    public onPopScene(){

    }

    //别人弹出栈，自己重新显示
    public onSceneReshow(){

    }
    
    //不显示加载进度
    public privodeNeedShowLoading()
    {
        return false;
    }
    
    /**
     * 创建游戏场景
     * Create a game scene
     */
    public createGameScene() {
        this.backButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.backHandler, this);
        this.getCodeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.mobileCodeHandler, this);
        this.nextStepButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.nextStepHandler, this);
    }

    public onInit() {

    }
    
    private backHandler(evt:egret.TouchEvent): void {
        Director.getInstance().effectPlay("click_mp3");
		//Director.getInstance().popScene();
        this.popScene();
	}
   
   //验证码倒计时
   private remainTimerHandler(){
       //let currentTicket = Math.floor(Number(new Date()) / 1000);
       this.lastTimerTicket--; 
       if(this.lastTimerTicket==0){
           this.ontimer=0;
       }
       switch(this.ontimer){
           case 1:
                this.getCodeButton.visible=false;
                this.remainTimeLabel.visible=true;
                this.remainTimeLabel.text=String(this.lastTimerTicket)+"s";
                
                break;
           case 0:
                this.remainTimer.removeEventListener(egret.TimerEvent.TIMER, this.remainTimerHandler, this);
                this.remainTimer.stop();
                this.getCodeButton.visible=true;
                this.remainTimeLabel.visible=false;
                this.lastTimerTicket=60;
                this.ontimer=1;
                break;
       }
   }

    //短信验证码
    private mobileCodeHandler(evt:egret.TouchEvent):void{
        Director.getInstance().effectPlay("click_mp3");
        var user_name:string = this.phoneLabel.text;
        if(user_name.length<=0)
        {
            Toast.launch("请输入手机号");
            return;
        }

        var httpEngie:HttpEngine = HttpEngine.getInstance();
        httpEngie.sendSMSCode(user_name,  function(name:string, ResponseSMSCode:ResponseSMSCode){
            if(ResponseSMSCode.error!=0)
            {
                Toast.launch(ResponseSMSCode.msg);
                return;
            }
            this.remainTimerHandler();
            this.remainTimer = new egret.Timer(1000, 0);
            this.remainTimer.addEventListener(egret.TimerEvent.TIMER, this.remainTimerHandler, this);
            this.remainTimer.start();
            this.ontimer=1;
            
            //this.sms_code=ResponseSMSCode.code;
            Toast.launch(ResponseSMSCode.msg);
            console.log(ResponseSMSCode);
        }, this);
    }
    private nextStepHandler(evt:egret.TouchEvent): void{
        Director.getInstance().effectPlay("click_mp3");
        var nickname:string = this.nicknameLabel.text;
        var user_name:string = this.phoneLabel.text;
        var password:string = this.passwordLabel.text;
        var repassword:string = this.repasswordLabel.text;
        var sms_code:string = this.verifyLabel.text;
        var code:string = this.codeLabel.text;

        if(nickname.length<=0)
        {
            Toast.launch("请输入昵称");
            return;
        }

        if(user_name.length<=0)
        {
            Toast.launch("请输入手机号");
            return;
        }

        if(password.length<=0)
        {
            Toast.launch("请输入密码");
            return;
        }

        if(repassword.length<=0)
        {
            Toast.launch("请输入重复密码");
            return;
        }

        if(code.length<=0)
        {
            Toast.launch("请输入安全码");
            return;
        }

        if(password!=repassword)
        {
            Toast.launch("两次输入的密码不一致");
            return;
        }

        //if(this.sms_code.length<=4)
        if(sms_code.length<4)
        {
            Toast.launch("请输入正确的验证码");
            return;
        }

        this.requestServerConfigAndRegist(nickname, user_name, password,repassword, code, sms_code);
    }

    private requestServerConfigAndRegist(nickname, user_name, password,repassword, code, sms_code)
    {
        let that = this;
        //首先请求配置
        let channelName:string = CommonConfig.getChannelName();
        HttpEngine.getInstance().getGameConfig(channelName, function(name, response:ResponseGameConfig){
            CommonConfig.gameConfig.setConfig(response);

            //开始注册
            var httpEngie:HttpEngine = HttpEngine.getInstance();
            httpEngie.sendRegist(nickname, user_name, password,repassword, code, sms_code, that.onRegistComplete, this);
        }, this);
    }

    private onRegistComplete(name, responseRegist:ResponseRegist)
    {
        console.log(responseRegist);
        if(responseRegist.error!=0)
        {
            Toast.launch(responseRegist.msg);
            return;
        }

        ClientStorage.setLoginName(this.phoneLabel.text);
        ClientStorage.setLoginPassword(this.passwordLabel.text);
        ClientStorage.setAccessToken(responseRegist.access_token);

        var that = this;
        var httpEngine:HttpEngine = HttpEngine.getInstance();
        httpEngine.getUserInfo(function(name:string, responseUserInfo:ResponseUserInfo){
            
            if(responseUserInfo.error!=0)
            {
                Toast.launch(responseUserInfo.msg);
                return;
            }
            
            console.log(responseUserInfo.userInfo.nickname);
            //ClientStorage.setUsername(user_name);
            ClientStorage.setUserInfo(responseUserInfo.userInfo);

            var newScene:HomeScene = new HomeScene();
            Director.getInstance().pushScene(newScene); 
            //延迟打印注册成功
            var tw = egret.Tween.get( that );
            tw.to( {}, 200 ).call(function(){
                Toast.launch('注册成功', 2000);    
            });
        }, that);
    }
}


