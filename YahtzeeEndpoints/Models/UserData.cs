using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.IO;

namespace YahtzeeEndpoints.Models
{
    public static class UserData
    {
        private static Dictionary<string, byte[]> userImages = new Dictionary<string, byte[]>();

        public static Dictionary<string, byte[]> UserImages
        {
            get { return userImages; }
        }
    }
}