import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PegaSetup from "./pages/PegaSetup";
import ScholarsDashboard from "./pages/ScholarsDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PegaSetup />} />
        <Route path="/pegaxy-dashboard" element={<PegaSetup />} />
        <Route path="/pegaxy-dashboard/scholars" element={<ScholarsDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
