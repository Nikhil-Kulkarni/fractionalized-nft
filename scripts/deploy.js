async function main() {
    const MyNFT = await ethers.getContractFactory('TikTok');

    const myNFT = await MyNFT.deploy("0x04223F6B85E4d63b65F44c0433ea27794A0BF07a");
    console.log('address:', myNFT.address);
}

main()
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });