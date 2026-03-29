import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export const PageLayout = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title={title} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default PageLayout;
