import * as ox__Secp256k1 from "ox/Secp256k1";
import { toHex } from "../encoding/hex.js";
/**
 * Generates the signature for the provided transaction hash.
 * @param options - The options for signing.
 * @param options.hash - The hash to be signed.
 * @param options.privateKey - The private key to sign the hash with.
 * @returns The transaction signature.
 * @example
 * ```ts
 * import { sign } from "thirdweb/utils";
 *
 * const signature = sign({
 *   hash: "0x",
 *   privateKey: "0x",
 * });
 * ```
 * @utils
 */
export function sign({ hash, privateKey }) {
    const { r, s, yParity } = ox__Secp256k1.sign({ payload: hash, privateKey });
    return {
        r: toHex(r, { size: 32 }),
        s: toHex(s, { size: 32 }),
        v: yParity === 1 ? 28n : 27n,
        yParity,
    };
}
//# sourceMappingURL=sign.js.map