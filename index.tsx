
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './context/LanguageContext';
import { WalletProvider } from './context/WalletContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <WalletProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </WalletProvider>
  </React.StrictMode>
);
