// src/pages/HomePage.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom'; // Para la navegación
import '@fortawesome/fontawesome-free/css/all.min.css'; // Iconos
import '../styles/HomePage.css'; // CSS dedicado

const HomePage: React.FC = () => {
    const navigate = useNavigate(); // Hook para la navegación

    const handleNavigateToPlans = () => {
        // Redirige a la ruta donde se muestran los planes de suscripción
        navigate('/planes'); // 🚨 ASEGÚRATE DE QUE ESTA RUTA COINCIDA CON LA DE TUS PLANES
    };

    return (
        <div className="home-page-container">
            <header className="home-header">
                <div className="header-content">
                    <img src="https://via.placeholder.com/60x60?text=SRI" alt="Logo SRI" className="sri-logo"/>
                    <h1 className="main-title">Facturación Electrónica <span className="highlight">SRI</span></h1>
                    <p className="subtitle">Simplifica tus trámites fiscales en Ecuador</p>
                </div>
            </header>

            <section className="hero-section">
                <div className="hero-content">
                    <h2 className="hero-headline">Tu socio estratégico para el cumplimiento tributario</h2>
                    <p className="hero-description">
                        Gestiona tus facturas electrónicas, retenciones y guías de remisión de forma ágil, segura y conforme a la normativa del SRI.
                    </p>
                    <button 
                        className="btn-primary hero-button"
                        onClick={handleNavigateToPlans}
                    >
                        <i className="fas fa-rocket button-icon"></i> Explora Nuestros Planes
                    </button>
                    <button className="btn-secondary hero-button-secondary">
                        <i className="fas fa-info-circle button-icon"></i> Más Información
                    </button>
                </div>
                {/* Aquí podrías añadir una imagen o ilustración
                  <div className="hero-image-placeholder">
                    <img src="/path/to/your/sri-illustration.svg" alt="Ilustración SRI" />
                  </div>
                */}
            </section>

            <section className="features-section">
                <h2 className="section-title">¿Por qué elegir nuestro sistema?</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <i className="fas fa-cogs feature-icon-large"></i>
                        <h3>Fácil de Usar</h3>
                        <p>Interfaz intuitiva diseñada para profesionales sin complicaciones.</p>
                    </div>
                    <div className="feature-card">
                        <i className="fas fa-shield-alt feature-icon-large"></i>
                        <h3>Seguridad Garantizada</h3>
                        <p>Tus datos protegidos con los más altos estándares de seguridad.</p>
                    </div>
                    <div className="feature-card">
                        <i className="fas fa-chart-line feature-icon-large"></i>
                        <h3>Reportes Inteligentes</h3>
                        <p>Genera reportes detallados para una mejor toma de decisiones.</p>
                    </div>
                    <div className="feature-card">
                        <i className="fas fa-headset feature-icon-large"></i>
                        <h3>Soporte Dedicado</h3>
                        <p>Equipo de soporte listo para ayudarte en cada paso.</p>
                    </div>
                </div>
            </section>

            <section className="cta-section">
                <div className="cta-content">
                    <h2>¿Listo para digitalizar tu gestión tributaria?</h2>
                    <p>Únete a cientos de profesionales que ya confían en nuestra plataforma.</p>
                    <button 
                        className="btn-primary cta-button"
                        onClick={handleNavigateToPlans}
                    >
                        <i className="fas fa-check-circle button-icon"></i> Empezar Ahora
                    </button>
                </div>
            </section>

            <footer className="home-footer">
                <p>&copy; {new Date().getFullYear()} Tu Sistema SRI. Todos los derechos reservados.</p>
                <div className="footer-links">
                    <a href="/politica-privacidad">Política de Privacidad</a>
                    <a href="/terminos-servicio">Términos de Servicio</a>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;