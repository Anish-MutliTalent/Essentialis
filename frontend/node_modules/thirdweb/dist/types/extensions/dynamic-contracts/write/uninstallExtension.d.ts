import type { ThirdwebContract } from "../../../contract/contract.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
export type UninstallExtensionOptions = {
    account: Account;
    contract: ThirdwebContract;
    extensionName: string;
};
/**
 * Uninstall an extension on a dynamic contract
 * @param options - The options for uninstalling an extension
 * @returns A prepared transaction to send
 * @example
 * ```ts
 * import { uninstallExtension } from "thirdweb/dynamic-contracts";
 * const transaction = uninstallExtension({
 *  client,
 *  chain,
 *  account,
 *  contract,
 *  extensionName: "MyExtension",
 * });
 * await sendTransaction({ transaction, account });
 * ```
 */
export declare function uninstallExtension(options: UninstallExtensionOptions): import("../../../transaction/prepare-transaction.js").PreparedTransaction<any, import("abitype").AbiFunction, import("../../../transaction/prepare-transaction.js").PrepareTransactionOptions>;
//# sourceMappingURL=uninstallExtension.d.ts.map