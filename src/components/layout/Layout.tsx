import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ searchQuery, onSearchChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0F17] flex flex-col font-sans">
      <Header
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
