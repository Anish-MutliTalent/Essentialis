"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signMessage = signMessage;
const ox__Hex = require("ox/Hex");
const ox__PersonalMessage = require("ox/PersonalMessage");
const ox__Secp256k1 = require("ox/Secp256k1");
const ox__Signature = require("ox/Signature");
function signMessage(options) {
    if ("privateKey" in options) {
        const payload = ox__PersonalMessage.getSignPayload(typeof options.message === "object"
            ? options.message.raw
            : ox__Hex.fromString(options.message));
        const signature = ox__Secp256k1.sign({
            payload,
            privateKey: options.privateKey,
        });
        return ox__Signature.toHex(signature);
    }
    if ("account" in options) {
        const { message, account } = options;
        return account.signMessage({ message });
    }
    throw new Error("Either privateKey or account is required");
}
//# sourceMappingURL=sign-message.js.map