class RuleNiuNiudialog extends BaseDialog {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView: LoadingUI;

    private closeImage: eui.Image;
    private ruleLabel: eui.Label;

    private ruleSelectBgImage: eui.Image;
    private rewardSelectBgImage: eui.Image;
    private officialSelectBgImage: eui.Image;
    private menImage: eui.Image;
    //private gameRuleImage: eui.Image;
    private gameRuleButton: eui.Button;
    private extraIntro: eui.Label;

    private rewardResultGroup: eui.Group;
    private officialResultGroup: eui.Group;
    private gameRuleGroup: eui.Group;

    private tab_type: string;
    private room_type: string;
    private is_official:number;
    private GameGroup: eui.Group;
    private GameScroller: eui.Scroller;
    // private BtnrewardSelec: eui.Button;
    // private BtnofficialSelec: eui.Button;
    private offcialResultList: eui.Group;
    private rewardResultList: eui.Group;
    private offcialResultItemList: any[] = null;
    private rewardResultItemList: any[] = null;

    private sound_on: number;

    private channelName:string ;

    private backgroundImage: eui.Image;
    private row = 30;
    private Game_id: number;
    public constructor(tab_type: string, room_type: string, sound_on: number, Game_id: number,is_official:number) {
        super();
        this.sound_on = sound_on;
        this.tab_type = tab_type;
        this.room_type = room_type;
        this.is_official=is_official;
        this.Game_id = Game_id;
        console.log(tab_type + "-" + room_type);
        this.skinName = "resource/skins/dialog/CommonDialog.exml";
        //if(tab_type == "rewardResult")
        {
            this.GameGroup.removeChildren();
        }
    }


