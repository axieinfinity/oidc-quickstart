using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Models
{
    [Serializable]
    [JsonObject(NamingStrategyType = typeof(SnakeCaseNamingStrategy))]
    public class UserInfo
    {
        public string IDToken { get; set; }
        public string Sub{ get; set; }
        public string Addr{ get; set; }
        public string Name{ get; set; }
        public string Email{ get; set; }
    }
}