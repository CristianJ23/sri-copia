// src/App.tsx (Ejemplo con React Router DOM)

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importa tus componentes
import HomePage from './components/HomePage'; // 🚨 Nuevo componente
import PlanList from './components/PlanList'; // Tu lista de planes existente
import SuccessPage from './components/SuccessPage';
import CancelPage from './components/CancelPage';
import LoginPage from './components/LoginPage';


function App() {
  return (
    <Router>
      <Routes>

        <Route path="/login" element={<LoginPage />} />

        {/* 🚨 Redireccionando la Home Page al path raíz (/) */}
        <Route path="/" element={<HomePage />} /> 
        
        {/* La página de planes, para que el botón de Home funcione */}
        <Route path="/planes" element={<PlanList />} />
        
        {/* La URL que Stripe golpea primero */}
        <Route path="/pago-exitoso" element={<SuccessPage />} />
        
        {/* La URL si el usuario cancela en Stripe */}
        <Route path="/pago-cancelado" element={<CancelPage />} />
        
        {/* Puedes añadir una redirección legacy o un alias para /home si el botón en planes.ts te fuerza a usarlo */}
        <Route path="/home" element={<HomePage />} /> 
      </Routes>
    </Router>
  );
}

export default App;