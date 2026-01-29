import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MemeBackground } from './components/MemeBackground';
import { Home } from './pages/Home';
import { FundList } from './pages/FundList';
import { FundDetail } from './pages/FundDetail';
import { Upload } from './pages/Upload';
import { Fund, ViewState } from './types';
import { MOCK_FUNDS } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [funds, setFunds] = useState<Fund[]>(MOCK_FUNDS);

  const handleNavigate = (view: ViewState) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView(view);
  };

  const handleSelectFund = (fund: Fund) => {
    setSelectedFund(fund);
    handleNavigate('detail');
  };

  const handleUpload = (newFund: Fund) => {
    setFunds([newFund, ...funds]);
    handleNavigate('list');
  };

  // Simple router
  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'list':
        return <FundList funds={funds} onSelect={handleSelectFund} />;
      case 'detail':
        return selectedFund ? (
          <FundDetail fund={selectedFund} onBack={() => handleNavigate('list')} />
        ) : (
          <FundList funds={funds} onSelect={handleSelectFund} />
        );
      case 'upload':
        return <Upload onUpload={handleUpload} />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  const isHome = currentView === 'home';

  return (
    <div className="min-h-screen bg-[#030305] text-white font-sans selection:bg-primary selection:text-black flex flex-col relative">
      {/* MemeBackground only visible on non-home pages */}
      {!isHome && <MemeBackground />}
      
      <Navbar currentView={currentView} onNavigate={handleNavigate} />
      
      <main className="animate-fade-in flex-grow relative z-10">
        {renderView()}
      </main>

      {/* Footer - Dynamic based on page */}
      {isHome ? (
        // High Visibility Neo-Brutalist Footer for Home
        <footer className="border-t-4 border-black bg-primary py-8 mt-auto shadow-[0_-4px_0px_#000] relative z-50">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-black font-black font-mono text-sm uppercase">
            <div className="flex items-center gap-3 bg-white px-3 py-1 rounded border-2 border-black shadow-[2px_2px_0px_#000]">
              <span className="w-3 h-3 bg-green-500 border-2 border-black animate-pulse"></span>
              <span>SYSTEM ONLINE // ETH_CHIANGMAI</span>
            </div>
            
            <div className="flex gap-6 text-black/80">
              <span className="cursor-pointer hover:text-white hover:underline decoration-2 decoration-black transition-colors">Twitter</span>
              <span className="cursor-pointer hover:text-white hover:underline decoration-2 decoration-black transition-colors">Telegram</span>
              <span className="cursor-pointer hover:text-white hover:underline decoration-2 decoration-black transition-colors">Docs</span>
            </div>

            <div className="text-xs font-bold opacity-80">
              © 2024 FLOWFUND. DEGEN MODE ACTIVE.
            </div>
          </div>
        </footer>
      ) : (
        // Minimal Low-Profile Footer for App Pages
        <footer className="border-t border-white/10 bg-[#08080a] py-4 mt-auto relative z-50">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-gray-500 font-mono text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>v1.0.4 stable</span>
            </div>
            <div className="flex gap-4">
              <span className="hover:text-primary cursor-pointer transition-colors">Help</span>
              <span className="hover:text-primary cursor-pointer transition-colors">Terms</span>
              <span>© FLOWFUND</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;