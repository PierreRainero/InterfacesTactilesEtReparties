package com.example.gaulthier.watchproject;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.os.Handler;
import android.support.wearable.activity.WearableActivity;
import android.widget.TextView;

import java.util.Random;

public class RunActivity extends WearableActivity implements SensorEventListener {

    TextView timer;
    int playerId;
    boolean acceptDataSharing;
    Handler handler;
    int delay;
    SensorManager mSensorManager;
    Sensor mHeartRateSensor;
    int valueHeartRateSensor;
    boolean needsToMockHeartbeat = false;

    /**
     * On create
     * @param savedInstanceState
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.run);

        mSensorManager = ((SensorManager) getSystemService(SENSOR_SERVICE));
        mHeartRateSensor = mSensorManager.getDefaultSensor(Sensor.TYPE_HEART_RATE);

        if (mHeartRateSensor == null) {
            this.needsToMockHeartbeat = true;
        } else {
            mSensorManager.registerListener(this, mHeartRateSensor, SensorManager.SENSOR_DELAY_NORMAL);
        }

        timer = findViewById(R.id.timerTextView);

        this.valueHeartRateSensor = 0;

        Bundle b = getIntent().getExtras();
        if(b != null) {
            this.playerId = b.getInt("playerId");
            this.acceptDataSharing = b.getBoolean("acceptDataSharing");
        }

        sendBPMEachSeconds();
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

        this.handler = new Handler();
        this.delay = 1000;

        handler.postDelayed(new Runnable(){
            public void run(){
                String datapath = "/my_path";
                int valueBPM;

                if (needsToMockHeartbeat) {
                    Random r = new Random();
                    valueBPM = r.nextInt(130 - 120) + 120;
                } else {
                    valueBPM = valueHeartRateSensor;
                }

                timer.setText("♡ " + Integer.toString(valueBPM));

                if (acceptDataSharing && valueBPM != 0) {
                    String message = "heartbeat:" + playerId + ":" + valueBPM;
                    new SendMessageThread(RunActivity.this, getApplicationContext(),
                            datapath, message).start();
                }
                handler.postDelayed(this, delay);
            }
        }, delay);
    }
    @Override
    public void onSensorChanged(SensorEvent event) {
        int value = (int)event.values[0];
        if (value != 0) {
            this.valueHeartRateSensor = value;
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
        System.out.println("accuracy changed - accuracy" + accuracy);
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