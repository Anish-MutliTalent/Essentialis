import { encodePacked } from "ox/AbiParameters";
import { numberToHex, stringToHex } from "../encoding/hex.js";
export function encodeExtraDataWithUri(options) {
    const uriHex = stringToHex(options.metadataUri);
    const lengthHex = numberToHex(uriHex.replace("0x", "").length / 2, {
        size: 1,
    });
    return encodePacked(["bytes", "bytes"], [uriHex, lengthHex]);
}
//# sourceMappingURL=encode-extra-data-with-uri.js.map