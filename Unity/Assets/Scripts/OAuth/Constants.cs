namespace OAuth
{
    public abstract class QueryParams
    {
        public const string ClientID = "client_id";
        public const string State = "state";
        public const string Scope = "scope";
        public const string Scopes = "scopes";
        public const string RedirectUri = "redirect_uri";
        public const string ResponseType = "response_type";
        public const string Nonce = "nonce";
        public const string CodeChallengeMethod = "code_challenge_method";
        public const string CodeChallenge = "code_challenge";
        public const string GrantType = "grant_type";
        public const string CodeVerifier = "code_verifier";
        public const string Code = "code";
        public const string ClientSecret = "client_secret";
        public const string AccessToken = "access_token";
    }

    public abstract class ResponseType
    {
        public const string Code = "code";
        public const string Token = "token";
        public const string IDToken = "id_token";
    }
}