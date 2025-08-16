import type { ThirdwebClient } from "../../../../../client/client.js";
import type { ClientScopedStorage } from "../../../core/authentication/client-scoped-storage.js";
import type { LogoutReturnType } from "../../../core/authentication/types.js";
export declare function logoutUser(args: {
    client: ThirdwebClient;
    storage: ClientScopedStorage;
}): Promise<LogoutReturnType>;
//# sourceMappingURL=logout.d.ts.map