// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ActionLogger {
    event ActionLogged(address indexed user, string action, uint256 timestamp, string details);

    function logAction(string memory action, string memory details) public {
        emit ActionLogged(msg.sender, action, block.timestamp, details);
    }
}
