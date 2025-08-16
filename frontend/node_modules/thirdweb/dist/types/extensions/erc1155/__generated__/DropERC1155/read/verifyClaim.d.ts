import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";
/**
 * Represents the parameters for the "verifyClaim" function.
 */
export type VerifyClaimParams = {
    conditionId: AbiParameterToPrimitiveType<{
        type: "uint256";
        name: "_conditionId";
    }>;
    claimer: AbiParameterToPrimitiveType<{
        type: "address";
        name: "_claimer";
    }>;
    tokenId: AbiParameterToPrimitiveType<{
        type: "uint256";
        name: "_tokenId";
    }>;
    quantity: AbiParameterToPrimitiveType<{
        type: "uint256";
        name: "_quantity";
    }>;
    currency: AbiParameterToPrimitiveType<{
        type: "address";
        name: "_currency";
    }>;
    pricePerToken: AbiParameterToPrimitiveType<{
        type: "uint256";
        name: "_pricePerToken";
    }>;
    allowlistProof: AbiParameterToPrimitiveType<{
        type: "tuple";
        name: "_allowlistProof";
        components: [
            {
                type: "bytes32[]";
                name: "proof";
            },
            {
                type: "uint256";
                name: "quantityLimitPerWallet";
            },
            {
                type: "uint256";
                name: "pricePerToken";
            },
            {
                type: "address";
                name: "currency";
            }
        ];
    }>;
};
export declare const FN_SELECTOR: "0xea1def9c";
/**
 * Checks if the `verifyClaim` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `verifyClaim` method is supported.
 * @extension ERC1155
 * @example
 * ```ts
 * import { isVerifyClaimSupported } from "thirdweb/extensions/erc1155";
 * const supported = isVerifyClaimSupported(["0x..."]);
 * ```
 */
export declare function isVerifyClaimSupported(availableSelectors: string[]): boolean;
/**
 * Encodes the parameters for the "verifyClaim" function.
 * @param options - The options for the verifyClaim function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeVerifyClaimParams } from "thirdweb/extensions/erc1155";
 * const result = encodeVerifyClaimParams({
 *  conditionId: ...,
 *  claimer: ...,
 *  tokenId: ...,
 *  quantity: ...,
 *  currency: ...,
 *  pricePerToken: ...,
 *  allowlistProof: ...,
 * });
 * ```
 */
export declare function encodeVerifyClaimParams(options: VerifyClaimParams): `0x${string}`;
/**
 * Encodes the "verifyClaim" function into a Hex string with its parameters.
 * @param options - The options for the verifyClaim function.
 * @returns The encoded hexadecimal string.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeVerifyClaim } from "thirdweb/extensions/erc1155";
 * const result = encodeVerifyClaim({
 *  conditionId: ...,
 *  claimer: ...,
 *  tokenId: ...,
 *  quantity: ...,
 *  currency: ...,
 *  pricePerToken: ...,
 *  allowlistProof: ...,
 * });
 * ```
 */
export declare function encodeVerifyClaim(options: VerifyClaimParams): `${typeof FN_SELECTOR}${string}`;
/**
 * Decodes the result of the verifyClaim function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC1155
 * @example
 * ```ts
 * import { decodeVerifyClaimResult } from "thirdweb/extensions/erc1155";
 * const result = decodeVerifyClaimResultResult("...");
 * ```
 */
export declare function decodeVerifyClaimResult(result: Hex): boolean;
/**
 * Calls the "verifyClaim" function on the contract.
 * @param options - The options for the verifyClaim function.
 * @returns The parsed result of the function call.
 * @extension ERC1155
 * @example
 * ```ts
 * import { verifyClaim } from "thirdweb/extensions/erc1155";
 *
 * const result = await verifyClaim({
 *  contract,
 *  conditionId: ...,
 *  claimer: ...,
 *  tokenId: ...,
 *  quantity: ...,
 *  currency: ...,
 *  pricePerToken: ...,
 *  allowlistProof: ...,
 * });
 *
 * ```
 */
export declare function verifyClaim(options: BaseTransactionOptions<VerifyClaimParams>): Promise<boolean>;
//# sourceMappingURL=verifyClaim.d.ts.map