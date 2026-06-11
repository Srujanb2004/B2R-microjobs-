import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ApplicantReview from './pages/ApplicantReview';
import JobPayment from './pages/JobPayment';
import TakerDashboard from './pages/TakerDashboard';
import VerificationPage from './pages/VerificationPage';
import ProtectedRoute from './components/ProtectedRoute';
import useAuthStore from './store/useAuthStore';

function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Protected Routes */}
          <Route path="/verify" element={<ProtectedRoute><VerificationPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/applicants/:jobId" element={<ProtectedRoute><ApplicantReview /></ProtectedRoute>} />
          <Route path="/payment/:jobId" element={<ProtectedRoute><JobPayment /></ProtectedRoute>} />
          <Route path="/taker-dashboard" element={<ProtectedRoute><TakerDashboard /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
