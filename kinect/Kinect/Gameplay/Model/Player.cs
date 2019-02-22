using Microsoft.Kinect;
using System;

namespace Kinect.Gameplay.Model
{
    /// <summary>
    /// Class representing a player
    /// </summary>
    /// <author>Pierre RAINERO</author>
    /// <seealso> href="https://github.com/PierreRainero/InterfacesTactilesEtReparties">Repository GitHub</seealso>
    class Player
    {
        public int TackedId { get; private set; }
        public int PlayerId { get; private set; }
        public PlayerState State { get; set; }
        public Skeleton PreviousSkeleton { get; set; }
        public Skeleton CurrentSkeleton { get; set; }
        public Speed Speed { get; private set; }
        private Jump lastJump;

        /// <summary>
        /// Normal constructor
        /// </summary>
        /// <param name="playerId">Player identifier</param>
        public Player(int playerId)
        {
            TackedId = -1;
            this.PlayerId = playerId;
            PreviousSkeleton = null;
            CurrentSkeleton = null;
            State = PlayerState.NOTDETECTED;
            lastJump = new Jump();
            Speed = new Speed();
        }

        /// <summary>
        /// Checks if the player is defined
        /// </summary>
        /// <returns>"true" if the player is well defined and ready to be used. "false" otherwise.</returns>
        public bool IsDefined()
        {
            return TackedId != -1;
        }

        /// <summary>
        /// Defines a kinect skeleton for the player
        /// </summary>
        /// <param name="skeleton">Skeleton associated to the player</param>
        public void Defined(Skeleton skeleton)
        {
            this.TackedId = skeleton.TrackingId;
            this.PreviousSkeleton = this.CurrentSkeleton;
            this.CurrentSkeleton = skeleton;
        }

        /// <summary>
        /// Indicates that player isn't usable
        /// </summary>
        public void Undefined()
        {
            TackedId = -1;
            CurrentSkeleton = null;
            PreviousSkeleton = null;
        }

        /// <summary>
        /// Notifies the system the player is jumping
        /// </summary>
        /// <param name="heigthJumped">Last heigth jumped</param>
        public void JumpDetected(float heigthJumped)
        {
            if(heigthJumped > 0)
            {
                lastJump.Increment(heigthJumped);
            }
            else
            {
                lastJump.Cancel();
            }
        }

        /// <summary>
        /// Allows to know if the jump is completed
        /// </summary>
        /// <returns>"true" if the jump is completed, "false" otherwise</returns>
        public bool Jumped()
        {
            return lastJump.IsJumpFinished();
        }

        /// <summary>
        /// Marks the last jump as validate and associate a time for it
        /// </summary>
        /// <param name="time">Time when the last jump was validate</param>
        public void ValidateJump(DateTime time)
        {
            lastJump.Complete(time);
        }

        /// <inheritdoc />
        public override string ToString()
        {
            return base.ToString() + ": { id: "+ PlayerId + ", trackedId: " + TackedId+" }";
        }
    }
}
