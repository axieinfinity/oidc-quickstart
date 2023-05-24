import { SkyMavisOAuth2Client, extractQueryParams, generateCodeVerifier } from '../../../skymavis-oauth2-client/lib';

async function getUserInfo(token: string) {
    return await fetch('http://localhost:8080/oauth2/userinfo', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token,
        },
    }).then((resp) => resp.json());
}

async function getToken(code: string, codeVerifier: string) {
    return await fetch('http://localhost:8080/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            code,
            codeVerifier,
            redirectUri: 'http://localhost:5173',
        }),
    }).then((resp) => resp.json());
}

const client = new SkyMavisOAuth2Client({
    clientId: '',
});

export { client, getToken, getUserInfo, extractQueryParams, generateCodeVerifier };
