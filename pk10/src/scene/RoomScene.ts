
class GameTypeInfo {
    public room_type: number;
    public room_type_name: string;
}

class BankerTypeInfo {
    public is_official: number;
    public is_official_name: string;
}

class RoomScene extends BaseScene {

    private itemGroup: eui.Group;

    private nameLabel: eui.Label;
    private balanceLabel: eui.Label;
    private paijiuButton: eui.Button;
    private niuniuButton: eui.Button;
    private sangongButton: eui.Button;

    private target_paijiuButton: eui.Button;
    private target_niuniuButton: eui.Button;
    private target_sangongButton: eui.Button;

    private tikuanImage: eui.Image;
    private chongzhiImage: eui.Image;
    private backImage: eui.Image;
    /*
    private paijiuImage: eui.Image;
    private niuniuImage: eui.Image;
    private btnPaijiuArena: eui.ToggleButton;
    private btnPaijiuVip: eui.ToggleButton;
    private btnNiuniuArena: eui.ToggleButton;
    private btnNiuniuVip: eui.ToggleButton;
    private sangongImage: eui.Image;
    */

    private type_image_1: eui.Image;
    private type_image_2: eui.Image;
    private type_image_3: eui.Image;
    private banker_button_1: eui.ToggleButton;
    private banker_button_2: eui.ToggleButton;

    private game_type_group: eui.Group;//游戏类型，牌九等
    private banker_type_group: eui.Group;//下注类型，有庄无庄

    private room_list_scroller: eui.Scroller;//房间列表
    private room_list_bg: eui.Image;//房间背景



    //private PaijiuFixed: boolean;
    //private NiuniuFixed: boolean;
    //音效开关
    private soundButton: eui.Button;
    private sound_on = 1;

    private channelName: String;

    //private serviceButton:eui.Button;
    private gameId: number;

    private itemList: any[];

    private responseRoomList: ResponseRoomList;

    private currentSelectedGameTypeIndex = 0;
    private currentSelectedBankerTypeIndex = 0;

    private gameTypeList: GameTypeInfo[];
    private bankerTypeList: BankerTypeInfo[];

    //在线人数
    private onlineCountLabel: eui.Label;
    private bankImage: eui.Image;
    private onlineImage: eui.Image;
    private onlineNum_1: eui.Label;
    private onlineNum_2: eui.Label;
    private onlineNum_3: eui.Label;
    private onlineNum_4: eui.Label;
    private onlineNum_5: eui.Label;
    private onlineNum_6: eui.Label;
    private onlineNum_7: eui.Label;
    private onlineNum_8: eui.Label;

    public constructor() {
        super();
        this.skinName = "resource/skins/scene/RoomSceneSkin.exml";
    }

    public onPopScene() {
    }

    //别人弹出栈，自己重新显示
    public onSceneReshow() {
        this.reloadUserInfo();
    }

    //不显示加载进度
    public privodeNeedShowLoading() {
        return false;
    }

