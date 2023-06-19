import React, { useRef } from 'react';
import { runtime } from 'webextension-polyfill';

import { client, extractQueryParams, generateCodeVerifier, getToken, getUserInfo } from '../utils/oauth-client';

import { Button } from '../components/Button';

const browser: any = (() => {
    if (typeof chrome === 'object') {
        return chrome;
    }
    //@ts-ignore
    if (typeof browser === 'object') {
        //@ts-ignore
        return browser;
    }
})();

export const Popup = () => {
    const [loading, setLoading] = React.useState(false);
    const [responseUrl] = React.useState('');
    const onLogin = async () => {
        setLoading(true);
        const codeVerifier = await generateCodeVerifier();
        const url = await client.authorizationCode.getAuthorizeUri({
            redirectUri: 'http://localhost:3000/oauth2/callback',
            codeVerifier,
        });
        document.location = url;

        //Firefox: handle login in background
        if (typeof chrome === 'undefined') {
            return runtime.sendMessage({ data: { url, codeVerifier }, type: 'login' });
        }

        //Handle login for google chrome
        chrome.identity.launchWebAuthFlow({ url, interactive: true }, function (responseUrl: string) {
            const { code, error, error_description } = extractQueryParams(responseUrl);
            if (code) {
                return getToken(code, codeVerifier)
                    .then(({ access_token }) => {
                        return getUserInfo(access_token);
                    })
                    .then((user) => {
                        console.log('getUserResponse', user);
                    });
            }
            console.error(error, error_description);
        });
    };
    return (
        <div>
            <div>
                <h2>Response:</h2>
                <p>{responseUrl}</p>
            </div>
            <Button loading={!!loading} onClick={onLogin}>
                Login with SM
            </Button>
        </div>
    );
};

export default Popup;
