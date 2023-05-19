export declare const resolveUrl: (uri: string, base?: string) => string;
export declare function generateCodeVerifier(): Promise<string>;
export declare function getCodeChallenge(codeVerifier: string): Promise<["plain" | "S256", string]>;
export declare function getWebCrypto(): any;
export declare const extractQueryParams: (url: string) => Record<string, any>;
