import React, { useState, useEffect } from "react";
import { fetchPlanes, startCheckout } from "../api/planes";
import type { Plan } from "../api/planes";
import { motion } from "framer-motion";
import "@fortawesome/fontawesome-free/css/all.min.css";

const PlanList: React.FC = () => {
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchPlanes();
        setPlanes(data.sort((a, b) => a.unit_amount - b.unit_amount));
      } catch (err) {
        setError("No se pudieron cargar los planes. Intenta más tarde.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSubscribe = async (priceId: string, productId: string) => {
    if (!priceId) return;
    setProcessingId(productId);
    try {
      const checkoutUrl = await startCheckout(priceId);
      window.location.href = checkoutUrl;
    } catch (err) {
      alert("Error: " + (err as Error).message);
      setProcessingId(null);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full"
        />
      </div>
    );

  if (error)
    return (
      <div className="text-center py-20 text-red-500 font-bold">{error}</div>
    );

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen py-20 px-4 font-sans">
      <div className="max-w-6xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
            Planes de Suscripción
          </h2>
          <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full" />
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {planes.map((plan, index) => {
            const isPopular = index === 1;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className={`flex flex-col bg-white rounded-3xl p-8 transition-all border ${
                  isPopular
                    ? "border-blue-500 shadow-2xl shadow-blue-100 ring-4 ring-blue-50"
                    : "border-slate-100 shadow-xl shadow-slate-200/50"
                }`}
              >
                {isPopular && (
                  <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full w-fit mb-6 tracking-widest uppercase mx-auto">
                    Recomendado
                  </span>
                )}

                <div className="flex items-start justify-center text-slate-900">
                  <span className="text-2xl font-bold mt-2">$</span>
                  {/* Cambiamos toFixed(0) por toFixed(2) */}
                  <span className="text-7xl font-black tracking-tighter">
                    {Math.floor(plan.unit_amount / 100)}
                  </span>
                  <div className="text-left ml-1 mt-4">
                    {/* Extraemos solo los decimales para que se vean más pequeños */}
                    <p className="text-2xl font-bold leading-none">
                      .{(plan.unit_amount % 100).toString().padStart(2, "0")}
                    </p>
                    <p className="text-xs text-slate-400 font-medium uppercase mt-1">
                      {plan.currency} / mes
                    </p>
                  </div>
                </div>

                {/* Descripción Real de Stripe */}
                <div className="flex-grow">
                  <div className="h-px bg-slate-50 mb-8" />
                  {plan.description ? (
                    <p className="text-slate-600 text-sm leading-relaxed text-center px-4">
                      {plan.description}
                    </p>
                  ) : (
                    <p className="text-slate-300 text-xs italic text-center">
                      Incluye todas las funciones del plan {plan.name}.
                    </p>
                  )}
                </div>

                <div className="mt-12">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSubscribe(plan.price_id, plan.id)}
                    disabled={processingId === plan.id}
                    className={`w-full py-4 rounded-2xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 ${
                      isPopular
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200"
                        : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200"
                    } ${
                      processingId === plan.id
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {processingId === plan.id ? (
                      <i className="fas fa-circle-notch fa-spin"></i>
                    ) : (
                      <>
                        <span>Suscribirse ahora</span>
                        <i className="fas fa-chevron-right text-[10px] opacity-50"></i>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <footer className="mt-16 text-center text-slate-400 text-xs">
          <p>
            Pagos procesados de forma segura por <strong>Stripe</strong>
          </p>
          <div className="flex justify-center gap-4 mt-4 text-lg grayscale opacity-50">
            <i className="fab fa-cc-visa"></i>
            <i className="fab fa-cc-mastercard"></i>
            <i className="fab fa-cc-amex"></i>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PlanList;
