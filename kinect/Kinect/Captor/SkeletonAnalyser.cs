using Kinect.Gameplay.Exception;
using Kinect.Gameplay.Model;
using Microsoft.Kinect;

namespace Kinect.Captor
{
    /// <summary>
    /// Class to analyse kinect skeletons
    /// </summary>
    /// <author>Pierre RAINERO</author>
    /// <seealso> href="https://github.com/PierreRainero/InterfacesTactilesEtReparties">Repository GitHub</seealso>
    class SkeletonAnalyser
    {
        /// <summary>
        /// Detects if a player raise his right hand
        /// </summary>
        /// <param name="player">Player to check</param>
        /// <returns>"true" if is right hand is higher of his head, "false" otherwise</returns>
        /// <exception cref="UndefinedPlayerException">Thrown when an undefined player is passed as parameter</exception>
        public static bool DidPlayerRaiseRightHand(Player player)
        {
            if (!player.IsDefined())
            {
                throw new UndefinedPlayerException("Player "+ player.Color+ " is undefined.");
            }

            Skeleton skeleton = player.Skeleton;

            Joint head = skeleton.Joints[JointType.Head];
            Joint rightHand = skeleton.Joints[JointType.WristRight];

            return head.Position.Y < rightHand.Position.Y;
        }
    }
}
