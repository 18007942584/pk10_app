package org.egret.java.pk10_android;

import java.io.File;
import java.util.HashMap;

import org.egret.egretframeworknative.EgretRuntime;
import org.egret.egretframeworknative.engine.EgretGameEngine;
import org.egret.egretframeworknative.engine.IGameExternalInterface;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.ProgressBar;

public class pk10_android extends Activity {
    private interface IRuntimeInterface {
        public void callback(String message);
        // 因为遗留问题 callBack 也是接受的
    }
    
    private static final String EGRET_ROOT = "egret";
    //TODO: egret publish之后，修改以下常量为生成的game_code名
    private static final String EGRET_PUBLISH_ZIP = "game_code_180224173611.zip";
    protected static final String TAG = "pk10_android";
    
   	//若bUsingPlugin为true，开启插件
    private boolean bUsingPlugin = false; 

    private boolean engineInited = false;
    private EgretGameEngine gameEngine;
    private String egretRoot;
    private String gameId;
    private String loaderUrl;
    private String updateUrl;

    //private static boolean UseCustomHotUpdate = false;
    private static boolean UseCustomHotUpdate = true;
    private HotUpdate hotUpdate = null;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);

        getWindow().setFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON, WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        egretRoot = new File(getFilesDir(), EGRET_ROOT).getAbsolutePath();
        gameId = "local";

        gameEngine = new EgretGameEngine();

        if (!UseCustomHotUpdate) {
            //TODO: DEBUG 使用 2
            // 本地DEBUG模式，发布请使用0本地zip，或者1网络获取zip
            setLoaderUrl(0);
            // 设置游戏的选项  (set game options)
            HashMap<String, Object> options = getGameOptions();
            gameEngine.game_engine_set_options(options);
            // 设置加载进度条  (set loading progress bar)
            gameEngine.game_engine_set_loading_view(new GameLoadingView(this));
            // 创建Egret<->Runtime的通讯 (create pipe between Egret and Runtime)
            setInterfaces();
            // 初始化并获得渲染视图 (initialize game engine and obtain rendering view)
            gameEngine.game_engine_init(this);
            engineInited = true;
            View gameEngineView = gameEngine.game_engine_get_view();

            setContentView(gameEngineView);
        }
        else {
            setContentView(R.layout.loading_view);

            hotUpdate = new HotUpdate(this, gameId);
            hotUpdate.doLoadGame();

            ProgressBar progressBar = (ProgressBar)findViewById(R.id.bar);
            //隐藏进度条
            progressBar.setVisibility(View.GONE);
            hotUpdate.setProgressBar(progressBar);
        }
    }

    public void runGameAfterHotUpdate(String _updateUrl) {
        loaderUrl = "";
        updateUrl = _updateUrl;
        HashMap<String, Object> options = getGameOptions();
        gameEngine.game_engine_set_options(options);
        setInterfaces();

        gameEngine.game_engine_init(this);
        engineInited = true;
        View gameEngineView = gameEngine.game_engine_get_view();

        setContentView(gameEngineView);
    }
    
    private void setInterfaces() {
        // Egret（TypeScript）－Runtime（Java）通讯
        // setRuntimeInterface(String name, IRuntimeInterface interface) 用于设置一个runtime的目标接口
        // callEgretInterface(String name, String message) 用于调用Egret的接口，并传递消息
        gameEngine.setRuntimeInterface("RuntimeInterface", new IRuntimeInterface() {
           @Override
            public void callback(String message) {
                Log.d(TAG, message);
                //gameEngine.callEgretInterface("EgretInterface", "A message from runtime");

               //egret请求渠道，响应请求，并且设置渠道
               if(message.equals("get_channel"))
               {//获取渠道
                   //首先从gradle配置里取
                   String channel = "";
                   try {
                       ApplicationInfo appInfo = pk10_android.this.getPackageManager().getApplicationInfo(pk10_android.this.getPackageName(), PackageManager.GET_META_DATA);
                       channel = appInfo.metaData.getString("CHANNEL");
                   } catch (PackageManager.NameNotFoundException e) {
                       e.printStackTrace();
                   }

                   //取不到就从bundle里拆
                   if(channel.length()==0)
                   {
                       String pkName = pk10_android.this.getPackageName();
                       String appName = pkName.replace("com.rainbow.", "");
                       channel = appName;
                   }
                   //channel设置回给egret
                   String callChannelString = "set_channel:"+channel;
                   gameEngine.callEgretInterface("EgretInterface", callChannelString);
               }
            }
        });
    }

    private HashMap<String, Object> getGameOptions() {
        HashMap<String, Object> options = new HashMap<String, Object>();
        options.put(EgretRuntime.OPTION_EGRET_GAME_ROOT, egretRoot);
        options.put(EgretRuntime.OPTION_GAME_ID, gameId);
        options.put(EgretRuntime.OPTION_GAME_LOADER_URL, loaderUrl);
        options.put(EgretRuntime.OPTION_GAME_UPDATE_URL, updateUrl);
        options.put(EgretRuntime.OPTION_PUBLISH_ZIP, EGRET_PUBLISH_ZIP);
        return options;
    }

    private void setLoaderUrl(int mode) {
        switch (mode) {
        case 2:
            // local DEBUG mode
            // 本地DEBUG模式，发布请使用0本地zip，或者1网络获取zip
            loaderUrl = "";
            updateUrl = "";
            break;
        case 1:
            // http request zip RELEASE mode, use permission INTERNET
            // 请求网络zip包发布模式，需要权限 INTERNET
            loaderUrl = "http://www.example.com/" + EGRET_PUBLISH_ZIP;
            updateUrl = "http://www.example.com/";
            break;
        default:
            // local zip RELEASE mode, default mode, `egret publish -compile --runtime native`
            // 私有空间zip包发布模式, 默认模式, `egret publish -compile --runtime native`
            loaderUrl = EGRET_PUBLISH_ZIP;
            updateUrl = "";
            break;
        }
    }

    @Override
    public void onPause() {
        super.onPause();
        if (engineInited) {
            gameEngine.game_engine_onPause();
        }
    }
    
    @Override
    public void onResume() {
        super.onResume();
        if (engineInited) {
            gameEngine.game_engine_onResume();
        }
    }
    
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        switch (keyCode) {
            case KeyEvent.KEYCODE_BACK:
                /*
                if (engineInited) {
                    gameEngine.game_engine_onStop();
                }
                finish();
                */

                new AlertDialog.Builder(this)
                    .setIcon(null)
                    .setTitle("提示")
                    .setMessage("是否要退出游戏？")
                    .setNegativeButton("取消", new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int which) {

                        }
                    })
                    .setPositiveButton("确定", new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int whichButton) {
                            if(gameEngine != null){
                                gameEngine.game_engine_onStop();
                            }
                            finish();
                        }

                    }).show();
                return true;
            default:
                return super.onKeyDown(keyCode, event);
        }
    }

}
