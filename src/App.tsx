import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { OverviewTab } from './components/OverviewTab';
import { InferenceLabTab } from './components/InferenceLabTab';
import { RealtimeDashboardTab } from './components/RealtimeDashboardTab';
import { HardwareSpecsModal } from './components/HardwareSpecsModal';
import { ResearchInfoModal } from './components/ResearchInfoModal';
import { ComparisonPrediction } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'dashboard' | 'inference'>('home');
  const [isSpecsModalOpen, setIsSpecsModalOpen] = useState<boolean>(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(window.innerWidth >= 768);
  const [inferenceHistory, setInferenceHistory] = useState<ComparisonPrediction[]>([]);

  return (
    <div className={`flex h-screen overflow-hidden font-sans antialiased transition-colors ${isDarkMode ? 'bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white' : 'bg-[#f4f7f6] text-slate-900 selection:bg-unnes-yellow selection:text-unnes-blue'
      }`}>

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Topbar
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          onOpenSpecsModal={() => setIsSpecsModalOpen(true)}
          onOpenInfoModal={() => setIsInfoModalOpen(true)}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Scrollable Canvas */}
        <main className={`flex-1 overflow-x-hidden overflow-y-auto ${isDarkMode ? 'bg-slate-950' : 'bg-slate-100/50'}`}>
          <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            <div className={activeTab === 'home' ? 'block' : 'hidden'}>
              <OverviewTab isDarkMode={isDarkMode} />
            </div>
            <div className={activeTab === 'dashboard' ? 'block' : 'hidden'}>
              <RealtimeDashboardTab isDarkMode={isDarkMode} history={inferenceHistory} />
            </div>
            <div className={activeTab === 'inference' ? 'block' : 'hidden'}>
              <InferenceLabTab 
                isDarkMode={isDarkMode} 
                onInferenceComplete={(res) => setInferenceHistory(prev => [...prev, res])} 
                onNavigateToDashboard={() => setActiveTab('dashboard')}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Hardware Specifications Modal */}
      <HardwareSpecsModal
        isOpen={isSpecsModalOpen}
        onClose={() => setIsSpecsModalOpen(false)}
        isDarkMode={isDarkMode}
      />

      {/* Research Info Modal */}
      <ResearchInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
