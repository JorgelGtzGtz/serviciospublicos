using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace ServiciosPublicos.Api.Filters
{
    public class Authentication : GenericIdentity
    {
        /// <summary>
        /// Get/Set for password
        /// </summary>
        public string Password { get; set; }

        /// <summary>
        /// Get/Set for Role
        /// </summary>
        public string Role { get; set; }

        /// <summary>
        /// Get/Set for UserName
        /// </summary>
        public string UserName { get; set; }

        /// <summary>
        /// Get/Set for UserID
        /// </summary>
        public int UserID { get; set; }

        /// <summary>
        /// Get/Set for SucursalID
        /// </summary>
        public bool? SuperAdmin { get; set; }

        public Authentication(string userName, string password, string role, int userID, bool? superAdmin)
            : base(userName, "Basic")
        {
            Role = role;
            Password = password;
            UserName = userName;
            UserID = userID;
            SuperAdmin = superAdmin;
        }
    }
}