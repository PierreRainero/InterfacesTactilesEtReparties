namespace Kinect.Communication.Formater
{
    /// <summary>
    /// Class representing an association between a key and a string
    /// </summary>
    /// <author>Pierre RAINERO</author>
    /// <seealso> href="https://github.com/PierreRainero/InterfacesTactilesEtReparties">Repository GitHub</seealso>
    class SimpleIntPair : SimpleMember
    {
        public int Value { get; set; }

        /// <summary>
        /// Normal constructor
        /// </summary>
        /// <param name="key">Value of the key</param>
        /// <param name="value">Value associated to the key</param>
        public SimpleIntPair(string key, int value)
        {
            this.Key = key;
            this.Value = value;
        }

        /// <inheritdoc />
        public override string JSONFormat()
        {
            return base.JSONFormat() + Value + "";
        }
    }
}
