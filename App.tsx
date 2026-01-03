import React, { useState } from 'react';
import Hero from './components/Hero';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { ViewState } from './types';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.LANDING);

  const navigateToLogin = () => setCurrentView(ViewState.LOGIN);
  const navigateToDashboard = () => setCurrentView(ViewState.DASHBOARD);
  const navigateToLanding = () => setCurrentView(ViewState.LANDING);

  return (
    <>
      {currentView === ViewState.LANDING && (
        <Hero onGetStarted={navigateToLogin} />
      )}
      {currentView === ViewState.LOGIN && (
        <Login onLogin={navigateToDashboard} onBack={navigateToLanding} />
      )}
      {currentView === ViewState.DASHBOARD && (
        <Dashboard onLogout={navigateToLanding} />
      )}
    </>
  );
}

export default App;