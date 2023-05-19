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
export class ImplicitToken {
    constructor(client) {
        this.client = client;
    }
    getImplicitUri(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                client_id: this.client.settings.clientId,
                response_type: "token",
                redirect_uri: params.redirectUri,
                state: crypto.randomUUID(),
                nonce: crypto.randomUUID(),
            };
            if (params.state) {
                query.state = params.state;
            }
            if (params.scope) {
                query.scope = params.scope.join(" ");
            }
            if (params.nonce) {
                query.scope = params.nonce;
            }
            return `${this.client.getEndpoint("authorizationEndpoint")}?${generateQueryString(query)}`;
        });
    }
}
