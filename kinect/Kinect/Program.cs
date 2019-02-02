using Kinect.Gameplay;
using System;

namespace Kinect
{
    /// <summary>
    /// Program entry point
    /// </summary>
    /// <author>Pierre RAINERO</author>
    /// <seealso> href="https://github.com/PierreRainero/InterfacesTactilesEtReparties">Repository GitHub</seealso>
    class Program
    {
        static void Main(string[] args)
        {
            Game game = new Game();
            game.StartCapture();

            Console.WriteLine("--- Press enter to stop this program ---");
            Console.ReadLine();
            game.StopCapture();
        }
    }
}
