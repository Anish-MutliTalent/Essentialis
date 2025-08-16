import type { AbiParameterToPrimitiveType } from "abitype";
/**
 * Represents the filters for the "TokensUnwrapped" event.
 */
export type TokensUnwrappedEventFilters = Partial<{
    unwrapper: AbiParameterToPrimitiveType<{
        type: "address";
        name: "unwrapper";
        indexed: true;
    }>;
    recipientOfWrappedContents: AbiParameterToPrimitiveType<{
        type: "address";
        name: "recipientOfWrappedContents";
        indexed: true;
    }>;
    tokenIdOfWrappedToken: AbiParameterToPrimitiveType<{
        type: "uint256";
        name: "tokenIdOfWrappedToken";
        indexed: true;
    }>;
}>;
/**
 * Creates an event object for the TokensUnwrapped event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC721
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { tokensUnwrappedEvent } from "thirdweb/extensions/erc721";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  tokensUnwrappedEvent({
 *  unwrapper: ...,
 *  recipientOfWrappedContents: ...,
 *  tokenIdOfWrappedToken: ...,
 * })
 * ],
 * });
 * ```
 */
export declare function tokensUnwrappedEvent(filters?: TokensUnwrappedEventFilters): import("../../../../../event/prepare-event.js").PreparedEvent<{
    readonly name: "TokensUnwrapped";
    readonly type: "event";
    readonly inputs: readonly [{
        readonly type: "address";
        readonly name: "unwrapper";
        readonly indexed: true;
    }, {
        readonly type: "address";
        readonly name: "recipientOfWrappedContents";
        readonly indexed: true;
    }, {
        readonly type: "uint256";
        readonly name: "tokenIdOfWrappedToken";
        readonly indexed: true;
    }];
}>;
//# sourceMappingURL=TokensUnwrapped.d.ts.map