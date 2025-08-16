import { type Address } from "../../../../../utils/address.js";
import type { TokenInfo } from "../../../../core/utils/defaultTokens.js";
export type NativeToken = {
    nativeToken: true;
};
export declare const NATIVE_TOKEN: NativeToken;
/**
 * @internal
 */
export declare function isNativeToken(token?: Partial<TokenInfo> | NativeToken): token is NativeToken;
export declare function getTokenAddress(token: TokenInfo | NativeToken): Address;
export type ERC20OrNativeToken = TokenInfo | NativeToken;
//# sourceMappingURL=nativeToken.d.ts.map