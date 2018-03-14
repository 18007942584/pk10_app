
abstract class BaseScene extends eui.Component {
    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView: LoadingUI = null;

    private resFile:string;     //加载的资源文件
    private resName:string;     //加载的资源名字
    private needShowLoading:boolean;    //是否显示加载进度框
    protected needPreload:boolean = false;

    public constructor() {
        super();
        
        this.resFile = this.provideResFileName();
        this.resName = this.provideResName();
        this.needShowLoading = this.privodeNeedShowLoading();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    protected popScene()
    {
        this.onPopScene();

        let that = this;
        let stageW = this.stage.stageWidth;
        let tw = egret.Tween.get( this );
        tw.to( {x:stageW-0}, 300 ).call(function(){
            that.popSceneEnd();
        });
    }

    protected popSceneWithoutAnimate()
    {
        this.onPopScene();
        this.popSceneEnd();
    }

    protected popSceneEnd()
    {
        
        Director.getInstance().popSceneDirect();
    }
    
    private onAddToStage(event: egret.Event) {
        //设置加载进度界面
        //Config to load process interface
        if(this.needShowLoading)
        {
            console.log('test loadingUI-=-------------------------------1');
            this.loadingView = new LoadingUI();
            this.stage.addChild(this.loadingView);
        }
        	
        if(!this.needPreload)
        {
            let that = this;
            this.createGameScene();
            //加载完毕之后，再飞进来。避免直接显示静态数据
            let stageW = this.stage.stageWidth;
            var tw = egret.Tween.get( this );
            this.x = stageW;
            tw.to( {x:0}, 300 ).call(function(){
                that.onInit();
            }, this);
            return
        }
        //this.stage.dirtyRegionPolicy = "off";
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        //RES.loadConfig("resource/default.res.json", "resource/");
        RES.loadConfig(this.resFile, this.resName);

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
            if(this.loadingView!=null)
            {
                this.stage.removeChild(this.loadingView);
            }

            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);

            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            this.createGameScene();

            //this.stage.addEventListener(egret.Event.DEACTIVATE, this.onGoBackground, this);
            //this.stage.addEventListener(egret.Event.ACTIVATE, this.onGoForeground, this);

            //加载完毕之后，再飞进来。避免直接显示静态数据
            let stageW = this.stage.stageWidth;
            var tw = egret.Tween.get( this );
            this.x = stageW;
            tw.to( {x:0}, 200 );
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
        if (event.groupName == "preload" && this.loadingView!=null) {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    /**
     * 创建游戏场景
     * Create a game scene
     */
    public abstract createGameScene();
    public abstract onInit();
    public abstract onPopScene();   //析构弹出
    public abstract onSceneReshow();  //别人弹出栈，自己重新显示
    public provideResFileName()
    {
        return "resource/default.res.json";
    }

    public provideResName()
    {
        return "resource/";
    }

    //派生类返回false，则不显示加载进度
    public privodeNeedShowLoading()
    {
        return false;
    }
   
   /*
   public onGoBackground(event: egret.Event) {
        console.log("进入后台");
        //Toast.launch("进入后台");
   }

   public onGoForeground(event: egret.Event) {
        console.log("进入前台");
        //Toast.launch("进入前台");
   }
   */
  
}


