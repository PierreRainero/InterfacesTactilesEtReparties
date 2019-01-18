using Kinect.Gameplay;
using Kinect.Gameplay.Model;
using Microsoft.Kinect;
using Microsoft.Kinect.Toolkit;
using System;
using System.Collections.Generic;

namespace Kinect.Captor
{
    /// <summary>
    /// Class to detect and interacts with a kinect v1
    /// </summary>
    /// <author>Pierre RAINERO</author>
    /// <seealso> href="https://github.com/PierreRainero/InterfacesTactilesEtReparties">Repository GitHub</seealso>
    class KinectCaptorV1
    {
        private KinectSensor sensor;
        public string Status { get; private set; }
        private Player[] players;
        private Game gameHook;

        /// <summary>
        /// Normal constructor : Detect and start the kinect
        /// </summary>
        /// <param name="players">Maximum players of the game to use</param>
        /// <param name="game">Game linked to the captor</param>
        public KinectCaptorV1(Player[] players, Game game)
        {
            gameHook = game;
            KinectSensorChooser sensorStatus = new KinectSensorChooser();
            sensorStatus.KinectChanged += KinectSensorChooserKinectChanged;
            this.players = players;

            sensorStatus.Start();
        }

        /// <summary>
        /// Method calls each time kinect sensor value changed
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e">Event to trigger</param>
        private void KinectSensorChooserKinectChanged(object sender, KinectChangedEventArgs e)
        {
            if (sensor != null)
            {
                sensor.SkeletonFrameReady -= KinectSkeletonFrameReady;
            }
                
            sensor = e.NewSensor;
            if (sensor == null)
            {
                return;
            }
            UpdateKinectStatus(Convert.ToString(e.NewSensor.Status));

            sensor.SkeletonStream.Enable();
            sensor.SkeletonFrameReady += KinectSkeletonFrameReady;
        }

        /// <summary>
        /// Method calls at each detection frame of the kinect
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e">Detection frame</param>
        private void KinectSkeletonFrameReady(object sender, SkeletonFrameReadyEventArgs e)
        {
            List<Skeleton> skeletons = DetectSkeletons(e);
            if (skeletons.Count == 0)
            {
                return;
            }

            List<Skeleton> nonAssociatedSkeletons = UpdateDefinedPlayers(skeletons);
            AssociateSkeletonsToPlayers(nonAssociatedSkeletons);

            switch (gameHook.Step)
            {
                case GameStep.WAITING:
                    if(GameEngine.PlayersReady(players))
                    {
                        gameHook.StartGame();
                    }
                    break;

                default:
                    break;
            }
        }

        /// <summary>
        /// Detects all skeletons in range of the kinect
        /// </summary>
        /// <param name="e">Detection frame</param>
        /// <returns>List of all kinect skeletons detected</returns>
        private List<Skeleton> DetectSkeletons(SkeletonFrameReadyEventArgs e)
        {
            Skeleton[] skeletons = new Skeleton[0];
            using (SkeletonFrame skeletonFrame = e.OpenSkeletonFrame())
            {
                if (skeletonFrame != null)
                {
                    skeletons = new Skeleton[skeletonFrame.SkeletonArrayLength];
                    skeletonFrame.CopySkeletonDataTo(skeletons);
                }
            }

            List<Skeleton> trackedSkeletons = new List<Skeleton>();
            foreach (Skeleton skel in skeletons)
            {
                if (skel.TrackingState == SkeletonTrackingState.Tracked)
                {
                    trackedSkeletons.Add(skel);
                }
            }

            return trackedSkeletons;
        }

        /// <summary>
        /// Updates defined players with new kinect skeletons.
        /// Marks lost player as "undefined".
        /// </summary>
        /// <param name="skeletons">List of all kinect skeletons detected</param>
        /// <returns>List of kinect skeleton without player associated</returns>
        private List<Skeleton> UpdateDefinedPlayers(List<Skeleton> skeletons)
        {
            List<Skeleton> nonAssociatedSkeletons = new List<Skeleton>();
            foreach(Skeleton skeleton in skeletons)
            {
                nonAssociatedSkeletons.Add(skeleton);
            }

            foreach (Player player in players)
            {
                if (!player.IsDefined())
                {
                    continue;
                }

                bool existingSkeletonForThisPlayer = false;
                foreach (Skeleton skeleton in skeletons)
                {
                    if (player.TackedId == skeleton.TrackingId)
                    {
                        existingSkeletonForThisPlayer = true;
                        player.Skeleton = skeleton;
                        nonAssociatedSkeletons.Remove(skeleton);
                    }
                }

                if (!existingSkeletonForThisPlayer)
                {
                    player.Undefined();
                }
            }

            return nonAssociatedSkeletons;
        }

        /// <summary>
        /// Associates all remaining skeletons (skeletons without player) to an undefined player
        /// </summary>
        /// <param name="skeletons">List of kinect skeleton without player associated</param>
        private void AssociateSkeletonsToPlayers(List<Skeleton> skeletons)
        {
            foreach (Skeleton skeleton in skeletons)
            {
                foreach (Player player in players)
                {
                    if (!player.IsDefined())
                    {
                        player.Defined(skeleton);
                        break;
                    }
                 }
            }
        }

        /// <summary>
        /// Updates the status of the captor
        /// </summary>
        /// <param name="newStatus">Current status of the kinect sensor</param>
        private void UpdateKinectStatus(string newStatus)
        {
            switch (newStatus)
            {
                case "Connected":
                    Status = "Connected";
                    break;
                case "Disconnected":
                    Status = "Disconnected";
                    break;
                case "Error":
                    Status = "Error";
                    break;
                case "NotReady":
                    Status = "Not Ready";
                    break;
                case "NotPowered":
                    Status = "Not Powered";
                    break;
                case "Initializing":
                    Status = "Initialising";
                    break;
                default:
                    Status = "Undefined";
                    break;
            }
        }
    }
}
