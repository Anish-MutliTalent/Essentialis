import type { ThirdwebClient } from "../../client/client.js";
import type { Ecosystem } from "../../wallets/in-app/core/wallet/types.js";
/**
 * @internal
 */
export declare function track({ client, ecosystem, data, }: {
    client: ThirdwebClient;
    ecosystem?: Ecosystem;
    data: object;
}): Promise<void | Response>;
//# sourceMappingURL=index.d.ts.map