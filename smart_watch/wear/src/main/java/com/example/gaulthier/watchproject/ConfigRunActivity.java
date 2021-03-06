package com.example.gaulthier.watchproject;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.support.v4.content.LocalBroadcastManager;
import android.support.wearable.activity.WearableActivity;
import android.view.View;
import android.view.WindowManager;

public class ConfigRunActivity extends WearableActivity {

    IntentFilter newFilter;
    Receiver messageReceiver;
    int playerId;

    /**
     * On create
     * @param savedInstanceState
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.config_run_circular);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        newFilter = new IntentFilter(Intent.ACTION_SEND);
        messageReceiver = new Receiver();

        LocalBroadcastManager.getInstance(this).registerReceiver(messageReceiver, newFilter);
    }

    /**
     * On destroy
     */
    @Override
    protected void onDestroy() {
        super.onDestroy();
        LocalBroadcastManager.getInstance(this).unregisterReceiver(messageReceiver);
    }

    /**
     * Click blue button on wear view
     * @param v
     */
    public void selectColorBlue(View v) {
        selectColor("blue");
    }

    /**
     * Click red button on wear view
     * @param v
     */
    public void selectColorRed(View v) {
        selectColor("red");
    }

    /**
     * Assign color to a player
     * @param color
     */
    public void selectColor(String color) {
        String datapath = "/my_path";
        System.out.println("message sent to handled device");
        int colorValue = 0;
        if (color.equals("red")) {
            colorValue = 1;
        } else if (color.equals("blue")) {
            colorValue =2;
        }
        String message = "configurationPlayerId:" + android.os.Build.MODEL + ":" + colorValue;

        this.playerId = colorValue;

        new SendMessageThread(ConfigRunActivity.this, getApplicationContext(),
                datapath, message).start();
        this.setContentView(R.layout.config_data);
        this.waitForRun();
    }

    public void waitForRun() {
        Intent intentMain = new Intent(ConfigRunActivity.this , RunActivity.class);
        Bundle b = new Bundle();
        b.putInt("playerId", this.playerId);
        intentMain.putExtras(b);
        finish();
        ConfigRunActivity.this.startActivity(intentMain);
    }

    /**
     * A class to receive  message from android device
     */
    public class Receiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            String message = intent.getStringExtra("message");
            System.out.println("Message received > message: " + message);
        }
    }

}
