import React,{useState} from "react";

import {Link} from "react-router-dom";
const Menu = () => {
  const [selectedMenu,setSelectedMenu]=useState(0);
  const [isProfileDropDownOpen,setIsProfileDropDownOpen]=useState(false);


  const handleMenuClick =(index)=>{
    setSelectedMenu(index);
  }

  const handleProfileClick =(index)=>{
    setIsProfileDropDownOpen(!isProfileDropDownOpen); // to toggle
  }

  const menuClass="menu";
  const activeMenuClass="menu selected";


  return (
    <div className="menu-container">
      <img src="logo.png" style={{ width: "50px" }} />
      <div className="menus">
        <ul>
          <li>
            <Link
              style={{textDecoration:"none"}} to="/" onClick={()=>handleMenuClick(0)}>
              <p className={selectedMenu===1 ? activeMenuClass:menuClass}>Dashboard</p>
            </Link>
            
          </li>
          <li>
          <Link
              style={{textDecoration:"none"}} to="/orders" onClick={()=>handleMenuClick(0)}>
              <p className={selectedMenu===1 ? activeMenuClass:menuClass}>Orders</p>
            </Link>
          </li>
          <li>
          <Link
              style={{textDecoration:"none"}} to="/holdings" onClick={()=>handleMenuClick(0)}>
              <p className={selectedMenu===1 ? activeMenuClass:menuClass}>Holdings</p>
            </Link>
          </li>
          <li>
          <Link
              style={{textDecoration:"none"}} to="/positions" onClick={()=>handleMenuClick(0)}>
              <p className={selectedMenu===1 ? activeMenuClass:menuClass}>Positions</p>
            </Link>
          </li>
          <li>
          <Link
              style={{textDecoration:"none"}} to="/funds" onClick={()=>handleMenuClick(0)}>
              <p className={selectedMenu===1 ? activeMenuClass:menuClass}>Funds</p>
            </Link>
          </li>
          <li>
          <Link
              style={{textDecoration:"none"}} to="/apps" onClick={()=>handleMenuClick(0)}>
              <p className={selectedMenu===1 ? activeMenuClass:menuClass}>Apps</p>
            </Link>
          </li>
        </ul>
        <hr />
        <div className="profile"  onClick={handleProfileClick}>
          <div className="avatar">ZU</div>
          <p className="username">USERID</p>
        </div>
       
      </div>
    </div>
  );
};

export default Menu;
