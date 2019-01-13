using WebSocketSharp;

namespace Kinect.Communication
{
    class SocketIOClient
    {
        private readonly WebSocket socket;

        public SocketIOClient(string url, int port)
        {
            socket = new WebSocket("ws://" + url + ":"+ port + "/socket.io/?EIO=2&transport=websocket");
        }

        public void Connect()
        {
            socket.Connect();
        }

        public void Disconnect()
        {
            socket.Close();
        }

        public void Emit(string chanel, string data)
        {
            socket.Send("42[\"" + chanel + "\", { \"content\":\""+ data + "\"}]");
        }
    }
}
