// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast'; // <-- 1. Importar

function App() {
  return (
    <> {/* <-- 2. Envolver en un fragmento */}
      <Toaster position="top-center" reverseOrder={false} /> {/* <-- 3. Añadir el componente */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;