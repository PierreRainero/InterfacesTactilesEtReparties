using Kinect.Communication;
using Kinect.Captor;
using Kinect.Gameplay.Model;
using System.Text;

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
            players[0] = new Player("blue");
            players[1] = new Player("red");

            socketIO = new SocketIOClient("localhost", 8282);
        }

        /// <summary>
        /// Starts players detection and connect the game to the backend
        /// </summary>
        public void StartCapture()
        {
            kinectMotor = new KinectCaptorV1(players, this);
            socketIO.Connect();
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
            StringBuilder playersList = new StringBuilder("[");
            foreach (Player player in players)
            {
                if (player.IsDefined())
                {
                    playersList.Append(player.ToDTO());
                }
            }
            playersList.Append("]");
            
            socketIO.Emit("start", new PairFormater("players", playersList.ToString()).JSONFormat());
            Step = GameStep.STARTED;
        }
    }
}
