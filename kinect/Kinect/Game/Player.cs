using Microsoft.Kinect;

namespace Kinect.Game
{
    /// <summary>
    /// Class representing a player
    /// </summary>
    /// <author>Pierre RAINERO</author>
    /// <seealso> href="https://github.com/PierreRainero/InterfacesTactilesEtReparties">Repository GitHub</seealso>
    class Player
    {
        public int TackedId { get; private set; }
        public string Color { get; private set; }
        public Skeleton Skeleton { get; set; }

        /// <summary>
        /// Normal constructor
        /// </summary>
        /// <param name="color">Color of the player (identifier)</param>
        public Player(string color)
        {
            TackedId = -1;
            this.Color = color;
            Skeleton = null;
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
            return base.ToString() + ": { color: "+ Color + ", id: " + TackedId+" }";
        }
    }
}
