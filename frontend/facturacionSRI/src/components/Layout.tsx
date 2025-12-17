// src/components/Layout.tsx

import React from 'react';
import type { ReactNode } from 'react';
import '../styles/Layout.css'; // 🚨 IMPORTAR EL ARCHIVO CSS DEDICADO

// Define el tipo para las props (los hijos que envolverá)
interface LayoutProps {
  children?: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-shell">
      {/* --- HEADER / NAVBAR --- */}
      <header className="app-header">
        <div className="header-container">
          <h1 className="app-title">
            SRI <span className="title-highlight">Facturación</span>
          </h1>
          <nav className="app-nav">
            <a href="#" className="nav-link">
              Inicio
            </a>
            <a href="#" className="nav-link">
              Mi Cuenta
            </a>
          </nav>
        </div>
      </header>

      {/* --- MAIN CONTENT (Aquí se inyectará PlanList) --- */}
      <main className="app-main">
        {children}
      </main>

      {/* --- FOOTER --- */}
      <footer className="app-footer">
        <div className="footer-container">
          <p className="footer-text">&copy; {new Date().getFullYear()} SRI Facturación. Todos los derechos reservados.</p>
          <div className="footer-links">
            <a href="#" className="footer-link">Política de Privacidad</a>
            <span className="footer-separator"> | </span>
            <a href="#" className="footer-link">Términos de Servicio</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;