package com.example.gaulthier.watchproject;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.os.Vibrator;
import android.support.wearable.activity.WearableActivity;
import android.widget.TextView;

public class RunActivity extends WearableActivity {

    TextView timer;

    /**
     * On create
     * @param savedInstanceState
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.run);

        timer = findViewById(R.id.timerTextView);

        new CountDownTimer(4000, 1000) {
            public void onTick(long millisUntilFinished) {
                Vibrator vibrator = (Vibrator) getSystemService(VIBRATOR_SERVICE);
                long[] vibrationPattern = {0, 200};
                final int indexInPatternToRepeat = -1;
                vibrator.vibrate(vibrationPattern, indexInPatternToRepeat);
                timer.setText(Integer.toString(Integer.parseInt(timer.getText().toString()) - 1));
            }

            public void onFinish() {
                timer.setText("124 BPM");
                RunActivity.this.sendBPMEachSeconds();
            }
        }.start();
    }

    /**
     * On destroy
     */
    @Override
    public void onDestroy() {
        super.onDestroy();
    }

    /**
     * Send BPM to android device each seconds
     */
    public void sendBPMEachSeconds() {
        new CountDownTimer(60000, 1000) {
            public void onTick(long millisUntilFinished) {
                String datapath = "/my_path";
                int valueBPM = 124;
                new SendMessageThread(RunActivity.this, getApplicationContext(),
                        datapath, "device " + android.os.Build.MODEL + " BPM: " + valueBPM).start();
            }

            @Override
            public void onFinish() {

            }
        }.start();
    }

    /**
     * A class to receive  message from android device
     */
    public class Receiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            String message = intent.getStringExtra("message");

            if (message.equals("endGame")) {
                System.out.println("endGame received");
            }
        }
    }

}