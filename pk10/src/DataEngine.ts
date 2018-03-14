
class DataEngine
{
    public static instance:DataEngine = null;
    
    public static getInstance() {
        if (DataEngine.instance == null) {
            DataEngine.instance = new DataEngine();
        }
        return DataEngine.instance;
    }

    private expectInfoList:ExpectInfo[] = new Array();
    private gameInfoList:GameInfo[] = new Array();
    private roomInfoList:RoomInfo[] = new Array();

    public setExpectInfoList(expectInfoList)
    {
        this.expectInfoList = expectInfoList;
    }

    public setGameInfoList(list)
    {
        this.gameInfoList = list;
    }

    public setRoomInfoList(list)
    {
        this.roomInfoList = list;
    }

    public getGameInfoList()
    {
        return this.gameInfoList;
    }

    public getRoomInfoList()
    {
        return this.roomInfoList;;
    }

    public getGameInfo(gameId:number)
    {
        for(var row in this.gameInfoList)
        {
            let item:GameInfo = this.gameInfoList[row];
            if(item.id==gameId)
            {
                return item;
            }
        }
        return null;
    }

    public getRoomInfo(roomId:number)
    {
        for(var row in this.roomInfoList)
        {
            let item:RoomInfo = this.roomInfoList[row];
            if(item.id==roomId)
            {
                return item;
            }
        }
        return null;
    }

    public getExpectInfo(gameId:number)
    {
        for(var row in this.expectInfoList)
        {
            let item:ExpectInfo = this.expectInfoList[row];
            if(item.fk_game_id==gameId)
            {
                return item;
            }
        }
        return null;
    }


    //北京赛车--645125期-牛牛
    public getGameRoomTitle(gameId:number, roomId:number)
    {
        let gameInfo = this.getGameInfo(gameId);
        let roomInfo = this.getRoomInfo(roomId);
        let expectInfo = this.getExpectInfo(gameId);
        if(gameInfo!=null && roomInfo!=null && expectInfo!=null)
        {
            let title = gameInfo.name+"--"+expectInfo.expect+"期--"+roomInfo.name;
            return title;
        }

        return "";
    }


/*
    public updateLocalExpectInfo(expectInfo:ExpectInfo)
    {
        this.expectInfo = expectInfo;
    }
    public getLocalNewExpect()
    {
        return this.expectInfo;
    }

    public getNewExpect(need_update:boolean, callback: Function, context:any)
    {
        var observer:Observer = null;
        if(callback!=null)
        {
            observer = new Observer(callback, context);
        }
        
        if(this.expectInfo!=null)
        {
            if(!need_update)
            {
                if(observer!=null)
                {
                    observer.notify(name, this.expectInfo);
                    return;
                }
            }
        }

        var that = this;
        HttpEngine.getInstance().getNewExpect(function(name:string, response:ResponseNewExpect){
            if(response.error!=0)
            {
                Toast.launch(response.msg);
                observer.notify(name, null);
            }else
            {
                that.updateLocalExpectInfo(response.info);
                observer.notify(name, response.info);
            }
        }, this);        
    }
*/

}