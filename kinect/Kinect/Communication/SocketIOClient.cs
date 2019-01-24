using System;
using System.Text.RegularExpressions;
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
        private readonly static string doublequote = "\"";

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

        /// <summary>
        /// Receive a message from distant server
        /// </summary>
        /// <param name="chanel">Chanel to listen</param>
        /// <param name="callback">Method to call when a message is emitted</param>
        public void On(string chanel, Action<string> callback)
        {
            socket.OnMessage += (sender, e) => {
                string data = e.Data;

                if (data.Substring(0,2) == "42")
                {
                    Regex pattern = new Regex(@"\[" + doublequote + chanel + doublequote + @"," + doublequote + @"(?<message>\w+)" + doublequote + @"\]");
                    Match match = pattern.Match(e.Data);
                    string message = match.Groups["message"].Value;

                    callback(message);
                }
            };
        }
    }
}
