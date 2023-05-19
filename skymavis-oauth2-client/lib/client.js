var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { OAuth2Account } from "./account";
import { AuthorizationCode } from "./authorize-code";
import { OAuth2Error } from "./error";
import { resolveUrl } from "./helpers";
import { ImplicitToken } from "./implicit-token";
const SSO_SERVER = "https://api-gateway.skymavis.com";
export const generateQueryString = (params) => {
    return new URLSearchParams(Object.fromEntries(Object.entries(params).filter((_k, v) => v !== undefined))).toString();
};
export class SkyMavisOAuth2Client {
    constructor(settings) {
        var _a, _b;
        this.settings = settings;
        (_a = this.settings).server || (_a.server = SSO_SERVER);
        (_b = this.settings).fetch || (_b.fetch = (...args) => globalThis.fetch(...args));
    }
    get authorizationCode() {
        return new AuthorizationCode(this);
    }
    get implicitToken() {
        return new ImplicitToken(this);
    }
    get account() {
        return new OAuth2Account(this);
    }
    handleErrorResponse(response) {
        return __awaiter(this, void 0, void 0, function* () {
            let jsonError;
            let errorDescription = "Unknown Error";
            let error = "Bad Request";
            if (response.headers.has("Content-Type") &&
                response.headers.get("Content-Type").startsWith("application/json")) {
                jsonError = yield response.json();
            }
            if (typeof (jsonError === null || jsonError === void 0 ? void 0 : jsonError.error) === "string") {
                error = jsonError.error;
            }
            if (typeof (jsonError === null || jsonError === void 0 ? void 0 : jsonError.error_description) === "string") {
                errorDescription = jsonError.error_description;
            }
            if (response.status === 401) {
                errorDescription =
                    jsonError.message || "Invalid authenticate credentials";
                error = "UnAuthorize";
            }
            return new OAuth2Error(error, errorDescription, response.status);
        });
    }
    getEndpoint(endpoint) {
        if (this.settings[endpoint]) {
            return resolveUrl(String(this.settings[endpoint]), this.settings.server);
        }
        switch (endpoint) {
            case "tokenEndpoint":
                return resolveUrl("/account/oauth2/token", this.settings.server);
            case "userinfo": {
                return resolveUrl("/account/userinfo", this.settings.server);
            }
            case "authorizationEndpoint": {
                return resolveUrl("/oauth2/auth", this.settings.server);
            }
        }
    }
}
