import { SkyMavisOAuth2Client } from "./client";
export type ClientSettings = {
    server: string;
    clientId: string;
    authorizeEndpoint?: string;
    tokenEndpoint?: string;
    clientSecret?: string;
};
export type GetAuthorizeUriParams = {
    redirectUri: string;
    state?: string;
    codeVerifier?: string;
    scope?: string[];
};
export type AuthenticateMethod = "client_secret_basic" | "client_secret_post";
export type GetTokenParams = {
    code: string;
    apiKey: string;
    redirectUri: string;
    clientSecret: string;
    authorizeMethod?: AuthenticateMethod;
    codeVerifier?: string;
};
export type AuthorizationQueryParams = {
    response_type: "code";
    client_id: string;
    redirect_uri: string;
    state?: string;
    scope?: string;
    code_challenge_method?: "plain" | "S256";
    code_challenge?: string;
};
export declare class AuthorizationCode {
    private readonly client;
    constructor(client: SkyMavisOAuth2Client);
    getAuthorizeUri(params: GetAuthorizeUriParams): Promise<string>;
    getToken(params: GetTokenParams): Promise<TokenResponse>;
}
export type TokenResponse = {
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
};
