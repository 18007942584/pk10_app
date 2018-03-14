class ClientStorage
{
    //private static key_username:string = "key_username";
    private static key_access_token:string = "key_access_token";
    private static key_refresh_token:string = "key_refresh_token";
    private static key_userinfo:string = "key_userinfo";

    private static key_is_tourist:string = "key_is_tourist";
    private static key_login_name:string = "key_login_name";
    private static key_login_password:string = "key_login_password";
    private static key_login_remember_password:string = "key_login_remember_password";

    /*
    public static setUsername(username:string)
    {
        egret.localStorage.setItem(this.key_username,username);    
    }

    public static getUsername()
    {
        return egret.localStorage.getItem(this.key_username);    
    }
    */

    public static setIsTourist(value:string)
    {
        egret.localStorage.setItem(this.key_is_tourist,value);    
    }

    public static getIsTourist()
    {
        return egret.localStorage.getItem(this.key_is_tourist);    
    }

    public static setLoginName(value:string)
    {
        egret.localStorage.setItem(this.key_login_name,value);    
    }

    public static getLoginName()
    {
        return egret.localStorage.getItem(this.key_login_name);    
    }

    public static setLoginPassword(value:string)
    {
        egret.localStorage.setItem(this.key_login_password,value);    
    }

    public static getLoginPassword()
    {
        return egret.localStorage.getItem(this.key_login_password);    
    }

    public static setLoginRememberPassword(value:string)
    {
        egret.localStorage.setItem(this.key_login_remember_password,value);    
    }

    public static getLoginRememberPassword()
    {
        return egret.localStorage.getItem(this.key_login_remember_password);    
    }

    public static setAccessToken(username:string)
    {
        egret.localStorage.setItem(this.key_access_token,username);    
    }

    public static getAccessToken()
    {
        return egret.localStorage.getItem(this.key_access_token);    
    }

    public static setRefreshToken(username:string)
    {
        egret.localStorage.setItem(this.key_refresh_token,username);    
    }

    public static getRefreshToken()
    {
        return egret.localStorage.getItem(this.key_refresh_token);    
    }

    public static setUserInfo(userinfo:UserInfo)
    {
        var json:JSON = userinfo.seralize() as JSON;
        egret.localStorage.setItem(this.key_userinfo, JSON.stringify(json));
    }

    public static getUserInfo()
    {
        var json_str = egret.localStorage.getItem(this.key_userinfo);
        var json = JSON.parse(json_str);
        var userInfo = new UserInfo(json);
        return userInfo;
    }

    public static setBalance()
    {
        
    }
}