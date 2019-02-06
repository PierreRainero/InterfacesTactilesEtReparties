package com.example.gaulthier.watchproject;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.os.Handler;
import android.support.v4.content.LocalBroadcastManager;
import android.support.wearable.activity.WearableActivity;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class RunActivity extends WearableActivity implements SensorEventListener {

    // player
    int playerId;
    boolean acceptDataSharing;
    int valueHeartRateSensor;
    boolean needsToMockHeartbeat;

    // time
    Handler handler;
    int delay;

    // textview
    TextView timer;

    // sensor
    SensorManager mSensorManager;
    Sensor mHeartRateSensor;
    Receiver messageReceiver;
    IntentFilter newFilter;

    // heartbeat
    int heartbeatMin;
    int heartbeatMax;
    int heartbeatAverage;
    List<Integer> valuesHeartbeat = new ArrayList<>();

    /**
     * On create
     * @param savedInstanceState
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.waiting_run);

        mSensorManager = ((SensorManager) getSystemService(SENSOR_SERVICE));
        mHeartRateSensor = mSensorManager.getDefaultSensor(Sensor.TYPE_HEART_RATE);

        if (mHeartRateSensor == null) {
            this.needsToMockHeartbeat = true;
        } else {
            mSensorManager.registerListener(this, mHeartRateSensor, SensorManager.SENSOR_DELAY_NORMAL);
        }

        this.valueHeartRateSensor = 0;

        Bundle b = getIntent().getExtras();
        if(b != null) {
            this.playerId = b.getInt("playerId");
            this.acceptDataSharing = b.getBoolean("acceptDataSharing");
        }

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
                    if (heartbeatMax == 0) {
                        heartbeatMax = valueHeartRateSensor;
                    }
                    if (heartbeatMin == 0) {
                        heartbeatMin = valueHeartRateSensor;
                    }
                    if (valueHeartRateSensor > heartbeatMax) {
                        heartbeatMax = valueHeartRateSensor;
                    }
                    if (valueHeartRateSensor < heartbeatMin) {
                        heartbeatMin = valueHeartRateSensor;
                    }
                }
                if (valueBPM != 0) {
                    valuesHeartbeat.add(valueBPM);
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

    /**
     * Every time sensor get a value
     * @param event
     */
    @Override
    public void onSensorChanged(SensorEvent event) {
        int value = (int)event.values[0];
        if (value != 0) {
            this.valueHeartRateSensor = value;
        }
    }

    /**
     * Every time accuracy sensor change
     * @param sensor
     * @param accuracy
     */
    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
        System.out.println("accuracy changed - accuracy" + accuracy);
    }

    /**
     * Received gameStart from backend
     */
    public void startRun() {
        setContentView(R.layout.run);
        timer = findViewById(R.id.timerTextView);
        sendBPMEachSeconds();
    }

    /**
     * Received gameEnd from backend
     */
    public void gameEnd() {
        // calculate average heartbeat
        Integer sum = 0;
        if (!valuesHeartbeat.isEmpty()) {
            for (Integer mark : this.valuesHeartbeat) {
                sum += mark;
            }
            this.heartbeatAverage = (int) sum.doubleValue() / this.valuesHeartbeat.size();
        }

        Intent intentMain = new Intent(RunActivity.this , ResultActivity.class);
        Bundle b = new Bundle();
        b.putInt("playerId", this.playerId);
        b.putBoolean("acceptDataSharing", this.acceptDataSharing);
        b.putInt("heartbeatMin", this.heartbeatMin);
        b.putInt("heartbeatMax", this.heartbeatMax);
        b.putInt("heartbeatAverage", this.heartbeatAverage);
        intentMain.putExtras(b);
        handler.removeCallbacksAndMessages(null);
        RunActivity.this.startActivity(intentMain);
        finish();
    }

    /**
     * A class to receive  message from android device
     */
    public class Receiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            String message = intent.getStringExtra("message");

            System.out.println("Message received");

            if (message.equals("gameStart")) {
                System.out.println("gameStart received");
                startRun();
            } else if (message.equals("gameEnd")) {
                System.out.println("endGame received");
                gameEnd();
            }
        }
    }

}