import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
/**
 * @extension UNSTOPPABLE-DOMAINS
 */
export type ResolveUDNameOptions = {
    client: ThirdwebClient;
    address: string;
    resolverAddress?: string;
    resolverChain?: Chain;
};
/**
 * Resolves the primary Untoppable-Domains name for a specified address.
 * @param options - The options for resolving an UD domain
 * @example
 *
 * ### Basic usage
 * ```ts
 * import { resolveName } from "thirdweb/extension/unstoppable-domains";
 *
 * const name = await resolveName({
 *   client,
 *   address: "0x...",
 * });
 * ```
 *
 * ### Custom resolver
 * By default this extension will try to resolve the address on Polygon mainnet,
 * you can decide to customize the resolver contract by specifying `resolverAddress` and `resolverChain`
 * ```ts
 * import { ethereum } from "thirdweb/chains";
 *
 * const address = await resolveName({
 *   client,
 *   address: "0x...",
 *   resolverAddress: "0x...",
 *   resolverChain: ethereum,
 * });
 * ```
 * @extension UNSTOPPABLE-DOMAINS
 */
export declare function resolveName(options: ResolveUDNameOptions): Promise<string>;
//# sourceMappingURL=resolveName.d.ts.map