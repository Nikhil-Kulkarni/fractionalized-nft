async function main() {
    const MyNFT = await ethers.getContractFactory('TikTokToken');

    const myNFT = await MyNFT.deploy();
    console.log('address:', myNFT.address);
}

main()
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });