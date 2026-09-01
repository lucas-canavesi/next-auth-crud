"use client";

import { ReactNode, useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col lg:flex-row">
      <Header onMenuClick={() => setMobileSidebarOpen(true)} />
      <div className="flex-1 lg:flex lg:flex-row min-h-0">
        <Sidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto" role="main">
          {children}
        </main>
      </div>
    </div>
  );
}