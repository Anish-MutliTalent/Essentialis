import type { AbiParameterToPrimitiveType } from "abitype";
/**
 * Represents the filters for the "TokensWrapped" event.
 */
export type TokensWrappedEventFilters = Partial<{
    wrapper: AbiParameterToPrimitiveType<{
        type: "address";
        name: "wrapper";
        indexed: true;
    }>;
    recipientOfWrappedToken: AbiParameterToPrimitiveType<{
        type: "address";
        name: "recipientOfWrappedToken";
        indexed: true;
    }>;
    tokenIdOfWrappedToken: AbiParameterToPrimitiveType<{
        type: "uint256";
        name: "tokenIdOfWrappedToken";
        indexed: true;
    }>;
}>;
/**
 * Creates an event object for the TokensWrapped event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC721
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { tokensWrappedEvent } from "thirdweb/extensions/erc721";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  tokensWrappedEvent({
 *  wrapper: ...,
 *  recipientOfWrappedToken: ...,
 *  tokenIdOfWrappedToken: ...,
 * })
 * ],
 * });
 * ```
 */
export declare function tokensWrappedEvent(filters?: TokensWrappedEventFilters): import("../../../../../event/prepare-event.js").PreparedEvent<{
    readonly name: "TokensWrapped";
    readonly type: "event";
    readonly inputs: readonly [{
        readonly type: "address";
        readonly name: "wrapper";
        readonly indexed: true;
    }, {
        readonly type: "address";
        readonly name: "recipientOfWrappedToken";
        readonly indexed: true;
    }, {
        readonly type: "uint256";
        readonly name: "tokenIdOfWrappedToken";
        readonly indexed: true;
    }, {
        readonly type: "tuple[]";
        readonly components: readonly [{
            readonly type: "address";
            readonly name: "assetContract";
        }, {
            readonly type: "uint8";
            readonly name: "tokenType";
        }, {
            readonly type: "uint256";
            readonly name: "tokenId";
        }, {
            readonly type: "uint256";
            readonly name: "amount";
        }];
        readonly name: "wrappedContents";
    }];
}>;
//# sourceMappingURL=TokensWrapped.d.ts.map