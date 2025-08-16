import type { AbiFunction } from "abitype";
import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { type ThirdwebContract } from "../../contract/contract.js";
import type { FetchDeployMetadataResult } from "../../utils/any-evm/deploy-metadata.js";
import type { Account } from "../../wallets/interfaces/wallet.js";
/**
 * @extension DEPLOY
 */
export type DeployPublishedContractOptions = {
    client: ThirdwebClient;
    chain: Chain;
    account: Account;
    contractId: string;
    contractParams?: Record<string, unknown>;
    publisher?: string;
    version?: string;
    implementationConstructorParams?: Record<string, unknown>;
    salt?: string;
};
/**
 * Deploy an instance of a published contract on a given chain
 * @param options - the deploy options
 * @returns a promise that resolves to the deployed contract address
 * @example
 *
 * ## Deploying a published contract
 *
 * ```ts
 * import { deployPublishedContract } from "thirdweb/deploys";
 *
 * const address = await deployPublishedContract({
 *   client,
 *   chain,
 *   account,
 *   contractId: "MyPublishedContract",
 *   contractParams: {
 *     param1: "value1",
 *     param2: 123,
 *   },
 *   publisher: "0x...", // optional, defaults to the thirdweb deployer
 * });
 * ```
 *
 *  ## Deploying a published contract deterministically
 *
 * ```ts
 * import { deployPublishedContract } from "thirdweb/deploys";
 *
 * const address = await deployPublishedContract({
 *   client,
 *   chain,
 *   account,
 *   contractId: "MyPublishedContract",
 *   contractParams: {
 *     param1: "value1",
 *     param2: 123,
 *   },
 *   publisher: "0x...",
 *   salt: "your-salt", // this will deterministically deploy the contract at the same address on all chains
 * });
 * ```
 * @extension DEPLOY
 */
export declare function deployPublishedContract(options: DeployPublishedContractOptions): Promise<string>;
/**
 * @internal
 */
export type DeployContractfromDeployMetadataOptions = {
    client: ThirdwebClient;
    chain: Chain;
    account: Account;
    deployMetadata: FetchDeployMetadataResult;
    initializeParams?: Record<string, unknown>;
    initializeData?: `0x${string}`;
    implementationConstructorParams?: Record<string, unknown>;
    isCrosschain?: boolean;
    modules?: {
        deployMetadata: FetchDeployMetadataResult;
        initializeParams?: Record<string, unknown>;
    }[];
    salt?: string;
};
/**
 * @internal
 */
export declare function deployContractfromDeployMetadata(options: DeployContractfromDeployMetadataOptions): Promise<string>;
/**
 * Prepares the initialization transaction for a contract deployment
 * @param options - The options for generating the initialize transaction
 * @param options.client - The ThirdwebClient instance
 * @param options.chain - The blockchain network configuration
 * @param options.account - The account performing the initialization
 * @param options.implementationContract - The contract implementation to initialize
 * @param options.deployMetadata - The metadata for the contract deployment
 * @param options.initializeParams - Optional parameters to pass to the initialize function
 * @param options.modules - Optional array of modules to install during initialization
 * @param options.modules[].deployMetadata - The metadata for the module contract
 * @param options.modules[].initializeParams - Optional parameters for module initialization
 * @returns The prepared transaction for contract initialization
 * @contract
 */
export declare function getInitializeTransaction(options: {
    client: ThirdwebClient;
    chain: Chain;
    account: Account;
    implementationContract: ThirdwebContract;
    deployMetadata: FetchDeployMetadataResult;
    initializeParams?: Record<string, unknown>;
    modules?: {
        deployMetadata: FetchDeployMetadataResult;
        initializeParams?: Record<string, unknown>;
    }[];
}): Promise<import("../../transaction/prepare-transaction.js").PreparedTransaction<[], AbiFunction, import("../../transaction/prepare-transaction.js").PrepareTransactionOptions>>;
//# sourceMappingURL=deploy-published.d.ts.map