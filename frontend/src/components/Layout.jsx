import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

/**
 * Layout Component
 * Main layout wrapper with sidebar and navbar
 */
const Layout = ({ children, title = 'Dashboard' }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Navbar */}
        <Navbar title={title} />

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
