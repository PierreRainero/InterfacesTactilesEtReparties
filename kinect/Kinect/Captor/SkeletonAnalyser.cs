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
                throw new UndefinedPlayerException("Player "+ player.PlayerId+ " is undefined.");
            }

            Skeleton skeleton = player.CurrentSkeleton;

            Joint head = skeleton.Joints[JointType.Head];
            Joint rightHand = skeleton.Joints[JointType.WristRight];

            return head.Position.Y < rightHand.Position.Y;
        }

        /// <summary>
        /// Check if a player is jumping
        /// </summary>
        /// <param name="previousSkeleton">Skeleton at the previous frame</param>
        /// <param name="lastSkeleton">Current skeleton</param>
        /// <returns>"true" if the player is jumping using his two feet, "false" otherwise</returns>
        public static bool DidJump(Skeleton previousSkeleton, Skeleton lastSkeleton)
        {
            if(previousSkeleton == null || lastSkeleton == null)
            {
                return false;
            }

            float pFootRight = previousSkeleton.Joints[JointType.FootRight].Position.Y;
            float pFootLeft = previousSkeleton.Joints[JointType.FootLeft].Position.Y;
            float lFootRight = lastSkeleton.Joints[JointType.FootRight].Position.Y;
            float lFootLeft = lastSkeleton.Joints[JointType.FootLeft].Position.Y;

            return (lFootRight - pFootRight) > 0.02 && (lFootLeft - pFootLeft) > 0.02;
        }

    }
}
