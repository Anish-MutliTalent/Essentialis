import * as ox__Signature from "ox/Signature";
import * as ox__TransactionEnvelopeEip2930 from "ox/TransactionEnvelopeEip2930";
import * as ox__TransactionEnvelopeEip7702 from "ox/TransactionEnvelopeEip7702";
import type { Hex } from "../utils/encoding/hex.js";
export type SerializableTransaction = {
    type?: string | undefined;
    r?: Hex | bigint;
    s?: Hex | bigint;
    v?: bigint | number;
    yParity?: bigint | number;
    accessList?: ox__TransactionEnvelopeEip2930.TransactionEnvelopeEip2930["accessList"] | undefined;
    chainId?: number | undefined;
    gasPrice?: bigint | undefined;
    maxFeePerGas?: bigint | undefined;
    maxPriorityFeePerGas?: bigint | undefined;
    data?: Hex | undefined;
    to?: string | null | undefined;
    nonce?: number | bigint | undefined;
    value?: bigint | undefined;
    gas?: bigint | undefined;
    gasLimit?: bigint | undefined;
    authorizationList?: ox__TransactionEnvelopeEip7702.TransactionEnvelopeEip7702["authorizationList"] | undefined;
};
export type SerializeTransactionOptions = {
    transaction: SerializableTransaction;
    signature?: ox__Signature.Signature<true, Hex> | ox__Signature.Legacy<Hex, bigint> | undefined;
};
/**
 * Serializes a legacy, EIP-1559, EIP-2930, EIP-4844, or EIP-7702 transaction object.
 *
 * @param options - The serialization options.
 * @param options.transaction - The transaction object to be serialized.
 * @param [options.signature] - The signature to include with the transaction, if necessary.
 * @returns The serialized transaction.
 * @throws An error if the provided transaction object is invalid.
 * @transaction
 * @example
 * ```ts
 * import { serializeTransaction } from "thirdweb";
 *
 * const serializedTransaction = serializeTransaction({ transaction: {
 *    to: "0x",
 *    value: 0n,
 *  }
 * });
 * ```
 */
export declare function serializeTransaction(options: SerializeTransactionOptions): Hex;
//# sourceMappingURL=serialize-transaction.d.ts.map