// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

contract EssentialisPayout is EIP712 {
    using ECDSA for bytes32;

    address public owner;
    uint256 public payoutAmount = 0.0005 ether;
    bool public paused = false;

    // Per-recipient nonce to prevent replay
    mapping(address => uint256) public nonces;
    mapping(address => bool) public isBlacklisted;
    // Registry for Encryption Public Keys (used for secure sharing)
    mapping(address => string) public encryptionKeys; // @audit New mapping

    event Payout(address indexed user, uint256 amount, uint256 nonce);
    event KeyRegistered(address indexed user, string pubKey); // @audit New event

    modifier onlyOwner() { require(msg.sender == owner, "Not owner"); _; }
    modifier notPaused() { require(!paused, "Paused"); _; }

    // EIP-712 type hash
    bytes32 private constant CLAIM_TYPEHASH =
        keccak256("Claim(address recipient,uint256 amount,uint256 nonce,uint256 deadline)");

    constructor() EIP712("EssentialisPayout", "1") {
        owner = msg.sender;
    }

    function claim(
        address recipient,
        uint256 amount,
        uint256 deadline,
        bytes calldata signature,
        string calldata pubEncryptionKey // @audit New argument
    ) external notPaused {
        require(!isBlacklisted[recipient], "Blacklisted");
        require(recipient == msg.sender, "Not recipient");
        require(block.timestamp <= deadline, "Expired");
        require(amount == payoutAmount, "Wrong amount");
        require(address(this).balance >= amount, "Insufficient funds");

        uint256 nonce = nonces[recipient];

        bytes32 structHash = keccak256(abi.encode(
            CLAIM_TYPEHASH,
            recipient,
            amount,
            nonce,
            deadline
        ));

        bytes32 digest = _hashTypedDataV4(structHash);
        address signer = ECDSA.recover(digest, signature);
        require(signer == owner, "Invalid signature");

        nonces[recipient] = nonce + 1;

        // Register Key if provided
        if (bytes(pubEncryptionKey).length > 0) {
            encryptionKeys[recipient] = pubEncryptionKey;
            emit KeyRegistered(recipient, pubEncryptionKey);
        }

        (bool ok, ) = payable(recipient).call{value: amount}("");
        require(ok, "Transfer failed");

        emit Payout(recipient, amount, nonce);
    }

    // Fallback registration for users who already claimed or don't need funds
    function registerEncryptionKey(string calldata pubKey) external {
        require(bytes(pubKey).length > 0, "Empty key");
        encryptionKeys[msg.sender] = pubKey;
        emit KeyRegistered(msg.sender, pubKey);
    }

    function pause(bool status) external onlyOwner { paused = status; }
    function setPayoutAmount(uint256 amt) external onlyOwner { payoutAmount = amt; }
    function blacklist(address user, bool status) external onlyOwner { isBlacklisted[user] = status; }

    receive() external payable {}
}
