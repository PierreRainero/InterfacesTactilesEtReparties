using Kinect.Communication;
using Kinect.Communication.Formater;
using Kinect.Captor;
using Kinect.Gameplay.Model;
using System;
using System.Configuration;
using System.Collections.Generic;
using log4net;
using System.Timers;

namespace Kinect.Gameplay
{
    /// <summary>
    /// Class representing a game
    /// </summary>
    /// <author>Pierre RAINERO</author>
    /// <seealso> href="https://github.com/PierreRainero/InterfacesTactilesEtReparties">Repository GitHub</seealso>
    class Game
    {
        public GameStep Step { get; private set; }
        private KinectCaptorV1 kinectMotor;
        private SocketIOClient socketIO;
        private Player[] players;
        private static readonly ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private bool logMode;
        private Timer timer;
        private bool isPinging;


        /// <summary>
        /// Normal constructor : Create the game for one or two players
        /// </summary>
        /// <param name="log">Activate logs (non activated by default)</param>
        public Game(bool log=false)
        {
            logMode = log;
            isPinging = false;
            Int32.TryParse(ConfigurationManager.AppSettings["socketIO_port"], out int port);
            socketIO = new SocketIOClient(ConfigurationManager.AppSettings["socketIO_url"], port);

            kinectMotor = new KinectCaptorV1(this);
            StartNewGame();
        }

        /// <summary>
        /// Starts players detection and connect the game to the backend
        /// </summary>
        public void StartCapture()
        {
            socketIO.Connect();
            socketIO.On("kinectStartRun", StartRun);
            socketIO.On("gameFinished", FinishRun);
            socketIO.On("kinectRestart", StartNewGame);
            if (logMode)
            {
                log.Info(Step.ToString() + " : Open socket - Start Capture");
            }

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
            if (logMode)
            {
                log.Info(Step.ToString() + " : Send available players = " + objectToSend.JSONFormat());
            }

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
                
                if (logMode)
                {
                    log.Info(Step.ToString() + " : Player " + jumperId + " has jumped");
                }

                players[jumperId - 1].ValidateJump(DateTime.Now);
            }
        }

        /// <summary>
        /// Send all players speed to the backend
        /// </summary>
        /// <remarks>
        /// Gameplay method : You shouldn't call it manually.
        /// </remarks>
        public void SendSpeed()
        {
            SimpleObjectFormater objectToSend = new SimpleObjectFormater();
            SimpleArray playersArray = new SimpleArray();
            foreach (Player player in players)
            {
                if (player.IsDefined())
                {
                    SimpleObjectFormater playerObjectToSend = new SimpleObjectFormater();
                    playerObjectToSend.AddInt("id", player.PlayerId);
                    playerObjectToSend.AddFloat("speed", player.Speed.value);
                    playersArray.AddMember(playerObjectToSend);
                }
            }

            objectToSend.AddArray("players", playersArray);
            if (logMode)
            {
                log.Info(Step.ToString() + " : Send players speed = " + objectToSend.JSONFormat());
            }

            socketIO.Emit("kinectPlayerSpeed", objectToSend.JSONFormat());
        }

        /// <summary>
        /// Send ping request to keep the connection alive
        /// </summary>
        /// <param name="frequence">Frequence to send a request in second (1 by default)</param>
        public void KeepConnectionAlive(int frequence=1)
        {
            if (!isPinging)
            {
                timer = new Timer(frequence * 1000);
                timer.Enabled = true;
                timer.Elapsed += new ElapsedEventHandler(timer_Elapsed);
                timer.Start();
                isPinging = true;
            }
        }
        private void timer_Elapsed(object sender, EventArgs e)
        {
            socketIO.Ping();
        }

        /// <summary>
        /// Stop the connection keeping alive
        /// </summary>
        public void StopConnectionForced()
        {
            if (isPinging)
            {
                timer.Stop();
                isPinging = false;
            }
        }

        /// <summary>
        /// Stop for good the previous game and start a new one (return to the initial state)
        /// </summary>
        /// <param name="message">Message emitted by the backend (empty by default)</param>
        private void StartNewGame(string message="")
        {
            if (logMode)
            {
                log.Info(Step.ToString() + " : Message received = \"" + message + "\"");
            }
            players = new Player[2];
            players[0] = new Player(1);
            players[1] = new Player(2);
            kinectMotor.Players = players;
            StopConnectionForced();

            Step = GameStep.WAITING;
        }

        /// <summary>
        /// Pass to the next gameplay step which is the run
        /// </summary>
        /// <param name="message">Message emitted by the backend</param>
        private void StartRun(string message)
        {
            if (logMode)
            {
                log.Info(Step.ToString() + " : Message received = \"" + message + "\"");
            }
            Step = GameStep.STARTED;
        }

        /// <summary>
        /// Stop the run step (stop jump and speed detection until next run)
        /// </summary>
        /// <param name="message">Message emitted by the backend</param>
        private void FinishRun(string message)
        {
            if (logMode)
            {
                log.Info(Step.ToString() + " : Message = \"" + message + "\"");
            }
            Step = GameStep.FINISHED;
        }
    }
}
