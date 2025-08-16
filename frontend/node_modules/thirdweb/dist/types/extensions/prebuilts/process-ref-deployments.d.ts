import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import type { DynamicParams } from "../../utils/any-evm/deploy-metadata.js";
import type { Account } from "../../wallets/interfaces/wallet.js";
export type ImplementationConstructorParam = {
    defaultValue?: string;
    dynamicValue?: DynamicParams;
};
type ProcessRefDeploymentsOptions = {
    client: ThirdwebClient;
    chain: Chain;
    account: Account;
    paramValue: string | ImplementationConstructorParam;
};
/**
 * Processes published contract references in constructor params. Deploys recursively if needed.
 * @returns Param value after processing references.
 * @internal
 */
export declare function processRefDeployments(options: ProcessRefDeploymentsOptions): Promise<string | string[]>;
export {};
//# sourceMappingURL=process-ref-deployments.d.ts.map