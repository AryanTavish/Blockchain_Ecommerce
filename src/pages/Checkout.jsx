import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ethers } from "ethers";

const Checkout = () => {
  const cartItems = useSelector((state) => state.handleCart);
  const [walletAddress, setWalletAddress] = useState(null);
  const [network, setNetwork] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  // Detect wallet and network changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setWalletAddress(accounts[0] || null);
        window.localStorage.setItem("walletAddress", accounts[0] || "");
      });
      window.ethereum.on("chainChanged", async () => {
        await detectNetwork();
      });
      detectNetwork();
    }
    // Retrieve stored wallet on mount
    const storedAddress = window.localStorage.getItem("walletAddress");
    if (storedAddress) setWalletAddress(storedAddress);
  }, []);

  // Detect network
  const detectNetwork = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const net = await provider.getNetwork();
      setNetwork(net.name + " (" + net.chainId + ")");
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      setMessage("❌ MetaMask not detected.");
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setWalletAddress(accounts[0]);
      window.localStorage.setItem("walletAddress", accounts[0]);
      await detectNetwork();
      setMessage("✅ Wallet connected!");
    } catch (err) {
      setMessage("❌ Wallet connection failed.");
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setWalletAddress(null);
    window.localStorage.removeItem("walletAddress");
    setMessage("🔌 Wallet disconnected.");
  };

  // Payment handler with UI feedback
  const handlePayment = async () => {
    if (!walletAddress) {
      setMessage("❌ Wallet not connected. Please connect your wallet first.");
      return;
    }
    setIsPending(true);
    setMessage("⏳ Confirm in wallet...");
    try {
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: walletAddress,
            to: "0x000000000000000000000000000000000000dead",
            value: "0x2386F26FC10000", // 0.01 ETH
          },
        ],
      });
      setMessage(`✅ Minted! Tx Hash: ${txHash}`);
    } catch (error) {
      setMessage("❌ Payment failed or cancelled.");
    }
    setIsPending(false);
  };

  const getTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price, 0).toFixed(2);
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Checkout</h2>
      <div className="mb-3">
        {walletAddress ? (
          <>
            <span className="badge bg-primary me-2">Connected: {walletAddress.slice(0, 8)}...</span>
            <span className="badge bg-secondary me-2">Network: {network}</span>
            <button className="btn btn-outline-danger btn-sm" onClick={disconnectWallet}>Disconnect</button>
          </>
        ) : (
          <button className="btn btn-outline-primary" onClick={connectWallet}>Connect Wallet</button>
        )}
      </div>
      <ul className="list-group mb-3">
        {cartItems.map((item, index) => (
          <li className="list-group-item d-flex justify-content-between" key={index}>
            <div>{item.title}</div>
            <span>₹{item.price}</span>
          </li>
        ))}
        <li className="list-group-item d-flex justify-content-between fw-bold">
          <div>Total</div>
          <span>₹{getTotal()}</span>
        </li>
      </ul>
      <button
        className="btn btn-success w-100"
        onClick={handlePayment}
        disabled={cartItems.length === 0 || !walletAddress || isPending}
      >
        {isPending ? (
          <span>
            <span className="spinner-border spinner-border-sm me-2"></span>
            Pending...
          </span>
        ) : (
          "Pay with Wallet"
        )}
      </button>
      {message && (
        <div className="mt-3 alert alert-info text-center" role="alert">
          {message}
        </div>
      )}
    </div>
  );
};

export default Checkout;
