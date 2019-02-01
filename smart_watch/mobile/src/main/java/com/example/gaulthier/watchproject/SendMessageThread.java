package com.example.gaulthier.watchproject;

import android.app.Activity;
import android.content.Context;

import com.google.android.gms.tasks.Task;
import com.google.android.gms.tasks.Tasks;
import com.google.android.gms.wearable.Node;
import com.google.android.gms.wearable.Wearable;

import java.util.List;
import java.util.concurrent.ExecutionException;

public class SendMessageThread extends Thread {

    String path;
    String message;
    Context context;
    Activity activity;

    SendMessageThread(Activity activity, Context context, String p, String m) {
        this.activity = activity;
        this.context = context;
        this.path = p;
        this.message = m;
    }

    public void run() {
        Task<List<Node>> nodeListTask =
                Wearable.getNodeClient(context).getConnectedNodes();
        try {
            List<Node> nodes = Tasks.await(nodeListTask);
            for (Node node : nodes) {
                Task<Integer> sendMessageTask =
                        Wearable.getMessageClient(activity).sendMessage(node.getId(), path, message.getBytes());
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