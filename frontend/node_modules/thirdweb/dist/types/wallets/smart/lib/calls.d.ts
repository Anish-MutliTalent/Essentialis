import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { type ThirdwebContract } from "../../../contract/contract.js";
import type { PreparedTransaction } from "../../../transaction/prepare-transaction.js";
import type { SendTransactionOption } from "../../interfaces/wallet.js";
/**
 * Predict the address of a smart account.
 * @param args - The options for predicting the address of a smart account.
 * @returns The predicted address of the smart account.
 * @example
 * ```ts
 * import { predictSmartAccountAddress } from "thirdweb/wallets/smart";
 *
 * const predictedAddress = await predictSmartAccountAddress({
 *  client,
 *  chain,
 *  adminAddress,
 * });
 * ```
 * @walletUtils
 */
export declare function predictSmartAccountAddress(args: {
    client: ThirdwebClient;
    chain: Chain;
    adminAddress: string;
    factoryAddress?: string;
    accountSalt?: string;
}): Promise<string>;
/**
 * Predict the address of a smart account.
 * @param args - The options for predicting the address of a smart account.
 * @returns The predicted address of the smart account.
 * @example
 * ```ts
 * import { predictAddress } from "thirdweb/wallets/smart";
 *
 * const predictedAddress = await predictAddress({
 *  factoryContract,
 *  adminAddress,
 *  accountSalt,
 * });
 * ```
 * @walletUtils
 * @deprecated Use `predictSmartAccountAddress` instead.
 */
export declare function predictAddress(args: {
    factoryContract: ThirdwebContract;
    predictAddressOverride?: (factoryContract: ThirdwebContract, admin: string) => Promise<string>;
    adminAddress: string;
    accountSalt?: string;
    accountAddress?: string;
}): Promise<string>;
/**
 * @internal
 */
export declare function prepareCreateAccount(args: {
    factoryContract: ThirdwebContract;
    adminAddress: string;
    accountSalt?: string;
    createAccountOverride?: (factoryContract: ThirdwebContract, admin: string) => PreparedTransaction;
}): PreparedTransaction;
/**
 * @internal
 */
export declare function prepareExecute(args: {
    accountContract: ThirdwebContract;
    transaction: SendTransactionOption;
    executeOverride?: (accountContract: ThirdwebContract, transaction: SendTransactionOption) => PreparedTransaction;
}): PreparedTransaction;
/**
 * @internal
 */
export declare function prepareBatchExecute(args: {
    accountContract: ThirdwebContract;
    transactions: SendTransactionOption[];
    executeBatchOverride?: (accountContract: ThirdwebContract, transactions: SendTransactionOption[]) => PreparedTransaction;
}): PreparedTransaction;
//# sourceMappingURL=calls.d.ts.map