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

  useEffect(() => {
    requestAuthrizationCode();
  }, []);
  return (
    <main className={styles.main}>
      <p>Redirect to Skymavis OAuth2 Server</p>
    </main>
  );
}
