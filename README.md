# Unity SSO quickstart

This quickstart guide shows you how to integrate Sky Mavis Account into a sample Unity app.

In this guide, you do the following:

1. Register your application on the Developer Portal.
2. Clone the sample repository
3. Configure the settings in your app
4. Set up a web server

## Prerequisites

A web server to host your Next.js app. For example, you can [use Vercel](https://nextjs.org/learn/basics/deploying-nextjs-app).

## Step 1. Register the app

Register your application on the Developer Portal as described in [Get started](doc:unity-sso-get-started).

## Step 2. Clone the sample repo

1. Clone this repository by running the following command:

```bash
git clone git@github.com:axieinfinity/unity-sso-quickstart.git
```

2. Navigate to the directory with the code.

```bash
cd unity-sso-quickstart
```

## Step 3. Configure the settings in your app

Open `Unity/Assets/Scripts/OAuth/OAuthSettings.cs` and replace the `ServerURL`, `TokenURL`, and `UserInfoURL` with your values.

```csharp
using System;
using UnityEngine;

namespace OAuth
{
    [CreateAssetMenu(fileName = "OAuthSettings", menuName = "Create OAuthSettings Object", order = 1)]
    [Serializable]
    public class OAuthSettings : ScriptableObject
    {
        /// <summary>
        /// OAuth endpoint
        /// </summary>
        public string ServerURL = "https://YOUR_SERVER_URL";

        /// <summary>
        /// OAuth scopes
        /// </summary>
        public string Scopes = "openid offline offline_access";

        /// <summary>
        /// token url for exchanging the auth code for an access token
        /// </summary>
        public string TokenURL = "https://YOUR_SERVER_URL/api/oauth2/token";

        /// <summary>
        /// userinfo URL
        /// </summary>
        public string UserInfoURL = "https://YOUR_SERVER_URL/api/oauth2/userinfo";
    }
}
```

## Step 4. Set up a web server

1. In `NextJS-web-server/`, create an `.env` file with the following content:
   1. Your client ID and client secret from the Developer Console.
   2. Your own callback URL and deep link URL.

```text
CALLBACK_URL=https://YOUR_APP_URL/oauth2/callback
CLIENT_ID=YOUR_CLIENT_ID
CLIENT_SECRET=YOUR_CLIENT_SECRET
DEEPLINK_URL=demosso://platform
```

Alternatively, you can edit the existing `.env.example` file. Make sure to remove the `.example` extension from the file name.

2. Deploy the app to a web server of your choice.

Now you can open your Unity app and click the login button to test the flow.
