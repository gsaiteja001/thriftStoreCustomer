import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaShoppingCart,
  FaBoxes,
  FaStore,
  FaUsers,
  FaChartBar,
  FaCog,
  FaHeadset,
  FaHeart,
  FaTruck,
  FaBoxOpen,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import { LoginContext } from '../context/LoginContext'; 
import './Sidebar.css';

function Sidebar() {
  const { userInfo } = useContext(LoginContext); // Access userInfo from the context
  const [expandedMenus, setExpandedMenus] = useState([]);
  const [collapsed, setCollapsed] = useState(false); // Track sidebar collapse state

  const toggleMenu = (name) => {
    if (expandedMenus.includes(name)) {
      setExpandedMenus(expandedMenus.filter((item) => item !== name));
    } else {
      setExpandedMenus([...expandedMenus, name]);
    }
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    { name: 'Home', icon: <FaBoxes />, path: '/EcommerceHome' },
    { name: 'Your Cart', icon: <FaShoppingCart />, path: '/CheckoutPage' },
    { name: 'Orders', icon: <FaBoxOpen />, path: '/MyOrdersPage' },
    { name: 'Wishlist', icon: <FaHeart />, path: '/Wishlist' },
    { name: 'Returns & Refunds', icon: <FaTruck />, path: '/returns' },
    { name: 'Profile', icon: <FaUsers />, path: '/profile' },
    { name: 'Customer Support', icon: <FaHeadset />, subItems: [
      { name: 'Support Tickets', path: '/support-tickets' },
      { name: 'Live Chat', path: '/live-chat' },
    ]}
  ];

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>

        <div className="toggle-btn" onClick={toggleSidebar}>
          {collapsed ?  <FaChevronLeft /> : <FaChevronRight />}
        </div>
 

      {menuItems.map((item, index) => (
        <div key={index}>
          {item.subItems ? (
            <>
              <div
                className={`sidebar-item ${expandedMenus.includes(item.name) ? 'active' : ''}`}
                onClick={() => toggleMenu(item.name)}
              >
                <span className="icon">{item.icon}</span>
                <span className="text">{item.name}</span>
                <FaChevronDown
                  className={`arrow ${expandedMenus.includes(item.name) ? 'rotated' : ''}`}
                />
              </div>
              <div
                className={`submenu ${expandedMenus.includes(item.name) ? 'submenu-expanded' : ''}`}
              >
                {item.subItems.map((subItem, subIndex) => (
                  <NavLink
                    to={subItem.path}
                    key={subIndex}
                    className="submenu-item"
                    activeclassname="active"
                  >
                    {subItem.name}
                  </NavLink>
                ))}
              </div>
            </>
          ) : (
            <NavLink
              to={item.path}
              className="sidebar-item"
              activeclassname="active"
            >
              <span className="icon">{item.icon}</span>
              <span className="text">{item.name}</span>
            </NavLink>
          )}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
