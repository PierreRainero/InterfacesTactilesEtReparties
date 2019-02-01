using Kinect.Captor;
using Kinect.Gameplay.Exception;
using Kinect.Gameplay.Model;
using log4net;
using System.Collections.Generic;

namespace Kinect.Gameplay
{
    /// <summary>
    /// Abstract class to manage gameplay phases
    /// </summary>
    /// <author>Pierre RAINERO</author>
    /// <seealso> href="https://github.com/PierreRainero/InterfacesTactilesEtReparties">Repository GitHub</seealso>
    abstract class GameEngine
    {
        private static readonly ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        /// <summary>
        /// Check all players and update their state if needed
        /// </summary>
        /// <param name="players">Players of the game to control</param>
        /// <returns>"true" if any player state change, "false" otherwise</returns>
        public static bool DidPlayersStateChange(Player[] players)
        {
            bool playerChange = false;
            foreach (Player player in players)
            {
                try
                {
                    bool res = SkeletonAnalyser.DidPlayerRaiseRightHand(player);
                    if (res)
                    {
                        if(player.State != PlayerState.READY)
                        {
                            playerChange = true;
                        }
                        player.State = PlayerState.READY;
                    }else
                    {
                        if (player.State != PlayerState.DETECTED)
                        {
                            playerChange = true;
                        }
                        player.State = PlayerState.DETECTED;
                    }
                }
                catch (UndefinedPlayerException exception)
                {
                    if(player.State != PlayerState.NOTDETECTED)
                    {
                        playerChange = true;
                    }
                    player.State = PlayerState.NOTDETECTED;
                }

            }

            return playerChange;
        }

        /// <summary>
        /// Detects all player who made a complete jump
        /// </summary>
        /// <param name="players">Players of the game to control</param>
        /// <returns>List containing jumpers id</returns>
        public static List<int> DetectsPlayerJump(Player[] players)
        {
            List<int> playersWhoJumped = new List<int>();
            foreach (Player player in players)
            {
                if (player.IsDefined() && SkeletonAnalyser.DidJump(player.PreviousSkeleton, player.CurrentSkeleton))
                {
                    player.JumpDetected();
                }
                else
                {
                    player.CancelJump();
                }

                if (player.Jumped())
                {
                    playersWhoJumped.Add(player.PlayerId);
                }
            }

            return playersWhoJumped;
        }

        /// <summary>
        /// Detects and updates speed of all players
        /// </summary>
        /// <param name="players">Players of the game to control</param>
        /// <returns>"true" if the speed have changed, "false" otherwise</returns>
        public static bool DetectsPlayerSpeed(Player[] players)
        {
            bool needUpdate = false;
            foreach (Player player in players)
            {
                SkeletonAnalyser.CalculateRunningSpeed(player);
                if (player.Speed.IsCalculable())
                {
                    player.Speed.Caculate();
                    needUpdate = true;
                }
            }

            return needUpdate;
        }
    }
}
