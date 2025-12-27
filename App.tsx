
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import VisaGuide from './pages/VisaGuide';
import DocumentAssistant from './pages/DocumentAssistant';
import ChatAssistant from './pages/ChatAssistant';
import AppointmentSoftware from './pages/AppointmentSoftware';
import FundPanel from './pages/FundPanel';
import AdminDashboard from './pages/AdminDashboard';
import Auth from './pages/Auth';
import { useWallet } from './context/WalletContext';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          {/* Main Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/guide/:countryId/:visaType" element={<VisaGuide />} />
          <Route path="/documents" element={<DocumentAssistant />} />
          <Route path="/chat" element={<ChatAssistant />} />
          
          {/* Feature Routes */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/add-fund" element={<FundPanel />} />
          <Route path="/booking-software" element={<AppointmentSoftware />} />
          
          {/* Management Route */}
          <Route path="/author" element={<AdminDashboard />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
