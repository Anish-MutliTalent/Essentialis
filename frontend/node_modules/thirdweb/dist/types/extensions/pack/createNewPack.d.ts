import type { ThirdwebClient } from "../../client/client.js";
import { type ThirdwebContract } from "../../contract/contract.js";
import type { BaseTransactionOptions, WithOverrides } from "../../transaction/types.js";
import type { NFTInput } from "../../utils/nft/parseNft.js";
export declare enum PACK_TOKEN_TYPE {
    ERC20 = 0,
    ERC721 = 1,
    ERC1155 = 2
}
export type ERC20Reward = {
    contractAddress: string;
    quantityPerReward: number | string;
    totalRewards: number | string;
};
export type ERC721Reward = {
    contractAddress: string;
    tokenId: bigint;
};
export type ERC1155Reward = {
    contractAddress: string;
    tokenId: bigint;
    quantityPerReward: number | string;
    totalRewards: number | string;
};
/**
 * @extension PACK
 */
export type CreateNewPackParams = {
    client: ThirdwebClient;
    contract: ThirdwebContract;
    /**
     * The address of the reward recipient
     */
    recipient: string;
    /**
     * The address of the entity who owns the tokens that are used as rewards.
     * This is only used for checking token approval
     */
    tokenOwner: string;
    /**
     * The metadata (image, description, etc.) of the Pack.
     * This is similar to an NFT's metadata
     */
    packMetadata: NFTInput | string;
    amountDistributedPerOpen: bigint;
    /**
     * JavaScript Date object
     */
    openStartTimestamp: Date;
    /**
     * An array of ERC20 rewards, see type `ERC20Reward` for more info
     */
    erc20Rewards?: ERC20Reward[];
    /**
     * An array of ERC721 rewards, see type `ERC721Reward` for more info
     */
    erc721Rewards?: ERC721Reward[];
    /**
     * An array of ERC1155 rewards, see type `ERC1155Reward` for more info
     */
    erc1155Rewards?: ERC1155Reward[];
};
/**
 * * @deprecated [Pack contract is incompatible with Pectra update. Support for this contract is being removed in next release.]
 *
 * @extension PACK
 * @example
 * ```ts
 * import { createNewPack } from "thirdweb/extensions/pack";
 *
 * const transaction = createNewPack({
 *   contract: packContract,
 *   client,
 *   recipient: "0x...",
 *   tokenOwner: "0x...",
 *   packMetadata: {
 *     name: "Pack #1",
 *     image: "image-of-pack-1",
 *   },
 *   openStartTimestamp: new Date(),
 *   erc20Rewards: [
 *     {
 *       contractAddress: "0x...",
 *       quantityPerReward: 1,
 *       totalRewards: 1,
 *     },
 *   ],
 *   erc721Rewards: [
 *     {
 *       contractAddress: "0x...",
 *       tokenId: 0n,
 *     },
 *   ],
 *   erc1155Rewards: [
 *     {
 *       contractAddress: "0x...",
 *       tokenId: 0n,
 *       quantityPerReward: 1,
 *       totalRewards: 1,
 *     },
 *   ],
 * });
 * ```
 */
export declare function createNewPack(options: WithOverrides<BaseTransactionOptions<CreateNewPackParams>>): import("../../transaction/prepare-transaction.js").PreparedTransaction<any, import("abitype").AbiFunction, import("../../transaction/prepare-transaction.js").PrepareTransactionOptions>;
//# sourceMappingURL=createNewPack.d.ts.map