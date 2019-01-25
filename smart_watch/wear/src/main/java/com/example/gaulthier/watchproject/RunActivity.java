package com.example.gaulthier.watchproject;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.os.Vibrator;
import android.support.wearable.activity.WearableActivity;
import android.widget.TextView;

import com.google.android.gms.tasks.Task;
import com.google.android.gms.tasks.Tasks;
import com.google.android.gms.wearable.Node;
import com.google.android.gms.wearable.Wearable;

import org.w3c.dom.Text;

import java.util.List;
import java.util.concurrent.ExecutionException;

public class RunActivity extends WearableActivity {

    TextView timer;

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

    public void sendBPMEachSeconds() {
        new CountDownTimer(60000, 1000) {
            public void onTick(long millisUntilFinished) {
                String datapath = "/my_path";
                int valueBPM = 124;
                new RunActivity.SendMessage(datapath, "device " + android.os.Build.MODEL + " BPM: " + valueBPM).start();
            }

            @Override
            public void onFinish() {

            }
        }.start();
    }

    public class Receiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            String message = intent.getStringExtra("message");

            if (message.equals("endGame")) {
                System.out.println("endGame received");
            }
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
                            Wearable.getMessageClient(RunActivity.this).sendMessage(node.getId(), path, message.getBytes());

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