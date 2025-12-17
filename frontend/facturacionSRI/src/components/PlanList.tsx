// src/components/PlanList.tsx - LISTO PARA LA PRUEBA DE STRIPE DIRECTA

import React, { useState, useEffect } from 'react';
// Importar la función de checkout y la interfaz Plan
import { fetchPlanes, startCheckout, type Plan } from '../api/planes'; 
import '@fortawesome/fontawesome-free/css/all.min.css'; 
import '../styles/PlanList.css'; 

const PlanList = () => {
    // Tipado de estados
    const [planes, setPlanes] = useState<Plan[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);

    useEffect(() => {
        // Lógica de carga de planes (fetchPlanes)
        const loadPlanes = async () => {
             try {
                const data = await fetchPlanes(); 
                setPlanes(data);
                setError(null);
            } catch (err) {
                const errorMessage = (err as Error).message || "Error desconocido en el fetch.";
                setError(`No se pudieron cargar los planes. (Detalles: ${errorMessage})`);
            } finally {
                setLoading(false);
            }
        };
        loadPlanes();
    }, []);

    // 🚨 FUNCIÓN DE SUSCRIPCIÓN MODIFICADA PARA ACEPTAR EL OBJETO PLAN COMPLETO
    const handleSubscribe = async (plan: Plan) => {
        if (processingPlanId) return; 

        setProcessingPlanId(plan.firebase_id);
        
        try {
            // 1. Convertir el precio de string a número para Stripe
            const priceValue = parseFloat(plan.pln_precio);
            
            // 2. Llamar a startCheckout, enviando el ID, Nombre y el PRECIO (directo a Stripe)
            // Esta llamada usa ahora la clave secreta de Stripe que está "quemada" en planes.ts.
            const result = await startCheckout(plan.firebase_id, plan.pln_nombre, priceValue);
            
            // 3. Redirigir al usuario a la URL de Stripe Checkout
            console.log(`Redirigiendo a: ${result.redirect_url}`);
            window.location.href = result.redirect_url; 
            
        } catch (error) {
            alert(`Fallo en la suscripción para ${plan.pln_nombre}: ${(error as Error).message}`);
            console.error(error);
        } finally {
            // Este bloque se ejecuta solo si falla la llamada a startCheckout
            setProcessingPlanId(null);
        }
    };
    
    // Función auxiliar para determinar la clase de color basada en el nombre del plan
    const getPlanClass = (planNombre: string) => {
        const name = planNombre.toLowerCase();
        if (name.includes('premium')) return 'plan-premium';
        if (name.includes('pro') || name.includes('profesional')) return 'plan-pro';
        return 'plan-basic'; // Clase por defecto
    };

    // --- Estados de la Interfaz (Loading/Error logic remains the same) ---
    if (loading) return (
        // ... (Loading JSX)
        <div className="status-message loading">
            <i className="fas fa-spinner fa-spin status-icon"></i>
            <p>⏳ Cargando planes desde Django...</p>
        </div>
    );
    
    if (error) return (
        // ... (Error JSX)
        <div className="status-message error-message">
            <i className="fas fa-times-circle status-icon"></i>
            <h3 className="error-title">Error de Conexión</h3>
            <p className="error-details">{error}</p>
        </div>
    );

    // --- Renderizado de los Planes ---
    return (
        <div className="pricing-section">
            <div className="pricing-container">
                {/* Encabezado Profesional */}
                <div className="section-header">
                    <h2 className="section-title">Planes de Suscripción</h2>
                    <p className="section-subtitle">
                        Elige la solución perfecta que impulsa tu negocio jurídico.
                    </p>
                </div>

                {planes.length === 0 ? (
                    <div className="no-plans-message">
                        Aún no hay planes activos disponibles en la base de datos.
                    </div>
                ) : (
                    <div className="plans-grid">
                        {planes.map((plan) => {
                            const isProcessing = processingPlanId === plan.firebase_id;

                            return (
                                <div 
                                    key={plan.firebase_id} 
                                    className={`plan-card ${getPlanClass(plan.pln_nombre)}`}
                                >
                                    {/* ... (Contenido de la tarjeta) ... */}
                                    <div className="plan-header">
                                        <h3 className="plan-name">{plan.pln_nombre}</h3>
                                        <span className="plan-code">Código: {plan.pln_codigo}</span>
                                    </div>
                                    <div className="plan-price-block">
                                        <span className="price-currency">$</span>
                                        <span className="price-amount">{parseFloat(plan.pln_precio).toFixed(2)}</span>
                                        <span className="price-period">/ {plan.pln_duracion_dias} días</span>
                                    </div>
                                    {plan.pln_descripcion && <p className="plan-description">{plan.pln_descripcion}</p>}
                                    <ul className="plan-features-list">
                                        <li className="feature-item"><i className="fas fa-check feature-icon"></i><span>Hasta <strong>{plan.pln_numero_cuentas}</strong> Usuario{plan.pln_numero_cuentas !== 1 ? 's' : ''}</span></li>
                                        <li className="feature-item"><i className="fas fa-check feature-icon"></i><span>Facturación Electrónica SRI</span></li>
                                        <li className="feature-item"><i className="fas fa-check feature-icon"></i><span>Soporte Prioritario por Email</span></li>
                                    </ul>

                                    {/* BOTÓN DE ACCIÓN: 🚨 Ahora pasamos el objeto 'plan' completo */}
                                    <button 
                                        className={`btn-subscribe ${isProcessing ? 'disabled' : ''}`}
                                        onClick={() => handleSubscribe(plan)} 
                                        disabled={isProcessing} 
                                    >
                                        {isProcessing ? (
                                            <>
                                                <i className="fas fa-spinner fa-spin button-icon"></i>
                                                Cargando...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-shopping-cart button-icon"></i>
                                                Suscribirse Ahora
                                            </>
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlanList;