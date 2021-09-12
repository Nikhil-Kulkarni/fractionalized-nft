const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Fractionalized Token tests", function() {
    let tikTokNFT;
    let token;
    let owner;
    let addr1;
    let addr2;

    before(async function() {
        const tokenFactory = await ethers.getContractFactory("TikTokToken");
        token = await tokenFactory.deploy();
        await token.deployed();

        const factory = await ethers.getContractFactory("TikTok");
        tikTokNFT = await factory.deploy(token.address);
        await tikTokNFT.deployed();

        await token.setNFTContract(tikTokNFT.address);

        [owner, addr1, addr2] = await ethers.getSigners();
    });

    it("Should return valid NFT name and symbol", async function() {
        expect(await tikTokNFT.name()).to.equal("TikTok");
        expect(await tikTokNFT.symbol()).to.equal("TikTok");
    });

    it("Should return valid token name and symbol", async function() {
        expect(await token.name()).to.equal("TOK");
        expect(await token.symbol()).to.equal("TOK");
    });

    it("Should mint NFT and owner should hold valid balance", async function() {
        await tikTokNFT.mintNFT(owner.address, "https://gateway.pinata.cloud/ipfs/QmZhy2ackQDUmJL3eWr9QzssrVRo3uL8zzipSDCJMzkefK");
        const balance = await tikTokNFT.balanceOf(owner.address);
        expect(balance).to.equal(1);
    });

    it("Should purchase 2 ERC20 tokens and hold valid balance", async function() {
        await token.connect(addr2).purchase(2, { value: "200000000000000000" });
        const balance = await token.balanceOf(addr2.address);
        expect(balance).to.equal(2);
    });

    it("Should sell 1 ERC20 token and hold valid balance", async function() {
        await token.connect(addr2).sell(1);
        const balance = await token.balanceOf(addr2.address);
        expect(balance).to.equal(1);
    });

    it("Should purchase ERC721 token and hold valid ERC721 balance and distribute funds to ERC20 token holders", async function() {
        console.log(await addr2.getBalance());
        await tikTokNFT.connect(addr1).purchase({ value: "100000000000000000" });
        
        await tikTokNFT.connect(owner).executeSale(1);
        const balance = await tikTokNFT.balanceOf(addr1.address);
        expect(balance).to.equal(1);

        const ownerBalance = await tikTokNFT.balanceOf(owner.address);
        expect(ownerBalance).to.equal(0);
        console.log(await addr2.getBalance());
    })
});