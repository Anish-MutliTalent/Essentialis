import type { PreparedTransaction } from "../transaction/prepare-transaction.js";
import type { Account } from "../wallets/interfaces/wallet.js";
/**
 * @internal
 */
export declare function setTransactionDecorator(decoratorFunction: (args: {
    account: Account;
    transaction: PreparedTransaction;
}) => Promise<{
    account: Account;
    transaction: PreparedTransaction;
}>): void;
/**
 * @internal
 */
export declare function clearTransactionDecorator(): void;
/**
 * @internal
 */
export declare function getTransactionDecorator(): ((args: {
    account: Account;
    transaction: PreparedTransaction;
}) => Promise<{
    account: Account;
    transaction: PreparedTransaction;
}>) | null;
//# sourceMappingURL=config.d.ts.map