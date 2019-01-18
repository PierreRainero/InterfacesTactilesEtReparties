using Kinect.Communication;
using Kinect.Communication.Formater;
using Kinect.Captor;
using Kinect.Gameplay.Model;
using System;

namespace Kinect.Gameplay
{
    /// <summary>
    /// Class representing a game
    /// </summary>
    /// <author>Pierre RAINERO</author>
    /// <seealso> href="https://github.com/PierreRainero/InterfacesTactilesEtReparties">Repository GitHub</seealso>
    class Game
    {
        private KinectCaptorV1 kinectMotor;
        private SocketIOClient socketIO;
        private Player[] players;
        public GameStep Step { get; private set; }

        /// <summary>
        /// Normal constructor : Create the game for one or two players
        /// </summary>
        public Game()
        {
            Step = GameStep.WAITING;

            players = new Player[2];
            players[0] = new Player(1);
            players[1] = new Player(2);

            socketIO = new SocketIOClient("localhost", 8282);
        }

        /// <summary>
        /// Starts players detection and connect the game to the backend
        /// </summary>
        public void StartCapture()
        {
            kinectMotor = new KinectCaptorV1(players, this);
            socketIO.Connect();
            socketIO.On("kinectStartRun", StartRun);

            SimpleObjectFormater objectToSend = new SimpleObjectFormater();
            objectToSend.AddString("state", kinectMotor.Status);
            socketIO.Emit("kinectConnected", objectToSend.JSONFormat());
        }

        /// <summary>
        /// Stops players detection and disconnect the game to the backend
        /// </summary>
        public void StopCapture()
        {
            socketIO.Disconnect();
        }

        /// <summary>
        /// Send the current players to the backend
        /// </summary>
        /// <remarks>
        /// Gameplay method : You shouldn't call it manually.
        /// </remarks>
        public void SendPlayers()
        {
            SimpleObjectFormater objectToSend = new SimpleObjectFormater();
            SimpleArray playersArray = new SimpleArray();
            foreach (Player player in players)
            {
                if (player.IsDefined())
                {
                    SimpleObjectFormater playerObjectToSend = new SimpleObjectFormater();
                    playerObjectToSend.AddInt("id", player.PlayerId);
                    playerObjectToSend.AddInt("state", (int)player.State);
                    playersArray.AddMember(playerObjectToSend);
                }
            }
            objectToSend.AddArray("players", playersArray);

            socketIO.Emit("players", objectToSend.JSONFormat());
        }

        /// <summary>
        /// Pass to the next gameplay step which is the run
        /// </summary>
        /// <param name="message">Message emitted by the backend</param>
        private void StartRun(string message)
        {
            Console.WriteLine("Message received : " + message + "\nThe run can start.");
            Step = GameStep.STARTED;
        }
    }
}
