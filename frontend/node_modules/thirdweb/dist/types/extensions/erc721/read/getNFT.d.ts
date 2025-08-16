import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { type NFT } from "../../../utils/nft/parseNft.js";
import type { Prettify } from "../../../utils/type-utils.js";
import { type TokenURIParams } from "../__generated__/IERC721A/read/tokenURI.js";
export { isTokenURISupported as isGetNFTSupported } from "../__generated__/IERC721A/read/tokenURI.js";
/**
 * Parameters for getting an NFT.
 * @extension ERC721
 */
export type GetNFTParams = Prettify<TokenURIParams & {
    /**
     * Whether to include the owner of the NFT.
     */
    includeOwner?: boolean;
    /**
     * Whether to check and fetch tokenID by index, in case of non-sequential IDs.
     *
     * It should be set to true if it's an ERC721Enumerable contract, and has `tokenByIndex` function.
     * In this case, the provided tokenId will be considered as token-index and actual tokenId will be fetched from the contract.
     */
    tokenByIndex?: boolean;
    /**
     * Whether to use the insight API to fetch the NFT.
     * @default true
     */
    useIndexer?: boolean;
}>;
/**
 * Retrieves information about a specific ERC721 non-fungible token (NFT).
 * @param options - The options for retrieving the NFT.
 * @returns A promise that resolves to the NFT object.
 * @extension ERC721
 * @example
 * ```ts
 * import { getNFT } from "thirdweb/extensions/erc721";
 * const nft = await getNFT({
 *  contract,
 *  tokenId: 1n,
 * });
 * ```
 *
 * * @example
 * ```ts
 * import { getNFT } from "thirdweb/extensions/erc721";
 *
 *
 * const nft = await getNFT({
 *  contract,
 *  tokenId: 1n,
 *  tokenByIndex: true // use this flag if the contract supports `tokenByIndex` and the above tokenId should be treated as an index.
 * });
 * ```
 */
export declare function getNFT(options: BaseTransactionOptions<GetNFTParams>): Promise<NFT>;
//# sourceMappingURL=getNFT.d.ts.map