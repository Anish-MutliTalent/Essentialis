import type { AbiParameterToPrimitiveType } from "abitype";
/**
 * Represents the filters for the "ClaimConditionUpdated" event.
 */
export type ClaimConditionUpdatedEventFilters = Partial<{
    tokenId: AbiParameterToPrimitiveType<{
        type: "uint256";
        name: "tokenId";
        indexed: true;
    }>;
}>;
/**
 * Creates an event object for the ClaimConditionUpdated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC1155
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { claimConditionUpdatedEvent } from "thirdweb/extensions/erc1155";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  claimConditionUpdatedEvent({
 *  tokenId: ...,
 * })
 * ],
 * });
 * ```
 */
export declare function claimConditionUpdatedEvent(filters?: ClaimConditionUpdatedEventFilters): import("../../../../../event/prepare-event.js").PreparedEvent<{
    readonly name: "ClaimConditionUpdated";
    readonly type: "event";
    readonly inputs: readonly [{
        readonly type: "uint256";
        readonly name: "tokenId";
        readonly indexed: true;
    }, {
        readonly type: "tuple";
        readonly components: readonly [{
            readonly type: "uint256";
            readonly name: "startTimestamp";
        }, {
            readonly type: "uint256";
            readonly name: "maxClaimableSupply";
        }, {
            readonly type: "uint256";
            readonly name: "supplyClaimed";
        }, {
            readonly type: "uint256";
            readonly name: "quantityLimitPerWallet";
        }, {
            readonly type: "bytes32";
            readonly name: "merkleRoot";
        }, {
            readonly type: "uint256";
            readonly name: "pricePerToken";
        }, {
            readonly type: "address";
            readonly name: "currency";
        }, {
            readonly type: "string";
            readonly name: "metadata";
        }];
        readonly name: "condition";
    }, {
        readonly type: "bool";
        readonly name: "resetEligibility";
    }];
}>;
//# sourceMappingURL=ClaimConditionUpdated.d.ts.map