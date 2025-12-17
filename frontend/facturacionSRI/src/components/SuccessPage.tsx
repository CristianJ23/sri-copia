// src/pages/SuccessPage.tsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SuccessPage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // En un escenario real, aquí se verifica el estado del pago con la API de Stripe
        // (usando el 'session_id' que Stripe añade a la URL de redirección).
        
        // Mensaje de éxito visible por un momento:
        const timer = setTimeout(() => {
            // 🚨 Redirige al usuario al Home Page principal (ruta '/')
            navigate('/'); 
        }, 5000); // 5 segundos para que el usuario lea el mensaje
        
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div style={{ padding: '50px', textAlign: 'center', backgroundColor: '#e6ffe6', minHeight: '100vh' }}>
            <i className="fas fa-check-circle" style={{ fontSize: '5rem', color: '#4CAF50' }}></i>
            <h1 style={{ color: '#4CAF50', marginTop: '20px' }}>¡Pago Exitoso!</h1>
            <p style={{ fontSize: '1.2rem', color: '#333' }}>
                Tu suscripción ha sido activada. Serás redirigido a la página principal en breve.
            </p>
            {/* Si necesitas verificar parámetros:
            <p>Session ID: {new URLSearchParams(window.location.search).get('session_id')}</p>
            */}
        </div>
    );
};

export default SuccessPage;