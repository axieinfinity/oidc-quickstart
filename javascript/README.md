# Single Sign-On (SSO) Implementation in Javascript

This guide will walk you through the process of implementing Single Sign-On (SSO) for your application. SSO allows users to log in once and gain access to multiple applications or services without the need to log in separately for each one.

## Prereqrisites

Your app must be allowlisted to access the OAuth 2.0 APIs. Follow the steps in the [Get started](https://docs.skymavis.com/docs/sma-get-started#get-started) section to request access to Sky Mavis Account.

## Getting Started:

### Start authenticate server:

Change working directory to `authenticate-server`:

1. Run: `npm install`
2. Clone `.env.example` -> `.env` and update .env content
3. Run `npm run start`

### Start Client:

1. Run: `npm install`
2. Update for clientId at `javascript/login.js`

```javascript
const client = new SkyMavisOAuth2Client({
  clientId: "your_client_id",
});
```

3. Run: `npm run start`
