using Kinect.Captor;
using Kinect.Gameplay.Exception;
using Kinect.Gameplay.Model;
using System;

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
        /// Checks if all players are ready for the next gameplay phase (start to play)
        /// </summary>
        /// <param name="players">Players of the game to control</param>
        /// <returns>"true" if all defined players are ready to start the game, "false" otherwise</returns>
        public static bool PlayersReady(Player[] players)
        {
            foreach (Player player in players)
            {
                try
                {
                    player.state = SkeletonAnalyser.DidPlayerRaiseRightHand(player) ? PlayerState.READY : PlayerState.DETECTED;
                } catch (UndefinedPlayerException e)
                {
                    player.state = PlayerState.NOTDETECTED;
                }

            }

            bool allPlayersAreReady = true;
            foreach (Player player in players)
            {
                if (player.state == PlayerState.DETECTED)
                {
                    allPlayersAreReady = false;
                    break;
                }
            }

            return allPlayersAreReady;
        }
    }
}
