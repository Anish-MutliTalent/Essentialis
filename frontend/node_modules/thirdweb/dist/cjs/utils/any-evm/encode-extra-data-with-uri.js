"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeExtraDataWithUri = encodeExtraDataWithUri;
const AbiParameters_1 = require("ox/AbiParameters");
const hex_js_1 = require("../encoding/hex.js");
function encodeExtraDataWithUri(options) {
    const uriHex = (0, hex_js_1.stringToHex)(options.metadataUri);
    const lengthHex = (0, hex_js_1.numberToHex)(uriHex.replace("0x", "").length / 2, {
        size: 1,
    });
    return (0, AbiParameters_1.encodePacked)(["bytes", "bytes"], [uriHex, lengthHex]);
}
//# sourceMappingURL=encode-extra-data-with-uri.js.map