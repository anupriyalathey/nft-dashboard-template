import { useState, useEffect } from "react";
import { Button, Box } from "@chakra-ui/react";
import { ethers, Signer, Contract } from "ethers";
import { formatEther } from "@ethersproject/units";
import Web3Modal from "web3modal";
const DAIABI = require("../abis/NFTFactory.json");

const web3Modal = new Web3Modal({
  providerOptions: {}, // required
});

function NFTFactory() {
  const [web3ModalInstance, setWeb3ModalInstance] = useState();
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [signerAddress, setSignerAddress] = useState("");
  const [daiContract, setDaiContract] = useState();

  const DAIAddress = "0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844";

  useEffect(() => {
    if (web3ModalInstance) {
      setProvider(new ethers.providers.Web3Provider(web3ModalInstance));
    }
  }, [web3ModalInstance]);

  useEffect(() => {
    if (provider) {
      setSigner(provider.getSigner());
      setDaiContract(new Contract(DAIAddress, DAIABI, provider));
    }
  }, [provider]);

  useEffect(() => {
    const fetchSigner = async () => {
      setSignerAddress(await signer.getAddress());
    };

    if (signer) {
      fetchSigner();
    }
  }, [signer]);

  useEffect(() => {
    const fetchBalance = async () => {
     fetchBalance(formatEther(await daiContract.balanceOf(signerAddress)));
    };

    if (signerAddress) {
      fetchBalance();
    }
  }, [signerAddress]);

  return signerAddress ? (
    <>
      <Box>{signerAddress}</Box>
      <Button
        onClick={async () => {
          await daiContract
            .connect(signer)
            .transfer("0x9719780dEB5b164a2c4128CFf0A46Cf6CF914d4d", "1");
        }}
      >
        Transfer
      </Button>
    </>
  ) : (
    <Button
      onClick={async () => {
        setWeb3ModalInstance(await web3Modal.connect());
      }}
    >
      Connect Wallet
    </Button>
  );
}

export default NFTFactory;
