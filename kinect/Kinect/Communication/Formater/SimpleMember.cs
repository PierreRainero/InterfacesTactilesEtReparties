namespace Kinect.Communication.Formater
{
    /// <summary>
    /// Class representing any generic object
    /// </summary>
    /// <author>Pierre RAINERO</author>
    /// <seealso> href="https://github.com/PierreRainero/InterfacesTactilesEtReparties">Repository GitHub</seealso>
    class SimpleMember
    {
        public string Key { get; set; }

        /// <summary>
        /// Return the simple member as a string respecting the JSON format
        /// </summary>
        /// <returns>Content as a string in JSON format</returns>
        public virtual string JSONFormat()
        {
            return "\"" + Key + "\":";
        }
    }
}
