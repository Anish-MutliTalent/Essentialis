import type { AbiFunction } from "abitype";
import type { PreparedTransaction } from "./prepare-transaction.js";
/**
 * @internal
 */
export declare function isAbiFunction(item: unknown): item is AbiFunction;
export declare function getTransactionGasCost(tx: PreparedTransaction, from?: string): Promise<bigint>;
//# sourceMappingURL=utils.d.ts.map