# Single Sign-On (SSO) Implementation for Firefox/GoogleChrome extension

This guide will walk you through the process of implementing Single Sign-On (SSO) for your application. SSO allows users to log in once and gain access to multiple applications or services without the need to log in separately for each one.

## Getting Started:

Your app must be allowlisted to access the OAuth 2.0 APIs. Follow the steps in the [Get started](https://docs.skymavis.com/docs/sma-get-started#get-started) section to request access to Sky Mavis Account.

### Run & Deploy:

1. Run: `pnpm install`
2. Run: `pnpm dev:chrome`
3. Load extension:

_Load the extension in Chrome_

-   Open Chrome browser and navigate to chrome://extensions
-   Select "Developer Mode" and then click "Load unpacked extension..."
-   From the file browser, choose to extension/dev/chrome or > (extension/dev/chrome)

_Load the extension in Firefox_

-   Open Firefox browser and navigate to about:debugging
-   Click "Load Temporary Add-on" and from the file browser, choose >> extension/dev/firefox
