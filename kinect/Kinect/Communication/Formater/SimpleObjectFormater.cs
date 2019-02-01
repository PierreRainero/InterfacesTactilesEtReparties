using System.Collections.Generic;
using System.Text;

namespace Kinect.Communication.Formater
{
    /// <summary>
    /// Class to create simple object to travel through the network (basically in json format)
    /// </summary>
    /// <author>Pierre RAINERO</author>
    /// <seealso> href="https://github.com/PierreRainero/InterfacesTactilesEtReparties">Repository GitHub</seealso>
    class SimpleObjectFormater : SimpleMember
    {
        private List<SimpleMember> children;

        /// <summary>
        /// Default constructor
        /// </summary>
        public SimpleObjectFormater()
        {
            children = new List<SimpleMember>();
        }

        /// <summary>
        /// Add a string as new child (attribute of the object to send)
        /// </summary>
        /// <param name="key">Value of the key</param>
        /// <param name="value">Value associated to the key</param>
        public void AddString(string key, string value)
        {
            children.Add(new SimpleStringPair(key, value));
        }
        /// <summary>
        /// Add a integer as new child (attribute of the object to send)
        /// </summary>
        /// <param name="key">Value of the key</param>
        /// <param name="value">Value associated to the key</param>
        public void AddInt(string key, int value)
        {
            children.Add(new SimpleIntPair(key, value));
        }

        /// <summary>
        /// Add a floating number as new child (attribute of the object to send)
        /// </summary>
        /// <param name="key">Value of the key</param>
        /// <param name="value">Value associated to the key</param>
        public void AddFloat(string key, float value)
        {
            children.Add(new SimpleFloatPair(key, value));
        }

        /// <summary>
        /// Add a generic object as new child (attribute of the object to send)
        /// </summary>
        /// <param name="key">Value of the key</param>
        /// <param name="value">Value associated to the key</param>
        public void AddMember(string key, SimpleMember member)
        {
            member.Key = key;
            children.Add(member);
        }

        /// <summary>
        /// Add an array of generic object as new child (attribute of the object to send)
        /// </summary>
        /// <param name="key">Value of the key</param>
        /// <param name="value">Value associated to the key</param>
        public void AddArray(string key, SimpleArray array)
        {
            array.Key = key;
            children.Add(array);
        }

        /// <inheritdoc />
        public override string JSONFormat()
        {
            string baseValue = Key == null ? "{" : base.JSONFormat() + "{";
            StringBuilder jsonObject = new StringBuilder(baseValue);

            foreach(SimpleMember child in children)
            {
                jsonObject.Append(child.JSONFormat() + ", ");
            }
            jsonObject.Remove(jsonObject.Length - 2, 2);

            jsonObject.Append("}");
            return jsonObject.ToString();
        }
    }
}
