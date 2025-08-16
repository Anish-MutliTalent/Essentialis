import { NATIVE_TOKEN_ADDRESS, ZERO_ADDRESS, } from "../../../../../constants/addresses.js";
import { getAddress } from "../../../../../utils/address.js";
export const NATIVE_TOKEN = { nativeToken: true };
/**
 * @internal
 */
export function isNativeToken(token) {
    return ((token &&
        ("nativeToken" in token ||
            token.address?.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase() ||
            token?.address === ZERO_ADDRESS)) ||
        false);
}
export function getTokenAddress(token) {
    if (isNativeToken(token)) {
        return NATIVE_TOKEN_ADDRESS;
    }
    return getAddress(token.address);
}
//# sourceMappingURL=nativeToken.js.map