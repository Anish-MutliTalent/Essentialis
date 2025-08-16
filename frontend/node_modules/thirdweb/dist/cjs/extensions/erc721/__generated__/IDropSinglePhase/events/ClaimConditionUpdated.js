"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.claimConditionUpdatedEvent = claimConditionUpdatedEvent;
const prepare_event_js_1 = require("../../../../../event/prepare-event.js");
/**
 * Creates an event object for the ClaimConditionUpdated event.
 * @returns The prepared event object.
 * @extension ERC721
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { claimConditionUpdatedEvent } from "thirdweb/extensions/erc721";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  claimConditionUpdatedEvent()
 * ],
 * });
 * ```
 */
function claimConditionUpdatedEvent() {
    return (0, prepare_event_js_1.prepareEvent)({
        signature: "event ClaimConditionUpdated((uint256 startTimestamp, uint256 maxClaimableSupply, uint256 supplyClaimed, uint256 quantityLimitPerWallet, bytes32 merkleRoot, uint256 pricePerToken, address currency, string metadata) condition, bool resetEligibility)",
    });
}
//# sourceMappingURL=ClaimConditionUpdated.js.map