    /**
     * 创建游戏场景
     * Create a game scene
     */
    public createGameScene() {
        this.channelName = CommonConfig.getChannelName();

        this.closeImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeHandler, this);
        this.backgroundImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeHandler, this);
        this.rewardResultGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showRewardResultHandler, this);
        this.officialResultGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showOfficialResultHandler, this);
        this.gameRuleGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gameRuleHandler, this);


        // var timer: egret.Timer = new egret.Timer(1000, 0);
        // timer.addEventListener(egret.TimerEvent.TIMER, this.updateTimerHandler, this);
        // timer.start();

        if (this.tab_type == "rewardResult") {
            this.GameScroller.viewport.validateNow();
            this.GameScroller.viewport.scrollV = 0;
            //this.GameGroup.removeChildren();
            this.rewardSelectBgImage.source = "betlistbtn_s_png";
            this.officialSelectBgImage.source = "";
            this.ruleSelectBgImage.source = "";
            this.menImage.source = "menImg2_png";
            HttpEngine.getInstance().getOpenResultNiuNiu(this.Game_id, this.row, this.getNewRewardSelec, this);
        } else if (this.tab_type == "gameRule") {
            this.rewardSelectBgImage.source = "";
            this.officialSelectBgImage.source = "";
            this.ruleSelectBgImage.source = "betlistbtn_s_png";
            this.menImage.source = "";
            if(this.channelName=='shpk10'){
                //四海
                //this.gameRuleImage.source = "bj_niuniu_png";
                this.gameRuleButton.skinName = "resource/skins/dialog/RuleViewBjNiuniu.exml";
            }else{
                //通用
                //this.gameRuleImage.source = "ty_bj_niuniu_png";
                this.gameRuleButton.skinName = "resource/skins/dialog/RuleViewTyBjNiuniu.exml";
            }
            this.GameGroup.addChild(this.gameRuleButton);
            let tween = egret.Tween.get(this);
            tween.wait(50).call(this.gameRuleHandler, null);
        }
    }
    private getNewRewardSelec(name: string, response: ResponeOpenResultNiuNiu): void {
        this.rewardResultItemList = new Array();
        for (var row in response.rows) {
            let item: OpenResultNiuNiu = response.rows[row] as OpenResultNiuNiu;
            var data = {
                gameInfo: item,
                expect: item.expect,
                datetime: item.datetime,
                area1: item.area1,
                area2: item.area2,
                is_win1: item.is_win1,
                is_win2: item.is_win2,
            }
            this.rewardResultItemList.push(data);
        }
        this.updateRewardSelec();
    }
    private updateRewardSelec() {
        let iarray: any[] = new Array();
        iarray = this.rewardResultItemList.reverse();
        for (var i = 0; i < iarray.length; i++) {
            let item = iarray[i];
            var RuleNiuNiuRewardSelec = new eui.Button();
            RuleNiuNiuRewardSelec.skinName = "resource/skins/dialog/RuleNiuNiuRewardSelec.exml";
            RuleNiuNiuRewardSelec.x = 0;
            RuleNiuNiuRewardSelec.y = 100 * i;
            this.GameGroup.addChild(RuleNiuNiuRewardSelec);
            var rewardSelecGaoup: eui.Group = RuleNiuNiuRewardSelec.getChildByName("RewardSelecGaoup") as (eui.Group);
            var noerLabel: eui.Label = rewardSelecGaoup.getChildByName("NoerLabel") as (eui.Label)
            var TimeLabel: eui.Label = rewardSelecGaoup.getChildByName("TimeLabel") as (eui.Label);
            var niuniu1: eui.Image = rewardSelecGaoup.getChildByName("niuniu1") as (eui.Image);
            var niuniu2: eui.Image = rewardSelecGaoup.getChildByName("niuniu2") as (eui.Image);
            var win2: eui.Image = rewardSelecGaoup.getChildByName("win2") as (eui.Image);
            var win1: eui.Image = rewardSelecGaoup.getChildByName("win1") as (eui.Image);
            noerLabel.text = item.expect + "期";
            TimeLabel.text = item.datetime;
            niuniu1.source = "n" + item.area1 + "_png";
            niuniu2.source = "n" + item.area2 + "_png";
            if (item.is_win1 == 0 && item.is_win2 == 1) {
                win1.visible = false;
                win2.visible = true;
            } else if (item.is_win1 == 1 && item.is_win2 == 0) {
                win1.visible = true;
                win2.visible = false;
            }
        }
    }
    private getNewOfficalResults(name: string, response: ResponeOpenOfficalResult): void {
        this.offcialResultItemList = new Array();
        for (var row in response.rows) {
            let item: OpenOfficalResults = response.rows[row] as OpenOfficalResults; console.log(response);
            var data = {
                gameInfo: item,
                expect: item.expect,
                opencode: item.opencode,
                opentime: item.opentime
            }
            this.offcialResultItemList.push(data);
        }
        this.updateOfficalResults();
    }
    private updateOfficalResults() {

        for (var i = 0; i < this.offcialResultItemList.length; i++) {
            let item = this.offcialResultItemList[i];
            var BtnofficialSelec = new eui.Button();
            BtnofficialSelec.skinName = "resource/skins/dialog/NineofficialSelectDlg.exml";
            BtnofficialSelec.x = 0;
            BtnofficialSelec.y = 100 * i;
            this.GameGroup.addChild(BtnofficialSelec);
            var officialSelectGroup: eui.Group = BtnofficialSelec.getChildByName("officialSelectGroup") as (eui.Group);
            var noerLabel: eui.Label = officialSelectGroup.getChildByName("NoerLabel") as (eui.Label)
            var TimeLabel: eui.Label = officialSelectGroup.getChildByName("TimeLabel") as (eui.Label);
            noerLabel.text = item.expect + "期";
            TimeLabel.text = item.opentime;

            //先隐藏数字
            for (let i = 0; i < 10; i++) {
                let code = i + 1;
                let resultImageName = "Ranking_Image_" + String(code);
                let resultImage: eui.Image = officialSelectGroup.getChildByName(resultImageName) as (eui.Image);
                resultImage.visible = false;
            }
            //再显示数字
            let openCodeList: any[] = item.opencode.split(",");//名次， 第几名是哪个车
            let codeCount: number = openCodeList.length;
            for (let i = 0; i < openCodeList.length; i++) {
                let code: number = Number(openCodeList[i]);
                if (code == 0) {
                    code = 10;
                }
                let resultImageName = "Ranking_Image_" + String(code);
                let resultImage: eui.Image = officialSelectGroup.getChildByName(resultImageName) as (eui.Image);
                resultImage.x = 39 * (12 - codeCount) / 2 + 39 * i;
                resultImage.visible = true;

            }
        }

    }
    //private RuleNineDialog:RuleNineDialog = null;
    private closeHandler(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            Director.getInstance().effectPlay("click_mp3");
        }
        //this.parent.removeChild(this);
        this.visible = false;
    }

    private showRewardResultHandler(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            Director.getInstance().effectPlay("click_mp3");
        }
        this.GameScroller.viewport.validateNow();
        this.GameScroller.viewport.scrollV = 0;
        this.GameGroup.removeChildren();
        this.rewardSelectBgImage.source = "betlistbtn_s_png";
        HttpEngine.getInstance().getOpenResultNiuNiu(this.Game_id, this.row, this.getNewRewardSelec, this);
        this.officialSelectBgImage.source = "";
        this.ruleSelectBgImage.source = "";
        this.menImage.source = "menImg2_png";

    }

    private showOfficialResultHandler(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            Director.getInstance().effectPlay("click_mp3");
        }
        this.GameScroller.viewport.validateNow();
        this.GameScroller.viewport.scrollV = 0;
        this.GameGroup.removeChildren();
        HttpEngine.getInstance().getOpenOfficalResult(this.Game_id, this.row, this.getNewOfficalResults, this)
        this.rewardSelectBgImage.source = "";
        this.officialSelectBgImage.source = "betlistbtn_s_png";
        this.ruleSelectBgImage.source = "";
        this.menImage.source = "";
    }

    private gameRuleHandler(evt: egret.TouchEvent): void {
        if (this.sound_on && evt!=null) {
            Director.getInstance().effectPlay("click_mp3");
        }
        this.GameScroller.viewport.validateNow();
        this.GameScroller.viewport.scrollV = 0;
        this.GameGroup.removeChildren();
        this.rewardSelectBgImage.source = "";
        this.officialSelectBgImage.source = "";
        this.ruleSelectBgImage.source = "betlistbtn_s_png";
        this.menImage.source = "";
        if(this.channelName=='shpk10'){
            //四海
            //this.gameRuleImage.source = "bj_niuniu_png";
            this.gameRuleButton.skinName = "resource/skins/dialog/RuleViewBjNiuniu.exml";
        }else{
            //通用
            //this.gameRuleImage.source = "ty_bj_niuniu_png";
            this.gameRuleButton.skinName = "resource/skins/dialog/RuleViewTyBjNiuniu.exml";
        }
        //this.GameGroup.addChild(this.gameRuleImage);
        this.GameGroup.addChild(this.gameRuleButton);
    }
}

