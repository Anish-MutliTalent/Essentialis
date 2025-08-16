import type { ThirdwebClient } from "../../../../client/client.js";
import type { Ecosystem } from "../wallet/types.js";
import type { ClientScopedStorage } from "./client-scoped-storage.js";
import type { AuthStoredTokenWithCookieReturnType } from "./types.js";
export type RegisterResult = {
    authenticatorData: string;
    credentialId: string;
    clientData: string;
    credential: {
        publicKey: string;
        algorithm: string;
    };
    origin: string;
};
export type AuthenticateResult = {
    credentialId: string;
    authenticatorData: string;
    clientData: string;
    signature: string;
    origin: string;
};
export type RpInfo = {
    name: string;
    id: string;
};
export interface PasskeyClient {
    register: (args: {
        name: string;
        challenge: string;
        rp: RpInfo;
    }) => Promise<RegisterResult>;
    authenticate: (args: {
        credentialId: string | undefined;
        challenge: string;
        rp: RpInfo;
    }) => Promise<AuthenticateResult>;
    isAvailable: () => boolean;
}
export declare function registerPasskey(options: {
    client: ThirdwebClient;
    passkeyClient: PasskeyClient;
    storage?: ClientScopedStorage;
    ecosystem?: Ecosystem;
    username?: string;
    rp: RpInfo;
}): Promise<AuthStoredTokenWithCookieReturnType>;
export declare function loginWithPasskey(options: {
    client: ThirdwebClient;
    passkeyClient: PasskeyClient;
    rp: RpInfo;
    storage?: ClientScopedStorage;
    ecosystem?: Ecosystem;
}): Promise<AuthStoredTokenWithCookieReturnType>;
//# sourceMappingURL=passkeys.d.ts.map