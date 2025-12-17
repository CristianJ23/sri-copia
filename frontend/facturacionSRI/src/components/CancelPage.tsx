// src/pages/CancelPage.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const CancelPage: React.FC = () => {
    const navigate = useNavigate();

    const handleRetry = () => {
        // Redirige de vuelta a la lista de planes
        navigate('/planes'); 
    };

    const handleGoHome = () => {
        // Redirige al Home Page principal
        navigate('/'); 
    };

    return (
        <div style={{ 
            padding: '50px', 
            textAlign: 'center', 
            backgroundColor: '#fff0f0', 
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <i className="fas fa-times-circle" style={{ 
                fontSize: '5rem', 
                color: '#DC3545', // Rojo para error/cancelación
                marginBottom: '20px'
            }}></i>
            <h1 style={{ color: '#DC3545', marginTop: '10px' }}>Pago Cancelado</h1>
            <p style={{ fontSize: '1.2rem', color: '#333', maxWidth: '600px', lineHeight: '1.6' }}>
                Parece que cancelaste la transacción o el pago no pudo ser procesado.
                Puedes volver a la lista de planes para intentar el pago con otra opción.
            </p>
            
            <div style={{ marginTop: '30px' }}>
                <button 
                    onClick={handleRetry}
                    style={{
                        padding: '12px 25px',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        color: 'white',
                        backgroundColor: '#FFC107', // Amarillo/Naranja para retry
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        marginRight: '15px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        transition: 'background-color 0.3s'
                    }}
                >
                    <i className="fas fa-redo-alt" style={{ marginRight: '8px' }}></i> Volver a Intentar
                </button>
                <button 
                    onClick={handleGoHome}
                    style={{
                        padding: '12px 25px',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        color: '#333',
                        backgroundColor: '#EAEAEA',
                        border: '1px solid #CCC',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                    }}
                >
                    <i className="fas fa-home" style={{ marginRight: '8px' }}></i> Ir a Inicio
                </button>
            </div>
        </div>
    );
};

export default CancelPage;