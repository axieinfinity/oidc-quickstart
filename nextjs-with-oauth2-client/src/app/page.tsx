"use client";
import styles from "./page.module.css";

import { client, generateCodeVerifier } from "./client";
import { useEffect } from "react";

export default function Home() {
  const requestAuthrizationCode = async () => {
    const codeVerifier = await generateCodeVerifier();
    localStorage.setItem("codeVerifier", codeVerifier);
    const url = await client.authorizationCode.getAuthorizeUri({
      codeVerifier,
      redirectUri: "http://localhost:3000/oauth2/callback",
      scope: ["openid", "offline", "offline_access"],
    });
    location.href = url;
  };

  const requestImplicitToken = async () => {
    const url = await client.implicitToken.getImplicitTokenUri({
      redirectUri: "http://localhost:3000/oauth2/callback",
    });
    location.href = url;
  };

  return (
    <main>
      <div style={{ margin: "auto", width: 680, marginTop: 200 }}>
        <h2 style={{ marginBottom: 24 }}>Redirect to Skymavis OAuth2 Server</h2>
        <button onClick={requestAuthrizationCode}>Authorization Code</button>
        <button onClick={requestImplicitToken}>Implicit Token</button>
      </div>
    </main>
  );
}
