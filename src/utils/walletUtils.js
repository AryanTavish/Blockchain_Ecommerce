// src/utils/walletUtils.js
import { ethers } from "ethers";

export const connectWallet = async () => {
  if (!window.ethereum) {
    alert("MetaMask is not installed!");
    return null;
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const network = await provider.getNetwork();

    return { provider, signer, address, network };
  } catch (error) {
    console.error("Wallet connection failed:", error);
    return null;
  }
};
