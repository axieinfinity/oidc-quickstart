using System.Security.Cryptography;
using System.Text;

namespace Utils
{
    public static class Crypto
    {
        private static readonly char[] Padding = { '=' };

        public static byte[] ComputeSha256Hash(string rawData)
        {
            using SHA256 sha256Hash = SHA256.Create();
            // ComputeHash - returns byte array  
            var bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));

            return bytes;
            // // Convert byte array to a string   
            // StringBuilder builder = new StringBuilder();  
            // foreach (var t in bytes)
            // {
            //     builder.Append(t.ToString("x2"));
            // }  
            // return builder.ToString();
        }

        public static string EncodeURLBase64(byte[] rawData)
        {
            return System.Convert.ToBase64String(rawData)
                .TrimEnd(Padding).Replace('+', '-').Replace('/', '_');
        }
    }
}