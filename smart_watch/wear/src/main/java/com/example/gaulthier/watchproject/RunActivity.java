package com.example.gaulthier.watchproject;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Vibrator;
import android.support.v4.content.LocalBroadcastManager;
import android.support.wearable.activity.WearableActivity;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class RunActivity extends WearableActivity implements SensorEventListener {

    // player
    int playerId;
    int valueHeartRateSensor;
    boolean needsToMockHeartbeat;

    // time
    Handler handler;
    int delay;

    // sensor
    SensorManager mSensorManager;
    Sensor mHeartRateSensor;
    Receiver messageReceiver;
    IntentFilter newFilter;

    // heartbeat
    TextView textViewHeartbeat;
    ImageView heartbeatImageView;

    // Vibrator
    Vibrator v;

    /**
     * On create
     * @param savedInstanceState
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.waiting_run);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        v = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);

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
        LocalBroadcastManager.getInstance(this).unregisterReceiver(messageReceiver);
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

                textViewHeartbeat.setText(Integer.toString(valueBPM));

                if (valueBPM != 0) {
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
        heartbeatImageView = findViewById(R.id.heartbeatImageView);
        textViewHeartbeat = findViewById(R.id.textViewHeartbeat);
        if (this.playerId == 2) {
            heartbeatImageView.setImageDrawable(getResources().getDrawable(R.drawable.heartbeat_blue));
        } else {
            heartbeatImageView.setImageDrawable(getResources().getDrawable(R.drawable.heartbeat_red));
        }
        sendBPMEachSeconds();
    }

    /**
     * Received gameEnd from backend
     */
    public void gameEnd(String players) {

        int heartbeatMin = 0;
        int heartbeatMax = 0;
        int heartbeatAverage = 0;

        try {
            JSONArray jsonArr = new JSONArray(players);
            Intent intentMain = new Intent(RunActivity.this , ResultActivity.class);

            for (int i = 0; i < jsonArr.length(); i++) {
                JSONObject jsonObj = jsonArr.getJSONObject(i);
                System.out.println(jsonObj);
                int playerId = jsonObj.getInt("playerId");

                if (playerId == this.playerId) {
                    heartbeatAverage = jsonObj.getInt("averageHearthbeat");
                    heartbeatMax = jsonObj.getInt("maxHearthBeat");
                    heartbeatMin = jsonObj.getInt("minHearthBeat");
                }
            }

            Bundle b = new Bundle();
            b.putInt("playerId", this.playerId);
            b.putInt("heartbeatMin", heartbeatMin);
            b.putInt("heartbeatMax", heartbeatMax);
            b.putInt("heartbeatAverage", heartbeatAverage);
            intentMain.putExtras(b);
            handler.removeCallbacksAndMessages(null);
            finish();
            RunActivity.this.startActivity(intentMain);
        } catch (JSONException e) {
            System.out.println("error: " + e);
        }
    }

    public void playerCollision(int playerIdReceived) {
        if (playerIdReceived == this.playerId) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                long[] vibrationPattern = {50};
                final int indexInPatternToRepeat = -1;
                v.vibrate(vibrationPattern, indexInPatternToRepeat);
            } else {
                v.vibrate(50);
            }
        }
    }

    /**
     * A class to receive  message from android device
     */
    public class Receiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            String message = intent.getStringExtra("message").split("_")[0];

            System.out.println("Message received : " + message);

            if (message.equals("gameStart")) {
                System.out.println("gameStart received");
                startRun();
            } if (message.equals("gameEnd")) {
                String players = intent.getStringExtra("message").split("_")[1];
                System.out.println("endGame received : "+ players);
                gameEnd(players);
            } if (message.equals("collision")) {
                int idPlayer = Integer.parseInt(intent.getStringExtra("message").split("_")[1]);
                playerCollision(idPlayer);
            }
        }
    }

}
