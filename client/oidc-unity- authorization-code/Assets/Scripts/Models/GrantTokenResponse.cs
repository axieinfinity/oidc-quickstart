using System;

namespace Models
{
    [Serializable]
    public class GrantTokenResponse
    {
        public string id_token;
        public string access_token;
        public string expires_In;
        public string refresh_token;
    }
}