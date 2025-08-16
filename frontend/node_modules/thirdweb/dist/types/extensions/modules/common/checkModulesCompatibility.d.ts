import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
/**
 * Check if the given modules are compatible with the given core contract
 * @param options
 * @modules
 */
export declare function checkModulesCompatibility(options: {
    coreBytecode: string;
    moduleBytecodes: string[];
    chain: Chain;
    client: ThirdwebClient;
}): Promise<boolean>;
//# sourceMappingURL=checkModulesCompatibility.d.ts.map