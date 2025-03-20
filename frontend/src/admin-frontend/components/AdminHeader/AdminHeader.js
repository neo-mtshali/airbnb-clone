import React from "react";
import {
  AppBar,
  Toolbar,
  Typography
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import airbnbLogo from "../../../assets/airbnb-logo.svg";
import "./AdminHeader.css";

function AdminHeader() {
  return (
    <AppBar position="static" color="inherit" elevation={0} className="adminheader">
      <Toolbar className="toolbar">
        {/* Left: Airbnb Logo */}
        <div className="logo-container">
          <img
            src={airbnbLogo}
            alt="Airbnb"
            className="airbnb-logo"
          />
        </div>

        {/* Right side user info */}
        <div className="user-container">
          <Typography variant="body1" className="user-name">
            John Doe
          </Typography>
          <AccountCircleIcon className="account-icon" />
          <MenuIcon className="menu-icon" />
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default AdminHeader;
