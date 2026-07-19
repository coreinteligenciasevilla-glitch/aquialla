import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { FeedReels } from './components/FeedReels';
import { LoginScreen } from './components/LoginScreen';

function AppContent() {
  const { currentUser, theme } = useApp();

  if (!currentUser) {
    return <LoginScreen />;
  }

  return (
    <div className={`w-full h-screen relative font-sans overflow-hidden transition-colors duration-500 ${
      theme === 'dark' ? 'bg-zinc-950 text-zinc-100' : 'bg-[#f4f4f4] text-zinc-900'
    }`}>
      {/* Native Fullscreen viewport content */}
      <div className="w-full h-full relative overflow-hidden">
        <FeedReels />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
