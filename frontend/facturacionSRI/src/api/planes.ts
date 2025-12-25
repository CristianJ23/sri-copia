// src/api/planes.ts
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';

export interface Plan {
    id: string;             // ID del producto en Firebase
    name: string;           // Nombre en Stripe
    description: string;    // Descripción en Stripe
    active: boolean;        // Estado
    price_id: string;       // El ID 'price_...' para el checkout
    unit_amount: number;    // Precio en centavos (ej: 1000)
    currency: string;       // Moneda (usd)
}

export const startCheckout = async (stripePriceId: string): Promise<string> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Debes estar logueado en Firebase");

    try {
        console.log("📝 Intentando crear documento para UID:", user.uid);
        
        // Creamos el documento
        const docRef = await addDoc(collection(db, 'users', user.uid, 'checkout_sessions'), {
            price: stripePriceId,
            success_url: window.location.origin + '/pago-exitoso',
            cancel_url: window.location.origin + '/pago-cancelado',
            mode: 'subscription',
        });

        console.log("📄 Documento creado con ID:", docRef.id);

        return new Promise((resolve, reject) => {
            // Ponemos un temporizador: si en 10 segundos no hay URL, cancelamos
            const timeout = setTimeout(() => {
                unsubscribe();
                reject(new Error("La extensión de Stripe no respondió a tiempo. Revisa los logs en Firebase."));
            }, 10000);

            const unsubscribe = onSnapshot(docRef, (snap) => {
                const data = snap.data();
                console.log("👀 Datos actuales del documento:", data);
                
                if (data?.url) {
                    clearTimeout(timeout);
                    unsubscribe();
                    resolve(data.url);
                } else if (data?.error) {
                    clearTimeout(timeout);
                    unsubscribe();
                    reject(new Error(data.error.message));
                }
            });
        });
    } catch (err: any) {
        console.error("❌ ERROR CRÍTICO EN FIREBASE:", err);
        throw err;
    }
};

export const fetchPlanes = async (): Promise<Plan[]> => {
    try {
        const response = await fetch('http://localhost:8000/api/v1/planes/');
        if (!response.ok) {
            throw new Error("Error al cargar planes desde Django");
        }
        const data = await response.json();
        return data as Plan[];
    } catch (error) {
        console.error("Error en fetchPlanes:", error);
        throw error;
    }
};