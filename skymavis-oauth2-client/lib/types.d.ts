export type TokenResponse = {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
};
export type ErrorResponse = {
    error: string;
    error_description: string;
};
