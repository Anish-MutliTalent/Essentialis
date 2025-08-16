"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeTransaction = serializeTransaction;
const ox__Hex = require("ox/Hex");
const ox__Signature = require("ox/Signature");
const ox__TransactionEnvelopeEip1559 = require("ox/TransactionEnvelopeEip1559");
const ox__TransactionEnvelopeEip2930 = require("ox/TransactionEnvelopeEip2930");
const ox__TransactionEnvelopeEip7702 = require("ox/TransactionEnvelopeEip7702");
const ox__TransactionEnvelopeLegacy = require("ox/TransactionEnvelopeLegacy");
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
function serializeTransaction(options) {
    const { transaction } = options;
    const type = getTransactionEnvelopeType(transaction);
    // This is to maintain compatibility with our old interface (including the signature in the transaction object)
    const signature = (() => {
        if (options.signature) {
            if ("v" in options.signature &&
                typeof options.signature.v !== "undefined") {
                return ox__Signature.fromLegacy({
                    r: ox__Hex.toBigInt(options.signature.r),
                    s: ox__Hex.toBigInt(options.signature.s),
                    v: Number(options.signature.v),
                });
            }
            return {
                r: ox__Hex.toBigInt(options.signature.r),
                s: ox__Hex.toBigInt(options.signature.s),
                // We force the Signature type here because we filter for legacy type above
                yParity: options.signature
                    .yParity,
            };
        }
        if (typeof transaction.v === "undefined" &&
            typeof transaction.yParity === "undefined") {
            return undefined;
        }
        if (transaction.r === undefined || transaction.s === undefined) {
            throw new Error("Invalid signature provided with transaction");
        }
        return {
            r: typeof transaction.r === "bigint"
                ? transaction.r
                : ox__Hex.toBigInt(transaction.r),
            s: typeof transaction.s === "bigint"
                ? transaction.s
                : ox__Hex.toBigInt(transaction.s),
            yParity: typeof transaction.v !== "undefined" &&
                typeof transaction.yParity === "undefined"
                ? ox__Signature.vToYParity(Number(transaction.v))
                : Number(transaction.yParity),
        };
    })();
    if (type === "eip1559") {
        const typedTransaction = transaction;
        ox__TransactionEnvelopeEip1559.assert(typedTransaction);
        return ox__TransactionEnvelopeEip1559.serialize(typedTransaction, {
            signature,
        });
    }
    if (type === "legacy") {
        const typedTransaction = transaction;
        ox__TransactionEnvelopeLegacy.assert(typedTransaction);
        return ox__TransactionEnvelopeLegacy.serialize(typedTransaction, {
            signature,
        });
    }
    if (type === "eip2930") {
        const typedTransaction = transaction;
        ox__TransactionEnvelopeEip2930.assert(typedTransaction);
        return ox__TransactionEnvelopeEip2930.serialize(typedTransaction, {
            signature,
        });
    }
    if (type === "eip7702") {
        const typedTransaction = transaction;
        ox__TransactionEnvelopeEip7702.assert(typedTransaction);
        return ox__TransactionEnvelopeEip7702.serialize(typedTransaction, {
            signature,
        });
    }
    throw new Error("Invalid transaction type");
}
/**
 * @internal
 */
function getTransactionEnvelopeType(transactionEnvelope) {
    if (typeof transactionEnvelope.type !== "undefined") {
        return transactionEnvelope.type;
    }
    if (typeof transactionEnvelope.authorizationList !== "undefined") {
        return "eip7702";
    }
    if (typeof transactionEnvelope.maxFeePerGas !== "undefined" ||
        typeof transactionEnvelope.maxPriorityFeePerGas !== "undefined") {
        return "eip1559";
    }
    if (typeof transactionEnvelope.gasPrice !== "undefined") {
        if (typeof transactionEnvelope.accessList !== "undefined") {
            return "eip2930";
        }
        return "legacy";
    }
    throw new Error("Invalid transaction type");
}
//# sourceMappingURL=serialize-transaction.js.map