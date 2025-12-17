import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'
import "./styles/tailwind.css";
// import PlanList from './components/PlanList.tsx'
// import Layout from './components/Layout.tsx';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* <Layout> */}
      {/* <PlanList />
    </Layout> */}
  </StrictMode>,
)


// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// // Importa tus componentes
// import HomePage from './components/HomePage'; // 🚨 Nuevo componente
// // import PlanList from './components/PlanList.tsx'; // Tu lista de planes existente
// // import SuccessPage from './pages/SuccessPage'; // Puedes crear estas luego
// // import CancelPage from './pages/CancelPage'; // Puedes crear estas luego

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<HomePage />} /> {/* 🚨 La nueva página principal */}
//         <Route path="/planes" element={<PlanList />} /> {/* Tu lista de planes */}
//         {/*
//         <Route path="/pago/exitoso" element={<SuccessPage />} />
//         <Route path="/pago/cancelado" element={<CancelPage />} />
//         */}
//         {/* Puedes añadir otras rutas aquí */}
//       </Routes>
//     </Router>
//   );
// }

// export default App;