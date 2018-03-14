/**
 * Created by egret on 2016/1/26.
 */
class Toast extends egret.DisplayObjectContainer {

    //存放Toast的容器
    private static _group: eui.Group;
    private static _cont: egret.DisplayObjectContainer;

    constructor() {
        super();
    }


    public static init(cont: egret.DisplayObjectContainer): void {
        this._cont = cont;
    }

/**
 * 创建一个Toast弹窗的方法
 * 使用：Toast.launch(显示文本，对应的Toashi自定义皮肤路径,消失时间（可选）)
 * 前提： 
 *       1.需要先在游戏初始化时，初始化Toast.init(主舞台)
 *       2.所自定义的皮肤文件中，显示文本所对应的控件id，必须为label_toastcont
 */
    public static launch(msg: string, duration: number = 1200): void {
        if (this._cont) {
            if (!this._group) {
                //布局
                let vLayout: eui.VerticalLayout = new eui.VerticalLayout();
                vLayout.horizontalAlign = egret.HorizontalAlign.CENTER;
                this._group = new eui.Group();
                this._group.layout = vLayout;
                this._group.width = egret.MainContext.instance.stage.stageWidth;
                this._cont.addChild(this._group);
                this._group.touchEnabled = false;
                this._group.touchChildren = false;
            }
            //创建一个自定义的Toast
            let toast: ObjToast = new ObjToast();
            //自定义Toast的皮肤，可当成参数传入
            //toast.skinName = my_skin;
            toast.abxca = msg;
            let num = this._group.height / toast.height;
            toast.x = (egret.MainContext.instance.stage.stageWidth - toast.width)/2;
            this._group.addChild(toast);
            if (num > 0.0) {
                this._group.y = this._group.y - (toast.height + 6);
            } else {
                this._group.y = egret.MainContext.instance.stage.stageHeight - toast.height-80;
            }
            //console.log("---Toast.height---",toast.width);
            //console.log("--duration--",this._group.width);
            let that = this;
            let tw = egret.Tween.get(toast);
            tw.to({ alpha: 1 }, 800, egret.Ease.quintOut)
                .wait(duration)
                .to({ alpha: 0 }, 1200, egret.Ease.quintIn).call(() => {      /*  y: this.y - 50, */
                    if (that._group) {
                        let tmpMc: any = that._group.getChildAt(0);
                        that._group.removeChild(tmpMc);
                        tmpMc = null;
                        that._group.y += (toast.height + 6)

                        that._group.removeChildren();
                        that._group.parent.removeChild(that._group);
                        that._group = null;
                    }
                });
        }
    }
}