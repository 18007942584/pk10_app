
class GameScrollTest extends eui.Component {

    private itemGroup: eui.Group;
    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView: LoadingUI;

    public backImage: eui.Image;

    public constructor() {
        super();
        //this.skinName = "resource/skins/GameNineSceneSkin.exml";

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

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
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
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
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        //this.loadArray();

        //this.backImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.backHandler, this);

        var scroller = new eui.Scroller();
        var list = new eui.List();  
        list.itemRendererSkinName = `
                <e:Skin states="up,down,disabled" minHeight="50" minWidth="100" xmlns:e="http://ns.egret.com/eui"> <e:Image width="100%" height="100%" scale9Grid="1,3,8,8" alpha.disabled="0.5"
                            source="resource/button_up.png"
                            source.down="resource/button_down.png"/> <e:Label text="{data}" top="8" bottom="8" left="8" right="8"
                            textColor="0xFFFFFF" verticalAlign="middle" textAlign="center"/> </e:Skin>`
        var ac = new eui.ArrayCollection([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
        list.dataProvider = ac;
        scroller.viewport = list;
        scroller.height = 200;
        this.addChild(scroller);

        scroller.addEventListener(egret.TouchEvent.TOUCH_BEGIN,()=>{console.log("111 Scroller Begin")},this);
        list.addEventListener(egret.TouchEvent.TOUCH_BEGIN,()=>{console.log("111 List Begin")},this);

        scroller.addEventListener(egret.TouchEvent.TOUCH_END,()=>{console.log("222 Scroller END")},this);
        list.addEventListener(egret.TouchEvent.TOUCH_END,()=>{console.log("222 List END")},this);

        scroller.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{console.log("33 Scroller Tap")},this);
        list.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{console.log("33 List Tap")},this);

        scroller.addEventListener(egret.TouchEvent.TOUCH_CANCEL,()=>{console.log("44 Scroller cancel")},this);
        list.addEventListener(egret.TouchEvent.TOUCH_CANCEL,()=>{console.log("44 List cancel")},this);
    }
    
    private loadArray(): void {


        var arr = [
            {key : "niuniu20", name : "北京赛车", img:"bjsc_png", 'jiang':"123456789", qi:'646768', last_ticket:'1002344123',weihu: "0"},
            {key : "niuniu20", name : "北京赛车", img:"bjsc_png", 'jiang':"123456789", qi:'646768', last_ticket:'1002344123',weihu: "0"},
            {key : "niuniu20", name : "北京赛车", img:"bjsc_png", 'jiang':"123456789", qi:'646768', last_ticket:'1002344123',weihu: "0"},
            {key : "niuniu20", name : "北京赛车", img:"bjsc_png", 'jiang':"123456789", qi:'646768', last_ticket:'1002344123',weihu: "0"},
            {key : "niuniu20", name : "北京赛车", img:"bjsc_png", 'jiang':"123456789", qi:'646768', last_ticket:'1002344123',weihu: "0"}

        ];

        //let arr = GlobalData.configData.game.hallbtns;
        for (var i = 0; i < arr.length; i++) {

            var button:eui.Button = new eui.Button();
            button.skinName = "resource/skins/HomeListCell.exml";

            
            //var nameLabel:eui.Label = button.getChildByName("nameLabel") as (eui.Label);
            //nameLabel.text = arr[i].name;

            var bgImage:eui.Image = button.getChildByName("bgImage") as (eui.Image);
            bgImage.source = arr[i].img;

            button.x=0;
            button.y = 300*i;
            this.itemGroup.addChild(button);

            button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchEend, this);
        }

        
    }

    private onTouchEend(evt:egret.TouchEvent ):void{
        var newScene:RoomScene = new RoomScene();
        Director.getInstance().pushScene(newScene);
    }
    private backHandler( evt:egret.TouchEvent ):void{
        Director.getInstance().popScene();
        //this.popScene();
    }


   
}


