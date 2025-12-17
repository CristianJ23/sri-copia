// src/api/planes.ts

// 1. DEFINICIÓN DE INTERFACES

export interface Plan {
    firebase_id: string;
    pln_codigo: string;
    pln_nombre: string;
    pln_descripcion?: string | null;
    pln_precio: string; 
    pln_duracion_dias: number;
    pln_estado: string;
    pln_numero_cuentas: number;
}

// 🚨 Interfaz para la respuesta que esperamos de la API de Checkout (simulada)
export interface CheckoutResponse {
    success: boolean;
    message: string;
    redirect_url: string; // La URL a la que el navegador debe redirigir (Stripe)
}


// Asegúrate de que esta URL coincida con la de tu servidor Django (normalmente puerto 8000)
const API_URL: string = 'http://localhost:8000/api/v1/'; 

// 2. FUNCIÓN PARA OBTENER PLANES (DEJA ESTA FUNCIÓN COMO ESTÁ)
export const fetchPlanes = async (): Promise<Plan[]> => {
    try {
        const response = await fetch(`${API_URL}planes/`);
        
        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            const errorMessage = errorBody.detail || errorBody.error || response.statusText;
            
            throw new Error(`Error HTTP ${response.status}: ${errorMessage}`);
        }
        
        const data: Plan[] = await response.json();
        return data;
        
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error al obtener los planes:", error.message);
            throw error;
        } else {
            console.error("Error desconocido al obtener los planes:", error);
            throw new Error("Ocurrió un error desconocido.");
        }
    }
};


// src/api/planes.ts (VERSIÓN INSEGURA PARA PRUEBAS RÁPIDAS)

// 🚨🚨🚨 NUNCA USAR CLAVE SECRETA EN EL FRONTEND EN PRODUCCIÓN 🚨🚨🚨
const STRIPE_SECRET_KEY: string = 'sk_test_51SeIDO2edvNXBgVWK9bROGPFeUrjNqd4z7cl4q1qSma6IKo8Ih9qCW8V5nw1GpOG9vA6o6hnxnlKyXNgwaRuKTwn003WURkTvP'; 
const STRIPE_API_URL: string = 'https://api.stripe.com/v1/checkout/sessions';

// 🚨 Debes obtener un Price ID de tu Dashboard de Stripe
const MOCK_STRIPE_PRICE_ID: string = 'price_1P5sC7E0sd8HnMA2nuhGMUFxTZPovFU9kiRToVroG9laDR0EH3ZxArqmpmXSfnA2AeHW5xYFegWReJQwBncBWU0B00DFxkGYSw'; 
// Reemplaza con un ID válido, ej: price_1O...

// URLs de retorno para la prueba
const SUCCESS_URL: string = 'http://localhost:5173/pago/exitoso'; // 👈 Apunta a la página de éxito
const CANCEL_URL: string = 'http://localhost:5173/pago/cancelado';

// ... (Interfaces Plan y CheckoutResponse existentes)

// 🚨 ELIMINAR O IGNORAR EL fetchPlanes que llama a Django si no lo usas

// 🚨 Nueva Lógica de Checkout Directa a Stripe
export const startCheckout = async (planId: string, planNombre: string, price: number): Promise<CheckoutResponse> => {
    
    // Convertir precio a centavos, como espera Stripe
    const unit_amount_cents = Math.round(price * 100); 

    const bodyData = new URLSearchParams({
        'payment_method_types[]': 'card',
        'mode': 'payment', // Cambiar a 'subscription' si es recurrente
        
        // Usar line_items para el precio (usaremos el ID de Mock para simplificar)
        'line_items[0][price_data][currency]': 'usd',
        'line_items[0][price_data][product_data][name]': planNombre,
        'line_items[0][price_data][unit_amount]': unit_amount_cents.toString(),
        'line_items[0][quantity]': '1',

        // Alternativa: Si ya tienes el Price ID de Stripe (RECOMENDADO)
        // 'line_items[0][price]': MOCK_STRIPE_PRICE_ID,
        // 'line_items[0][quantity]': '1',
        
        'success_url': SUCCESS_URL,
        'cancel_url': CANCEL_URL,
        'metadata[plan_id]': planId,
    }).toString();


    try {
        const response = await fetch(STRIPE_API_URL, {
            method: 'POST',
            headers: {
                // Autenticación con la clave secreta
                'Authorization': `Bearer ${STRIPE_SECRET_KEY}`, 
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: bodyData,
        });

        const data = await response.json();

        if (!response.ok || data.url === undefined) {
            console.error("Error de Stripe API:", data);
            throw new Error(data.error?.message || 'Fallo al crear la sesión de Stripe.');
        }

        return {
            success: true,
            message: "Sesión de Stripe creada.",
            redirect_url: data.url 
        };
    } catch (error) {
        console.error("Error en la llamada a Stripe:", error);
        throw new Error(`Error en el pago: ${(error as Error).message}`);
    }
};

