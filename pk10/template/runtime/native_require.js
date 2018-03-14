
var game_file_list = [
    //以下为自动修改，请勿修改
    //----auto game_file_list start----
	"libs/modules/egret/egret.js",
	"libs/modules/egret/egret.native.js",
	"libs/modules/eui/eui.js",
	"libs/modules/res/res.js",
	"libs/modules/tween/tween.js",
	"libs/modules/game/game.js",
	"libs/modules/socket/socket.js",
	"bin-debug/HttpPacket.js",
	"bin-debug/scene/BaseScene.js",
	"bin-debug/dialog/BaseDialog.js",
	"bin-debug/dialog/RuleFeitingNineDialog.js",
	"bin-debug/GameScrollTest.js",
	"bin-debug/HttpEngine.js",
	"bin-debug/AssetAdapter.js",
	"bin-debug/LoadingUI.js",
	"bin-debug/Logger.js",
	"bin-debug/Main.js",
	"bin-debug/ObjToast.js",
	"bin-debug/Observer.js",
	"bin-debug/SocketEngine.js",
	"bin-debug/SocketPacket.js",
	"bin-debug/TestScene.js",
	"bin-debug/ThemeAdapter.js",
	"bin-debug/Toast.js",
	"bin-debug/dialog/AreaBetListDialog.js",
	"bin-debug/dialog/BankerDialog.js",
	"bin-debug/DataEngine.js",
	"bin-debug/dialog/ConcludeDialog.js",
	"bin-debug/dialog/ConfirmDialog.js",
	"bin-debug/dialog/NewReceveViewDlg.js",
	"bin-debug/dialog/OpenListDialog.js",
	"bin-debug/dialog/PlayerListDialog.js",
	"bin-debug/dialog/ReceivedHongbaoDlg.js",
	"bin-debug/dialog/RuleCaihongbaoDialog.js",
	"bin-debug/dialog/RuleCarDialog.js",
	"bin-debug/dialog/RuleDanzhangDialog.js",
	"bin-debug/scene/ShishicaiRoomScene.js",
	"bin-debug/dialog/RuleFeitingNiuNiudialog.js",
	"bin-debug/dialog/RuleHongbaoDialog.js",
	"bin-debug/dialog/RuleLonghuDialog.js",
	"bin-debug/dialog/RuleNineDialog.js",
	"bin-debug/dialog/RuleNiuNiudialog.js",
	"bin-debug/dialog/RulePCDanDanDialog.js",
	"bin-debug/dialog/SendHongbaoDlg.js",
	"bin-debug/dialog/ServiceDialog.js",
	"bin-debug/dialog/ShoudaoHongbaoDlg.js",
	"bin-debug/dialog/TouzhuDetailsDialog.js",
	"bin-debug/dialog/ToViewHongbaoDlg.js",
	"bin-debug/Director.js",
	"bin-debug/scene/GameBoatNineScene.js",
	"bin-debug/scene/GameBoatNiuniuScene.js",
	"bin-debug/scene/GameCarScene.js",
	"bin-debug/scene/GameCommon.js",
	"bin-debug/scene/GameDanzhangScene.js",
	"bin-debug/scene/GameHongbaoScene.js",
	"bin-debug/scene/GameLonghuScene.js",
	"bin-debug/scene/GameNineScene.js",
	"bin-debug/scene/GameNiuniuScene.js",
	"bin-debug/scene/GamePcDanDanScnen.js",
	"bin-debug/scene/GameScence.js",
	"bin-debug/scene/HomeScene.js",
	"bin-debug/scene/LoginScene.js",
	"bin-debug/scene/RegistScene.js",
	"bin-debug/scene/RoomScene.js",
	"bin-debug/ClientStorage.js",
	//----auto game_file_list end----
];

var window = this;

egret_native.setSearchPaths([""]);

egret_native.requireFiles = function () {
    for (var key in game_file_list) {
        var src = game_file_list[key];
        require(src);
    }
};

egret_native.egretInit = function () {
    if(egret_native.featureEnable) {
        //控制一些优化方案是否开启
        var result = egret_native.featureEnable({
            
        });
    }
    egret_native.requireFiles();
    //egret.dom为空实现
    egret.dom = {};
    egret.dom.drawAsCanvas = function () {
    };
};

egret_native.egretStart = function () {
    var option = {
        //以下为自动修改，请勿修改
        //----auto option start----
		entryClassName: "Main",
		frameRate: 30,
		scaleMode: "exactFit",
		contentWidth: 640,
		contentHeight: 1136,
		showPaintRect: false,
		showFPS: false,
		fpsStyles: "x:0,y:0,size:12,textColor:0xffffff,bgAlpha:0.9",
		showLog: false,
		logFilter: "",
		maxTouches: 2,
		textureScaleFactor: 1
		//----auto option end----
    };

    egret.native.NativePlayer.option = option;
    egret.runEgret();
    egret_native.Label.createLabel("/system/fonts/DroidSansFallback.ttf", 20, "", 0);
    egret_native.EGTView.preSetOffScreenBufferEnable(true);
};