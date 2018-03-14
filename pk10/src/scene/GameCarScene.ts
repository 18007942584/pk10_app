
class GameCarScene extends BaseScene {

    private itemGroup: eui.Group;
    
    public backImage: eui.Image;
    public mainScroller: eui.Scroller;
    public helpImage: eui.Image;
    public userListImage: eui.Image;

    public leftImage: eui.Image;
    public rightImage: eui.Image;
    
    public gameId;
    public roomId;

    //音效开关
    private soundButton:eui.Button;
    private sound_on=1;

    
    public setGameRoomId(gameId, roomId)
    {
        this.gameId = gameId;
        this.roomId = roomId;
    }

    public constructor() {
        super();
        this.skinName = "resource/skins/scene/GameCarSceneSkin.exml";
        
    }

    public onPopScene(){

    }

    //别人弹出栈，自己重新显示
    public onSceneReshow(){

    }
    
    /**
     * 创建游戏场景
     * Create a game scene
     */
    public createGameScene() {
        //this.loadArray();

        this.mainScroller.viewport.contentWidth = 1140;
        this.mainScroller.viewport.scrollH = 0;
        this.updateButton();

        this.backImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.backHandler, this);

        //this.mainScroller.addEventListener(	egret.TouchEvent.TOUCH_END, this.mainScrollerTouchCancelHandler, this);
        //this.mainScroller.addEventListener(	egret.TouchEvent.TOUCH_CANCEL, this.mainScrollerTouchCancelHandler, this);
        //this.mainScroller.addEventListener(egret.TouchEvent.TOUCH_CANCEL,()=>{console.log("44 Scroller cancel")},this);
        //this.mainScroller.addEventListener(	egret.Event.CHANGE, this.mainScrollerMoveHandler, this);	

        this.helpImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.helpHandler, this);
        this.userListImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.userListHandler, this);

        this.leftImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.leftHandler, this);
        this.rightImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.rightHandler, this);
        console.log(this.leftImage);
        console.log(this.backImage);
    }
    
    public onInit()
    {

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
    
    private showLeft()
    {
        //console.log("左边! direction:"+this.direction+"  lastX:"+this.lastX+" currentX:"+this.currentX);
        var that = this;
        var tw = egret.Tween.get( this.mainScroller.viewport );
        tw.to( {scrollH:0}, 200 ).call(function(){
            that.updateButton();
        });
        
    }

    private showCenter()
    {
        //console.log("中间! direction:"+this.direction+"  lastX:"+this.lastX+" currentX:"+this.currentX);
        var that = this;
        var tw = egret.Tween.get( this.mainScroller.viewport );
        tw.to( {scrollH:500}, 200 ).call(function(){
            that.updateButton();
        });
    }

    private showRight()
    {
        var that = this;
        //console.log("右边! direction:"+this.direction+"  lastX:"+this.lastX+" currentX:"+this.currentX);
        var tw = egret.Tween.get( this.mainScroller.viewport );
        tw.to( {scrollH:1000}, 200 ).call(function(){
            that.updateButton();
        });
    }

    private updateButton()
    {
        if(this.mainScroller.viewport.scrollH<400)
        {//在左边
            this.leftImage.source = "arrow_right_png";
        }else if(this.mainScroller.viewport.scrollH<999)
        {
            this.leftImage.source = "arrow_left_png";
            this.rightImage.source = "arrow_right_png";
        }else
        {
            this.rightImage.source = "arrow_left_png";
        }
    }

    private helpHandler( evt:egret.TouchEvent ):void{
        Director.getInstance().showRuleCarDialog(this,this.sound_on);
    }

    private userListHandler( evt:egret.TouchEvent ):void{
        Director.getInstance().showPlayerListDialog(this, null, this.gameId, this.roomId, "car",this.sound_on);
    }

    private leftHandler( evt:egret.TouchEvent ):void{
        if(this.mainScroller.viewport.scrollH<400)
        {
            this.showCenter();
        }else
        {
            this.showLeft();
        }
    }

    private rightHandler( evt:egret.TouchEvent ):void{
        if(this.mainScroller.viewport.scrollH>501)
        {
            this.showCenter();
        }else
        {
            this.showRight();
        }
    }

    private backHandler( evt:egret.TouchEvent ):void{
        var that = this;
        Director.getInstance().showConfirmDialog("您的资金将在本局结算后返还，确定退出？",this.sound_on, this, function(confirmed:boolean){
            if(confirmed)
            {
                HttpEngine.getInstance().leaveRoom(that.roomId, function(name:string, response:ResponseLeaveRoom){
                    //Director.getInstance().popScene();
                    that.popScene();
                    SocketEngine.getInstance().close();
                    /*
                    if(response.error==0)
                    {
                        //todo: 这个提示打印不出来，待查
                        //延迟打印错误消息
                        var tw = egret.Tween.get( Director.getInstance().getCurrentScene());
                        tw.to( {}, 500 ).call(function(){
                            Toast.launch(response.msg, 2000);    
                        });
                    }
                    */
                }, that);
            }
        });
    }

 
}


