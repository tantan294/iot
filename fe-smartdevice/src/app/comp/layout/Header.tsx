import React from "react";
import userIcon from "../../../asset/image/user-icon.png";

export const Header = () => {
  return (
    <header className="app-header">
      <div className="header-user">
        <div className="header-avatar">
          <img src={userIcon} alt="Avatar" />
        </div>
        <p className="header-username">Bùi Thanh Tân</p>
      </div>
    </header>
  );
};
