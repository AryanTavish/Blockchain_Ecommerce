import React, { useState, useEffect } from "react";
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { connectWallet } from "../utils/walletUtils";

const Navbar = () => {
  const state = useSelector(state => state.handleCart);
  const [walletAddress, setWalletAddress] = useState(null);
  const [network, setNetwork] = useState(null);
  const [message, setMessage] = useState(""); // feedback message

  const handleConnect = async () => {
    try {
      const result = await connectWallet();
      if (result) {
        setWalletAddress(result.address);
        setNetwork(result.network.name);
        setMessage(`✅ Connected to ${result.network.name}`);
      } else {
        setMessage("❌ Wallet connection failed");
      }
    } catch (err) {
      setMessage("❌ Error connecting wallet");
      console.error(err);
    }
  };

  
  const handleDisconnect = () => {
    setWalletAddress(null);
    setNetwork(null);
    setMessage("⚠️ Wallet disconnected");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light py-3 sticky-top">
      <div className="container">
        <NavLink className="navbar-brand fw-bold fs-4 px-2" to="/">React Ecommerce</NavLink>
        <button className="navbar-toggler mx-2" type="button" data-toggle="collapse" data-target="#navbarSupportedContent">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav m-auto my-2 text-center">
            <li className="nav-item"><NavLink className="nav-link" to="/">Home</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/product">Products</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/about">About</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/contact">Contact</NavLink></li>
          </ul>

          <div className="buttons text-center">
            {walletAddress ? (
              <>
                <button onClick={handleDisconnect} className="btn btn-outline-danger m-2">Disconnect</button>
                <span className="btn btn-outline-success m-2">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </>
            ) : (
              <button onClick={handleConnect} className="btn btn-outline-dark m-2">
                Connect Wallet
              </button>
            )}
            <NavLink to="/login" className="btn btn-outline-dark m-2">Login</NavLink>
            <NavLink to="/register" className="btn btn-outline-dark m-2">Register</NavLink>
            <NavLink to="/cart" className="btn btn-outline-dark m-2">Cart ({state.length})</NavLink>
          </div>
        </div>
      </div>

      {/* Feedback message below navbar */}
      {message && (
        <div className="text-center p-2">
          <small className="text-muted">{message}</small>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
