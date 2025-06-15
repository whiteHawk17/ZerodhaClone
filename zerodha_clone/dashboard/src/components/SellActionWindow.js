import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "../utils/axios";
import GeneralContext from "./GeneralContext";
import "./SellActionWindow.css";

const SellActionWindow = ({ uid }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);

  const { closeSellWindow, notifyHoldingsUpdate } = useContext(GeneralContext);

  const handleSellClick = () => {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to place an order');
      return;
    }

    axios.post('/sellStock', {
      name: uid,
      qty: stockQuantity,
      price: stockPrice,
      mode: "SELL",
    })
    .then((res) => {
      notifyHoldingsUpdate();
      closeSellWindow();
    })
    .catch((err) => {
      console.error("Sell Order Error:", err);
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
      } else {
        alert("Order failed! Please try again.");
      }
    });
  };

  const handleCancelClick = () => {
    closeSellWindow();
  };

  return (
    <div className="sell-container" id="sell-window" draggable="true">
      <div className="sell-regular-order">
        <div className="sell-inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>

          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      <div className="sell-buttons">
        <span>Margin required ₹140</span>
        <div>
          <Link className="sell-btn sell-btn-red" onClick={handleSellClick}>
            Sell
          </Link>
          <Link className="sell-btn sell-btn-grey" onClick={handleCancelClick}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SellActionWindow;

