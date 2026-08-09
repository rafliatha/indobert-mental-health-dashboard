import React, { useState, useEffect } from 'react';
import { Activity, Sliders, LayoutDashboard, Database, X, Home } from 'lucide-react';

interface SidebarProps {
  activeTab: 'home' | 'dashboard' | 'inference';
  setActiveTab: (tab: 'home' | 'dashboard' | 'inference') => void;
  isDarkMode: boolean;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isDarkMode,
  isSidebarOpen,
  setIsSidebarOpen
}) => {
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(false);

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await fetch('/api/health');
        setIsBackendOnline(response.ok);
      } catch (error) {
        setIsBackendOnline(false);
      }
    };

    checkBackendStatus();
    const interval = setInterval(checkBackendStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const sidebarClasses = `fixed inset-y-0 left-0 z-40 w-64 transform transition-all duration-300 ease-in-out md:relative md:flex-shrink-0 ${
    isSidebarOpen ? 'translate-x-0 ml-0' : '-translate-x-full md:translate-x-0 md:-ml-64'
  } ${
    isDarkMode 
      ? 'bg-slate-900 border-r border-slate-800' 
      : 'bg-unnes-blue text-white shadow-xl'
  }`;

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={sidebarClasses}>
        <div className="flex items-center justify-between h-16 border-b border-white/10 px-4">
          <h1 className="text-lg font-black tracking-wider flex items-center gap-2 text-white">
            <LayoutDashboard className="w-5 h-5 text-unnes-yellow" />
            <span>Mental Health</span>
          </h1>
          <button 
            className="md:hidden p-1 text-white/70 hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-1">
          <p className={`text-xs font-semibold uppercase tracking-wider mb-4 mt-2 px-3 ${isDarkMode ? 'text-slate-500' : 'text-blue-300'}`}>
            Menu Utama
          </p>

          <button
            onClick={() => {
              setActiveTab('home');
              if (window.innerWidth < 768) setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'home'
                ? isDarkMode
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'bg-white/10 text-white border-l-4 border-unnes-yellow'
                : isDarkMode
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  : 'text-blue-100 hover:text-white hover:bg-white/5'
            }`}
          >
            <Home className="w-5 h-5" />
            Overview
          </button>

          <button
            onClick={() => {
              setActiveTab('inference');
              if (window.innerWidth < 768) setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'inference'
                ? isDarkMode
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'bg-white/10 text-white border-l-4 border-unnes-yellow'
                : isDarkMode
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  : 'text-blue-100 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sliders className="w-5 h-5" />
            Tab Pengujian
          </button>

          <button
            onClick={() => {
              setActiveTab('dashboard');
              if (window.innerWidth < 768) setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'dashboard'
                ? isDarkMode
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'bg-white/10 text-white border-l-4 border-unnes-yellow'
                : isDarkMode
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  : 'text-blue-100 hover:text-white hover:bg-white/5'
            }`}
          >
            <Activity className="w-5 h-5" />
            Dashboard Evaluasi
          </button>
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-white/10">
          <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-slate-950 border border-slate-800' : 'bg-black/20'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Database className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-blue-300'}`} />
              <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-blue-100'}`}>Backend Status</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isBackendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
              <span className={`text-xs font-mono ${isBackendOnline ? 'text-emerald-400' : 'text-red-400'}`}>
                {isBackendOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
