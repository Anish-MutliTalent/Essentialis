import type { ClientAndChain } from "../../../utils/types.js";
/**
 * Retrieves the deployed clone factory contract instance if available
 * @param args - Client and chain information required to locate the contract
 * @returns Promise that resolves to the clone factory contract instance if deployed, null otherwise
 *
 * @internal
 */
export declare function getDeployedCloneFactoryContract(args: ClientAndChain): Promise<Readonly<import("../../contract.js").ContractOptions<[], `0x${string}`>> | null>;
//# sourceMappingURL=clone-factory.d.ts.map