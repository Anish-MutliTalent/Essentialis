import type { Address } from "abitype";
import type { FileOrBufferOrString } from "../../storage/upload/types.js";
import type { Prettify } from "../../utils/type-utils.js";
import type { ClientAndChainAndAccount } from "../../utils/types.js";
export type MarketplaceContractParams = {
    name: string;
    description?: string;
    image?: FileOrBufferOrString;
    external_link?: string;
    contractURI?: string;
    social_urls?: Record<string, string>;
    defaultAdmin?: Address;
    platformFeeBps?: number;
    platformFeeRecipient?: string;
    trustedForwarders?: string[];
};
export type DeployMarketplaceContractOptions = Prettify<ClientAndChainAndAccount & {
    params: MarketplaceContractParams;
} & {
    version?: string;
}>;
/**
 * Deploys a marketplace contract.
 * @param options - The options for deploying the marketplace contract.
 *
 * @extension MARKETPLACE
 *
 * @example
 * ```ts
 * import { deployMarketplaceContract } from "thirdweb/deploys";
 *
 * const address = await deployMarketplaceContract({
      client,
      chain,
      account,
      params: {
        name: "MarketplaceV3",
        description: "MarketplaceV3 deployed using thirdweb SDK",
        platformFeeRecipient: "0x21d514c90ee4E4e4Cd16Ce9185BF01F0F1eE4A04",
        platformFeeBps: 1000,
      },
    });
 * ```
 */
export declare function deployMarketplaceContract(options: DeployMarketplaceContractOptions): Promise<string>;
//# sourceMappingURL=deploy-marketplace.d.ts.map