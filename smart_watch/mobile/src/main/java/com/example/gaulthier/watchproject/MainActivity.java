package com.example.gaulthier.watchproject;

import android.support.v7.app.AppCompatActivity;
import android.content.BroadcastReceiver;
import android.widget.Button;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.support.v4.content.LocalBroadcastManager;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;

import com.github.nkzawa.emitter.Emitter;

import java.net.URISyntaxException;

import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.Socket;

public class MainActivity extends AppCompatActivity  {

    Button talkbutton;
    TextView textview;
    private Socket mSocket;
    EditText ipAddress;

    /**
     * On create
     * @param savedInstanceState
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        talkbutton = findViewById(R.id.talkButton);
        textview = findViewById(R.id.textView);
        ipAddress = findViewById(R.id.editTextIp);

        IntentFilter messageFilter = new IntentFilter(Intent.ACTION_SEND);
        Receiver messageReceiver = new Receiver();
        LocalBroadcastManager.getInstance(this).registerReceiver(messageReceiver, messageFilter);
    }

    /**
     * On destroy
     */
    @Override
    public void onDestroy() {
        super.onDestroy();

        mSocket.disconnect();
        mSocket.off("gameStart", new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                new SendMessageThread(MainActivity.this, getApplicationContext(), "/my_path", "gameStart").start();
            }
        }).off("gameEnd", new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                new SendMessageThread(MainActivity.this, getApplicationContext(), "/my_path", "gameEnd").start();
            }
        });
    }

    /**
     * Connect to the backend to initiate web socket
     */
    public void connectToServer(View v) {
        System.out.println("Try to send to server");

        try {
            mSocket = IO.socket("http://" + ipAddress.getText());
        } catch (URISyntaxException e) {
            System.out.println("error : " + e);
        }

        mSocket.on("gameStart", new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                new SendMessageThread(MainActivity.this, getApplicationContext(), "/my_path", "gameStart").start();
            }
        }).on("gameEnd", new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                new SendMessageThread(MainActivity.this, getApplicationContext(), "/my_path", "gameEnd").start();
            }
        });

        mSocket.connect();
        mSocket.emit("smartphoneConnect", "");
        new SendMessageThread(MainActivity.this, getApplicationContext(), "/my_path", "connectedToServer").start();
    }

    /**
     * Disconnect to the backend
     */
    public void disconnectServer(View v) {
        mSocket.disconnect();
        mSocket.off("gameStart", new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                new SendMessageThread(MainActivity.this, getApplicationContext(), "/my_path", "gameStart").start();
            }
        }).off("gameEnd", new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                new SendMessageThread(MainActivity.this, getApplicationContext(), "/my_path", "gameEnd").start();
            }
        });
    }


    /**
     *
     */
    public void gameStart(View v) {
        new SendMessageThread(MainActivity.this, getApplicationContext(), "/my_path", "gameStart").start();
    }

    /**
     * A class to receive  message from wearable device
     */
    public class Receiver extends BroadcastReceiver {

        @Override
        public void onReceive(Context context, Intent intent) {
            String typeMessage = intent.getStringExtra("message").split(":")[0];
            String playerId = intent.getStringExtra("message").split(":")[1];
            String valueMessage= intent.getStringExtra("message").split(":")[2];

            if (typeMessage.equals("heartbeat")) {
                String messageToSend = "[{" +
                        "\"playerId\"" + ":" + playerId +"," +
                        "\"heartbeat\"" + ":" + valueMessage +
                        "}]";
                mSocket.emit("heartbeat", messageToSend);
            }
            else if (typeMessage.equals("configurationPlayerId")) {
                String messageToSend = "[{" +
                        "\"deviceId\"" + ":" +playerId + "," +
                        "\"playerId\"" + ":" + valueMessage +
                        "}]";
                mSocket.emit("watchConfigurations", messageToSend);
            }
            else if (typeMessage.equals("configurationDataSharing")) {
                String messageToSend = "[{" +
                        "\"playerId\"" + ":" + playerId + "," +
                        "\"dataSharing\"" + ":" + valueMessage +
                        "}]";
                mSocket.emit("watchConfigurations", messageToSend);
            }
        }
    }

}