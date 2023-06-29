# Implementation for Unity

Sample using Unity.

## Getting Started

Your app must be allowlisted to access the OAuth 2.0 APIs. Follow the steps in the [Get started](https://docs.skymavis.com/docs/sma-get-started#get-started) section to request access to Sky Mavis Account.

How to run

1. Add redirect uri

- Access <https://developers.skymavis.one/console/account-service/>
- Add your callback uri, default: `demologin://platform`

2. Open `Unity/Assets/Scripts/LoginController.cs` and replace the values.

```csharp
public string CLIENT_ID = "<your_client_id>";
public string REDIRECT_URI = "demologin://platform";
public string SSO_AUTHORIZATION_ENDPOINT = "https://api-gateway.skymavis.one/oauth2/auth";
public string SERVER_TOKEN_ENDPOINT = "http://localhost:8080/oauth2/authorization-code/token";
```

3. Now you can open your Unity app and click the login button to test the flow.
