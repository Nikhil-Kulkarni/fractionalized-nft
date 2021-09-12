import "./App.css";

import { Button, Container } from "react-bootstrap";
import { useCallback, useEffect, useState } from "react";

import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
import Web3Modal from "web3modal";

const providerOptions = {
  walletConnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: process.env.REACT_APP_INFURA_ID,
    },
  },
};

const modal = new Web3Modal({
  network: "rinkeby",
  providerOptions: providerOptions,
  cacheProvider: false,
});

const App = () => {
  const [account, setAccount] = useState<string>();
  const [tokenBalance, setTokenBalance] = useState<string>();

  const web3 = new Web3(Web3.givenProvider || process.env.REACT_APP_INFURA_URL);
  const nftContract = new web3.eth.Contract(require("./contracts/TikTok.json").abi, process.env.REACT_APP_NFT_ADDRESS);
  const tokenContract = new web3.eth.Contract(
    require("./contracts/TikTokToken.json").abi,
    process.env.REACT_APP_TOKEN_ADDRESS
  );

  const loadAccounts = async () => {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length !== 0) {
      setAccount(accounts[0]);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    const loadAccountTokenBalance = async() => {
      if (!account) return;
      const balance = await tokenContract.methods.balanceOf(account).call();
      setTokenBalance(balance);
    };
    loadAccountTokenBalance();
  }, [account, tokenContract.methods]);

  const connectWallet = async () => {
    await modal.connect();
    loadAccounts();
  };

  const buyToken = async () => {
    tokenContract.methods.purchase(1).send({ from: account, gas: 120000, value: 1e17 });
  };

  const sellToken = async () => {
    tokenContract.methods.sell(1).send({ from: account, gas: 120000 });
  }

  const mint = async () => {
    nftContract.methods.mintNFT(account, "https://gateway.pinata.cloud/ipfs/QmZhy2ackQDUmJL3eWr9QzssrVRo3uL8zzipSDCJMzkefK").send({ from: account, gas: 120000 });
  }

  const purchase = async () => {
    nftContract.methods.purchase().send({ from: account, value: 1e17 });
  }

  const executeSale = async () => {
    nftContract.methods.executeSale(1).send({from: account, gas: 120000 });
  }

  return (
    <div className="App" style={{ marginTop: 10 }}>
      {account ? (
        <Button
          className="float-end"
          variant="light"
          size="sm"
          style={{ marginRight: 20, fontWeight: "bold", textOverflow: "ellipsis", maxWidth: 150 }}
        >
          {account.substr(0, 11)}...
        </Button>
      ) : (
        <Button className="float-end" variant="info" style={{ marginRight: 20 }} onClick={connectWallet}>
          Connect Wallet
        </Button>
      )}
      <Container>
        <h5>Buy/Sell $TOK Tokens</h5>
        <div>
          <Button variant="success" style={{ marginRight: 4 }} onClick={buyToken}>Buy</Button>
          <Button variant="warning" onClick={sellToken}>Sell</Button>
        </div>
        <p>Your balance: {tokenBalance}</p>
        <h5>Purchase NFT</h5>
        <div>
          <Button variant="success" style={{ marginRight: 4 }} onClick={mint}>Mint NFT</Button>
          <Button variant="warning" onClick={purchase} style={{ marginRight: 4 }}>Purchase</Button>
          <Button variant="info" onClick={executeSale}>Execute sale</Button>
        </div>
      </Container>
    </div>
  );
};

export default App;
