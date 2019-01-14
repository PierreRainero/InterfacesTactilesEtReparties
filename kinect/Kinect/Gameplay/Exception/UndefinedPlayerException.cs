using System;

namespace Kinect.Gameplay.Exception
{
    /// <summary>
    /// Exception class when an undefined player is use
    /// </summary>
    /// <author>Pierre RAINERO</author>
    /// <seealso> href="https://github.com/PierreRainero/InterfacesTactilesEtReparties">Repository GitHub</seealso>
    class UndefinedPlayerException : System.Exception
    {
        private DateTime m_errorTime;
        private static ushort s_errorNumber;

        /// <summary>
        /// Normal constructor
        /// </summary>
        /// <param name="message">Error message for more details</param>
        public UndefinedPlayerException(string message) : base(message)
        {
            m_errorTime = DateTime.Now;
            s_errorNumber++;
        }
    }
}
