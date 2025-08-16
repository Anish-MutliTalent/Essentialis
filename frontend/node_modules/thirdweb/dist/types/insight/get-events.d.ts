import type { GetV1EventsByContractAddressData, GetV1EventsByContractAddressResponse } from "@thirdweb-dev/insight";
import type { AbiEvent } from "ox/AbiEvent";
import type { Chain } from "../chains/types.js";
import type { ThirdwebClient } from "../client/client.js";
import type { PreparedEvent } from "../event/prepare-event.js";
export type ContractEvent = NonNullable<GetV1EventsByContractAddressResponse["data"]>[number];
/**
 * Get contract events
 * @example
 * ```ts
 * import { Insight } from "thirdweb";
 *
 * const events = await Insight.getContractEvents({
 *   client,
 *   chains: [sepolia],
 *   contractAddress: "0x1234567890123456789012345678901234567890",
 *   event: transferEvent(),
 *   decodeLogs: true,
 * });
 * ```
 * @insight
 */
export declare function getContractEvents(options: {
    client: ThirdwebClient;
    chains: Chain[];
    contractAddress: string;
    event?: PreparedEvent<AbiEvent>;
    decodeLogs?: boolean;
    queryOptions?: Omit<GetV1EventsByContractAddressData["query"], "chain" | "decode">;
}): Promise<ContractEvent[]>;
//# sourceMappingURL=get-events.d.ts.map