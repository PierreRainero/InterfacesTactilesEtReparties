package com.example.gaulthier.watchproject;

import android.support.v7.app.AppCompatActivity;
import android.content.BroadcastReceiver;
import android.widget.Button;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.support.v4.content.LocalBroadcastManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.view.View;
import android.widget.TextView;

import com.github.nkzawa.emitter.Emitter;
import com.google.android.gms.wearable.Node;
import com.google.android.gms.tasks.Task;
import com.google.android.gms.tasks.Tasks;
import com.google.android.gms.wearable.Wearable;

import java.net.URISyntaxException;
import java.util.List;
import java.util.concurrent.ExecutionException;

import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.Socket;

public class MainActivity extends AppCompatActivity  {

    Button talkbutton;
    TextView textview;
    private Socket mSocket;
    protected Handler myHandler;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        talkbutton = findViewById(R.id.talkButton);
        textview = findViewById(R.id.textView);

        myHandler = new Handler(new Handler.Callback() {
            @Override
            public boolean handleMessage(Message msg) {
                Bundle stuff = msg.getData();
                messageText(stuff.getString("messageText"));
                return true;
            }
        });

        try {
            mSocket = IO.socket("http://172.20.10.2:8282");
        } catch (URISyntaxException e) {
            System.out.println("error : " + e);
        }

        mSocket.on("gameStart", new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                new NewThread("/my_path", "gameStart").start();
            }
        }).on("gameEnd", new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                new NewThread("/my_path", "gameEnd").start();
            }
        });

        mSocket.connect();

        IntentFilter messageFilter = new IntentFilter(Intent.ACTION_SEND);
        Receiver messageReceiver = new Receiver();
        LocalBroadcastManager.getInstance(this).registerReceiver(messageReceiver, messageFilter);

    }

    /**
     * Connect to the backend to initiate web socket
     */
    public void connectToServer(View v) {
        System.out.println("Try to send to server");
        mSocket.emit("hiImTheSmartphone", "");
        new NewThread("/my_path", "connectedToServer").start();
    }

    public void gameStart(View v) {
        new NewThread("/my_path", "gameStart").start();
    }

    public void messageText(String newinfo) {
        if (newinfo.compareTo("") != 0) {
            textview.append("\n" + newinfo);
        }
    }

    public class Receiver extends BroadcastReceiver {

        @Override
        public void onReceive(Context context, Intent intent) {
            System.out.println("message received from wearable device");
            if (intent.getAction().equals(Intent.ACTION_SEND)) {
                System.out.println("message sent to server");
                mSocket.emit("watch", intent.getStringExtra("message"));
            }


        }
    }

    public void talkClick(View v) {
        String message = "Sending message.... ";
        textview.setText(message);

        new NewThread("/my_path", message).start();

    }

    public void sendmessage(String messageText) {
        Bundle bundle = new Bundle();
        bundle.putString("messageText", messageText);
        Message msg = myHandler.obtainMessage();
        msg.setData(bundle);
        myHandler.sendMessage(msg);

    }

    class NewThread extends Thread {
        String path;
        String message;

        NewThread(String p, String m) {
            path = p;
            message = m;
        }

        public void run() {

            Task<List<Node>> wearableList =
                    Wearable.getNodeClient(getApplicationContext()).getConnectedNodes();
            try {

                List<Node> nodes = Tasks.await(wearableList);
                for (Node node : nodes) {
                    Task<Integer> sendMessageTask =

                            Wearable.getMessageClient(MainActivity.this).sendMessage(node.getId(), path, message.getBytes());

                    try {
                        Integer result = Tasks.await(sendMessageTask);
                        sendmessage("I just sent the wearable a message ");
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