import React, { useState,useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const API_BASE_URL = "http://localhost:3002";

const BuyActionWindow = ({ uid }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);

  const { closeBuyWindow, notifyHoldingsUpdate } = useContext(GeneralContext);

  const handleBuyClick = () => {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to place an order');
      return;
    }

    axios.post(`${API_BASE_URL}/newOrder`, {
      name: uid,
      qty: stockQuantity,
      price: stockPrice,
      mode: "BUY",
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then((res) => {
      notifyHoldingsUpdate();
      closeBuyWindow();
    })
    .catch((err) => {
      console.error("Buy Order Error:", err);
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
      } else {
        alert("Order failed! Please try again.");
      }
    });
  };

  const handleCancelClick = () => {
    closeBuyWindow();
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        <div className="inputs">
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
              onChange={(e) => {
                setStockPrice(e.target.value);
              }}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹140</span>
        <div>
          <Link className="btn btn-blue" onClick={handleBuyClick}>
            Buy
          </Link>
          <Link to="" className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};
export default BuyActionWindow;

