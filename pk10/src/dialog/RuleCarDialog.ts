class RuleCarDialog extends eui.Component {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView: LoadingUI;

    private closeImage: eui.Image;
    private ruleLabel: eui.Label;

    private ruleSelectBgImage:eui.Image;
    private rewardSelectBgImage:eui.Image;
    private officialSelectBgImage:eui.Image;
    private menImage:eui.Image;
    private gameRuleImage:eui.Image;

    private rewardResultGroup:eui.Group;
    private officialResultGroup:eui.Group;
    private gameRuleGroup:eui.Group;

    private sound_on:number;
    private backgroundImage: eui.Image;
    public constructor(sound_on:number) {
        super();
        this.sound_on=sound_on;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);

        this.skinName = "resource/skins/dialog/RuleCarDialog.exml";
    }

    private onAddToStage(event: egret.Event) {
        //设置加载进度界面
        //Config to load process interface
        //this.loadingView = new LoadingUI();
        //this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event: RES.ResourceEvent) {
        if (event.groupName == "preload") {
            //this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);

            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            this.createGameScene();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event: RES.ResourceEvent) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event: RES.ResourceEvent) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event: RES.ResourceEvent) {
        if (event.groupName == "preload") {
            //this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private textfield: egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        var text = "\r\n北京赛车-豪车俱乐部\r\n\r\n\r\n开奖时间：每天9:02-23:57,每五分钟开奖一次，每天开奖179期\r\n\r\n\r\n北京赛车PK10，分①②③④⑤⑥⑦⑧⑨⑩十条车道。\r\n\r\n豪车俱乐部是根据北京赛车官方的开奖结果采集而来的，保证结果的公平性。\r\n\r\n\r\n采集PK①车道为豪车俱乐部冠军车\r\n猜中冠军车可获得高倍奖金！";
        this.ruleLabel.text = text;
        this.closeImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeHandler, this);
        this.backgroundImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeHandler, this);
        this.rewardResultGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showRewardResultHandler, this);
        this.officialResultGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showOfficialResultHandler, this);
        this.gameRuleGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gameRuleHandler, this);
    }

    private closeHandler(evt:egret.TouchEvent): void {
        if(this.sound_on){
            Director.getInstance().effectPlay("click_mp3");
        }
        
		this.visible = false;
	}

    private showRewardResultHandler(evt:egret.TouchEvent):void{
        if(this.sound_on){
            Director.getInstance().effectPlay("click_mp3");
        }
        this.rewardSelectBgImage.source="betlistbtn_s_png";
        this.officialSelectBgImage.source="";
        this.ruleSelectBgImage.source="";
        this.menImage.source="menImg_png";
        this.gameRuleImage.source="";
    }

    private showOfficialResultHandler(evt:egret.TouchEvent):void{
        if(this.sound_on){
            Director.getInstance().effectPlay("click_mp3");
        }
        this.rewardSelectBgImage.source="";
        this.officialSelectBgImage.source="betlistbtn_s_png";
        this.ruleSelectBgImage.source="";
        this.menImage.source="menImg_png";
        this.gameRuleImage.source="";
    }

    private gameRuleHandler(evt:egret.TouchEvent):void{
        if(this.sound_on){
            Director.getInstance().effectPlay("click_mp3");
        }
        this.rewardSelectBgImage.source="";
        this.officialSelectBgImage.source="";
        this.ruleSelectBgImage.source="betlistbtn_s_png";
        this.menImage.source="";
        this.gameRuleImage.source="paijiuRules_png";
    }
   

}


