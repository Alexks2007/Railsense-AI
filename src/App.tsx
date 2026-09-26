import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { GateDetails } from './pages/GateDetails';
import { Alerts } from './pages/Alerts';
import { EmergencyMode } from './pages/EmergencyMode';
import { Reports } from './pages/Reports';
import { Favorites } from './pages/Favorites';

export const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout searchQuery={searchQuery} onSearchChange={(q) => setSearchQuery(q)} />
          }
        >
          <Route index element={<Dashboard globalSearchQuery={searchQuery} />} />
          <Route path="gate/:id" element={<GateDetails />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="emergency" element={<EmergencyMode />} />
          <Route path="reports" element={<Reports />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="*" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
