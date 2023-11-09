import React from "react";
import "../../styles/Layout.scss";

// Icons
import MenuIcon from "../../assets/images/uneven-menu-icon.svg";
import CountryFlag from "../../assets/images/country-flag.svg";
import ChevronDownIcon from "../../assets/images/chevron-down.svg";

const Layout = ({ children }) => {
  return (
    <div className="layout-container position-relative">
      <header className="header d-flex justify-content-between align-items-center w-100">
        <img src={MenuIcon} alt="menu" height={11.5} width={18.5} />
        <span className="d-flex align-items-center">
          <img src={CountryFlag} alt="country" height={24} width={24} />
          <img
            src={ChevronDownIcon}
            alt="dropdown"
            height={7.5}
            width={13}
            className="ms-2"
          />
        </span>
      </header>
      {children}
    </div>
  );
};

export default Layout;
