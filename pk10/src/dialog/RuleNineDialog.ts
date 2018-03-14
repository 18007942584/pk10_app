class RuleNineDialog extends BaseDialog {

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
    private is_official:number;//是否vip场
    private GameGroup: eui.Group;
    private GameScroller: eui.Scroller
    // private BtnrewardSelec: eui.Button;
    // private BtnofficialSelec: eui.Button;
    private offcialResultList: eui.Group;
    private rewardResultList: eui.Group;
    private offcialResultItemList: any[] = null;
    private rewardResultItemList: any[] = null;

    private sound_on: number;
    private channelName:string ;

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

        var text = "\r\n北京赛车-豪车俱乐部\r\n\r\n\r\n开奖时间：每天9:02-23:57,每五分钟开奖一次，每天开奖179期\r\n\r\n\r\n北京赛车PK10，分①②③④⑤⑥⑦⑧⑨⑩十条车道。\r\n\r\n豪车俱乐部是根据北京赛车官方的开奖结果采集而来的，保证结果的公平性。\r\n\r\n\r\n采集PK①车道为豪车俱乐部冠军车\r\n猜中冠军车可获得高倍奖金！";
        //this.ruleLabel.text = text;

        this.closeImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeHandler, this);
        this.backgroundImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeHandler, this);
        this.rewardResultGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showRewardResultHandler, this);
        this.officialResultGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showOfficialResultHandler, this);
        this.gameRuleGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gameRuleHandler, this);

        // var timer: egret.Timer = new egret.Timer(100, 1);
        // timer.addEventListener(egret.TimerEvent.TIMER, this.updateRewardSelec, this);
        // timer.start();

        if (this.tab_type == "rewardResult") {
            this.GameScroller.viewport.validateNow();
            this.GameScroller.viewport.scrollV = 0;
            //this.GameGroup.removeChildren();
            this.rewardSelectBgImage.source = "betlistbtn_s_png";
            this.officialSelectBgImage.source = "";
            this.ruleSelectBgImage.source = "";
            this.menImage.source = "menImg_png";
            HttpEngine.getInstance().getOpenResultNine(this.Game_id, this.row, this.getNewRewardSelec, this)
            // if (this.room_type == "nine") {
            //     HttpEngine.getInstance().getOpenResultNine(this.Game_id, this.row, this.getNewRewardSelec, this)
            // } else if (this.room_type == "niuniu") {
            // } else if (this.room_type == "longhu") {
            //     //HttpEngine.getInstance().getOpenResultLonghu(this.Game_id, this.row, this.getNewRewardSelec, this)
            // }
        } else if (this.tab_type == "gameRule") {
            this.rewardSelectBgImage.source = "";
            this.officialSelectBgImage.source = "";
            this.ruleSelectBgImage.source = "betlistbtn_s_png";
            this.menImage.source = "";
            if(this.Game_id==4)///欧洲赛车牌九
            {
                this.gameRuleButton.skinName = "resource/skins/dialog/RuleViewBjPaijiuOu.exml";
            }
            else if(this.channelName=='shpk10'){
                //四海
                //this.gameRuleImage.source = "bj_paijiu_png";
                //this.gameRuleImage.visible = false;
                this.gameRuleButton.skinName = "resource/skins/dialog/RuleViewBjPaijiu.exml";
            }else if(this.channelName=='mfpk10'&&this.is_official==1){
                //明发vip场规则附加说明
                this.gameRuleButton.skinName = "resource/skins/dialog/RuleViewTyBjVipPaijiu.exml";
            }else{
                //通用
                //this.gameRuleImage.source = "ty_bj_paijiu_png";
                //this.gameRuleImage.visible = false;
                this.gameRuleButton.skinName = "resource/skins/dialog/RuleViewTyBjPaijiu.exml";
            }
            this.GameGroup.addChild(this.gameRuleButton);
            let tween = egret.Tween.get(this);
            tween.wait(50).call(this.gameRuleHandler, null);
        }
    }
    private getNewRewardSelec(name: string, response: ResponeOpenResultNine): void {
        this.rewardResultItemList = new Array();
        for (var row in response.rows) {
            let item: OpenResultNine = response.rows[row] as OpenResultNine;
            var data = {
                gameInfo: item,
                datetime: item.datetime,
                expect: item.expect,
                area1: item.area1,
                area2: item.area2,
                area3: item.area3,
                area4: item.area4,
                area5: item.area5,
                arr: [item.ranking1, item.ranking2, item.ranking3, item.ranking4, item.ranking5],

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
            var BtnrewardSelec = new eui.Button();
            BtnrewardSelec.skinName = "resource/skins/dialog/rewardSelecDlg.exml"
            BtnrewardSelec.x = 0;
            BtnrewardSelec.y = 100 * i;
            var RewardSelecGaoup: eui.Group = BtnrewardSelec.getChildByName("RewardSelecGaoup") as (eui.Group);
            var TimeLabel: eui.Label = RewardSelecGaoup.getChildByName("TimeLabel") as (eui.Label);
            var NoerLabel: eui.Label = RewardSelecGaoup.getChildByName("NoerLabel") as (eui.Label);
            var resultLabel1: eui.Label = RewardSelecGaoup.getChildByName("Ranking_Label_1") as (eui.Label);
            var resultLabel2: eui.Label = RewardSelecGaoup.getChildByName("Ranking_Label_2") as (eui.Label);
            var resultLabel3: eui.Label = RewardSelecGaoup.getChildByName("Ranking_Label_3") as (eui.Label);
            var resultLabel4: eui.Label = RewardSelecGaoup.getChildByName("Ranking_Label_4") as (eui.Label);
            var resultLabel5: eui.Label = RewardSelecGaoup.getChildByName("Ranking_Label_5") as (eui.Label);
            NoerLabel.text = item.expect + "期";
            TimeLabel.text = item.datetime;
            resultLabel1.text = item.area1;
            resultLabel2.text = item.area2;
            resultLabel3.text = item.area3;
            resultLabel4.text = item.area4;
            resultLabel5.text = item.area5;
            //先隐藏数字
            for (let i = 0; i < 5; i++) {
                let code = i + 1;
                let resultImageName = "Ranking_Image_" + String(code);
                let resultImage: eui.Image = RewardSelecGaoup.getChildByName(resultImageName) as (eui.Image);
                resultImage.visible = false;
            }

            let openCodeList: any[] = item.arr;//名次， 第几名是哪个车
            let codeCount: number = openCodeList.length;
            for (let j = 0; j < openCodeList.length; j++) {
                let code: number = Number(openCodeList[j]);
                // let RankingImageName = "Ranking_Image_" + + String(code);
                // let resultImage: eui.Image = RewardSelecGaoup.getChildByName(RankingImageName) as (eui.Image);
                // resultImage.x = 20 + 110 * j;
                // resultImage.visible = true;
                let resultImage = new eui.Image();
                resultImage.source = "rank_" + String(code) + "_png";
                resultImage.width = 48;
                resultImage.height = 28;
                resultImage.y = 68;
                resultImage.x = 20 + 110 * j;
                BtnrewardSelec.addChild(resultImage);
            }
            this.GameGroup.addChild(BtnrewardSelec);
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
        HttpEngine.getInstance().getOpenResultNine(this.Game_id, this.row, this.getNewRewardSelec, this)
        this.officialSelectBgImage.source = "";
        this.ruleSelectBgImage.source = "";
        this.menImage.source = "menImg_png";

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
        if(this.Game_id==4)///欧洲赛车牌九
        {
            this.gameRuleButton.skinName = "resource/skins/dialog/RuleViewBjPaijiuOu.exml";
        }
        else if(this.channelName=='shpk10'){
            //四海
            //this.gameRuleImage.source = "bj_paijiu_png";
            this.gameRuleButton.skinName = "resource/skins/dialog/RuleViewBjPaijiu.exml";
        }else if(this.channelName=='mfpk10'&&this.is_official==1){
            //明发vip场规则附加说明
            this.gameRuleButton.skinName = "resource/skins/dialog/RuleViewTyBjVipPaijiu.exml";
        }else{
            //通用
            //this.gameRuleImage.source = "ty_bj_paijiu_png";
            this.gameRuleButton.skinName = "resource/skins/dialog/RuleViewTyBjPaijiu.exml";
        }
        this.GameGroup.addChild(this.gameRuleButton);
        //this.GameGroup.addChild(this.gameRuleImage);
    }

}


