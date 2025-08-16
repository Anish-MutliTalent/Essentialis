// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol"; // For tracking listed tokens

interface IPriceableNFT {
    function tokenURI(uint256 tokenId) external view returns (string memory);
    // We'll assume the price is part of the metadata URI or set off-chain during listing.
    // For on-chain price, the NFT contract would need a getPrice(tokenId) function.
    // For this example, price is set during listing.
}

contract NFTMarketplace is ReentrancyGuard, Ownable {
    using EnumerableSet for EnumerableSet.UintSet;

    address public commissionWallet;
    uint256 public commissionPercentage; // e.g., 1000 for 10.00% (basis points)

    struct Listing {
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 price; // in MATIC (wei)
        bool active;
    }

    mapping(address => mapping(uint256 => Listing)) public listings;
    Listing[] public allListingsArray;
    mapping(address => mapping(uint256 => uint256)) public listingArrayIndex;


    event NFTListed(
        address indexed seller,
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 price,
        uint256 listingId
    );
    event NFTSold(
        address indexed seller,
        address indexed buyer,
        address indexed nftContract,
        uint256 tokenId,
        uint256 price,
        uint256 commission,
        uint256 listingId
    );
    event NFTUnlisted(
        address indexed seller,
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 listingId
    );
    event CommissionWalletChanged(address indexed newWallet);
    event CommissionPercentageChanged(uint256 newPercentage);

    modifier onlyListingOwner(address _nftContract, uint256 _tokenId) {
        require(listings[_nftContract][_tokenId].seller == msg.sender, "Not listing owner");
        _;
    }

    modifier isListed(address _nftContract, uint256 _tokenId) {
        require(listings[_nftContract][_tokenId].active, "NFT not listed or already sold");
        _;
    }

    constructor(address _initialCommissionWallet, uint256 _initialCommissionPercentage)
        Ownable(msg.sender) // <-- CORRECTED HERE: Pass msg.sender directly
        ReentrancyGuard()   // ReentrancyGuard constructor doesn't take arguments
    {
        require(_initialCommissionWallet != address(0), "Commission wallet cannot be zero address");
        require(_initialCommissionPercentage <= 10000, "Commission cannot exceed 100%"); // Max 10000 for 100.00%
        commissionWallet = _initialCommissionWallet;
        commissionPercentage = _initialCommissionPercentage;
    }

    function listNFT(address _nftContract, uint256 _tokenId, uint256 _price) external nonReentrant {
        IERC721 nft = IERC721(_nftContract);
        require(nft.ownerOf(_tokenId) == msg.sender, "Not the owner of the NFT");
        require(_price > 0, "Price must be greater than zero");
        // Ensure the marketplace contract is approved to transfer this specific NFT or all NFTs of the user
        require(nft.isApprovedForAll(msg.sender, address(this)) || nft.getApproved(_tokenId) == address(this),
                "Marketplace not approved to transfer NFT");

        // Deactivate previous listing if any to prevent issues, or explicitly require unlisting.
        // For simplicity, we overwrite. A more robust system might prevent relisting if active.
        if (listings[_nftContract][_tokenId].active) {
            // If you want to update price, it's better to have a separate updatePrice function.
            // For now, let's assume a new listing overwrites or fails.
            // Or, just unlist first:
            _unlistNFT(_nftContract, _tokenId, listings[_nftContract][_tokenId].seller);
        }

        uint256 listingId = allListingsArray.length;

        listings[_nftContract][_tokenId] = Listing({
            seller: msg.sender,
            nftContract: _nftContract,
            tokenId: _tokenId,
            price: _price,
            active: true
        });

        allListingsArray.push(listings[_nftContract][_tokenId]);
        listingArrayIndex[_nftContract][_tokenId] = listingId;


        // Optional: Use EnumerableSet if you need on-chain enumeration of *which* tokens are listed.
        // This requires a unique ID for each listing. For simplicity, we are using mapping.
        // listedTokens.add(uniqueListingId);

        emit NFTListed(msg.sender, _nftContract, _tokenId, _price, listingId);
    }

    function buyNFT(address _nftContract, uint256 _tokenId) external payable nonReentrant isListed(_nftContract, _tokenId) {
        Listing storage listing = listings[_nftContract][_tokenId]; // Use storage pointer
        IERC721 nft = IERC721(_nftContract);

        require(msg.value >= listing.price, "Insufficient MATIC sent for purchase");

        uint256 price = listing.price;
        address seller = listing.seller;

        // Mark as inactive before transfer to prevent reentrancy issues with the NFT transfer itself
        listing.active = false;
        // Note: If using allListingsArray for display, you might need a way to mark it inactive there too,
        // or filter active listings off-chain. For on-chain views, `listings` mapping is the source of truth for active status.


        // Calculate commission
        uint256 commissionAmount = (price * commissionPercentage) / 10000;
        uint256 amountToSeller = price - commissionAmount;

        // Transfer NFT to buyer
        // The marketplace contract must be approved by the seller to do this
        nft.safeTransferFrom(seller, msg.sender, _tokenId);

        // Pay commission
        (bool successComm, ) = commissionWallet.call{value: commissionAmount}("");
        require(successComm, "Failed to send commission");

        // Pay seller
        (bool successSell, ) = seller.call{value: amountToSeller}("");
        require(successSell, "Failed to send funds to seller");

        // Refund any excess Ether sent
        if (msg.value > price) {
            (bool successRefund, ) = msg.sender.call{value: msg.value - price}("");
            require(successRefund, "Failed to refund excess Ether");
        }

        uint256 listingId = listingArrayIndex[_nftContract][_tokenId];
        // Update the entry in allListingsArray to mark as inactive (or handle by filtering off-chain)
        // This makes on-chain enumeration of active listings complex with just an array.
        // A better approach for allListingsArray would be to store an index to the `listings` map key,
        // or manage active listings in a separate EnumerableSet.
        // For now, we assume off-chain indexing will handle showing 'active' listings.
        // To properly "remove" from allListingsArray, you'd need to shift elements or use a linked list structure,
        // which adds complexity. Marking as inactive in the `listings` map is key.

        emit NFTSold(seller, msg.sender, _nftContract, _tokenId, price, commissionAmount, listingId);
    }

    function unlistNFT(address _nftContract, uint256 _tokenId) external nonReentrant onlyListingOwner(_nftContract, _tokenId) isListed(_nftContract, _tokenId) {
       _unlistNFT(_nftContract, _tokenId, msg.sender);
    }

    function _unlistNFT(address _nftContract, uint256 _tokenId, address _seller) private {
        listings[_nftContract][_tokenId].active = false;
        uint256 listingId = listingArrayIndex[_nftContract][_tokenId];
        // Again, handling allListingsArray for removal is complex. Off-chain indexer is better.
        emit NFTUnlisted(_seller, _nftContract, _tokenId, listingId);
    }


    // Admin functions
    function updateCommissionWallet(address _newWallet) external onlyOwner {
        require(_newWallet != address(0), "New commission wallet cannot be zero address");
        commissionWallet = _newWallet;
        emit CommissionWalletChanged(_newWallet);
    }

    function updateCommissionPercentage(uint256 _newPercentage) external onlyOwner {
        require(_newPercentage <= 10000, "Commission cannot exceed 100%");
        commissionPercentage = _newPercentage;
        emit CommissionPercentageChanged(_newPercentage);
    }

    // View functions
    function getListing(address _nftContract, uint256 _tokenId) public view returns (Listing memory) {
        return listings[_nftContract][_tokenId];
    }

    // --- Functions for browsing listings (can be gas intensive for many items) ---
    // It's generally better to get this data via off-chain event indexing.

    function getListingDetailsById(uint256 _listingId) public view returns (Listing memory) {
        require(_listingId < allListingsArray.length, "Invalid listing ID");
        return allListingsArray[_listingId];
    }

    function getTotalListings() public view returns (uint256) {
        return allListingsArray.length; // Includes inactive listings if not pruned
    }

    // To get active listings, you would iterate `allListingsArray` and check `listings[contract][tokenId].active`.
    // This is very inefficient on-chain.

}