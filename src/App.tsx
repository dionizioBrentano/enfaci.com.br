import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ProcedurePage } from './pages/ProcedurePage';
import { ServiceRequestsPage } from './pages/ServiceRequestsPage';
import { LoginPage } from './pages/LoginPage';
import { AccountPage } from './pages/AccountPage';
import { MfaPage } from './pages/MfaPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/servicos/:slug" element={<ProcedurePage />} />
        <Route path="/solicitacoes" element={<ServiceRequestsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/conta" element={<AccountPage />} />
        <Route path="/mfa" element={<MfaPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
