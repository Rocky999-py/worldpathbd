
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

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/author" element={<AdminDashboard />} />
          <Route path="/add-fund" element={<FundPanel />} />
          <Route path="/guide/:countryId/:visaType" element={<VisaGuide />} />
          <Route path="/documents" element={<DocumentAssistant />} />
          <Route path="/chat" element={<ChatAssistant />} />
          <Route path="/booking-software" element={<AppointmentSoftware />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
