"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signTransaction = signTransaction;
const ox__Hash = require("ox/Hash");
const ox__Secp256k1 = require("ox/Secp256k1");
const serialize_transaction_js_1 = require("../serialize-transaction.js");
/**
 * Signs a transaction to be sent to a node.
 * @param options The options for signing.
 * @param options.transaction - The transaction object to sign
 * @param options.privateKey - The account private key
 * @returns The signed transaction as a hex string
 * @example
 * ```ts
 * import { signTransaction } from "thirdweb";
 * signTransaction({
 *   transaction: {
 *     ...
 *   },
 *   privateKey: "0x...",
 * });
 * ```
 * @transaction
 */
function signTransaction({ transaction, privateKey, }) {
    const serializedTransaction = (0, serialize_transaction_js_1.serializeTransaction)({ transaction });
    const signature = ox__Secp256k1.sign({
        payload: ox__Hash.keccak256(serializedTransaction),
        privateKey: privateKey,
    });
    return (0, serialize_transaction_js_1.serializeTransaction)({
        transaction: { ...transaction, ...signature },
    });
}
//# sourceMappingURL=sign-transaction.js.map