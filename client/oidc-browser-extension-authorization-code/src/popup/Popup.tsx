import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { runtime } from 'webextension-polyfill';
import { SERVER_ENDPOINT } from 'utils/env';

export const Popup = () => {
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(null);

    const requestLogin = () => {
        if (loading) return;
        runtime.sendMessage({ type: 'login' });
        setLoading(true);
    };

    useEffect(() => {
        runtime.onMessage.addListener(async function (message) {
            switch (message.type) {
                case 'response_login': {
                    try {
                        const { code, redirect_uri } = message.data;
                        const { data } = await axios({
                            baseURL: SERVER_ENDPOINT,
                            url: '/oauth2/authorization-code/token',
                            method: 'POST',
                            data: {
                                code,
                                redirect_uri,
                            },
                        });
                        setToken(data);
                        setLoading(false);
                    } catch (error) {
                        console.log('error', error);
                    }
                }
            }
        });
    }, []);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '100px',
            }}
        >
            {token ? (
                <>
                    <h1>Login successful!</h1>
                    <pre style={{ whiteSpace: 'pre-wrap', width: 200, overflow: 'auto' }}>
                        {JSON.stringify(token, null, 2)}
                    </pre>
                </>
            ) : (
                <>
                    <h1>Login</h1>
                    <button
                        style={{
                            padding: '12px 32px',
                            borderRadius: 8,
                            border: 'none',
                            cursor: 'pointer',
                        }}
                        onClick={requestLogin}
                    >
                        {loading ? 'Loading ... ' : 'Continue with Sky Mavis SSO'}
                    </button>
                </>
            )}
        </div>
    );
};

export default Popup;
