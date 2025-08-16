import * as ox__Hex from "ox/Hex";
import * as ox__PersonalMessage from "ox/PersonalMessage";
import * as ox__Secp256k1 from "ox/Secp256k1";
import * as ox__Signature from "ox/Signature";
export function signMessage(options) {
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