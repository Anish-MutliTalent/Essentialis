// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";


contract NFTLand is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;
    // Mapping from tokenId to encrypted metadata (for genesis tokens)
    mapping(uint256 => string) public tokenData;
    // Mapping for updates: genesis tokenId => list of update records (encrypted data)
    mapping(uint256 => string[]) public tokenUpdates;

    struct NftDataStruct {
        uint256 tokenId;
        string tokenURI;
    }

    struct OwnedNFTs {
        mapping(address => bool) isContractOwner; // Tracks which contract the owner has
        uint256[] tokenIds;  // Token IDs owned by this user across all contracts
    }

    mapping(address => OwnedNFTs) internal nftsOwned;

    // Flags to control access
    bool public onlyOwnerMint = true;
    bool public onlyOwnerUpdate = true;

    event NFTMinted(uint256 indexed tokenId, address indexed owner, string data);
    event NFTUpdated(uint256 indexed genesisTokenId, uint256 indexed updateIndex, string updatedData);

    constructor() ERC721("LandChain", "LAND") Ownable(msg.sender) {
        tokenCounter = 0;
    }

    /**
     * @dev Override conflicting Context methods
     */
    function _msgSender() internal view override(Context) returns (address) {
        return super._msgSender();
    }

    function _msgData() internal view override(Context) returns (bytes calldata) {
        return super._msgData();
    }

    /**
     * @dev Toggle whether only the contract owner can mint new NFTs
     */
    function setOnlyOwnerMint(bool _onlyOwnerMint) external onlyOwner {
        onlyOwnerMint = _onlyOwnerMint;
    }

    /**
     * @dev Toggle whether only the contract owner can append updates
     */
    function setOnlyOwnerUpdate(bool _onlyOwnerUpdate) external onlyOwner {
        onlyOwnerUpdate = _onlyOwnerUpdate;
    }


    /**
     * @dev Mint a new NFT (genesis land record)
     */
    function mintNFT(string memory data) public returns (uint256) {
        if (onlyOwnerMint) {
            require(msg.sender == owner(), "Only contract owner can mint");
        }

        uint256 newTokenId = tokenCounter;
        _safeMint(msg.sender, newTokenId);
        tokenUpdates[newTokenId].push(data);
        tokenData[newTokenId] = data;
        tokenCounter++;
        nftsOwned[msg.sender].tokenIds.push(newTokenId);

        emit NFTMinted(newTokenId, msg.sender, data);
        return newTokenId;
    }

    /**
     * @dev Append an update to an existing NFT (updates tokenData and URI)
     */
    error NotTokenOwner(uint256 tokenId, address caller);
    function updateNFT(uint256 tokenId, string memory updatedData) public {
        if (ownerOf(tokenId) != msg.sender) {
            revert NotTokenOwner(tokenId, msg.sender);
        }
        if (onlyOwnerUpdate && msg.sender != owner()) {
            revert("Only contract owner can update when restriction is enabled");
        }

        tokenUpdates[tokenId].push(updatedData);
        tokenData[tokenId] = updatedData;
        _setTokenURI(tokenId, updatedData);

        emit NFTUpdated(tokenId, tokenUpdates[tokenId].length - 1, updatedData);
    }

    /**
     * @dev Returns the number of updates for a given token
     */
    function getUpdateCount(uint256 tokenId) public view returns (uint256) {
        return tokenUpdates[tokenId].length;
    }

    /**
     * @dev Returns the nfts for a given owner
     */

    function fetchNFTsForOwner(address _ownerAddress) external view returns (uint256[] memory) {
        require(_ownerAddress != address(0), "Invalid owner address");

        // Get the NFT tokens and contract addresses owned by this user
        uint256[] memory tokenIds = nftsOwned[_ownerAddress].tokenIds;

        return (tokenIds);
    }
    function _updateOwnerLists(
        address from,
        address to,
        uint256 tokenId
    ) private {
        if (from != address(0)) {
            uint256[] storage oldList = nftsOwned[from].tokenIds;
            for (uint256 i = 0; i < oldList.length; i++) {
                if (oldList[i] == tokenId) {
                    oldList[i] = oldList[oldList.length - 1];
                    oldList.pop();
                    break;
                }
            }
        }
        if (to != address(0)) {
            nftsOwned[to].tokenIds.push(tokenId);
        }
    }

    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address previousOwner) {
        address from = _ownerOf(tokenId);
        previousOwner = super._update(to, tokenId, auth);

        // Your custom logic
        if (from != address(0) && to != address(0)) {
            // Remove from previous owner
            _updateOwnerLists(from, to, tokenId);
        }

    }

}