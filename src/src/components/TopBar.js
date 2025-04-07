// src/components/TopBar/TopBar.js
import React, { useState } from 'react';
import { FaSearch, FaBell, FaUserCircle } from 'react-icons/fa';
import './TopBar.css';

function TopBar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="topbar">
      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input type="text" placeholder="Search..." className="search-input" />
      </div>
      <div className="topbar-right">
        <FaBell className="icon" />
        <div className="profile" onClick={toggleDropdown}>
          <FaUserCircle className="icon" />
          {dropdownOpen && (
            <div className="dropdown">
              <div className="dropdown-item">Profile</div>
              <div className="dropdown-item">Logout</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopBar;
