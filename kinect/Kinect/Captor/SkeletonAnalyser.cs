using Kinect.Gameplay.Exception;
using Kinect.Gameplay.Model;
using Microsoft.Kinect;
using System;

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
        /// Check and calculate if a player is jumping
        /// </summary>
        /// <param name="previousSkeleton">Skeleton at the previous frame</param>
        /// <param name="lastSkeleton">Current skeleton</param>
        /// <returns>Average height jumped for this frame</returns>
        public static float CalculatePlayerJump(Skeleton previousSkeleton, Skeleton lastSkeleton)
        {
            if(previousSkeleton == null || lastSkeleton == null || !IsEvaluable(lastSkeleton))
            {
                return 0;
            }

            float rigthFootDistance = (lastSkeleton.Joints[JointType.FootRight].Position.Y - previousSkeleton.Joints[JointType.FootRight].Position.Y);
            float leftFootDistance = (lastSkeleton.Joints[JointType.FootLeft].Position.Y - previousSkeleton.Joints[JointType.FootLeft].Position.Y);
            float estimatedHeigth = (rigthFootDistance + leftFootDistance) / 2;

            return estimatedHeigth < 0.012? 0 : estimatedHeigth;
        }

        /// <summary>
        /// Collects data to calculate the speed of a player
        /// </summary>
        /// <param name="player">Player to use</param>
        public static void CalculateRunningSpeed(Player player)
        {
            Skeleton previousSkeleton = player.PreviousSkeleton;
            Skeleton lastSkeleton = player.CurrentSkeleton;

            if (previousSkeleton == null || lastSkeleton == null)
            {
                return;
            }

            if (!IsEvaluable(lastSkeleton))
            {
                player.Speed.AddShot(0, 0);
                return;
            }

            Joint pKneeRight = previousSkeleton.Joints[JointType.KneeRight];
            Joint lKneeRight = lastSkeleton.Joints[JointType.KneeRight];
            Joint pKneeLeft = previousSkeleton.Joints[JointType.KneeLeft];
            Joint lKneeLeft = lastSkeleton.Joints[JointType.KneeLeft];

            player.Speed.AddShot(Math.Abs(lKneeRight.Position.Z - pKneeRight.Position.Z),
                                 Math.Abs(lKneeLeft.Position.Z - pKneeLeft.Position.Z));
        }

        /// <summary>
        /// Check if the skeleton to analyze is in the scope
        /// </summary>
        /// <param name="skeleton">Skeleton to analyze</param>
        /// <returns>"true" if the skeleton is usable, "false" otherwise</returns>
        private static bool IsEvaluable(Skeleton skeleton)
        {
            return skeleton.Position.Z >= 1.2 && skeleton.Position.Z <= 4;
        }
    }
}
