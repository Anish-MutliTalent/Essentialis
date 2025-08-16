"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashEntryERC1155 = hashEntryERC1155;
const viem_1 = require("viem");
const address_js_1 = require("../../address.js");
const keccak256_js_1 = require("../../hashing/keccak256.js");
async function hashEntryERC1155(options) {
    return (0, keccak256_js_1.keccak256)((0, viem_1.encodePacked)(["address", "uint256", "uint256"], [
        (0, address_js_1.getAddress)(options.entry.recipient),
        BigInt(options.entry.tokenId),
        BigInt(options.entry.amount),
    ]));
}
//# sourceMappingURL=hash-entry-erc1155.js.map