namespace Kinect.Communication
{
    /// <summary>
    /// Class to associate a key and a value, then allow to format them to send it throw the network
    /// </summary>
    /// <author>Pierre RAINERO</author>
    /// <seealso> href="https://github.com/PierreRainero/InterfacesTactilesEtReparties">Repository GitHub</seealso>
    class PairFormater
    {
        public string Key { get; set; }
        public string Value { get; set; }

        /// <summary>
        /// Normal constructor
        /// </summary>
        /// <param name="key">Value of the key</param>
        /// <param name="value">Value associated to the key</param>
        public PairFormater(string key, string value)
        {
            this.Key = key;
            this.Value = value;
        }

        /// <summary>
        /// Formates the pair as JSON Object
        /// </summary>
        /// <returns>JSON Object in a string</returns>
        public string JSONFormat()
        {
            return "{ \"" + Key + "\":" + Value + "}";
        }
    }
}
