import type { GetV1WalletsByWalletAddressTransactionsData, GetV1WalletsByWalletAddressTransactionsResponse } from "@thirdweb-dev/insight";
import type { Chain } from "../chains/types.js";
import type { ThirdwebClient } from "../client/client.js";
export type Transaction = NonNullable<GetV1WalletsByWalletAddressTransactionsResponse["data"]>[number];
/**
 * Get transactions for a wallet
 * @example
 * ```ts
 * import { Insight } from "thirdweb";
 *
 * const transactions = await Insight.getTransactions({
 *   client,
 *   walletAddress: "0x1234567890123456789012345678901234567890",
 *   chains: [sepolia],
 * });
 * ```
 * @insight
 */
export declare function getTransactions(args: {
    client: ThirdwebClient;
    walletAddress: string;
    chains: Chain[];
    queryOptions?: GetV1WalletsByWalletAddressTransactionsData["query"];
}): Promise<Transaction[]>;
//# sourceMappingURL=get-transactions.d.ts.map