// TypeScript file
class ObjToast extends eui.Component {
    private content: eui.Label = new eui.Label();
    private bg:eui.Rect = new eui.Rect();
    private textValue = "none text";
    constructor() {
        super();
        this.bg.fillColor = 0x1E1E1E;
        this.bg.alpha = 0.8;
        this.bg.ellipseWidth = 15;
        this.bg.ellipseHeight = 15;
        this.addChild(this.bg);
        this.content.fontFamily = 'Microsoft Yahei';
        this.content.size = 20;
        this.content.lineSpacing = 8;
        this.content.textAlign = egret.HorizontalAlign.CENTER
        this.addChild(this.content);
    }

    public set abxca(value: string) {
        this.textValue = value;
        if(this.content) {
            this.content.textFlow = new egret.HtmlTextParser().parser(value);
        }
        this.bg.width = this.content.width + 50;
        this.bg.height = this.content.height + 20;
        this.content.x = (this.bg.width - this.content.width) / 2;
        this.content.y = (this.bg.height - this.content.height) / 2;
    }
}