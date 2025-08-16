import type { ThirdwebClient } from "../../../../client/client.js";
import type { UserWallet } from "../wallet/enclave-wallet.js";
import type { Ecosystem } from "../wallet/types.js";
/**
 * Generate a new enclave wallet using an auth token
 * @internal
 */
export declare function generateWallet({ client, ecosystem, authToken, }: {
    client: ThirdwebClient;
    authToken: string;
    ecosystem?: Ecosystem;
}): Promise<UserWallet>;
//# sourceMappingURL=generate-wallet.enclave.d.ts.map