    /**
     * 创建游戏场景
     * Create a game scene
     */
    public createGameScene() {
        let userInfo = ClientStorage.getUserInfo();
        this.nameLabel.text = userInfo.nickname;
        this.balanceLabel.text = Number(userInfo.balance).toFixed(2);


        this.tikuanImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onServiceHandler, this);
        this.chongzhiImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onServiceHandler, this);

        this.type_image_1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGameTypeHandler, this);
        this.type_image_2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGameTypeHandler, this);
        this.type_image_3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGameTypeHandler, this);

        this.banker_button_1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBankerTypeHandler, this);
        this.banker_button_2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBankerTypeHandler, this);

        this.backImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.backHandler, this);

        this.type_image_1.visible = false;
        this.type_image_2.visible = false;
        this.type_image_3.visible = false;
        this.banker_button_1.visible = false;
        this.banker_button_2.visible = false;

        let channelName = CommonConfig.getChannelName();
        if (channelName == 'jtpk10') {
            //新濠定制，竞技场和VIP场位置对换
            this.banker_button_1.x = 331;
            this.banker_button_2.x = 95;
        }

        /*
        this.channelName = CommonConfig.getChannelName();
        if(this.channelName=='shpk10'){
            //四海定制，牌九改为推筒子
            this.paijiuImage.source='btn_ttz_s_png';
        }else{
            this.paijiuImage.source='btn_paijiu_s_png';
        }

        this.btnNiuniuArena.visible = false;
        this.btnNiuniuVip.visible = false;
        this.PaijiuFixed = false;
        this.NiuniuFixed = false;
        
        this.paijiuImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.paijiuHandler, this);
        this.niuniuImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.niuniuHandler, this);
        this.sangongImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.sangongHandler, this);

        this.btnPaijiuArena.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPaijiuArena, this)
        this.btnPaijiuVip.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPaijiuVip, this);
        this.btnNiuniuArena.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onNiuniuArena, this)
        this.btnNiuniuVip.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onNiuniuVip, this);
        */

        //this.loadArray();
        let that = this;
        HttpEngine.getInstance().getRoomListAll(this.gameId, this.onGetResponseRoomList, this);
        this.reloadUserInfo();
        this.requestGameConfig();
    }

    public onInit() {

    }

    private onGetResponseRoomList(name: string, response: ResponseRoomList) {
        this.gameTypeList = new Array();
        this.bankerTypeList = new Array();
        this.responseRoomList = response;

        //计算有几种游戏类型
        for (let i = 0; i < this.responseRoomList.rows.length; i++) {
            //组合gameType
            let roomInfo: RoomInfo = this.responseRoomList.rows[i];
            let found = false;
            for (let key in this.gameTypeList) {
                let gameTypeInfo: GameTypeInfo = this.gameTypeList[key];
                if (roomInfo.room_type == gameTypeInfo.room_type) {
                    found = true;
                    break;
                }
            }

            if (!found) {
                let gameTypeInfo = new GameTypeInfo();//牌九，牛牛等
                gameTypeInfo.room_type = roomInfo.room_type;
                gameTypeInfo.room_type_name = roomInfo.room_type_name;
                this.gameTypeList.push(gameTypeInfo);

            }
        }

        //先判断上庄有几种类型
        let haveFreeBanker = false;
        let haveOfficalBanker = false;
        for (let i = 0; i < this.responseRoomList.rows.length; i++) {
            //组合bankerType
            let roomInfo: RoomInfo = this.responseRoomList.rows[i];
            if (roomInfo.is_official == 1) {
                haveOfficalBanker = true;
            } else {
                haveFreeBanker = true;
            }
        }

        //处理庄的配置，竞技场一定放在前面，和ui匹配
        if (haveFreeBanker) {
            let bankerTypeInfo = new BankerTypeInfo();
            bankerTypeInfo.is_official = 0;
            bankerTypeInfo.is_official_name = "竞技场";
            this.bankerTypeList.push(bankerTypeInfo);
        }

        if (haveOfficalBanker) {
            let bankerTypeInfo = new BankerTypeInfo();
            bankerTypeInfo.is_official = 1;
            bankerTypeInfo.is_official_name = "VIP";
            this.bankerTypeList.push(bankerTypeInfo);
        }
        //更新高度，和显示隐藏
        this.updateFrame();

        //更新数据
        this.updateData();
    }

    private requestGameConfig() {
        let channelName: string = CommonConfig.getChannelName();
        HttpEngine.getInstance().getGameConfig(channelName, function (name, response: ResponseGameConfig) {
            CommonConfig.gameConfig.setConfig(response);
        }, this);
    }

    /*
    private onPaijiuArena(evt: egret.TouchEvent): void {
        Director.getInstance().effectPlay("click_mp3");
        this.btnPaijiuVip.selected = false;
        this.btnPaijiuArena.selected = true;
        this.PaijiuFixed = false;
        let that = this;
        HttpEngine.getInstance().getRoomList(this.gameId, 0, function (name: string, response: ResponseRoomList) {
            if(this.channelName=='shpk10'){
                //四海定制，牌九改为推筒子
                that.loadArray(response, '推筒子');
            }else{
                that.loadArray(response, '牌九');
            }
            
        }, this);
    }
    private onPaijiuVip(evt: egret.TouchEvent): void {
        Director.getInstance().effectPlay("click_mp3");
        this.btnPaijiuArena.selected = false;
        this.btnPaijiuVip.selected = true;
        this.PaijiuFixed = true;
        let that = this;
        HttpEngine.getInstance().getRoomList(this.gameId, 1, function (name: string, response: ResponseRoomList) {
            if(this.channelName=='shpk10'){
                //四海定制，牌九改为推筒子
                that.loadArray(response, '推筒子');
            }else{
                that.loadArray(response, '牌九');
            }
        }, this);
    }
    private onNiuniuArena(evt: egret.TouchEvent): void {
        Director.getInstance().effectPlay("click_mp3");
        this.btnNiuniuVip.selected = false;
        this.btnNiuniuArena.selected = true;
        this.NiuniuFixed = false;
        let that = this;
        HttpEngine.getInstance().getRoomList(this.gameId, 0, function (name: string, response: ResponseRoomList) {
            that.loadArray(response, '牛牛');
        }, this);
    }
    private onNiuniuVip(evt: egret.TouchEvent): void {
        Director.getInstance().effectPlay("click_mp3");
        this.btnNiuniuArena.selected = false;
        this.btnNiuniuVip.selected = true;
        this.NiuniuFixed = true;
        let that = this;
        HttpEngine.getInstance().getRoomList(this.gameId, 1, function (name: string, response: ResponseRoomList) {
            that.loadArray(response, '牛牛');
        }, this);
    }

    private paijiuHandler(evt: egret.TouchEvent): void {
        Director.getInstance().effectPlay("click_mp3");

        if(this.channelName=='shpk10'){
            //四海定制，牌九改为推筒子
            this.paijiuImage.source = RES.getRes("btn_ttz_s_png");
        }else{
            this.paijiuImage.source = RES.getRes("btn_paijiu_s_png");
        }
        this.niuniuImage.source = RES.getRes("btn_niuniu_n_png");
        this.sangongImage.source = RES.getRes("btn_sangong_n_png");
        this.btnPaijiuArena.visible = true;
        this.btnPaijiuVip.visible = true;
        this.btnNiuniuArena.visible = false;
        this.btnNiuniuVip.visible = false;
        let that = this;
        if (this.PaijiuFixed == false) {
            HttpEngine.getInstance().getRoomList(this.gameId, 0, function (name: string, response: ResponseRoomList) {
                if(this.channelName=='shpk10'){
                    //四海定制，牌九改为推筒子
                    that.loadArray(response, '推筒子');
                }else{
                    that.loadArray(response, '牌九');
                }
            }, this);
        } else {
            HttpEngine.getInstance().getRoomList(this.gameId, 1, function (name: string, response: ResponseRoomList) {
                if(this.channelName=='shpk10'){
                    //四海定制，牌九改为推筒子
                    that.loadArray(response, '推筒子');
                }else{
                    that.loadArray(response, '牌九');
                }
            }, this);
        }

    }
    private niuniuHandler(evt: egret.TouchEvent): void {
        Director.getInstance().effectPlay("click_mp3");
        if(this.channelName=='shpk10'){
            //四海定制，牌九改为推筒子
            this.paijiuImage.source = RES.getRes("btn_ttz_n_png");
        }else{
            this.paijiuImage.source = RES.getRes("btn_paijiu_n_png");
        }
        this.niuniuImage.source = RES.getRes("btn_niuniu_s_png");
        this.sangongImage.source = RES.getRes("btn_sangong_n_png");
        this.btnNiuniuArena.visible = true;
        this.btnNiuniuVip.visible = true;
        this.btnPaijiuArena.visible = false;
        this.btnPaijiuVip.visible = false;
        let that = this;
        if (this.NiuniuFixed == false) {
            HttpEngine.getInstance().getRoomList(this.gameId, 0, function (name: string, response: ResponseRoomList) {
                that.loadArray(response, '牛牛');
            }, this);
        } else {
            HttpEngine.getInstance().getRoomList(this.gameId, 1, function (name: string, response: ResponseRoomList) {
                that.loadArray(response, '牛牛');
            }, this);
        }
    }
    private sangongHandler(evt: egret.TouchEvent): void {
        Director.getInstance().effectPlay("click_mp3");
        if(this.channelName=='shpk10'){
            //四海定制，牌九改为推筒子
            this.paijiuImage.source = RES.getRes("btn_ttz_n_png");
        }else{
            this.paijiuImage.source = RES.getRes("btn_paijiu_n_png");
        }
        this.niuniuImage.source = RES.getRes("btn_niuniu_n_png");
        this.sangongImage.source = RES.getRes("btn_sangong_s_png");
        let that = this;
        HttpEngine.getInstance().getRoomList(this.gameId, 0, function (name: string, response: ResponseRoomList) {
            that.loadArray(response, '豪车俱乐部');
        }, this);
    }
    */

    //牌九，牛牛， 豪车 ， 单张，龙虎  分别对应1-5, btn_ttz_s_png,单张和龙虎反了
    private getImageSource(game_type: number, selected: boolean) {
        this.channelName = CommonConfig.getChannelName();

        let imageName: string = "";
        switch (game_type) {
            case 1:
                {
                    if (this.channelName == 'shpk10') {
                        //四海定制，牌九改为推筒子
                        imageName = "btn_ttz";
                    } else {
                        imageName = "btn_paijiu";
                    }
                }
                break;
            case 2:
                imageName = "btn_niuniu";
                break;
            case 3:
                imageName = "btn_haoche";
                break;
            case 4:
                imageName = "btn_longhu";
                break;
            case 5:
                imageName = "btn_danzhang";
                break;
            case 6:
                imageName = "btn_qianghongbao";
                break;
            case 7:
                imageName = "btn_pc";
                break;
        }

        if (selected) {
            imageName = imageName + "_s";
        } else {
            imageName = imageName + "_n";
        }
        imageName = imageName + "_png";
        console.log("imageName===============" + imageName);
        return RES.getRes(imageName);
    }

    private onGameTypeHandler(evt: egret.TouchEvent): void {
        Director.getInstance().effectPlay("click_mp3");

        //牌九，牛牛， 豪车 ， 单张，龙虎  分别对应1-5, btn_ttz_s_png
        if (evt.target == this.type_image_1) {
            this.currentSelectedGameTypeIndex = 0;
        } else if (evt.target == this.type_image_2) {
            this.currentSelectedGameTypeIndex = 1;
        } else {
            this.currentSelectedGameTypeIndex = 2;
        }
        this.updateData();
        this.updateFrame();
    }

    private onBankerTypeHandler(evt: egret.TouchEvent): void {
        Director.getInstance().effectPlay("click_mp3");

        if (evt.target == this.banker_button_1) {
            this.currentSelectedBankerTypeIndex = 0;
            this.banker_button_2.selected = false;
        } else {

            this.currentSelectedBankerTypeIndex = 1;
            this.banker_button_1.selected = false;
        }
        this.updateData();

    }

    public setGameId(gameId: number) {
        this.gameId = gameId;
    }

    private updateFrame() {
        //更新gameType图片
        if (this.gameTypeList.length == 2) {//有2个gameType才显示gameType
            let gameTypeInfo1 = this.gameTypeList[0];
            let gameTypeInfo2 = this.gameTypeList[1];
            this.type_image_1.source = this.getImageSource(gameTypeInfo1.room_type, this.currentSelectedGameTypeIndex == 0);
            this.type_image_2.source = this.getImageSource(gameTypeInfo2.room_type, this.currentSelectedGameTypeIndex == 1);
            this.type_image_3.source = null;
            this.type_image_1.visible = true;
            this.type_image_2.visible = true;
            this.type_image_3.visible = false;
            this.type_image_1.x = 120;
            this.type_image_2.x = 355;
        } else if (this.gameTypeList.length >= 3) {
            let gameTypeInfo1 = this.gameTypeList[0];
            let gameTypeInfo2 = this.gameTypeList[1];
            let gameTypeInfo3 = this.gameTypeList[2];
            this.type_image_1.source = this.getImageSource(gameTypeInfo1.room_type, this.currentSelectedGameTypeIndex == 0);
            this.type_image_2.source = this.getImageSource(gameTypeInfo2.room_type, this.currentSelectedGameTypeIndex == 1);
            this.type_image_3.source = this.getImageSource(gameTypeInfo3.room_type, this.currentSelectedGameTypeIndex == 2);
            this.type_image_1.visible = true;
            this.type_image_2.visible = true;
            this.type_image_3.visible = true;
        } else {
            let gameTypeInfo1 = this.gameTypeList[0];
            this.type_image_1.source = this.getImageSource(gameTypeInfo1.room_type, this.currentSelectedGameTypeIndex == 0);
            this.type_image_2.source = null;
            this.type_image_3.source = null;
            this.type_image_1.x = (this.game_type_group.width - this.type_image_1.width) / 2;

            this.type_image_1.visible = true;
            this.type_image_2.visible = false;
            this.type_image_3.visible = false;
        }

        //更新高度
        let currentY = this.game_type_group.y;
        let moreHeight = 0;

        currentY += this.game_type_group.height;
        moreHeight += 0;
        this.game_type_group.visible = true;
        /*
                //更新gameType图片
                if(this.gameTypeList.length>=2)
                {//有2个gameType才显示gameType
                    
                    currentY += this.game_type_group.height;
                    moreHeight += 0;
                    this.game_type_group.visible = true;
                }else
                {//否则只显示一个
                    currentY += 0;
                    moreHeight+= this.game_type_group.height;
                    this.game_type_group.visible = false;
                }
        */

        //更新bankerType
        if (this.bankerTypeList.length >= 2) {//有2个gameType才显示gameType
            this.banker_type_group.y = currentY;
            currentY += this.banker_type_group.height;
            moreHeight += 0;
            this.banker_type_group.visible = true;
            this.banker_button_1.visible = true;
            this.banker_button_2.visible = true;
        } else {//否则不显示
            currentY += 0;
            moreHeight += this.banker_type_group.height;
            this.banker_type_group.visible = false;
            this.banker_button_1.visible = false;
            this.banker_button_2.visible = false;
        }

        this.room_list_scroller.y = currentY;
        this.room_list_bg.y = currentY;

        this.room_list_scroller.height = this.room_list_scroller.height + moreHeight;
        this.room_list_bg.height = this.room_list_bg.height + moreHeight;

    }

    private updateData() {
        let selectedGameType: GameTypeInfo = this.gameTypeList[this.currentSelectedGameTypeIndex];
        let selectedBankerType: BankerTypeInfo = this.bankerTypeList[this.currentSelectedBankerTypeIndex];

        let arr = new Array();
        for (let i = 0; i < this.responseRoomList.rows.length; i++) {
            let roomInfo: RoomInfo = this.responseRoomList.rows[i];
            if (roomInfo.room_type == selectedGameType.room_type && roomInfo.is_official == selectedBankerType.is_official) {
                arr.push(roomInfo);
            }
        }
        this.loadArray(arr, selectedGameType.room_type_name, selectedBankerType.is_official == 1);
    }

    private loadArray(rows: RoomInfo[], gameName: string, fixed_banker: boolean): void {
        let headerList = {
            1: "pj2_png",
            2: "pj_png",
            3: "pj3_png",
        }

        this.itemList = new Array();
        let count = 0;
        for (let row in rows) {

            let roomInfo: RoomInfo = rows[row] as RoomInfo;
            count += Number(roomInfo.number) * 3;
            let data = {
                roomInfo: roomInfo,
                tip: roomInfo.number,
                header: headerList[roomInfo.id],
                name: roomInfo.name,
                img: "icon_car_png",
                state: Number(roomInfo.state),   ////0关闭，1正常，2维护中
            }
            this.itemList.push(data);
        }

        //获取当前在线总人数
        HttpEngine.getInstance().getOnlinecount(function (name: string, ResponseOnlinecount: ResponseOnlinecount) {
            if (ResponseOnlinecount.error != 0) {
                Toast.launch(ResponseOnlinecount.msg);
                return;
            }
            let count = ResponseOnlinecount.count;
            this.onlineCountLabel.text = count;
            Toast.launch(ResponseOnlinecount.msg);
        }, this);

        //let arr = GlobalData.configData.game.hallbtns;
        let roomList = new Array();
        let rc = 0;
        for (let k = 0; k < this.itemList.length; k++) {
            //if (this.itemList[k].name == gameName)
            {
                roomList[rc] = this.itemList[k];
                roomList[rc]['item_key'] = k;
                rc++;
            }
        }
        this.itemGroup.removeChildren();
        for (let i = 0; i < roomList.length; i++) {
            let button: eui.Button = new eui.Button();
            button.skinName = "resource/skins/scene/RoomListCell.exml";

            let bankImage: eui.Image = button.getChildByName("bankImage") as (eui.Image);
            let roomNumLabel: eui.Label = button.getChildByName("roomNumLabel") as (eui.Label);
            if (this.itemList[0].item_key == 0) {
                if (fixed_banker == false) {
                    bankImage.source = "icon2_bank_png";
                    roomNumLabel.text = "官方大厅" + String(i + 1);
                } else {
                    bankImage.source = "icon_bank_png";
                    roomNumLabel.text = "VIP玩家" + String(i + 1);
                }
            } else {
                if (fixed_banker == false) {
                    bankImage.source = "icon2_bank_png";
                    roomNumLabel.text = "官方大厅" + String(i + 1);
                } else {
                    bankImage.source = "icon_bank_png";
                    roomNumLabel.text = "VIP玩家" + String(i + 1);
                }
            }
            let countLabel: eui.Label = button.getChildByName("countLabel") as (eui.Label);
            countLabel.text = roomList[i].tip;
            /////////////
            let onlineImage: eui.Image = button.getChildByName("onlineImage") as (eui.Image);

            if (roomList[i].tip <= 30) {
                countLabel.textColor = 0x00FF00;
                onlineImage.source = "online_green_png";
            } else if (roomList[i].tip <= 60 && roomList[i].tip > 30) {
                countLabel.textColor = 0xFFFF00;
                onlineImage.source = "online_orange_png";
            } else if (roomList[i].tip > 60) {
                countLabel.textColor = 0xFF0000;
                onlineImage.source = "online_red_png";
            }
            let gameLabel: eui.Label = button.getChildByName("gameLabel") as (eui.Label);
            gameLabel.text = roomList[i].name;
            if (this.channelName == 'shpk10') {
                //四海定制，牌九改为推筒子，字体大小改为30
                gameLabel.size = 30;
            }
            let thumbImage: eui.Image = button.getChildByName("thumbImage") as (eui.Image);
            //房间小图标
            if (this.gameId == 1) {
                thumbImage.source = "icon_car_png";
            } else if (this.gameId == 2) {
                thumbImage.source = "icon_car_png";
            } else if (this.gameId == 3) {
                thumbImage.source = "icon_boat_png";
            } else if (this.gameId == 4) {
                thumbImage.source = "icon_mssc_png";
            } else if (this.gameId == 5) {
                thumbImage.source = "icon_msft_png";
            } else if (this.gameId == 6){
                thumbImage.source = "icon_pcdd_png";
            }else {
                thumbImage.source = roomList[i].img;
            }
            button.x = 0;
            button.y = 120 * i;
            button.top = 10 + 120 * i;
            button.name = ("button_" + String(roomList[i]['item_key']));
            this.itemGroup.addChild(button);

            //EventManage.addEvent(this, btn, egret.TouchEvent.TOUCH_TAP, this.onTouchEend.bind(this, arr[i]));

            button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.roomHandler, this);
        }

    }

    private reloadUserInfo() {
        let httpEngine: HttpEngine = HttpEngine.getInstance();
        httpEngine.getUserInfo(function (name: string, responseUserInfo: ResponseUserInfo) {
            console.log(responseUserInfo.userInfo.nickname);

            ClientStorage.setUserInfo(responseUserInfo.userInfo);
            var userInfo: UserInfo = ClientStorage.getUserInfo();
            this.balanceLabel.text = Number(userInfo.balance).toFixed(2);
        }, this);
    }

    private roomHandler(evt: egret.TouchEvent): void {
        Director.getInstance().effectPlay("click_mp3");
        let target: eui.Button = evt.currentTarget;
        let index_str = target.name.replace("button_", "");

        let index: number = Number(index_str);
        let item = this.itemList[index];
        let roomInfo = item.roomInfo as RoomInfo;
        let state: number = item.state;
        if (state == 0) {

            Toast.launch("房间关闭中，请稍后再来...");
            return
        }
        if (state == 2) {
            Toast.launch("房间维护中，请稍后再来...");
            return
        }
        if (state != 1) {
            Toast.launch("房间准备中，请稍后再来...");
            return
        }

        this.joinRoom(roomInfo);
    }

    private joinRoom(roomInfo: RoomInfo) {
        let roomId = roomInfo.id;
        let room_type = roomInfo.room_type;
        let fk_game_id = roomInfo.fk_game_id;
        let that: RoomScene = this;
        /*
        //延迟打印进入房间成功
        let tw = egret.Tween.get(this);
        tw.to({}, 200).call(function () {
            Toast.launch("进入房间", 2000);
        });
        */

        let homeScene: HomeScene = new HomeScene();
        homeScene.setRoomData(that.gameId, roomInfo);
        switch (room_type) {//房间类型 1牌九 2牛牛 3豪车 4 龙虎 5单张
            case 1:
                {//牌九
                    if (fk_game_id == 1) {
                        let scene1: GameNineScene = new GameNineScene();
                        if (roomInfo.is_official) {
                            //VIP场固定庄
                            scene1.setRoomData(that.gameId, roomInfo, false);
                        } else {
                            scene1.setRoomData(that.gameId, roomInfo, true);
                        }
                        Director.getInstance().pushScene(scene1);
                    } else if (fk_game_id == 3) {
                        let scene1: GameBoatNineScene = new GameBoatNineScene();
                        if (roomInfo.is_official) {
                            //VIP场固定庄
                            scene1.setRoomData(that.gameId, roomInfo, false);
                        } else {
                            scene1.setRoomData(that.gameId, roomInfo, true);
                        }
                        Director.getInstance().pushScene(scene1);
                    } else if (fk_game_id == 4) {
                        //欧豪赛车牌九
                        let scene1: GameNineScene = new GameNineScene();
                        if (roomInfo.is_official) {
                            //VIP场固定庄
                            scene1.setRoomData(that.gameId, roomInfo, false);
                        } else {
                            scene1.setRoomData(that.gameId, roomInfo, true);
                        }
                        scene1.setNeedFastAnimation(true);
                        Director.getInstance().pushScene(scene1);
                    } else if (fk_game_id == 5) {
                        //欧豪飞艇牌九
                        let scene1: GameBoatNineScene = new GameBoatNineScene();
                        if (roomInfo.is_official) {
                            //VIP场固定庄
                            scene1.setRoomData(that.gameId, roomInfo, false);

                        } else {
                            scene1.setRoomData(that.gameId, roomInfo, true);
                        }
                        scene1.setNeedFastAnimation(true);
                        Director.getInstance().pushScene(scene1);
                    }
                    break;
                }
            case 2:
                {//牛牛=
                    if (fk_game_id == 1) {
                        let scene2: GameNiuniuScene = new GameNiuniuScene();
                        if (roomInfo.is_official) {
                            //VIP场固定庄
                            scene2.setRoomData(that.gameId, roomInfo, false);
                        } else {
                            scene2.setRoomData(that.gameId, roomInfo, true);
                        }
                        Director.getInstance().pushScene(scene2);
                    } else if (fk_game_id == 3) {
                        let scene2: GameBoatNiuniuScene = new GameBoatNiuniuScene();
                        if (roomInfo.is_official) {
                            //VIP场固定庄
                            scene2.setRoomData(that.gameId, roomInfo, false);
                        } else {
                            scene2.setRoomData(that.gameId, roomInfo, true);
                        }
                        Director.getInstance().pushScene(scene2);
                    }
                    break;
                }
            case 3:
                {//豪车

                    let scene3: GameCarScene = new GameCarScene();
                    //scene3.setGameRoomId(that.gameId, roomId);
                    Director.getInstance().pushScene(scene3);
                    break;
                }
            case 4:
                {//龙虎
                    let sceneLonghu: GameLonghuScene = new GameLonghuScene();
                    sceneLonghu.setRoomData(that.gameId, roomInfo);
                    Director.getInstance().pushScene(sceneLonghu);
                    break;
                }
            case 5:
                {//单张
                    let sceneDanzhang: GameDanzhangScene = new GameDanzhangScene();
                    sceneDanzhang.setRoomData(that.gameId, roomInfo);
                    Director.getInstance().pushScene(sceneDanzhang);
                    break;
                }
            case 6:
                {//猴赛雷
                    let SceneHongbao: GameHongbaoScene = new GameHongbaoScene();
                    SceneHongbao.setRoomData(that.gameId, roomInfo, false);
                    Director.getInstance().pushScene(SceneHongbao);

                    break;
                }
            case 7:
                {//PC蛋蛋
                    let ScenePCdandan: GamePcDanDanScene = new GamePcDanDanScene();
                    ScenePCdandan.setRoomData(that.gameId, roomInfo, false);
                    Director.getInstance().pushScene(ScenePCdandan);
                }
            default:
                {

                    //let newScene:GameScrollTest = new GameScrollTest();
                    //Director.getInstance().pushScene(newScene);
                    break;
                }
        }
        /*
        HttpEngine.getInstance().joinRoom(roomId, function(name:string, response:ResponseJoinRoom){
            if(response.error!=0)
            {
                Toast.launch(response.msg);
            }

            //延迟打印进入房间成功
            let tw = egret.Tween.get( this );
            tw.to( {}, 200 ).call(function(){
                Toast.launch(response.msg, 2000);    
            });

            switch(roomId)
            {
            case 1:
            {//牌九
                let scene2:GameNineScene = new GameNineScene();
                scene2.setRoomData(that.gameId, roomId, response);
                Director.getInstance().pushScene(scene2);
                break;
            }
            case 2:
            {//牛牛
                let scene1:GameNiuniuScene = new GameNiuniuScene();
                scene1.setGameRoomId(that.gameId, roomId);
                Director.getInstance().pushScene(scene1);
                break;
            }
            case 3:
            {
                let scene3:GameCarScene = new GameCarScene();
                scene3.setGameRoomId(that.gameId, roomId);
                Director.getInstance().pushScene(scene3);
                break;
            }
            default:
            {
                //let newScene:GameScrollTest = new GameScrollTest();
                //Director.getInstance().pushScene(newScene);
                break;
            }
        }
        }, this);
        */
    }

    private onServiceHandler(evt: egret.TouchEvent): void {
        Director.getInstance().effectPlay("click_mp3");
        Director.getInstance().showServiceDialog(this, this.sound_on);
    }

    private backHandler(evt: egret.TouchEvent): void {

        Director.getInstance().effectPlay("click_mp3");
        //Director.getInstance().popScene();
        this.popScene();
    }

    // private serivceHandler(evt:egret.TouchEvent):void{
    //     Director.getInstance().showServiceDialog(this);
    // }



}


