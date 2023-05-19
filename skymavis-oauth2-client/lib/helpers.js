var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const resolveUrl = (uri, base) => new URL(uri, base).toString();
export function generateCodeVerifier() {
    return __awaiter(this, void 0, void 0, function* () {
        const webCrypto = getWebCrypto();
        if (webCrypto) {
            const arr = new Uint8Array(32);
            webCrypto.getRandomValues(arr);
            return base64Url(arr);
        }
        else {
            const nodeCrypto = require("crypto");
            return new Promise((res, rej) => {
                nodeCrypto.randomBytes(32, (err, buf) => {
                    if (err)
                        rej(err);
                    res(buf.toString("base64url"));
                });
            });
        }
    });
}
export function getCodeChallenge(codeVerifier) {
    return __awaiter(this, void 0, void 0, function* () {
        const webCrypto = getWebCrypto();
        if (webCrypto === null || webCrypto === void 0 ? void 0 : webCrypto.subtle) {
            return [
                "S256",
                base64Url(yield webCrypto.subtle.digest("SHA-256", stringToBuffer(codeVerifier))),
            ];
        }
        else {
            const nodeCrypto = require("crypto");
            const hash = nodeCrypto.createHash("sha256");
            hash.update(stringToBuffer(codeVerifier));
            return ["S256", hash.digest("base64url")];
        }
    });
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
function stringToBuffer(input) {
    const buf = new Uint8Array(input.length);
    for (let i = 0; i < input.length; i++) {
        buf[i] = input.charCodeAt(i) & 0xff;
    }
    return buf;
}
function base64Url(buf) {
    return btoa(String.fromCharCode(...new Uint8Array(buf)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}
export const extractQueryParams = (url) => {
    const searchParams = new URL(url).searchParams;
    let entries = [];
    for (let pair of searchParams.entries()) {
        entries.push(pair);
    }
    return Object.fromEntries(entries);
};
