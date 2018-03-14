class LoginScene extends BaseScene {

    /**
     * 加载进度界面
     * Process interface loading
     */
    //private loadingView: LoadingUI;

    private loginButton: eui.Button;
    private registButton: eui.Button;

    private logoImageView:eui.Image;

    private usernameTextField: egret.TextField;
    private passwordTextField: egret.TextField;
    private rememberPasswordCheckbox : eui.CheckBox;
    private versionLabel:eui.Label;

    private username:string;
    private password:string;

    private touristLabel:eui.Label;//游客登录
    private is_tourists:number;;
    

    public constructor() {
        super();
        this.skinName = "resource/skins/scene/LoginScene.exml";
    }
    
    public onPopScene(){

    }

    //别人弹出栈，自己重新显示
    public onSceneReshow(){
        let login_name = ClientStorage.getLoginName();
        let login_password = ClientStorage.getLoginPassword();
        this.usernameTextField.text = login_name;
        this.passwordTextField.text = login_password;
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
        this.versionLabel.text = CommonConfig.getChannelTitle()+":"+CommonConfig.egret_version;
        let logoSource = CommonConfig.getLogoSource();
        this.logoImageView.source = logoSource;

        let login_name = ClientStorage.getLoginName();
        let login_password = ClientStorage.getLoginPassword();
        let login_remember_password = ClientStorage.getLoginRememberPassword();

        if(login_remember_password!="0")
        {
            this.rememberPasswordCheckbox.$setSelected(true);
        }else
        {
            this.rememberPasswordCheckbox.$setSelected(false);
        }

        this.usernameTextField.text = login_name;
        this.passwordTextField.text = login_password;

        this.loginButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.loginHandler, this);
        this.registButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.registHandler, this);
        this.touristLabel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.loginByTouristHandler, this);

    }

    public onInit()
    {
        
    }

    private loginByTouristHandler(evt:egret.TouchEvent): void {
        //游客身份直接绕过登录鉴权，进入大厅
        this.is_tourists=1;
        Director.getInstance().effectPlay("click_mp3");
        this.username = "";
        this.password = "";
        this.requestServerConfigAndLogin();
	}

    private loginHandler(evt:egret.TouchEvent): void {
		//var newScene:HomeScene = new HomeScene();
        //Director.getInstance().pushScene(newScene);
        this.is_tourists=0;
        Director.getInstance().effectPlay("click_mp3");
        
        this.username = this.usernameTextField.text;
        this.password = this.passwordTextField.text;
        if(this.username.length==0)
        {
            Toast.launch("请输入用户名");
            return;
        }

        if(this.password.length==0)
        {
            Toast.launch("请输入密码");
            return;
        }

        this.requestServerConfigAndLogin();
	}

    private requestServerConfigAndLogin()
    {
        let that = this;

        //首先请求配置
        let channelName:string = CommonConfig.getChannelName();
        HttpEngine.getInstance().getGameConfig(channelName, function(name, response:ResponseGameConfig){
            CommonConfig.gameConfig.setConfig(response);

            var httpEngine:HttpEngine = HttpEngine.getInstance();
            //Toast.launch("提交注册:"+this.username+":"+this.password);
            httpEngine.sendLogin(that.username, that.password, that.is_tourists, that.onLoginComplete, that);
        }, this);
    }
   
    private registHandler(evt:egret.TouchEvent): void {
        Director.getInstance().effectPlay("click_mp3");
        var newScene:RegistScene = new RegistScene();
        Director.getInstance().pushScene(newScene);
    }

    private onLoginComplete(name:string, responseLogin:ResponseLogin, user_name:string)
    {
        if(responseLogin.error==0)
        {
            //ClientStorage.setUsername(user_name);
            if(this.rememberPasswordCheckbox.selected)
            {
                ClientStorage.setLoginName(this.username);
                ClientStorage.setLoginPassword(this.password);
                ClientStorage.setLoginRememberPassword("1");
            }else
            {
                ClientStorage.setLoginName("");
                ClientStorage.setLoginPassword("");
                ClientStorage.setLoginRememberPassword("0");
            }
            
            //正常账号密码登录
            let is_tourist="0";
            ClientStorage.setIsTourist(is_tourist);
            ClientStorage.setAccessToken(responseLogin.access_token);
            ClientStorage.setRefreshToken(responseLogin.refresh_token);
            //alert("登录成功:"+responseLogin.refresh_token);

            var httpEngine:HttpEngine = HttpEngine.getInstance();
            httpEngine.getUserInfo(function(name:string, responseUserInfo:ResponseUserInfo){
                console.log(responseUserInfo.userInfo.nickname);
                ClientStorage.setUserInfo(responseUserInfo.userInfo);

                //登录注册不连接socket了
                //SocketEngine.getInstance().start();
                var newScene:HomeScene = new HomeScene();
                Director.getInstance().pushScene(newScene); 
                //延迟打印登录成功
                var tw = egret.Tween.get( this );
                tw.to( {}, 200 ).call(function(){
                    Toast.launch('登录成功', 2000);    
                });
                //todo: 登录成功后连接socket，连接socket后收到绑定成功消息，才能打开HomeScene，这里需要修改
                
            }, this);
        }else
        {
            Toast.launch(responseLogin.msg);
        }
        

        console.log(responseLogin.msg);
    }

   
}
