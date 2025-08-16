import type { Account } from "../../../wallets/interfaces/wallet.js";
import type { PreparedTransaction } from "../../prepare-transaction.js";
import type { SerializableTransaction } from "../../serialize-transaction.js";
import type { WaitForReceiptOptions } from "../wait-for-tx-receipt.js";
import type { GaslessOptions } from "./types.js";
type SendGaslessTransactionOptions = {
    account: Account;
    transaction: PreparedTransaction<any>;
    serializableTransaction: SerializableTransaction;
    gasless: GaslessOptions;
};
export declare function sendGaslessTransaction({ account, transaction, serializableTransaction, gasless, }: SendGaslessTransactionOptions): Promise<WaitForReceiptOptions>;
export {};
//# sourceMappingURL=send-gasless-transaction.d.ts.map