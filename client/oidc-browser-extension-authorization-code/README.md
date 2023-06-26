# Single Sign-On (SSO) Implementation for Firefox/GoogleChrome extension

This guide will walk you through the process of implementing Single Sign-On (SSO) for your application. SSO allows users to log in once and gain access to multiple applications or services without the need to log in separately for each one.

## Getting Started:

### Start authenticate server:

Change working directory to `authenticate-server`:

1. Run: `npm install`
2. Clone `.env.example` -> `.env` and update .env content
3. Run `npm run start`

### Run & Deploy:

Change working directory to `extension`, the SSO implementation locate in `src/popup/Popup.tsx` and the sso client is in `src/utils/oauth-client`

1. Run: `npm install`
2. Update for clientId at `extension/utils/oauth2-client.ts`

```javascript
const client = new SkyMavisOAuth2Client({
    clientId: 'your_client_id',
});
```

3. Run: `npm run dev:(chrome|firefox|edge)`
4. Load extension:

_Load the extension in Firefox_

-   Open Firefox browser and navigate to about:debugging
-   Click "Load Temporary Add-on" and from the file browser, choose >> extension/dev/firefox

_Load the extension in Chrome_

-   Open Chrome browser and navigate to chrome://extensions
-   Select "Developer Mode" and then click "Load unpacked extension..."
-   From the file browser, choose to extension/dev/chrome or > (extension/dev/chrome)
