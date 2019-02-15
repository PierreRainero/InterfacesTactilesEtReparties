package com.example.gaulthier.watchproject;

import android.support.v7.app.AppCompatActivity;
import android.content.BroadcastReceiver;
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

    private Socket mSocket;
    EditText ipAddress;
    TextView receivedFromWear;
    TextView sentToWear;
    TextView receivedFromServer;
    TextView sentToServer;
    Receiver messageReceiver;

    /**
     * On create
     * @param savedInstanceState
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        ipAddress = findViewById(R.id.editTextIp);
        receivedFromWear = findViewById(R.id.receivedFromWear);
        sentToWear = findViewById(R.id.sentToWear);
        receivedFromServer = findViewById(R.id.receivedFromServer);
        sentToServer = findViewById(R.id.sentToServer);

        IntentFilter messageFilter = new IntentFilter(Intent.ACTION_SEND);
        messageReceiver = new Receiver();
        LocalBroadcastManager.getInstance(this).registerReceiver(messageReceiver, messageFilter);
    }

    /**
     * On destroy
     */
    @Override
    public void onDestroy() {
        super.onDestroy();
        mSocket.disconnect();
        LocalBroadcastManager.getInstance(this).unregisterReceiver(messageReceiver);
    }

    /**
     * Connect to the backend to initiate web socket
     */
    public void connectToServer(View v) {
        try {
            mSocket = IO.socket("http://" + ipAddress.getText());
        } catch (URISyntaxException e) {
            sentToServer.setText("ERROR: " + e);
        }

        mSocket.on("gameStart", new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                receivedFromServer.setText("gameStart received");
                sentToWear.setText("gameStart sent");
                new SendMessageThread(MainActivity.this, getApplicationContext(), "/my_path", "gameStart").start();
            }
        }).on("gameFinished", new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                receivedFromServer.setText("gameFinished received");
                sentToWear.setText("gameEnd sent");
                new SendMessageThread(MainActivity.this, getApplicationContext(), "/my_path", "gameEnd").start();
            }
        }).on("watchRestart", new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                receivedFromServer.setText("watchRestart received");
                sentToWear.setText("watchRestart sent");
                new SendMessageThread(MainActivity.this, getApplicationContext(), "/my_path", "watchRestart").start();
            }
        });

        mSocket.connect();
        sentToServer.setText("smartphoneConnect sent");
        mSocket.emit("smartphoneConnect", "");
        sentToWear.setText("connectedToServer sent");
        new SendMessageThread(MainActivity.this, getApplicationContext(), "/my_path", "connectedToServer").start();
    }

    /**
     * Disconnect to the backend
     */
    public void disconnectServer(View v) {
        mSocket.disconnect();
        LocalBroadcastManager.getInstance(this).unregisterReceiver(messageReceiver);
    }

    /**
     * Restart game
     */
    public void restartGame(View v) {
        sentToWear.setText("watchRestart sent");
        new SendMessageThread(MainActivity.this, getApplicationContext(), "/my_path", "watchRestart").start();
    }


    /**
     *
     */
    public void gameStart(View v) {
        sentToWear.setText("gameStart sent");
        new SendMessageThread(MainActivity.this, getApplicationContext(), "/my_path", "gameStart").start();
    }

    /**
     *
     */
    public void gameEnd(View v) {
        sentToWear.setText("gameEnd sent");
        new SendMessageThread(MainActivity.this, getApplicationContext(), "/my_path", "gameEnd").start();
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