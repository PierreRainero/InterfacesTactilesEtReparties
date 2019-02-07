package com.example.gaulthier.watchproject;

import android.os.Bundle;
import android.support.wearable.activity.WearableActivity;
import android.view.View;
import android.view.WindowManager;
import android.widget.TextView;

public class ResultActivity extends WearableActivity {

    int playerId;
    boolean acceptDataSharing;
    int heartbeatMin = 0;
    int heartbeatMax = 0;
    int heartbeatAverage = 0;

    TextView textHeartbeatMin;
    TextView textHeartbeatMax;
    TextView textHeartbeatAverage;

    /**
     * On create
     * @param savedInstanceState
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.results);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        Bundle b = getIntent().getExtras();
        if(b != null) {
            this.playerId = b.getInt("playerId");
            this.acceptDataSharing = b.getBoolean("acceptDataSharing");
            this.heartbeatMin = b.getInt("heartbeatMin");
            this.heartbeatMax = b.getInt("heartbeatMax");
            this.heartbeatAverage = b.getInt("heartbeatAverage");
        }

        textHeartbeatMin = findViewById(R.id.textHeartbeatMin);
        textHeartbeatMax = findViewById(R.id.textHeartbeatMax);
        textHeartbeatAverage = findViewById(R.id.textHeartbeatAverage);

        String heartbeatMinText = textHeartbeatMin.getText() + Integer.toString(this.heartbeatMin);
        String heartbeatMaxText = textHeartbeatMax.getText() + Integer.toString(this.heartbeatMax);
        String heartbeatAverageText = textHeartbeatAverage.getText() + Integer.toString(this.heartbeatAverage);

        textHeartbeatMin.setText(heartbeatMinText);
        textHeartbeatMax.setText(heartbeatMaxText);
        textHeartbeatAverage.setText(heartbeatAverageText);

    }

    /**
     * On destroy
     */
    @Override
    protected void onDestroy() {
        super.onDestroy();
    }

    /**
     * End game
     * @param v
     */
    public void exit(View v) {
        finish();
    }
}
