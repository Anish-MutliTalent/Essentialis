import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
/**
 * @extension UNSTOPPABLE-DOMAINS
 */
export type ResolveAddressOptions = {
    client: ThirdwebClient;
    name: string;
    resolverAddress?: string;
    resolverChain?: Chain;
};
/**
 * Resolve an Unstoppable-Domain domain to an Ethereum address
 * @param options - The options for resolving an UD domain
 * @returns The Ethereum address associated with the domain name. [Learn more](https://docs.unstoppabledomains.com/reverse-resolution/)
 * @example
 *
 * ### Basic usage
 * ```ts
 * import { resolveAddress } from "thirdweb/extension/unstoppable-domains";
 *
 * const address = await resolveAddress({
 *   client,
 *   name: "thirdweb.crypto",
 * });
 * ```
 *
 * ### Custom resolver
 * By default this extension will try to resolve the name on Polygon mainnet,
 * you can decide to customize the resolver contract by specifying `resolverAddress` and `resolverChain`
 * ```ts
 * import { ethereum } from "thirdweb/chains";
 *
 * const address = await resolveAddress({
 *   client,
 *   name: "thirdweb.crypto",
 *   resolverAddress: "0x...",
 *   resolverChain: ethereum,
 * });
 * ```
 *
 * @extension UNSTOPPABLE-DOMAINS
 */
export declare function resolveAddress(options: ResolveAddressOptions): Promise<string>;
//# sourceMappingURL=resolveAddress.d.ts.map