"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NATIVE_TOKEN = void 0;
exports.isNativeToken = isNativeToken;
exports.getTokenAddress = getTokenAddress;
const addresses_js_1 = require("../../../../../constants/addresses.js");
const address_js_1 = require("../../../../../utils/address.js");
exports.NATIVE_TOKEN = { nativeToken: true };
/**
 * @internal
 */
function isNativeToken(token) {
    return ((token &&
        ("nativeToken" in token ||
            token.address?.toLowerCase() === addresses_js_1.NATIVE_TOKEN_ADDRESS.toLowerCase() ||
            token?.address === addresses_js_1.ZERO_ADDRESS)) ||
        false);
}
function getTokenAddress(token) {
    if (isNativeToken(token)) {
        return addresses_js_1.NATIVE_TOKEN_ADDRESS;
    }
    return (0, address_js_1.getAddress)(token.address);
}
//# sourceMappingURL=nativeToken.js.map