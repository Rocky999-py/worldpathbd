
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import VisaGuide from './pages/VisaGuide';
import DocumentAssistant from './pages/DocumentAssistant';
import ChatAssistant from './pages/ChatAssistant';
import AppointmentSoftware from './pages/AppointmentSoftware';
import Auth from './pages/Auth';
import { useAuth } from './context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/guide/:countryId/:visaType" element={
            <ProtectedRoute>
              <VisaGuide />
            </ProtectedRoute>
          } />
          <Route path="/documents" element={
            <ProtectedRoute>
              <DocumentAssistant />
            </ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute>
              <ChatAssistant />
            </ProtectedRoute>
          } />
          <Route path="/booking-software" element={
            <ProtectedRoute>
              <AppointmentSoftware />
            </ProtectedRoute>
          } />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
