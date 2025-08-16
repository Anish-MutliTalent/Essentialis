import type { ClientAndChainAndAccount } from "../../../utils/types.js";
import { type ThirdwebContract } from "../../contract.js";
import { type InfraContractId } from "./infra.js";
/**
 * Gets or deploys the infrastructure contracts needed for a published contract deployment
 * @param args - The arguments object
 * @param args.chain - The blockchain network configuration
 * @param args.client - The ThirdwebClient instance
 * @param args.account - The account performing the deployment
 * @param args.contractId - The ID of the contract to deploy
 * @param args.constructorParams - Optional constructor parameters for the implementation contract
 * @param args.publisher - Optional publisher address, defaults to thirdweb
 * @param args.version - Optional version of the contract to deploy
 * @returns An object containing:
 * - cloneFactoryContract: The factory contract used for creating clones
 * - implementationContract: The deployed implementation contract
 * @contract
 */
export declare function getOrDeployInfraForPublishedContract(args: ClientAndChainAndAccount & {
    contractId: string;
    constructorParams?: Record<string, unknown>;
    publisher?: string;
    version?: string;
}): Promise<{
    cloneFactoryContract: ThirdwebContract;
    implementationContract: ThirdwebContract;
}>;
/**
 * @internal
 * @returns the deployed clone factory contract
 */
export declare function deployCloneFactory(options: ClientAndChainAndAccount): Promise<Readonly<import("../../contract.js").ContractOptions<[], `0x${string}`>>>;
/**
 * @internal
 * @returns the deployed infra contract
 */
export declare function deployImplementation(options: ClientAndChainAndAccount & {
    contractId: string;
    constructorParams?: Record<string, unknown>;
    publisher?: string;
    version?: string;
}): Promise<Readonly<import("../../contract.js").ContractOptions<[], `0x${string}`>>>;
/**
 * Convenience function to get or deploy an infra contract
 * @internal
 */
export declare function getOrDeployInfraContract(options: ClientAndChainAndAccount & {
    contractId: InfraContractId;
    constructorParams?: Record<string, unknown>;
    publisher?: string;
    version?: string;
}): Promise<Readonly<import("../../contract.js").ContractOptions<[], `0x${string}`>>>;
//# sourceMappingURL=bootstrap.d.ts.map