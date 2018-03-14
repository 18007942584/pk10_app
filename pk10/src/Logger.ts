/**
 * Created by egret on 2016/1/26.
 */
class Logger extends egret.DisplayObjectContainer {
    public static log(msg: string): void {
        if(msg.length<=0)
        {
            return;
        }

        //return;

        if(egret.Capabilities.os=="Windows PC" || egret.Capabilities.os=="Mac OS")
        {
            let time = new Date();
            // 程序计时的月从0开始取值后+1
            let m = time.getMonth() + 1;
            let t = time.getFullYear() + "-" + m + "-"
                + time.getDate() + " " + time.getHours() + ":"
                + time.getMinutes() + ":" + time.getSeconds();
            let logStr = t+">>> "+msg;
            console.log(logStr);
        }
    }
}