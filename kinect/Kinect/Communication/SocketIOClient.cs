using WebSocketSharp;

namespace Kinect.Communication
{
    /// <summary>
    /// Class to open a communication to a Node.js server through a socket.io socket
    /// </summary>
    /// <author>Pierre RAINERO</author>
    /// <seealso> href="https://github.com/PierreRainero/InterfacesTactilesEtReparties">Repository GitHub</seealso>
    class SocketIOClient
    {
        private readonly WebSocket socket;

        /// <summary>
        /// Normal constructor : create the socket
        /// </summary>
        /// <param name="url">Address of the distant server</param>
        /// <param name="port">Port to use</param>
        public SocketIOClient(string url, int port)
        {
            socket = new WebSocket("ws://" + url + ":"+ port + "/socket.io/?EIO=2&transport=websocket");
        }

        /// <summary>
        /// Starts the connection through a socket.io
        /// </summary>
        /// <remarks>
        /// You should call this method one time before any other ones
        /// </remarks>
        public void Connect()
        {
            socket.Connect();
        }

        /// <summary>
        /// Closes the connection
        /// </summary>
        /// <remarks>
        /// You should call this method when you doesn't want to communicate any more with the distant server
        /// </remarks>
        public void Disconnect()
        {
            socket.Close();
        }

        /// <summary>
        /// Sends a message to a specific channel for distant server
        /// </summary>
        /// <param name="chanel">Chanel to use</param>
        /// <param name="data">Data content as json object in a string</param>
        public void Emit(string chanel, string data)
        {
            socket.Send("42[\"" + chanel + "\","+ data + "]");
        }
    }
}
