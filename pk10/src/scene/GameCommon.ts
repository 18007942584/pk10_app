
class AreaRank
{
    public area;
    public value;
}

//服务端状态
enum ServerState
{
    StateWait = 1,      //等待开始
    StateBet = 2,       //下注中
    StateBlock = 3,      //封盘中
    StateStartRun = 4,       //开始跑车
}

//客户端状态
enum ClientState
{
    ClientStateNormal = 1,      //正常，以服务端为准
    ClientStateConclude = 2,    //结算中，结算中优先，忽略服务端状态，这时候服务端状态可能是等待开始
}

enum RoomType
{
    RoomTypeNine    = 1,    //牌九
    RoomTypeNiuniu  = 2,    //牛牛
    RoomTypeCar     = 3,    //赛车
    RoomeTypeLonghu = 4, //龙虎斗
    RoomeTypeDanzhang = 5, //单张
    RoomeTypeHongbao = 6,//红包
    RoomeTypePcDanDan = 7,//pc蛋蛋

}
//等待开始
//收到上庄消息，转为上庄中
//收到封盘消息，转为封盘中
//收到结算消息，转为结算中
//收到等待开始消息，不操作，等结算完毕后，转换为等待开始状态
//断线重连，或者从后台切到前台，重新请求加入房间，获取服务器状态
enum ProcessState
{
    ProcessStateInit = 1,       //初始化中,等待socket连接，或者掉线了
    ProcessStateWait = 2,       //等待开始
    ProcessStateBeting = 3,          //下注中
    ProcessStateBlocking = 4,        //封盘
    ProcessStateRun = 5,        //开始跑车
    ProcessStateConclude = 6,        //结算动画中
}

/*
class ServerConfig
{
    public service_qq:string = "";
    public service_weixin:string = "";

    public setConfig(response: ResponseServerConfig){
        this.service_qq = response.service_qq;
        this.service_weixin = response.service_weixin;
  }
}
*/

class GameConfig
{
    public cs_qq:string = "";
    public cs_wx:string = "";
    public bet_confirm:Number = 0;//下注是否需要确认
    public chip_rows:ChipRowInfo[] = new Array();
    public area_chip_show_count:number = 0;

    public setConfig(response: ResponseGameConfig){
        this.cs_qq = response.cs_qq;
        this.cs_wx = response.cs_wx;
        this.bet_confirm = response.bet_confirm;
        this.chip_rows = response.chip_rows;
        this.area_chip_show_count = response.area_chip_show_count;
  }
}

enum ChannelConfig
{
    kn86pk10    = 1,    //测试服
    shpk10      = 2,    //四海
    typk10      = 3,    //天娱
    jtpk10      = 4,    //九天
    zcpk10      = 5,    //中彩
    mfpk10      = 6,    //明发

}

//打包js要修改CannelConfig
//命令：egret publish pk10 --runtime native -e
//渠道说明：新增加功能：在android和ios已经实现了根据工程的配置读取渠道，并且设置给egret这边
//因此打包的时候不修改渠道也没关系，可以用同一套ts适应所有的渠道，这个地方配置的渠道只是给调试/发布web用
//main.ts里实现了egret这边的渠道设置功能
//原生交互参考 http://edn.egret.com/cn/index.php/article/index/id/714
class CommonConfig
{
    //更改服务起接口地址

    public static channelConfig:ChannelConfig = ChannelConfig.kn86pk10;
    public static egret_version:string = "1.0.32";

    public static gameConfig:GameConfig = new GameConfig();

    //是否开启测试。控制测试的按钮的
    public static getIsEnableTest()
    {
        switch(CommonConfig.channelConfig)
        {
            case ChannelConfig.kn86pk10:
                return true;
            case ChannelConfig.shpk10:
            case ChannelConfig.typk10:
            case ChannelConfig.jtpk10: 
            case ChannelConfig.zcpk10:
            case ChannelConfig.mfpk10:
            default:
                return false;
        }
    }

