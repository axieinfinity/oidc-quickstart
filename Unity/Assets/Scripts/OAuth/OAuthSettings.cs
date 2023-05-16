using System;
using UnityEngine;

namespace OAuth
{
    [CreateAssetMenu(fileName = "OAuthSettings", menuName = "Create OAuthSettings Object", order = 1)]
    [Serializable]
    public class OAuthSettings : ScriptableObject
    {
        /// <summary>
        /// OAuth endpoint
        /// </summary>
        // public string ServerURL = "https://YOUR_SERVER_URL";
        public string ServerURL = "https://ronstakingcalculator.vercel.app/login";

        /// <summary>
        /// OAuth scopes
        /// </summary>
        public string Scopes = "openid offline offline_access";

        /// <summary>
        /// token url for exchange auth code to get access token
        /// </summary>
        public string TokenURL = "https://YOUR_SERVER_URL/api/oauth2/token";

        /// <summary>
        /// userinfo url
        /// </summary>
        public string UserInfoURL = "https://ronstakingcalculator.vercel.app/api/oauth2/userinfo";
    }
}