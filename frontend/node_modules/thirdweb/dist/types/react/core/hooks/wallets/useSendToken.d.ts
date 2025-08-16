import type { ThirdwebClient } from "../../../../client/client.js";
/**
 * Send Native or ERC20 tokens from active wallet to given address.
 * @example
 * ```tsx
 * const { mutate: sendToken } = useSendToken(client);
 *
 * // send native currency
 * sendToken({
 *    receiverAddress: "0x...",
 *    amount: "0.1",
 * });
 *
 * // send ERC20
 * sendToken({
 *   tokenAddress,
 *   receiverAddress: "0x...",
 *   amount: "0.5",
 * });
 * ```
 * @wallet
 */
export declare function useSendToken(client: ThirdwebClient): import("@tanstack/react-query").UseMutationResult<{
    readonly transactionHash: import("../../../../exports/thirdweb.js").Hex;
    client: ThirdwebClient;
    chain: import("../../../../chains/types.js").Chain;
    maxBlocksWaitTime?: number | undefined;
}, Error, {
    tokenAddress?: string;
    receiverAddress: string;
    amount: string;
}, unknown>;
//# sourceMappingURL=useSendToken.d.ts.map