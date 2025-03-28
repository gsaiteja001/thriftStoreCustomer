
import React from 'react';
import Sidebar from './Sidebar';

import './Layout.css';

function Layout({ children }) {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="content">{children}</div>
      </div>
    </div>
  );
}

export default Layout;
