using Kinect.Communication;
using Kinect.Captor;
using System;
using Kinect.Game;

namespace Kinect
{
    /// <summary>
    /// Program entry point
    /// </summary>
    /// <author>Pierre RAINERO</author>
    /// <seealso> href="https://github.com/PierreRainero/InterfacesTactilesEtReparties">Repository GitHub</seealso>
    class Program
    {
        static void Main(string[] args)
        {
            Player[] players = new Player[2];
            players[0] = new Player("blue");
            players[1] = new Player("red");
            KinectV1 kinectCaptor = new KinectV1(players);

            Console.WriteLine(kinectCaptor.Status);
            SocketIOClient socketIO = new SocketIOClient("localhost", 8282);
            socketIO.Connect();
            socketIO.Emit("my other event", kinectCaptor.Status);
            socketIO.Disconnect();

            Console.ReadLine();
        }
    }
}
