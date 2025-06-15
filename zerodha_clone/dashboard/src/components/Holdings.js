import React,{useState,useEffect, useContext} from "react";

// import { holdings } from "../data/data";

// import {holdings} from "../data/data";
import axios from "../utils/axios";
import GeneralContext from "./GeneralContext";


const Holdings = () => {
  const [allHoldings,setAllHolding] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const {holdingsUpdateTrigger} = useContext(GeneralContext);

  useEffect(()=>{
    const fetchHoldings = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/userHoldings");
        setAllHolding(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching holdings:", error);
        setError("Failed to load holdings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHoldings();
  },[holdingsUpdateTrigger]);

  if (loading) {
    return <div>Loading holdings...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>

      <div className="order-table">
        <table>
        <thead>
          <tr>
            <th>Instrument</th>
            <th>Qty.</th>
            <th>Avg. cost</th>
            <th>LTP</th>
            <th>Cur. val</th>
            <th>P&L</th>
            <th>Net chg.</th>
            <th>Day chg.</th>
          </tr>
          </thead>
          <tbody>
          {allHoldings.map((stock,index)=>{
            const curValue = stock.price * stock.qty;
            const isProfit = curValue-stock.avg*stock.qty >= 0.0;
            const profClass = isProfit ? "profit" : "loss";
            const dayClass = stock.isLoss ? "loss" : "profit";

            return (
              <tr key={index}>
                <td>{stock.name}</td>
                <td>{stock.qty}</td>
                <td>{stock.avg.toFixed(2)}</td>
                <td>{stock.price.toFixed(2)}</td>
                <td>{curValue.toFixed(2)}</td>
                <td className={profClass}>{(curValue-stock.avg * stock.qty).toFixed(2)}</td>
                <td className={profClass}>{stock.net}</td>
                <td className={dayClass}>{stock.day}</td>
              </tr>
            )
          })}
          </tbody>
        </table>
      </div>

      <div className="row">
        <div className="col">
          <h5>
            29,875.<span>55</span>{" "}
          </h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>
            31,428.<span>95</span>{" "}
          </h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5>1,553.40 (+5.20%)</h5>
          <p>P&L</p>
        </div>
      </div>
    </>
  );
};

export default Holdings;
