import React, { useEffect, useState } from "react";

import Menu from "./Menu";

const TopBar = () => {
  const [userName, setUserName] = useState('USERID'); // Default to USERID

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  return (
    <div className="topbar-container">
      <div className="indices-container">
        <div className="nifty">
          <p className="index">NIFTY 50</p>
          <p className="index-points">{100.2} </p>
          <p className="percent"> </p>
        </div>
        <div className="sensex">
          <p className="index">SENSEX</p>
          <p className="index-points">{100.2}</p>
          <p className="percent"></p>
        </div>
      </div>

      <Menu />
      <div className="user-info">
        <p>Hi {userName}</p>
      </div>
    </div>
  );
};

export default TopBar;
