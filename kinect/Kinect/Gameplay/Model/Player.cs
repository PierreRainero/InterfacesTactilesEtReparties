using Microsoft.Kinect;

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
        public PlayerState state { get; set; }
        public Skeleton Skeleton { get; set; }

        /// <summary>
        /// Normal constructor
        /// </summary>
        /// <param name="playerId">Player identifier</param>
        public Player(int playerId)
        {
            TackedId = -1;
            this.PlayerId = playerId;
            Skeleton = null;
            state = PlayerState.NOTDETECTED;
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
            this.Skeleton = skeleton;
        }

        /// <summary>
        /// Indicates that player isn't usable
        /// </summary>
        public void Undefined()
        {
            TackedId = -1;
            Skeleton = null;
        }

        public override string ToString()
        {
            return base.ToString() + ": { id: "+ PlayerId + ", trackedId: " + TackedId+" }";
        }
    }
}
