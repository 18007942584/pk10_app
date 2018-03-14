class Director {
    public static instance: Director = null;
    private stackLayer = [];
    private gameLayer: Main = null;

    private channel: egret.SoundChannel;

    public static getInstance() {
        if (Director.instance == null) {
            Director.instance = new Director();
        }
        return Director.instance;
    }

    public initWithMain(m: Main) {
        if (this.gameLayer == null) {
            this.gameLayer = m;
        }

    }

    public getMain() {
        return this.gameLayer;
    }

    public getCurrentScene() {
        return this.stackLayer[this.stackLayer.length - 1];
    }

    private lastPlayChipMilliTicket = 0;
    private waitPlayChipMilliTicket = 250;
    //播放音效
    public effectPlay(sound_type: string) {
        if (sound_type == "chip_bet_mp3") {
            let currentTicket = Number(new Date());
            if (currentTicket - this.lastPlayChipMilliTicket < this.waitPlayChipMilliTicket) {
                //不到时间，不播放下注声音
                return;
            }
            this.lastPlayChipMilliTicket = currentTicket;
        }
        //音效
        let sound: egret.Sound = RES.getRes(sound_type);
        sound.type = egret.Sound.EFFECT;
        sound.play(0, 1);

        //console.log("button touched");
        //播放音乐
        //this.channel = sound.play(0,1);
        //this.channel.addEventListener(egret.Event.SOUND_COMPLETE, this.onSoundComplete, this);
        //return this.channel;
    }

    //播放音效
    public soundPlay(sound_type: string) {
        //音效
        let sound: egret.Sound = RES.getRes(sound_type);
        sound.type = egret.Sound.MUSIC;

        //console.log("button touched");
        //播放音乐
        this.channel = sound.play(0, 1);
        this.channel.addEventListener(egret.Event.SOUND_COMPLETE, this.onSoundComplete, this);
        return this.channel;
    }

    //停止播放音效
    public soundClose(): void {
        this.channel.stop();
    }

    private onSoundComplete(event: egret.Event): void {
        egret.log("onSoundComplete");
    }

    // ========================================================
    //替换场景
    public repleaceScene(layer: egret.DisplayObject) {
        if (this.gameLayer != null && layer != null) {
            this.gameLayer.removeChildren();
            this.gameLayer.addChild(layer);
        }
    }
    //添加场景
    public pushScene(layer: egret.DisplayObject) {
        if (this.gameLayer != null && layer != null) {
            this.stackLayer.push(layer);
            this.gameLayer.addChild(layer);


            let stageW = this.gameLayer.stage.stageWidth;
            layer.x = stageW;
            /*
                        let stageW = this.gameLayer.stage.stageWidth;
                        let tw = egret.Tween.get( layer );
                        layer.x = stageW;
                        tw.to( {x:0}, 300 );
            */
        }
    }

    //移除场景
    public popSceneDirect() {
        let len = this.stackLayer.length;
        if (len > 1) {//最后一层不弹出
            let lastLayer = this.stackLayer[len - 1];
            if (lastLayer instanceof LoginScene) {//如果是loginScene，则不得弹出，因为是最后一层了，再弹出会黑屏，两层保护
                return;
            }
            egret.Tween.removeTweens(lastLayer);
            this.gameLayer.removeChild(lastLayer)
            this.stackLayer.pop();
            lastLayer = null;

            let newLayer = this.stackLayer[this.stackLayer.length - 1];
            if (newLayer instanceof BaseScene) {
                let baseScene: BaseScene = newLayer as BaseScene;
                baseScene.onSceneReshow();
            }
        }
    }

    //移除场景
    public popScene() {
        if (this.gameLayer != null) {
            let len = this.stackLayer.length;
            if (len > 1) {//最后一层不弹出
                let lastLayer = this.stackLayer[len - 1];
                if (lastLayer instanceof LoginScene) {//如果是loginScene，则不得弹出，因为是最后一层了，再弹出会黑屏, 两层保护
                    return;
                }

                if (lastLayer.parent != this.gameLayer) {
                    let popLayer = this.gameLayer;
                    let popStackLayer = this.stackLayer;

                    if (lastLayer instanceof BaseScene) {
                        let baseScene: BaseScene = lastLayer as BaseScene;
                        baseScene.onPopScene();
                    }
                    egret.Tween.removeTweens(lastLayer);
                    popLayer.removeChild(lastLayer)
                    popStackLayer.pop();
                    lastLayer = null;

                    let newLayer = popStackLayer[popStackLayer.length - 1];
                    if (newLayer instanceof BaseScene) {
                        let baseScene: BaseScene = newLayer as BaseScene;
                        baseScene.onSceneReshow();
                    }
                } else {

                    //
                    let popLayer = this.gameLayer;
                    let popStackLayer = this.stackLayer;
                    let stageW = this.gameLayer.stage.stageWidth;
                    let tw = egret.Tween.get(lastLayer);
                    tw.to({ x: stageW - 0 }, 300);

                    let twPop = egret.Tween.get(this.gameLayer);
                    tw.to({}, 300).call(function () {
                        if (lastLayer instanceof BaseScene) {
                            let baseScene: BaseScene = lastLayer as BaseScene;
                            baseScene.onPopScene();
                        }
                        egret.Tween.removeTweens(lastLayer);
                        popLayer.removeChild(lastLayer)
                        popStackLayer.pop();
                        lastLayer = null;

                        let newLayer = popStackLayer[popStackLayer.length - 1];
                        if (newLayer instanceof BaseScene) {
                            let baseScene: BaseScene = newLayer as BaseScene;
                            baseScene.onSceneReshow();
                        }
                    });

                    //this.gameLayer.removeChild(layer)
                    //this.stackLayer.pop();
                    //                    Util.removeByElements(this.stackLayer, layer);
                }
            }
        }
    }

    //弹出到根场景
    public popToRoot() {
        if (this.gameLayer != null) {
            let len = this.stackLayer.length;
            for (let i = len - 1; i > 0; i--) {//最后一层不弹出
                let layer = this.stackLayer[i];
                if (layer.parent == this.gameLayer) {

                    let popLayer = this.gameLayer;
                    let popStackLayer = this.stackLayer;
                    let stageW = this.gameLayer.stage.stageWidth;
                    /*
                    let tw = egret.Tween.get( layer );
                    tw.to( {x:stageW}, 300 ).call(function(){
                        popLayer.removeChild(layer)
                        popStackLayer.pop();
                    });
                    */

                    if (layer instanceof BaseScene) {
                        let baseScene: BaseScene = layer as BaseScene;
                        baseScene.onPopScene();
                    }

                    popLayer.removeChild(layer)
                    popStackLayer.pop();

                    let newLayer = popStackLayer[popStackLayer.length - 1];
                    if (newLayer instanceof BaseScene) {
                        let baseScene: BaseScene = newLayer as BaseScene;
                        baseScene.onSceneReshow();
                    }
                }
            }
        }
    }

    private serviceDialog: ServiceDialog = null;
    public showServiceDialog(parent: eui.Component, sound_on: number): void {

        /*
        if (this.mahjongCreate) {
            this.removeChild(this.mahjongCreate);
            //this.mahjongCreate.dispose();
            this.mahjongCreate = null;
        }
        */
        if (this.serviceDialog) {
            this.serviceDialog.parent.removeChild(this.serviceDialog);
        }
        this.serviceDialog = new ServiceDialog(sound_on);
        parent.addChild(this.serviceDialog);
        this.serviceDialog.visible = true;
        //this.serviceDialog.x = this.gameLayer.stage.stageWidth;//放在外面准备数据
    }

    private ruleCarDialog: RuleCarDialog = null;
    public showRuleCarDialog(parent: eui.Component, sound_on: number): void {

        if (!this.ruleCarDialog) {
            this.ruleCarDialog = new RuleCarDialog(sound_on);
            // PopUpManager.addPopUp(this.bottomBtn, 0);
            parent.addChild(this.ruleCarDialog);
        } else {
            this.ruleCarDialog.parent.removeChild(this.ruleCarDialog);
            parent.addChild(this.ruleCarDialog);
        }
        this.ruleCarDialog.visible = true;
    }
    //投注明细弹窗
    private touzhuDetailsDialog: TouzhuDetailsDialog = null;
    public showTouzhuDetailsDialog(gameId: number, roomId: number, sound_on: number, parent: eui.Component): void {
        if (this.touzhuDetailsDialog) {
            this.touzhuDetailsDialog.parent.removeChild(this.touzhuDetailsDialog);
        }

        this.touzhuDetailsDialog = new TouzhuDetailsDialog(gameId, roomId, sound_on);
        parent.addChild(this.touzhuDetailsDialog);
        this.touzhuDetailsDialog.visible = true;
        //this.touzhuDetailsDialog.x = this.gameLayer.stage.stageWidth;//放在外面准备数据
    }

    private ruleHongbaoDialog: RuleHongbaoDialog = null;
    public showRuleHonebaoDialog(parent: eui.Component, tab_type: string, room_type: string, sound_on: number, Game_id: number, is_official: number): void {

        if (this.ruleHongbaoDialog) {
            this.ruleHongbaoDialog.parent.removeChild(this.ruleHongbaoDialog);
        }

        this.ruleHongbaoDialog = new RuleHongbaoDialog(tab_type, room_type, sound_on, Game_id, is_official);
        parent.addChild(this.ruleHongbaoDialog);
        this.ruleHongbaoDialog.visible = true;
        //this.ruleHongbaoDialog.x = this.gameLayer.stage.stageWidth;//放在外面准备数据
    }
    private rulePCDanDanDialog: RulePCDanDanDialog = null;
    public showRulePCDanDanDialog(parent: eui.Component, tab_type: string, room_type: string, sound_on: number, Game_id: number, is_official: number): void {

        if (this.rulePCDanDanDialog) {
            this.rulePCDanDanDialog.parent.removeChild(this.rulePCDanDanDialog);
        }

        this.rulePCDanDanDialog = new RulePCDanDanDialog(tab_type, room_type, sound_on, Game_id, is_official);
        parent.addChild(this.rulePCDanDanDialog);
        this.rulePCDanDanDialog.visible = true;
        //this.ruleHongbaoDialog.x = this.gameLayer.stage.stageWidth;//放在外面准备数据
    }
    //抢到红包明细
    private shoudaoHongbaoDlg: ShoudaoHongbaoDlg = null;
    public showShoudaoHongbaoDlg(gameId: number, roomId: number, sound_on: number, parent: eui.Component): void {

        if (this.shoudaoHongbaoDlg) {
            this.shoudaoHongbaoDlg.parent.removeChild(this.shoudaoHongbaoDlg);
        }

        this.shoudaoHongbaoDlg = new ShoudaoHongbaoDlg(gameId, roomId, sound_on);
        parent.addChild(this.shoudaoHongbaoDlg);
        this.shoudaoHongbaoDlg.visible = true;
    }
    //发送红包明细
    private sendHongbaoDlg: SendHongbaoDlg = null;
    public showsendHongbaoDlg(gameId: number, roomId: number, sound_on: number, parent: eui.Component): void {
        if (this.sendHongbaoDlg) {
            this.sendHongbaoDlg.parent.removeChild(this.sendHongbaoDlg)
        }
        this.sendHongbaoDlg = new SendHongbaoDlg(gameId, roomId, sound_on);
        parent.addChild(this.sendHongbaoDlg);
        this.sendHongbaoDlg.visible = true;
    }
    //接收红包对话窗口
    private nweRececeViewDlg: NweRececeViewDlg = null;
    public showRececeViewDlg(gameId: number, roomId: number, sound_on: number, parent: eui.Component): void {

        if (this.nweRececeViewDlg) {
            this.nweRececeViewDlg.parent.removeChild(this.nweRececeViewDlg);
        }
        this.nweRececeViewDlg = new NweRececeViewDlg(gameId, roomId, sound_on);
        parent.addChild(this.nweRececeViewDlg);
        this.nweRececeViewDlg.visible = true;
    }
    private ruleNineDialog: RuleNineDialog = null;
    public showRuleNineDialog(parent: eui.Component, tab_type: string, room_type: string, sound_on: number, Game_id: number, is_official: number): void {

        if (this.ruleNineDialog) {
            this.ruleNineDialog.parent.removeChild(this.ruleNineDialog);
        }
        this.ruleNineDialog = new RuleNineDialog(tab_type, room_type, sound_on, Game_id, is_official);
        parent.addChild(this.ruleNineDialog);
        this.ruleNineDialog.visible = true;
        //this.ruleNineDialog.x = this.gameLayer.stage.stageWidth;//放在外面准备数据
    }


    private ruleFeitingNineDialog: RuleFeitingNineDialog = null;
    public showFeitingRuleNineDialog(parent: eui.Component, tab_type: string, room_type: string, sound_on: number, Game_id: number, is_official: number): void {

        if (this.ruleFeitingNineDialog) {
            this.ruleFeitingNineDialog.parent.removeChild(this.ruleFeitingNineDialog);
        }

        this.ruleFeitingNineDialog = new RuleFeitingNineDialog(tab_type, room_type, sound_on, Game_id, is_official); +
            parent.addChild(this.ruleFeitingNineDialog);
        this.ruleFeitingNineDialog.visible = true;
        //this.ruleFeitingNineDialog.x = this.gameLayer.stage.stageWidth;//放在外面准备数据
    }
    private ruleNiuNiudialog: RuleNiuNiudialog = null;
    public showRuleNiuNiudialog(parent: eui.Component, tab_type: string, room_type: string, sound_on: number, Game_id: number, is_official: number): void {

        if (this.ruleNiuNiudialog) {
            this.ruleNiuNiudialog.parent.removeChild(this.ruleNiuNiudialog);
        }
        this.ruleNiuNiudialog = new RuleNiuNiudialog(tab_type, room_type, sound_on, Game_id, is_official);
        parent.addChild(this.ruleNiuNiudialog);
        this.ruleNiuNiudialog.visible = true;
        //this.ruleNiuNiudialog.x = this.gameLayer.stage.stageWidth;//放在外面准备数据
    }
    private ruleFeitingNiuNiudialog: RuleFeitingNiuNiudialog = null;
    public showRuleFeitingNiuNiudialog(parent: eui.Component, tab_type: string, room_type: string, sound_on: number, Game_id: number, is_official: number): void {

        if (this.ruleFeitingNiuNiudialog) {
            this.ruleFeitingNiuNiudialog.parent.removeChild(this.ruleFeitingNiuNiudialog);
        }
        this.ruleFeitingNiuNiudialog = new RuleFeitingNiuNiudialog(tab_type, room_type, sound_on, Game_id, is_official);
        parent.addChild(this.ruleFeitingNiuNiudialog);
        this.ruleFeitingNiuNiudialog.visible = true;
        //this.ruleFeitingNiuNiudialog.x = this.gameLayer.stage.stageWidth;//放在外面准备数据
    }
    private ruleLonghuDialog: RuleLonghuDialog = null;
    public showRuleLonghuDialog(parent: eui.Component, tab_type: string, room_type: string, sound_on: number, Game_id: number, is_official: number): void {

        if (this.ruleLonghuDialog) {
            this.ruleLonghuDialog.parent.removeChild(this.ruleLonghuDialog);
        }
        this.ruleLonghuDialog = new RuleLonghuDialog(tab_type, room_type, sound_on, Game_id, is_official);
        parent.addChild(this.ruleLonghuDialog);
        this.ruleLonghuDialog.visible = true;
        //this.ruleLonghuDialog.x = this.gameLayer.stage.stageWidth;//放在外面准备数据
    }

    private ruleLongDanzhang: RuleDanzhangDialog = null;
    public showRuleDanzhangDialog(parent: eui.Component, tab_type: string, room_type: string, sound_on: number, Game_id: number, is_official: number): void {

        if (this.ruleLongDanzhang) {
            this.ruleLongDanzhang.parent.removeChild(this.ruleLongDanzhang);
        }
        this.ruleLongDanzhang = new RuleDanzhangDialog(tab_type, room_type, sound_on, Game_id, is_official);
        parent.addChild(this.ruleLongDanzhang);
        this.ruleLongDanzhang.visible = true;
        //this.ruleLongDanzhang.x = this.gameLayer.stage.stageWidth;//放在外面准备数据
    }

    private playerListDialog: PlayerListDialog = null;
    public showPlayerListDialog(parent: eui.Component, nicknameList: string[], gameId: number, roomId: number, room_type: string, sound_on: number): void {
        if (this.playerListDialog) {
            this.playerListDialog.parent.removeChild(this.playerListDialog);
        }

        this.playerListDialog = new PlayerListDialog(nicknameList, gameId, roomId, room_type, sound_on);
        parent.addChild(this.playerListDialog);
        this.playerListDialog.visible = true;
        //this.playerListDialog.x = this.gameLayer.stage.stageWidth;//放在外面准备数据
    }

    private concludeDialog: ConcludeDialog = null;
    public showConcludeDialog(parent: eui.Component, gameId: number, roomId: number, bankerReward: number, resultUserList: ResultUser[], room_type: string, sound_on: number): void {
        if (this.concludeDialog) {
            this.concludeDialog.parent.removeChild(this.concludeDialog);
        }

        this.concludeDialog = new ConcludeDialog(gameId, roomId, bankerReward, resultUserList, room_type, sound_on);
        parent.addChild(this.concludeDialog);
        this.concludeDialog.visible = true;
        //this.concludeDialog.x = this.gameLayer.stage.stageWidth;//放在外面准备数据
    }

    private confirmDialog: ConfirmDialog = null;
    public showConfirmDialog(text: string, sound_on: number, parent: eui.Component, listener: Function): void {

        if (this.confirmDialog) {
            this.confirmDialog.parent.removeChild(this.confirmDialog);
        }

        this.confirmDialog = new ConfirmDialog(sound_on);
        this.confirmDialog.setNotice(text, listener);
        parent.addChild(this.confirmDialog);
        this.confirmDialog.visible = true;
        //this.confirmDialog.x = this.gameLayer.stage.stageWidth;//放在外面准备数据
    }

    private bankerDialog: BankerDialog = null;
    public showBankerDialog(parent: eui.Component, room_type: string, listener: Function, context: any): void {

        if (this.bankerDialog) {
            this.bankerDialog.parent.removeChild(this.bankerDialog);
        }

        this.bankerDialog = new BankerDialog(room_type);
        parent.addChild(this.bankerDialog);
        this.bankerDialog.visible = true;
        //this.bankerDialog.x = this.gameLayer.stage.stageWidth;//放在外面准备数据
    }

    private areaBetListDialog: AreaBetListDialog = null;
    public showAreaBetListDialog(parent: eui.Component, areaBetList: AreaBet[], sound_on: boolean): void {

        if (this.areaBetListDialog) {
            this.areaBetListDialog.parent.removeChild(this.areaBetListDialog);
        }

        this.areaBetListDialog = new AreaBetListDialog(areaBetList, sound_on);
        parent.addChild(this.areaBetListDialog);
        this.areaBetListDialog.visible = true;
        //this.areaBetListDialog.x = this.gameLayer.stage.stageWidth;//放在外面准备数据
    }
}