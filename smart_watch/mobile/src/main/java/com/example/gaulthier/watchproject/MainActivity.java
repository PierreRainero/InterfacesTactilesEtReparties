package com.example.gaulthier.watchproject;

import android.support.v7.app.AppCompatActivity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.support.v4.content.LocalBroadcastManager;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;

import com.github.nkzawa.emitter.Emitter;

import java.net.URISyntaxException;

import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.Socket;

import org.json.JSONException;
import org.json.JSONObject;

public class MainActivity extends AppCompatActivity  {

    private Socket mSocket;
    EditText ipAddress;
    Receiver messageReceiver;
    ImageView imageView;
    Button buttonStartRun;
    Button buttonEndRun;
    Button buttonRestart;
    Button buttonConnect;
    TextView labelIpAddress;
    boolean hide = true;
    boolean connected = false;

    /**
     * On create
     * @param savedInstanceState
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        ipAddress = findViewById(R.id.editTextIp);
        imageView = findViewById(R.id.imageView);
        buttonStartRun = findViewById(R.id.buttonStartRun);
        buttonEndRun = findViewById(R.id.buttonEndRun);
        buttonRestart = findViewById(R.id.buttonRestart);
        buttonConnect = findViewById(R.id.buttonConnect);
        labelIpAddress = findViewById(R.id.labelIpAddress);

        buttonStartRun.setVisibility(View.GONE);
        buttonEndRun.setVisibility(View.GONE);
        buttonRestart.setVisibility(View.GONE);

        imageView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (!hide) {
                    buttonStartRun.setVisibility(View.GONE);
                    buttonEndRun.setVisibility(View.GONE);
                    buttonRestart.setVisibility(View.GONE);
                    hide = true;
                } else {
                    buttonStartRun.setVisibility(View.VISIBLE);
                    buttonEndRun.setVisibility(View.VISIBLE);
                    buttonRestart.setVisibility(View.VISIBLE);
                    hide = false;
                }
            }
        });

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
        if (connected) {
            labelIpAddress.setVisibility(View.VISIBLE);
            ipAddress.setVisibility(View.VISIBLE);
            buttonConnect.setText("Se connecter");
            mSocket.disconnect();
            LocalBroadcastManager.getInstance(this).unregisterReceiver(messageReceiver);
            connected = false;
        } else {
            try {
                mSocket = IO.socket("http://" + ipAddress.getText());
                buttonConnect.setText("Se déconnecter");
                labelIpAddress.setVisibility(View.GONE);
                ipAddress.setVisibility(View.GONE);
            } catch (URISyntaxException e) {
                System.out.println("ERROR: " + e);
            }

            mSocket.on("gameStart", new Emitter.Listener() {
                @Override
                public void call(Object... args) {
                    new SendMessageThread(MainActivity.this, getApplicationContext(), "/my_path", "gameStart").start();
                }
            }).on("gameFinished", new Emitter.Listener() {
                @Override
                public void call(Object... args) {
                    JSONObject player = (JSONObject)args[0];
                    new SendMessageThread(MainActivity.this, getApplicationContext(), "/my_path", "gameEnd:" + player.toString()).start();
                }
            }).on("watchRestart", new Emitter.Listener() {
                @Override
                public void call(Object... args) {
                    new SendMessageThread(MainActivity.this, getApplicationContext(), "/my_path", "watchRestart").start();
                }
            }).on("collision", new Emitter.Listener() {
                @Override
                public void call(Object... args) {
                    JSONObject player = (JSONObject)args[0];
                    int playerId = -1;
                    try {
                        playerId = player.getInt("playerId");
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                    if (playerId != -1) {
                        new SendMessageThread(MainActivity.this, getApplicationContext(), "/my_path", "collision:" + playerId).start();
                    }
                }
            });
            connected = true;
            mSocket.connect();
            mSocket.emit("smartphoneConnect", "");
            new SendMessageThread(MainActivity.this, getApplicationContext(), "/my_path", "connectedToServer").start();
        }
    }

    /**
     * Restart game
     */
    public void restartGame(View v) {
        new SendMessageThread(MainActivity.this, getApplicationContext(), "/my_path", "watchRestart").start();
    }


    /**
     *
     */
    public void gameStart(View v) {
        new SendMessageThread(MainActivity.this, getApplicationContext(), "/my_path", "gameStart").start();
    }

    /**
     *
     */
    public void gameEnd(View v) {
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