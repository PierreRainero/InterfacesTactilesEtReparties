package com.example.gaulthier.watchproject;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.os.Vibrator;
import android.support.v4.content.LocalBroadcastManager;
import android.support.wearable.activity.WearableActivity;
import android.view.View;

import com.google.android.gms.tasks.Task;
import com.google.android.gms.tasks.Tasks;
import com.google.android.gms.wearable.Node;
import com.google.android.gms.wearable.Wearable;

import java.util.List;
import java.util.concurrent.ExecutionException;

public class ConfigRunActivity extends WearableActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.config_run_circular);

        IntentFilter newFilter = new IntentFilter(Intent.ACTION_SEND);
        ConfigRunActivity.Receiver messageReceiver = new ConfigRunActivity.Receiver();

        LocalBroadcastManager.getInstance(this).registerReceiver(messageReceiver, newFilter);
    }

    public void selectColorBlue(View v) {
        selectColor("blue");
    }

    public void selectColorRed(View v) {
        selectColor("red");
    }

    public void selectColor(String color) {
        String datapath = "/my_path";
        System.out.println("message sent to handled device");
        new ConfigRunActivity.SendMessage(datapath, "device " + android.os.Build.MODEL + " choose color " + color).start();
        this.setContentView(R.layout.config_data);
    }

    public void refuseData(View v) {
        heartDataSharing(false);
    }

    public void acceptData(View v) {
        heartDataSharing(true);
    }

    public void heartDataSharing(boolean acceptHeartDataSharing) {
        String datapath = "/my_path";
        new ConfigRunActivity.SendMessage(datapath, "heartData:" + acceptHeartDataSharing).start();
        this.setContentView(R.layout.waiting_run);
    }

    public void startRun() {
        Vibrator vibrator = (Vibrator) getSystemService(VIBRATOR_SERVICE);
        long[] vibrationPattern = {0, 500, 50, 300};
        //-1 - don't repeat
        final int indexInPatternToRepeat = -1;
        vibrator.vibrate(vibrationPattern, indexInPatternToRepeat);

        Intent intentMain = new Intent(ConfigRunActivity.this , RunActivity.class);
        ConfigRunActivity.this.startActivity(intentMain);
        finish();
    }

    public class Receiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            System.out.println("message received from the handled");
            startRun();
        }
    }

    class SendMessage extends Thread {
        String path;
        String message;

        SendMessage(String p, String m) {
            path = p;
            message = m;
        }

        public void run() {
            Task<List<Node>> nodeListTask =
                    Wearable.getNodeClient(getApplicationContext()).getConnectedNodes();
            try {
                List<Node> nodes = Tasks.await(nodeListTask);
                for (Node node : nodes) {
                    Task<Integer> sendMessageTask =
                            Wearable.getMessageClient(ConfigRunActivity.this).sendMessage(node.getId(), path, message.getBytes());
                    try {
                        Integer result = Tasks.await(sendMessageTask);
                    } catch (ExecutionException exception) {
                    } catch (InterruptedException exception) {
                    }
                }
            } catch (ExecutionException exception) {
            } catch (InterruptedException exception) {
            }
        }
    }
}
