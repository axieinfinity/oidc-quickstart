export const resolveUrl = (uri: string, base?: string) =>
  new URL(uri, base).toString();

export async function generateCodeVerifier(): Promise<string> {
  const webCrypto = getWebCrypto();
  if (webCrypto) {
    const arr = new Uint8Array(32);
    webCrypto.getRandomValues(arr);
    return base64Url(arr);
  } else {
    const nodeCrypto = require("crypto");
    return new Promise<string>((res, rej) => {
      nodeCrypto.randomBytes(32, (err: Error, buf: Buffer) => {
        if (err) rej(err);
        res(buf.toString("base64url"));
      });
    });
  }
}

export async function getCodeChallenge(
  codeVerifier: string
): Promise<["plain" | "S256", string]> {
  const webCrypto = getWebCrypto();
  if (webCrypto?.subtle) {
    return [
      "S256",
      base64Url(
        await webCrypto.subtle.digest("SHA-256", stringToBuffer(codeVerifier))
      ),
    ];
  } else {
    const nodeCrypto = require("crypto");
    const hash = nodeCrypto.createHash("sha256");
    hash.update(stringToBuffer(codeVerifier));
    return ["S256", hash.digest("base64url")];
  }
}

export function getWebCrypto() {
  // Browsers
  if (typeof window !== "undefined" && window.crypto) {
    return window.crypto;
  }
  // Web workers possibly
  if (typeof self !== "undefined" && self.crypto) {
    return self.crypto;
  }
  const crypto = require("crypto");
  if (crypto.webcrypto) {
    return crypto.webcrypto;
  }
  return null;
}

function stringToBuffer(input: string): ArrayBuffer {
  const buf = new Uint8Array(input.length);
  for (let i = 0; i < input.length; i++) {
    buf[i] = input.charCodeAt(i) & 0xff;
  }
  return buf;
}

function base64Url(buf: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export const extractQueryParams = (url: string): Record<string, any> => {
  const { searchParams, hash } = new URL(url);

  let entries: [string, string][] = [];

  for (let pair of searchParams.entries()) {
    entries.push(pair);
  }

  for (let pair of new URLSearchParams(
    (hash || "").replace(/^#/, "")
  ).entries()) {
    entries.push(pair);
  }
  return Object.fromEntries(entries);
};
