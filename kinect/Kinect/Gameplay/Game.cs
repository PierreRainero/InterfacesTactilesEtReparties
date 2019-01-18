using Kinect.Communication;
using Kinect.Communication.Formater;
using Kinect.Captor;
using Kinect.Gameplay.Model;
using System.Text;
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
        /// Starts the gameplay phase
        /// </summary>
        /// <remarks>
        /// Gameplay method : You shouldn't call it manually.
        /// </remarks>
        public void StartGame()
        {
            SimpleObjectFormater objectToSend = new SimpleObjectFormater();
            SimpleArray playersArray = new SimpleArray();
            foreach (Player player in players)
            {
                if (player.IsDefined())
                {
                    SimpleObjectFormater playerObjectToSend = new SimpleObjectFormater();
                    playerObjectToSend.AddInt("id", player.PlayerId);
                    playersArray.AddMember(playerObjectToSend);
                }
            }
            objectToSend.AddArray("players", playersArray);

            socketIO.Emit("start", objectToSend.JSONFormat());
            Step = GameStep.STARTED;
        }
    }
}
