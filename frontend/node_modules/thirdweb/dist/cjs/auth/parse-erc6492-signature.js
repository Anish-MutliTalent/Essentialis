"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseErc6492Signature = parseErc6492Signature;
const ox__AbiParameters = require("ox/AbiParameters");
const ox__Address = require("ox/Address");
const erc6492_1 = require("ox/erc6492");
/**
 * Parses a serialized ({@link Hex}) [ERC-6492](https://eips.ethereum.org/EIPS/eip-6492) signature.
 * If the signature is not in ERC-6492 format, the original signature is returned.
 *
 * @param {Hex} signature The signature to parse
 *
 * @returns {@link ParseErc6492SignatureReturnType} The parsed (or original) signature
 *
 * @example
 * ```ts
 * import { parseErc6492Signature } from 'thirdweb/auth';
 *
 * const parsedSignature = parseErc6492Signature('0x1234567890123456789012345678901234567890');
 * ```
 * @auth
 */
function parseErc6492Signature(signature) {
    if (!erc6492_1.WrappedSignature.validate(signature)) {
        return { signature };
    }
    const [address, data, originalSignature] = ox__AbiParameters.decode([{ type: "address" }, { type: "bytes" }, { type: "bytes" }], signature);
    return {
        address: ox__Address.checksum(address),
        data,
        signature: originalSignature,
    };
}
//# sourceMappingURL=parse-erc6492-signature.js.map