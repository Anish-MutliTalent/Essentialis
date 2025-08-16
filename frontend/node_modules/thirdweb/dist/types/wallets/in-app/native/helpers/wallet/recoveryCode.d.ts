import type { ThirdwebClient } from "../../../../../client/client.js";
import type { ClientScopedStorage } from "../../../core/authentication/client-scoped-storage.js";
export declare function getCognitoRecoveryPasswordV1(args: {
    client: ThirdwebClient;
    storage: ClientScopedStorage;
}): Promise<string>;
export declare function getCognitoRecoveryPasswordV2(args: {
    client: ThirdwebClient;
    storage: ClientScopedStorage;
}): Promise<string>;
//# sourceMappingURL=recoveryCode.d.ts.map