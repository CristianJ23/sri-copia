import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig'; 
import { signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

axios.defaults.withCredentials = true;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    const syncWithFirebase = async () => {
      // Si ya hay usuario, dejamos de cargar
      if (auth.currentUser) {
        setIsSyncing(false);
        return;
      }

      try {
        console.log("🔄 Iniciando sincronización...");
        const response = await axios.get('http://localhost:8000/api/v1/get-firebase-token/', {
          withCredentials: true 
        });

        const { firebase_token } = response.data;
        console.log("🎟️ Token recibido");

        const userCredential = await signInWithCustomToken(auth, firebase_token);
        console.log("✅ Sincronizado como:", userCredential.user.uid);
      } catch (error: any) {
        console.error("❌ Error de sincronización:", error.response?.data || error.message);
      } finally {
        setIsSyncing(false);
      }
    };

    syncWithFirebase();

    // Escuchar cambios de estado para asegurar que React se entere
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setIsSyncing(false);
    });

    return () => unsubscribe();
  }, []);

  const handleNavigateToPlans = () => {
    if (isSyncing) {
      alert("Estamos preparando tu conexión segura con SRI-Cloud...");
      return;
    }
    if (!auth.currentUser) {
      alert("No se detectó sesión activa. Por favor, inicia sesión de nuevo.");
      navigate('/login');
      return;
    }
    navigate('/planes');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <header className="bg-white shadow-sm py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="https://via.placeholder.com/60x60?text=SRI" 
              alt="Logo SRI" 
              className="w-12 h-12 md:w-16 md:h-16 object-contain"
            />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-blue-900 leading-tight">
                Facturación Electrónica <span className="text-blue-600">SRI</span>
              </h1>
              <p className="text-sm md:text-base text-gray-500">Simplifica tus trámites fiscales en Ecuador</p>
            </div>
          </div>
          <div className={`text-xs font-bold ${auth.currentUser ? 'text-green-600' : 'text-blue-600'}`}>
            <i className={`fas ${isSyncing ? 'fa-spinner fa-spin' : 'fa-shield-alt'}`}></i> 
            {isSyncing ? ' Sincronizando...' : auth.currentUser ? ' Conexión Activa' : ' Conexión Segura'}
          </div>
        </div>
      </header>

      <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 py-16 md:py-24 text-white">
        <div className="container mx-auto px-4 text-center md:text-left flex flex-col md:flex-row items-center">
          <div className="md:w-2/3 space-y-6">
            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Tu socio estratégico para el <span className="text-blue-300">cumplimiento tributario</span>
            </h2>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl">
              Gestiona tus facturas electrónicas, retenciones y guías de remisión de forma ágil, segura y conforme a la normativa del SRI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={handleNavigateToPlans}
                className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-3 rounded-lg font-bold flex items-center justify-center transition-colors shadow-lg"
              >
                <i className="fas fa-rocket mr-2"></i> Explora Nuestros Planes
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;