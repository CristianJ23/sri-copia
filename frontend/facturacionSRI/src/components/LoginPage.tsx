import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Función auxiliar para obtener la cookie CSRF
    const getCookie = (name: string) => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        try {
            // Importante: Django redirige tras el login exitoso (302). 
            // Axios lo maneja, pero nos interesa que la cookie se guarde.
            await axios.post('http://localhost:8000/api-auth/login/', formData, {
                withCredentials: true,
                headers: {
                    'X-CSRFToken': getCookie('csrftoken') || '', 
                }
            });

            console.log("✅ Login exitoso en Django");
            navigate('/'); // Al ir al Home, se activará el useEffect de sincronización
        } catch (error) {
            console.error("Error en login:", error);
            alert("Credenciales incorrectas o error de conexión con el servidor.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">Panel de Acceso</h2>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Usuario de Django</label>
                        <input 
                            type="text" 
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                        <input 
                            type="password" 
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg"
                    >
                        Iniciar Sesión
                    </button>
                </form>
                <p className="mt-4 text-xs text-center text-gray-400">
                    Usa las credenciales de superusuario creadas en la terminal.
                </p>
            </div>
        </div>
    );
};

export default LoginPage;