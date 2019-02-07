package com.example.gaulthier.watchproject;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.os.Vibrator;
import android.support.v4.content.LocalBroadcastManager;
import android.support.wearable.activity.WearableActivity;
import android.view.WindowManager;

public class MainActivity extends WearableActivity {

    IntentFilter newFilter;
    Receiver messageReceiver;

    /**
     * On create
     * @param savedInstanceState
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        newFilter = new IntentFilter(Intent.ACTION_SEND);
        messageReceiver = new Receiver();

        LocalBroadcastManager.getInstance(this).registerReceiver(messageReceiver, newFilter);
    }

    /**
     * On destroy
     */
    @Override
    public void onDestroy() {
        super.onDestroy();
        LocalBroadcastManager.getInstance(this).unregisterReceiver(messageReceiver);
    }

    /**
     * A class to receive  message from android device
     */
    public class Receiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            String message = intent.getStringExtra("message");

            if (message.equals("connectedToServer")) {
                Vibrator vibrator = (Vibrator) getSystemService(VIBRATOR_SERVICE);
                long[] vibrationPattern = {0, 200};
                final int indexInPatternToRepeat = -1;
                vibrator.vibrate(vibrationPattern, indexInPatternToRepeat);

                Intent intentMain = new Intent(MainActivity.this , ConfigRunActivity.class);
                MainActivity.this.finish();
                MainActivity.this.startActivity(intentMain);
            }
        }
    }

}