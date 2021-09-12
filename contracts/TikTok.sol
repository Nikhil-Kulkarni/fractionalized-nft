pragma solidity ^0.7.3;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./TikTokToken.sol";
import "hardhat/console.sol";

contract TikTok is ERC721, Ownable {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint256 _purchasePrice;
    address _purchaser;

    TikTokToken _fractionalToken;

    constructor(address fractionalTokenAddress) ERC721("TikTok", "TikTok") {
        _fractionalToken = TikTokToken(fractionalTokenAddress);
    }

    function mintNFT(address recipient, string memory tokenURI) external onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 currentId = _tokenIds.current();

        _mint(recipient, currentId);
        _setTokenURI(currentId, tokenURI);
        _approve(address(this), currentId);

        return currentId;
    }

    function purchase() external payable {
        require(msg.sender != address(0), "Invalid address");
        require(msg.value > 0, "Invalid payment");
        _purchasePrice = msg.value;
        _purchaser = msg.sender;
    }

    function executeSale(uint256 tokenId) external {
        require(_purchaser != address(0), "Invalid purchase address");
        _fractionalToken.onNFTPurchase{value: _purchasePrice}();
        safeTransferFrom(ownerOf(tokenId), _purchaser, tokenId);
    }

}