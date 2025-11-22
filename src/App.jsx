import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { BankProvider, useBank } from './context/BankContext';
import { MarketProvider } from './context/MarketContext';
import { Onboarding, Home, Earn, Save, Spend, Wallet, Learn, Passbook, MarketHome, Help } from './pages';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children }) => {
  const { state, loading } = useBank();
  if (loading) return <div>Loading...</div>;
  if (!state.user) return <Navigate to="/onboarding" />;
  return children;
};

import SplashScreen from './components/SplashScreen';
import HelpCarousel from './components/HelpCarousel';

const AppContent = () => {
  const { state, markHelpAsSeen } = useBank(); // Moved useBank hook here to access state for Navbar
  const navigate = useNavigate();
  return (
    <div className="app-container">
      {state.user && !state.hasSeenHelp && (
        <HelpCarousel
          onComplete={markHelpAsSeen}
          onClose={markHelpAsSeen}
        />
      )}

      {/* Global Help FAB */}
      {state.user && (
        <button
          onClick={() => navigate('/help')}
          style={{
            position: 'fixed',
            bottom: '90px', // Above Navbar (approx 80px height)
            right: '20px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: '#6C5CE7',
            color: 'white',
            border: 'none',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            fontSize: '24px',
            cursor: 'pointer',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ❓
        </button>
      )}

      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/earn" element={<ProtectedRoute><Earn /></ProtectedRoute>} />
        <Route path="/save" element={<ProtectedRoute><Save /></ProtectedRoute>} />
        <Route path="/spend" element={<ProtectedRoute><Spend /></ProtectedRoute>} />
        <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
        <Route path="/passbook" element={<ProtectedRoute><Passbook /></ProtectedRoute>} />
        <Route path="/learn" element={<ProtectedRoute><Learn /></ProtectedRoute>} />
        <Route path="/market" element={<ProtectedRoute><MarketHome /></ProtectedRoute>} />
        <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />
      </Routes>
      {state.user && <Navbar />}
    </div>
  );
};

function App() {
  const [showSplash, setShowSplash] = React.useState(true);

  return (
    <BankProvider>
      <Router>
        <MarketProvider>
          {showSplash ? (
            <SplashScreen onFinish={() => setShowSplash(false)} />
          ) : (
            <AppContent />
          )}
        </MarketProvider>
      </Router>
    </BankProvider>
  );
}

export default App;
