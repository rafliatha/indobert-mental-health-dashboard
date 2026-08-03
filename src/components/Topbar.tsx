import React from 'react';
import { Menu, Sun, Moon, Cpu } from 'lucide-react';

interface TopbarProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onOpenSpecsModal: () => void;
  onOpenInfoModal: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (val: boolean) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  isDarkMode,
  setIsDarkMode,
  onOpenSpecsModal,
  onOpenInfoModal,
  isSidebarOpen,
  setIsSidebarOpen
}) => {
  return (
    <header className={`h-16 flex items-center justify-between px-4 lg:px-8 border-b transition-colors z-20 ${
      isDarkMode 
        ? 'bg-slate-900 border-slate-800 text-white' 
        : 'bg-white border-slate-200 text-slate-800 shadow-sm'
    }`}>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="hidden sm:flex flex-col">
          <span className="text-sm font-bold">Klasifikasi Kesehatan Mental Twitter</span>
          <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Model Evaluasi & Analisis Komparatif</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onOpenInfoModal}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
            isDarkMode
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              : 'bg-slate-50 hover:bg-slate-100 text-unnes-blue border-slate-200'
          }`}
          title="Info Skripsi"
        >
          <span className="hidden sm:inline">Info Penelitian</span>
        </button>

        <button
          onClick={onOpenSpecsModal}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
            isDarkMode
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              : 'bg-slate-50 hover:bg-slate-100 text-unnes-blue border-slate-200'
          }`}
          title="Spesifikasi Hardware"
        >
          <Cpu className="w-4 h-4 text-cyan-500" />
          <span className="hidden sm:inline">Hardware Specs</span>
        </button>

        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-2 rounded-lg border transition-all ${
            isDarkMode
              ? 'bg-slate-800 hover:bg-slate-700 text-yellow-300 border-slate-700'
              : 'bg-slate-50 hover:bg-slate-100 text-unnes-blue border-slate-200'
          }`}
          title={isDarkMode ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-unnes-blue" />}
        </button>
      </div>
    </header>
  );
};
