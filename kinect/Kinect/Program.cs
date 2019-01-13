using Kinect.Communication;

namespace Kinect
{
    class Program
    {
        static void Main(string[] args)
        {
            SocketIOClient socketIO = new SocketIOClient("localhost", 8282);
            socketIO.Connect();
            socketIO.Emit("my other event", "message from C#");
            socketIO.Disconnect();
        }
    }
}
