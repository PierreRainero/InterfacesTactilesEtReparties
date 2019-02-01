using Kinect.Communication;
using Kinect.Communication.Formater;
using Kinect.Captor;
using Kinect.Gameplay.Model;
using System;
using System.Configuration;
using System.Collections.Generic;
using log4net;

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
        private static readonly ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        /// <summary>
        /// Normal constructor : Create the game for one or two players
        /// </summary>
        public Game()
        {
            Int32.TryParse(ConfigurationManager.AppSettings["socketIO_port"], out int port);
            socketIO = new SocketIOClient(ConfigurationManager.AppSettings["socketIO_url"], port);

            StartNewGame();
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
        /// Send all players who jumped to the backend
        /// </summary>
        /// <param name="jumpers">List containing jumpers id</param>
        /// <remarks>
        /// Gameplay method : You shouldn't call it manually.
        /// </remarks>
        public void SendJumpers(List<int> jumpers)
        {
            foreach (int jumperId in jumpers)
            {
                SimpleObjectFormater objectToSend = new SimpleObjectFormater();
                objectToSend.AddInt("playerId", jumperId);
                socketIO.Emit("kinectPlayerJump", objectToSend.JSONFormat());
                log.Info("Player " + jumperId + " has jumped.");
                players[jumperId - 1].ValidateJump(DateTime.Now);
            }
        }

        /// <summary>
        /// Stop for good the previous game and start a new one (return to the initial state)
        /// </summary>
        private void StartNewGame()
        {
            players = new Player[2];
            players[0] = new Player(1);
            players[1] = new Player(2);

            Step = GameStep.WAITING;
        }

        /// <summary>
        /// Pass to the next gameplay step which is the run
        /// </summary>
        /// <param name="message">Message emitted by the backend</param>
        private void StartRun(string message)
        {
            log.Info("Message received : \"" + message + "\".\tThe run can start.");
            Step = GameStep.STARTED;
        }
    }
}
