import type { AbiParameterToPrimitiveType } from "abitype";
/**
 * Represents the parameters for the "encodeBytesOnInstall" function.
 */
export type EncodeBytesOnInstallParams = {
    startTokenId: AbiParameterToPrimitiveType<{
        type: "uint256";
        name: "startTokenId";
    }>;
};
export declare const FN_SELECTOR: "0x579a6021";
/**
 * Encodes the parameters for the "encodeBytesOnInstall" function.
 * @param options - The options for the encodeBytesOnInstall function.
 * @returns The encoded ABI parameters.
 * @extension MODULES
 * @example
 * ```ts
 * import { encodeEncodeBytesOnInstallParams } "thirdweb/extensions/modules";
 * const result = encodeEncodeBytesOnInstallParams({
 *  startTokenId: ...,
 * });
 * ```
 */
export declare function encodeBytesOnInstallParams(options: EncodeBytesOnInstallParams): `0x${string}`;
//# sourceMappingURL=encodeBytesOnInstall.d.ts.map