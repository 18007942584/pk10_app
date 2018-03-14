class RuleLonghuDialog extends BaseDialog {

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
    private GameScroller:eui.Scroller
    // private BtnrewardSelec: eui.Button;
    // private BtnofficialSelec: eui.Button;
    private offcialResultList: eui.Group;
    private rewardResultList: eui.Group;
    private offcialResultItemList: any[] = null;
    private rewardResultItemList: any[] = null;

    private sound_on: number;
    private channelName:string ;

    private Ranking_Image_1: eui.Image;
    private Ranking_Image_2: eui.Image;
    private Ranking_Image_3: eui.Image;
    private Ranking_Image_4: eui.Image;
    private Ranking_Image_5: eui.Image;
    private backgroundImage: eui.Image;

    private Game_id: number;
    private row = 30;
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
            this.menImage.source = "";
            HttpEngine.getInstance().getOpenResultLonghu(this.Game_id, this.row, this.getNewRewardSelec, this);
        } else if (this.tab_type == "gameRule") {
            this.rewardSelectBgImage.source = "";
            this.officialSelectBgImage.source = "";
            this.ruleSelectBgImage.source = "betlistbtn_s_png";
            this.menImage.source = "";
            if(this.channelName=='shpk10'){
                //四海
                //this.gameRuleImage.source = "ssc_longhu_sh_png";
                this.gameRuleButton.skinName = "resource/skins/dialog/RuleViewSscLonghuSh.exml";
            }else{
                //通用
                //this.gameRuleImage.source = "ty_ssc_longhu_png";
                this.gameRuleButton.skinName = "resource/skins/dialog/RuleViewTySscLonghu.exml";
            }
            this.GameGroup.addChild(this.gameRuleButton);
            let tween = egret.Tween.get(this);
            tween.wait(50).call(this.gameRuleHandler, null);
        }
    }
    private getNewRewardSelec(name: string, response: ResponeOpenResultLonghu): void {
        this.rewardResultItemList = new Array();
        for (var row in response.rows) {
            let item: OpenResultLonghu = response.rows[row] as OpenResultLonghu;
            var data = {
                gameInfo: item,
                upTime: item.up_time,
                fkExpectId: item.fk_expect_id,
                code1: item.code1,
                code2: item.code2,
                result: item.result,
            }
            this.rewardResultItemList.push(data);
        }
        this.updateRewardSelec();
    }
    private updateRewardSelec() {
        for (var i = 0; i < this.rewardResultItemList.length; i++) {
            let item = this.rewardResultItemList[i];
            var RuleNiuNiuRewardSelec = new eui.Button();
            RuleNiuNiuRewardSelec.skinName = "resource/skins/dialog/RuleLonghuRewardSelecDlg.exml";
            RuleNiuNiuRewardSelec.x = 0;
            RuleNiuNiuRewardSelec.y = 100 * i;
            this.GameGroup.addChild(RuleNiuNiuRewardSelec);
            var RewardSelectGroup: eui.Group = RuleNiuNiuRewardSelec.getChildByName("RewardSelectGroup") as (eui.Group);
            var noerLabel: eui.Label = RewardSelectGroup.getChildByName("NoerLabel") as (eui.Label)
            var TimeLabel: eui.Label = RewardSelectGroup.getChildByName("TimeLabel") as (eui.Label);
            var symbol: eui.Image = RewardSelectGroup.getChildByName("symbol") as (eui.Image);
            var NumImage1: eui.Image = RewardSelectGroup.getChildByName("NumImage1") as (eui.Image);
            var NumImage2: eui.Image = RewardSelectGroup.getChildByName("NumImage2") as (eui.Image);
            var result: eui.Image = RewardSelectGroup.getChildByName("result") as (eui.Image);
            noerLabel.text = item.fkExpectId + "期";
            TimeLabel.text = item.upTime;
            if (item.code1 > item.code2) {
                symbol.source = "dayu_png";
                NumImage1.source = item.code1 + "_png";
                NumImage2.source = item.code2 + "_png";
            } else if (item.code1 < item.code2) {
                symbol.source = "xiaoyu_png";
                NumImage1.source = item.code1 + "_png";
                NumImage2.source = item.code2 + "_png";
            } else {
                symbol.source = "dengyu_png";
                NumImage1.source = item.code1 + "_png";
                NumImage2.source = item.code2 + "_png";
            }
            switch (item.result) {
                case 1:
                    result.source = "long1_png";
                    break;
                case 2:
                    result.source = "hu1_png";
                    break;
                case 3:
                    result.source = "he1_png";
                    break;
            }
        }
    }
    private getNewOfficalResults(name: string, response: ResponeOpenOfficalResultLonghu): void {
        this.offcialResultItemList = new Array();
        for (var row in response.rows) {
            let item: OpenOfficalResultsLonghu = response.rows[row] as OpenOfficalResultsLonghu; console.log(response);
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
            BtnofficialSelec.skinName = "resource/skins/dialog/officialLonghuSelectDlg.exml";
            BtnofficialSelec.x = 0;
            BtnofficialSelec.y = 100 * i;
            this.GameGroup.addChild(BtnofficialSelec);
            var officialSelectGroup: eui.Group = BtnofficialSelec.getChildByName("officialSelectGroup") as (eui.Group);
            var noerLabel: eui.Label = officialSelectGroup.getChildByName("NoerLabel") as (eui.Label)
            var TimeLabel: eui.Label = officialSelectGroup.getChildByName("TimeLabel") as (eui.Label);

            noerLabel.text = item.expect + "期";
            TimeLabel.text = item.opentime;

            //再显示数字
            let openCodeList: any[] = item.opencode.split(",");
            let codeCount: number = openCodeList.length;
            for (let i = 0; i < openCodeList.length; i++) {
                let code = openCodeList[i];
                let resultImage = new eui.Image();
                resultImage.x = 160 + 45 * i;
                resultImage.y = 52;
                resultImage.width = 39;
                resultImage.height = 38;
                resultImage.source = code + "_png";
                officialSelectGroup.addChild(resultImage);
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
        HttpEngine.getInstance().getOpenResultLonghu(this.Game_id, this.row, this.getNewRewardSelec, this)
        this.officialSelectBgImage.source = "";
        this.ruleSelectBgImage.source = "";
        this.menImage.source = "";

    }

    private showOfficialResultHandler(evt: egret.TouchEvent): void {
        if (this.sound_on) {
            Director.getInstance().effectPlay("click_mp3");
        }
         this.GameScroller.viewport.validateNow();
        this.GameScroller.viewport.scrollV = 0;
        this.GameGroup.removeChildren();
        HttpEngine.getInstance().getOpenOfficalResultLonghu(this.Game_id, this.row, this.getNewOfficalResults, this)
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
                //this.gameRuleImage.source = "ssc_longhu_sh_png";
                this.gameRuleButton.skinName = "resource/skins/dialog/RuleViewSscLonghuSh.exml";
            }else{
                //通用
                //this.gameRuleImage.source = "ty_ssc_longhu_png";
                this.gameRuleButton.skinName = "resource/skins/dialog/RuleViewTySscLonghu.exml";
            }
        //this.GameGroup.addChild(this.gameRuleImage);
        this.GameGroup.addChild(this.gameRuleButton);

    }
}

