pragma solidity ^0.7.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract TikTokToken is ERC20, Ownable {
    address payable[] holders;
    uint256 PRICE_PER_TOKEN = 1e17;
    uint256 SCALING_FACTOR = 1e18;
    uint256 MAX_SUPPLY = 1000;
    address _nftContractAddress;

    constructor() ERC20("TOK", "TOK") {}

    function setNFTContract(address contractAddress) external onlyOwner {
        _nftContractAddress = contractAddress;
    }

    function purchase(uint256 amount) external payable {
        require(msg.sender != address(0), "Invalid address");
        require(msg.value >= amount * PRICE_PER_TOKEN, "Invalid fees");
        require(MAX_SUPPLY - amount >= 0, "Not enough TOK left");

        holders.push(msg.sender);
        _mint(msg.sender, amount);
    }

    function sell(uint256 amount) external {
        require(msg.sender != address(0), "Invalid address");
        require(balanceOf(msg.sender) >= amount, "Not enough TOK");
        if (balanceOf(msg.sender) == amount) {
            uint256 index = 0;
            for (uint256 i = 0; i < holders.length; i++) {
                if (holders[i] == msg.sender) {
                    index = i;
                    break;
                }
            }
            delete holders[index];
        }

        _burn(msg.sender, amount);
        (bool success,) = msg.sender.call{value: PRICE_PER_TOKEN * amount}("");
        require(success, "Failed to send eth");
    }

    function onNFTPurchase() external payable {
        require(msg.sender == _nftContractAddress, "Invalid sender");
        for (uint256 i = 0; i < holders.length; i++) {
            uint256 balance = balanceOf(holders[i]);
            uint256 ownedProportion = balance * SCALING_FACTOR / MAX_SUPPLY;
            uint256 funds = msg.value * ownedProportion / SCALING_FACTOR;
            (bool success,) = holders[i].call{value: funds}("");
            require(success, "Failed to send eth");
        }
    }
}
