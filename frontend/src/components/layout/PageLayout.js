import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export const PageLayout = ({ title, children }) => {
  return (
    <div className="page-layout">
      <Sidebar />
      <div className="layout-main">
        <Header title={title} />
        <div className="layout-content">{children}</div>
      </div>
    </div>
  );
};

export default PageLayout;
