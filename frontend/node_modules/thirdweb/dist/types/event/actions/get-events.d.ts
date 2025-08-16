import type { Abi, AbiEvent, ExtractAbiEvent, ExtractAbiEventNames } from "abitype";
import type { ThirdwebContract } from "../../contract/contract.js";
import { type GetLogsBlockParams } from "../../rpc/actions/eth_getLogs.js";
import type { Prettify } from "../../utils/type-utils.js";
import { type PreparedEvent } from "../prepare-event.js";
import { type ParseEventLogsResult } from "./parse-logs.js";
export type GetContractEventsOptionsDirect<abi extends Abi, abiEvents extends PreparedEvent<AbiEvent>[], TStrict extends boolean> = {
    contract: ThirdwebContract<abi>;
    events?: abiEvents;
    strict?: TStrict;
    useIndexer?: boolean;
};
export type GetContractEventsOptions<abi extends Abi, abiEvents extends PreparedEvent<AbiEvent>[], TStrict extends boolean> = Prettify<GetContractEventsOptionsDirect<abi, abiEvents, TStrict> & GetLogsBlockParams>;
export type GetContractEventsResult<abiEvents extends PreparedEvent<AbiEvent>[], TStrict extends boolean> = ParseEventLogsResult<abiEvents, TStrict>;
/**
 * Retrieves events from a contract based on the provided options.
 * @param options - The options for retrieving events.
 * @returns A promise that resolves to an array of parsed event logs.
 * Note: toBlock and fromBlock are both inclusive.
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * const events = await getContractEvents({
 *  contract: myContract,
 *  fromBlock: 123456n,
 *  toBlock: 123456n,
 *  events: [preparedEvent, preparedEvent2],
 * });
 * ```
 * @example
 * Optionally specify a blockRange as the number of blocks to retrieve. toBlock will default to the current block number.
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * const events = await getContractEvents({
 *  contract: myContract,
 *  blockRange: 123456n,
 *  events: [preparedEvent, preparedEvent2],
 * });
 * ```
 * @example
 * Use fromBlock with blockRange for pagination.
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * const events = await getContractEvents({
 *  contract: myContract,
 *  fromBlock: lastBlockFetched,
 *  blockRange: 123456n,
 *  events: [preparedEvent, preparedEvent2],
 * });
 * ```
 * @example
 * Retrieve events for a specific block hash.
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * const events = await getContractEvents({
 *  contract: myContract,
 *  blockHash: "0x...",
 *  events: [preparedEvent, preparedEvent2],
 * });
 * ```
 * @contract
 */
export declare function getContractEvents<const abi extends Abi, const abiEvents extends PreparedEvent<AbiEvent>[] = PreparedEvent<ExtractAbiEvent<abi, ExtractAbiEventNames<abi>>>[], const TStrict extends boolean = true>(options: GetContractEventsOptions<abi, abiEvents, TStrict>): Promise<GetContractEventsResult<abiEvents, TStrict>>;
//# sourceMappingURL=get-events.d.ts.map