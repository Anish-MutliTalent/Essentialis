import type { ThirdwebContract } from "../../../contract/contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import type { AccountPermissions } from "./types.js";
/**
 * @extension ERC4337
 */
export type AddSessionKeyOptions = {
    /**
     * The admin account that will perform the operation.
     */
    account: Account;
    /**
     * The address to add as a session key.
     */
    sessionKeyAddress: string;
    /**
     * The permissions to assign to the session key.
     */
    permissions: AccountPermissions;
};
/**
 * Adds session key permissions for a specified address.
 * @param options - The options for the removeSessionKey function.
 * @param {Contract} options.contract - The smart account contract to add the session key to
 * @returns The transaction object to be sent.
 * @example
 * ```ts
 * import { addSessionKey } from 'thirdweb/extensions/erc4337';
 * import { sendTransaction } from 'thirdweb';
 *
 * const transaction = addSessionKey({
 * contract,
 * account,
 * sessionKeyAddress,
 * permissions: {
 *  approvedTargets: ['0x...'],
 *  nativeTokenLimitPerTransaction: 0.1, // in ETH
 *  permissionStartTimestamp: new Date(),
 *  permissionEndTimestamp: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // 1 year from now
 * }
 * });
 *
 * await sendTransaction({ transaction, account });
 * ```
 * @extension ERC4337
 */
export declare function addSessionKey(options: BaseTransactionOptions<AddSessionKeyOptions>): import("../../../transaction/prepare-transaction.js").PreparedTransaction<any, import("abitype").AbiFunction, import("../../../transaction/prepare-transaction.js").PrepareTransactionOptions>;
/**
 * Checks if the `isAddSessionKeySupported` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `isAddSessionKeySupported` method is supported.
 * @extension ERC4337
 * @example
 * ```ts
 * import { isAddSessionKeySupported } from "thirdweb/extensions/erc4337";
 *
 * const supported = isAddSessionKeySupported(["0x..."]);
 * ```
 */
export declare function isAddSessionKeySupported(availableSelectors: string[]): boolean;
/**
 * Checks if the session key should be updated.
 * @param currentPermissions - The current permissions of the session key.
 * @param newPermissions - The new permissions to set for the session key.
 * @returns A boolean indicating if the session key should be updated.
 * @extension ERC4337
 * @example
 * ```ts
 * import { shouldUpdateSessionKey } from "thirdweb/extensions/erc4337";
 *
 * const shouldUpdate = await shouldUpdateSessionKey({ accountContract, sessionKeyAddress, newPermissions });
 * ```
 */
export declare function shouldUpdateSessionKey(args: {
    accountContract: ThirdwebContract;
    sessionKeyAddress: string;
    newPermissions: AccountPermissions;
}): Promise<boolean>;
//# sourceMappingURL=addSessionKey.d.ts.map