
using System;

namespace Kinect.Gameplay.Model
{
    /// <summary>
    /// Class representing a speed of an object
    /// </summary>
    /// <author>Pierre RAINERO</author>
    /// <seealso> href="https://github.com/PierreRainero/InterfacesTactilesEtReparties">Repository GitHub</seealso>
    class Speed
    {
        public float[] ZDistanceRight { get; private set; }
        public float[] ZDistanceLeft { get; private set; }
        public float value;
        private int indexer;

        /// <summary>
        /// Default constructor
        /// </summary>
        public Speed()
        {
            ZDistanceRight = new float[10];
            ZDistanceLeft = new float[10];
            indexer = 0;
            value = 0;
        }

        /// <summary>
        /// Add a "deep" (Z axe) distance for a frame
        /// </summary>
        /// <param name="rigthDistance">Z distance for right knee</param>
        /// <param name="leftDistance">Z distance for left knee</param>
        public void AddShot(float rigthDistance, float leftDistance)
        {
            if (indexer >= 10)
            {
                return;
            }

            ZDistanceRight[indexer] = rigthDistance > 0.1 ? (float)0.1 : rigthDistance;
            ZDistanceLeft[indexer] = leftDistance > 0.1 ? (float)0.1 : leftDistance;

            indexer++;
        }

        /// <summary>
        /// Check if there are enough data to calculate the speed
        /// </summary>
        /// <returns>"true" if the speed can be calculate, "false" otherwise</returns>
        public bool IsCalculable()
        {
            return indexer == 9;
        }

        /// <summary>
        /// Calculate and update the current value of the speed
        /// </summary>
        /// <returns>Current speed value</returns>
        public float Caculate()
        {
            float rigthSum = 0;
            Array.ForEach(ZDistanceRight, delegate (float i) { rigthSum += i; });
            float leftSum = 0;
            Array.ForEach(ZDistanceLeft, delegate (float i) { leftSum += i; });

            indexer = 0;
            float averageRunningSpeedFactor = (float)0.857836;
            value = SpeedCorrector((rigthSum + leftSum) / 2 * 19 * averageRunningSpeedFactor);

            return value;
        }

        /// <summary>
        /// Corrects speed by avoid the  kinect imprecision when the object doesn't move and cap maximum speed to 7 m/s
        /// </summary>
        /// <param name="estimatedSpeed">Estimate speed using ten last frame shots</param>
        /// <returns>Corrected estimate speed</returns>
        private float SpeedCorrector(float estimatedSpeed)
        {
            if(estimatedSpeed <= 0 || (estimatedSpeed > 0 && estimatedSpeed < 1))
            {
                return 0;
            }

            if(estimatedSpeed > 7)
            {
                return 7;
            }

            return estimatedSpeed;
        }
    }
}
