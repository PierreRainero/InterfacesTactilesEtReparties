using System;

namespace Kinect.Gameplay.Model
{
    /// <summary>
    /// Class representing a jump
    /// </summary>
    /// <author>Pierre RAINERO</author>
    /// <seealso> href="https://github.com/PierreRainero/InterfacesTactilesEtReparties">Repository GitHub</seealso>
    class Jump
    {
        private int jumpCounter;
        private static readonly int periodDuration = 3;
        private Nullable<DateTime> lastJump;

        /// <summary>
        /// Default constructor
        /// </summary>
        public Jump()
        {
            jumpCounter = 0;
            lastJump = null;
        }

        /// <summary>
        /// Reset the current period
        /// </summary>
        public void Cancel()
        {
            jumpCounter = 0;
        }

        /// <summary>
        /// Increment the current period
        /// </summary>
        public void Increment()
        {
            jumpCounter++;
            
            if (lastJump.HasValue && DateTime.Now.Second != lastJump.Value.Second)
            {
                lastJump = null;
            }
        }
        
        /// <summary>
        /// Check if the jump is finished and valid
        /// </summary>
        /// <returns>"true" if the jump can be accepted, "false" otherwise</returns>
        public bool IsJumpFinished()
        {
            return jumpCounter == periodDuration && 
                (!lastJump.HasValue || DateTime.Now.Second != lastJump.Value.Second);
        }

        public void Complete(DateTime jumpTime) {
            lastJump = jumpTime;
            Cancel();
        }

        /// <inheritdoc />
        public override string ToString()
        {
            return base.ToString() + ": { period: " + jumpCounter + "/"+ periodDuration+", last accepted jump: " + lastJump.ToString() + " }";
        }
    }
}
