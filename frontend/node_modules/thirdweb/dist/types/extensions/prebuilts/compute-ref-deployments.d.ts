import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import type { ImplementationConstructorParam } from "./process-ref-deployments.js";
type ComputeRefDeploymentsOptions = {
    client: ThirdwebClient;
    chain: Chain;
    paramValue: string | ImplementationConstructorParam;
};
/**
 * Computes addresses for published contract references in constructor params.
 * @returns Param value after processing references.
 * @internal
 */
export declare function computeRefDeployments(options: ComputeRefDeploymentsOptions): Promise<string | string[]>;
export {};
//# sourceMappingURL=compute-ref-deployments.d.ts.map