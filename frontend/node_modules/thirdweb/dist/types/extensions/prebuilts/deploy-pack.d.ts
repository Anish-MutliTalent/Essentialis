import type { FileOrBufferOrString } from "../../storage/upload/types.js";
import type { Prettify } from "../../utils/type-utils.js";
import type { ClientAndChainAndAccount } from "../../utils/types.js";
/**
 * @extension DEPLOY
 */
export type PackContractParams = {
    /**
     * Name of the Pack contract
     */
    name: string;
    /**
     * Defaults to the deployer's address
     */
    royaltyRecipient?: string;
    /**
     * Defaults to 0 (zero)
     */
    royaltyBps?: number | string;
    description?: string;
    image?: FileOrBufferOrString;
    external_link?: string;
    social_urls?: Record<string, string>;
    /**
     * Defaults to an empty string ("")
     */
    symbol?: string;
    contractURI?: string;
    /**
     * Defaults to the deployer's address
     */
    defaultAdmin?: string;
    trustedForwarders?: string[];
};
/**
 * @extension DEPLOY
 */
export type DeployPackContractOptions = Prettify<ClientAndChainAndAccount & {
    params: PackContractParams;
}>;
/**
 * @deprecated [Pack contract is incompatible with Pectra update. Support for this contract is being removed in next release.]
 *
 * Deploy a thirdweb Pack contract
 * @param options params for deploying [`Pack contract`](https://thirdweb.com/thirdweb.eth/Pack)
 * @returns
 *
 * @example
 * ```ts
 * import { deployPackContract } from "thirdweb/extensions/deploy";
 *
 * const packAddress = await deployPackContract({
 *   account,
 *   client,
 *   chain,
 *   params: {
 *     name: "Pack contract name",
 *     symbol: "PACK1155",
 *   },
 * });
 * ```
 * @extension DEPLOY
 */
export declare function deployPackContract(options: DeployPackContractOptions): Promise<string>;
//# sourceMappingURL=deploy-pack.d.ts.map