import type { ThirdwebContract } from "../../../contract/contract.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
export type InstallPublishedExtensionOptions = {
    account: Account;
    contract: ThirdwebContract;
    extensionName: string;
    publisher?: string;
    version?: string;
    constructorParams?: Record<string, unknown>;
};
/**
 * Install a published extension on a dynamic contract
 * @param options - The options for installing a published extension
 * @returns A prepared transaction to send
 * @example
 * ```ts
 * import { installPublishedExtension } from "thirdweb/dynamic-contracts";
 * const transaction = installPublishedExtension({
 *  client,
 *  chain,
 *  account,
 *  contract,
 *  extensionName: "MyExtension",
 *  publisherAddress: "0x...",
 * });
 * await sendTransaction({ transaction, account });
 * ```
 */
export declare function installPublishedExtension(options: InstallPublishedExtensionOptions): import("../../../transaction/prepare-transaction.js").PreparedTransaction<any, import("abitype").AbiFunction, import("../../../transaction/prepare-transaction.js").PrepareTransactionOptions>;
//# sourceMappingURL=installPublishedExtension.d.ts.map