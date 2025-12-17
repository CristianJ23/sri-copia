// src/types/custom.d.ts

// Esto le dice al compilador de TypeScript que el módulo '*.js' es seguro de importar
declare module '*.js';

// O más específico (mejor):
declare module '../api/planes' {
    export function fetchPlanes(): Promise<any>;
    // Añade otras funciones que exportes (ej. startCheckout)
}