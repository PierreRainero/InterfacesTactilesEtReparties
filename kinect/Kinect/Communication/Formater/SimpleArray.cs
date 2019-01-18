using System.Collections.Generic;
using System.Text;

namespace Kinect.Communication.Formater
{
    /// <summary>
    /// Class representing a generic array
    /// </summary>
    /// <author>Pierre RAINERO</author>
    /// <seealso> href="https://github.com/PierreRainero/InterfacesTactilesEtReparties">Repository GitHub</seealso>
    class SimpleArray : SimpleMember
    {
        private List<SimpleMember> members;

        /// <summary>
        /// Default constructor
        /// </summary>
        public SimpleArray()
        {
            members = new List<SimpleMember>();
        }

        /// <summary>
        /// Add a member in the array
        /// </summary>
        /// <param name="memberToAdd">Generic member to add</param>
        public void AddMember(SimpleMember memberToAdd)
        {
            members.Add(memberToAdd);
        }

        /// <summary>
        /// Remove a member in the array
        /// </summary>
        /// <param name="indexOfMemberToRemove">Index of the generic member to remove</param>
        public void RemoveMember(int indexOfMemberToRemove)
        {
            members.RemoveAt(indexOfMemberToRemove);
        }

        /// <inheritdoc />
        public override string JSONFormat()
        {
            StringBuilder jsonObject = new StringBuilder(base.JSONFormat() + "[");

            foreach (SimpleMember member in members)
            {
                jsonObject.Append(member.JSONFormat() + ", ");
            }
            jsonObject.Remove(jsonObject.Length - 2, 2);

            jsonObject.Append("]");
            return jsonObject.ToString();
        }
    }
}
