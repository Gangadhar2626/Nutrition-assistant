import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="dashboard-layout">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="dashboard-content">{children}</main>
      </div>
    </>
  );
};

export default DashboardLayout;
