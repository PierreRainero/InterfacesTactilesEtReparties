using Kinect.Captor;
using Kinect.Gameplay.Exception;
using Kinect.Gameplay.Model;

namespace Kinect.Gameplay
{
    /// <summary>
    /// Abstract class to manage gameplay phases
    /// </summary>
    /// <author>Pierre RAINERO</author>
    /// <seealso> href="https://github.com/PierreRainero/InterfacesTactilesEtReparties">Repository GitHub</seealso>
    abstract class GameEngine
    {
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
                catch (UndefinedPlayerException e)
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
    }
}
