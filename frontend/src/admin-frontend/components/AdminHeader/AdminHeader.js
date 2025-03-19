import React from "react";
import {
  AppBar,
  Toolbar,
  Typography
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "./AdminHeader.css";

function AdminHeader() {
  return (
    <AppBar position="static" color="inherit" elevation={0} className="adminheader">
      <Toolbar className="toolbar">
        {/* Left: Airbnb Logo */}
        <div className="logo-container">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Airbnb_logo.svg/200px-Airbnb_logo.svg.png"
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
