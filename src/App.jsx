// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/layouts/DashboardLayout'; // <-- Nuevo Layout
import ResumenPage from './pages/ResumenPage'; // <-- Nueva página
import PapeletasPage from './pages/PapeletasPage'; // <-- Nueva página
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          
          {/* --- RUTA PROTEGIDA PRINCIPAL PARA LA APP --- */}
          <Route 
            path="/app" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          > 
            {/* Rutas anidadas que se mostrarán dentro de DashboardLayout */}
            <Route index element={<Navigate to="resumen" replace />} /> 
            <Route path="resumen" element={<ResumenPage />} />
            <Route path="papeletas" element={<PapeletasPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;