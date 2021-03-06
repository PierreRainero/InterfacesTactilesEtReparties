﻿using System;

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
        private float cumuledHeight;
        private static readonly int periodDuration = 4;
        private Nullable<DateTime> lastJump;

        /// <summary>
        /// Default constructor
        /// </summary>
        public Jump()
        {
            jumpCounter = 0;
            cumuledHeight = 0;
            lastJump = null;
        }

        /// <summary>
        /// Reset the current period
        /// </summary>
        public void Cancel()
        {
            jumpCounter = 0;
            cumuledHeight = 0;
        }

        /// <summary>
        /// Increment the current period
        /// </summary>
        /// <param name="height">Additional heigth jumped</param>
        public void Increment(float height)
        {
            cumuledHeight += height;
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
                   cumuledHeight > 0.14 &&
                   (!lastJump.HasValue || DateTime.Now.Subtract(lastJump.Value).Seconds>=2.5);
        }

        /// <summary>
        /// Mark the current jump as completed
        /// </summary>
        /// <param name="jumpTime">Validation time of the jump</param>
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
