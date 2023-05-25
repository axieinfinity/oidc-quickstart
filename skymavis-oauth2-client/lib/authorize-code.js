var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { generateQueryString } from "./client";
import { getCodeChallenge, getWebCrypto } from "./helpers";
export class AuthorizationCode {
    constructor(client) {
        this.client = client;
        this.getAuthorizeUri = (params) => __awaiter(this, void 0, void 0, function* () {
            const webCrypto = getWebCrypto();
            const query = {
                client_id: this.client.settings.clientId,
                response_type: "code",
                redirect_uri: params.redirectUri,
                state: webCrypto.randomUUID(),
            };
            if (params.codeVerifier) {
                const [algorithm, codeChallange] = yield getCodeChallenge(params.codeVerifier);
                query.code_challenge_method = algorithm;
                query.code_challenge = codeChallange;
            }
            if (params.state) {
                query.state = params.state;
            }
            if (params.scope) {
                query.scope = params.scope.join(" ");
            }
            return `${this.client.getEndpoint("authorizationEndpoint")}?${generateQueryString(query)}`;
        });
        this.getToken = (params) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const headers = {
                "Content-Type": "application/x-www-form-urlencoded",
                "X-API-KEY": params.apiKey,
            };
            const query = {
                grant_type: "authorization_code",
                code: params.code,
                redirect_uri: params.redirectUri,
            };
            if (params.codeVerifier) {
                query.code_verifier = params.codeVerifier;
            }
            if ((params === null || params === void 0 ? void 0 : params.authorizeMethod) === "client_secret_basic") {
                headers.Authorization = `Basic ${btoa(`${this.client.settings.clientId}:${params.clientSecret}`)}`;
                query.token_endpoint_auth_method = "client_secret_basic";
            }
            else {
                query.client_id = this.client.settings.clientId;
                query.client_secret = params.clientSecret || "";
            }
            const resp = yield ((_b = (_a = this.client.settings).fetch) === null || _b === void 0 ? void 0 : _b.call(_a, this.client.getEndpoint("tokenEndpoint"), {
                method: "POST",
                body: generateQueryString(query),
                headers,
            }));
            if (!resp) {
                throw new Error("Cannot parse the response from server");
            }
            if (resp.ok) {
                return (yield resp.json());
            }
            throw yield this.client.handleErrorResponse(resp);
        });
    }
}
