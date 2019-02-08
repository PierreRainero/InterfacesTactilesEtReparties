package com.example.gaulthier.watchproject;

import android.content.Intent;
import android.os.Bundle;
import android.support.wearable.activity.WearableActivity;
import android.view.View;
import android.view.WindowManager;
import android.widget.ImageView;
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

    ImageView heartbeatImage;

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

        textHeartbeatMin = findViewById(R.id.tvHeartbeatMin);
        textHeartbeatMax = findViewById(R.id.tvHeartbeatMax);
        textHeartbeatAverage = findViewById(R.id.tvHeartbeatAverage);
        heartbeatImage = findViewById(R.id.heartbeatImage);

        String heartbeatMinText = Integer.toString(this.heartbeatMin);
        String heartbeatMaxText = Integer.toString(this.heartbeatMax);
        String heartbeatAverageText = Integer.toString(this.heartbeatAverage);

        if (this.playerId == 2) {
            heartbeatImage.setImageDrawable(getResources().getDrawable(R.drawable.heartbeat_blue));
        } else {
            heartbeatImage.setImageDrawable(getResources().getDrawable(R.drawable.heartbeat_red));
        }

        textHeartbeatMin.setText(heartbeatMinText + " min    ");
        textHeartbeatMax.setText(heartbeatMaxText+ " max    ");
        textHeartbeatAverage.setText(heartbeatAverageText + " moyen");

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
    public void newGame(View v) {
        Intent intentMain = new Intent(this , ConfigRunActivity.class);
        finish();
        this.startActivity(intentMain);
        finish();
    }
}