    public static getChannelName()
    {
        switch(CommonConfig.channelConfig)
        {
            case ChannelConfig.kn86pk10:
                return "kn86pk10";
            case ChannelConfig.shpk10:
                return "shpk10";
            case ChannelConfig.typk10:
                return "typk10";
            case ChannelConfig.jtpk10:
                return "jtpk10";
            case ChannelConfig.zcpk10:
                return "zcpk10";
            case ChannelConfig.mfpk10:
                return "mfpk10";
        }
        return "";
    }
    
    public static getChannelTitle()
    {
        switch(CommonConfig.channelConfig)
        {
            case ChannelConfig.kn86pk10:
                return "测试服";
            case ChannelConfig.shpk10:
                return "四海娱乐";
            case ChannelConfig.typk10:
                return "天娱娱乐";
            case ChannelConfig.jtpk10:
                return "新濠天地";
            case ChannelConfig.zcpk10:
                return "中彩娱乐";
            case ChannelConfig.mfpk10:
                return "明发"
        }
        return "";
    }

    public static setChannelName(channel_name:string)
    {
        if(channel_name=="kn86pk10")
        {
            CommonConfig.channelConfig = ChannelConfig.kn86pk10;
        }else if(channel_name=="shpk10")
        {
            CommonConfig.channelConfig = ChannelConfig.shpk10;
        }else if(channel_name=="typk10")
        {
            CommonConfig.channelConfig = ChannelConfig.typk10;
        }else if(channel_name=="jtpk10")
        {
            CommonConfig.channelConfig = ChannelConfig.jtpk10;
        }else if(channel_name=="zcpk10")
        {
            CommonConfig.channelConfig = ChannelConfig.zcpk10;
        }else if(channel_name=="mfpk10")
        {
            CommonConfig.channelConfig = ChannelConfig.mfpk10;
        }
    }

    public static getUrlPrefix()
    {
        switch(CommonConfig.channelConfig)
        {
            case ChannelConfig.kn86pk10:
                return "http://pk.kn86.cn";
            case ChannelConfig.shpk10:
                return "http://pk.0wg95.cn";
            case ChannelConfig.typk10:
                return "http://waild.cn";
            case ChannelConfig.jtpk10:
                return "http://ewuep.cn";
            case ChannelConfig.zcpk10:
                return "http://pwy9.cn";
            case ChannelConfig.mfpk10:
                return "http://bquku.cn";
            default:
                return "";
        }
    }

    public static getLogoSource()
    {
        switch(CommonConfig.channelConfig)
        {
            case ChannelConfig.kn86pk10:
                return "login_title_sihai_new_png";
            case ChannelConfig.shpk10:
                return "login_title_sihai_new_png";
            case ChannelConfig.typk10:
                return "login_title_tianyu_new_png";
            case ChannelConfig.jtpk10:
                return "logo_title_xinhao_new_png";
            case ChannelConfig.zcpk10:
                return "login_title_zhongcai_new_png"
            case ChannelConfig.mfpk10:
                return "logo_title_mingfa_new_png";
        }
    }

    public static isEnableVisitor()
    {
        switch(CommonConfig.channelConfig)
        {
            case ChannelConfig.kn86pk10:
                return true;
            case ChannelConfig.shpk10:
                return true;
            case ChannelConfig.typk10:
                return false;
            case ChannelConfig.jtpk10:
                return false;
            case ChannelConfig.zcpk10:
                return false;
            case ChannelConfig.mfpk10:
                return true;
            default:
                return false;
        }
    }
}

class PointMap{
    public value1:number;
    public value2:number;

    public constructor(value1, value2)
    {
        this.value1 = value1;
        this.value2 = value2;
    }
}

class OnlineStorage
{
    public static instance:OnlineStorage = null;

    public static getInstance() {
        if (OnlineStorage.instance == null) {
            OnlineStorage.instance = new OnlineStorage();
            OnlineStorage.instance.setPointmap();
        }
        return OnlineStorage.instance;
    }
    
    public setPointmap()
    {
        this.pointMap = new Array();
        this.pointMap[1] = new PointMap(5,6);
        this.pointMap[2] = new PointMap(2,5);
        this.pointMap[3] = new PointMap(1,2);
        this.pointMap[4] = new PointMap(5,4);
        this.pointMap[5] = new PointMap(5,5);
        
    }

    public pointMap:PointMap[];
}