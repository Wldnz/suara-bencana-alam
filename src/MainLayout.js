import Sidebar from "./components/Sidebar";
import React from 'react';
const MainLayout = ({ children }) => {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    );
  };

  export default MainLayout;