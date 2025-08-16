import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import type { FetchDeployMetadataResult } from "../../../utils/any-evm/deploy-metadata.js";
import type { Prettify } from "../../../utils/type-utils.js";
import type { ClientAndChain } from "../../../utils/types.js";
import { type ThirdwebContract } from "../../contract.js";
export type InfraContractId = "WETH9" | "Forwarder" | "ForwarderEOAOnly" | "TWCloneFactory" | (string & {});
type GetDeployedInfraParams = Prettify<ClientAndChain & {
    contractId: InfraContractId;
    constructorParams?: Record<string, unknown>;
    publisher?: string;
    version?: string;
}>;
/**
 * Retrieves a deployed infrastructure contract instance for the specified contract ID
 * @param options - Configuration options for locating the infrastructure contract
 * @param options.client - ThirdwebClient instance
 * @param options.chain - Target blockchain network
 * @param options.contractId - Identifier for the infrastructure contract (e.g. "WETH9", "Forwarder")
 * @param options.constructorParams - Optional constructor parameters for contract initialization
 * @param options.publisher - Optional custom publisher address
 * @param options.version - Optional specific contract version to retrieve
 * @returns Promise that resolves to the contract instance if deployed, null otherwise
 *
 * @internal
 */
export declare function getDeployedInfraContract(options: GetDeployedInfraParams): Promise<ThirdwebContract | null>;
/**
 * @internal
 */
export declare function getDeployedInfraContractFromMetadata(options: {
    client: ThirdwebClient;
    chain: Chain;
    contractMetadata: FetchDeployMetadataResult;
    constructorParams?: Record<string, unknown>;
    salt?: string;
}): Promise<ThirdwebContract | null>;
/**
 * @internal
 */
export declare function prepareInfraContractDeployTransactionFromMetadata(options: {
    client: ThirdwebClient;
    chain: Chain;
    contractMetadata: FetchDeployMetadataResult;
    constructorParams?: Record<string, unknown>;
    salt?: string;
}): import("../../../transaction/prepare-transaction.js").PreparedTransaction<[], import("abitype").AbiFunction, import("../../../transaction/prepare-transaction.js").PrepareTransactionOptions>;
export {};
//# sourceMappingURL=infra.d.ts.map