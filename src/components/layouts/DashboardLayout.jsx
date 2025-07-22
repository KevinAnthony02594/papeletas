// src/components/layouts/DashboardLayout.jsx
import React, { useState } from 'react'; 
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import useUserStore from '../../store/userStore';
import { FiGrid, FiFileText, FiLogOut, FiBriefcase } from 'react-icons/fi'; // <-- Añadimos un ícono para el logo
import ThemeToggle from '../ThemeToggle';
import ConfirmationModal from '../ConfirmationModal'; 

function DashboardLayout() {
  const { userData, logout } = useUserStore();
  const navigate = useNavigate();

  // --- 1. ESTADO PARA CONTROLAR LA BARRA LATERAL ---
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  if (!userData) return null; 

  return (
    <>
      <div className="flex h-screen bg-slate-100 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-200">
        
        {/* --- 2. SIDEBAR AHORA ES INTERACTIVO --- */}
        <aside 
          className={`bg-white dark:bg-slate-800 flex flex-col flex-shrink-0 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'w-64' : 'w-20'}`}
          onMouseEnter={() => setIsSidebarExpanded(true)}
          onMouseLeave={() => setIsSidebarExpanded(false)}
        >
          {/* Logo */}
          <div className="h-16 flex items-center justify-center border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <FiBriefcase className="text-blue-600 dark:text-blue-400" size={24} />
              {/* 3. El texto del logo se oculta/muestra con una transición */}
              <span className={`font-bold text-xl text-blue-600 dark:text-blue-400 overflow-hidden transition-all duration-300 ${isSidebarExpanded ? 'w-24 opacity-100' : 'w-0 opacity-0'}`}>
                Papeletas
              </span>
            </div>
          </div>

          {/* Navegación */}
          <nav className="flex-grow p-4 space-y-2">
            <NavLink to="/app/resumen" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-semibold' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
              <FiGrid size={20} className="flex-shrink-0" />
              <span className={`overflow-hidden transition-opacity duration-200 ${isSidebarExpanded ? 'opacity-100' : 'opacity-0'}`}>Resumen</span>
            </NavLink>
            <NavLink to="/app/papeletas" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-semibold' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
              <FiFileText size={20} className="flex-shrink-0" />
              <span className={`overflow-hidden transition-opacity duration-200 ${isSidebarExpanded ? 'opacity-100' : 'opacity-0'}`}>Mis Papeletas</span>
            </NavLink>
          </nav>
          
          {/* Perfil de Usuario */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                {getInitials(userData.contrato.nombre_completo)}
              </div>
              <div className={`flex-grow overflow-hidden transition-opacity duration-200 ${isSidebarExpanded ? 'opacity-100' : 'opacity-0'}`}>
                <p className="font-semibold text-sm truncate">{userData.contrato.nombre_completo}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* --- Contenido Principal (no cambia) --- */}
        <div className="flex-1 flex flex-col max-h-screen">
          <header className="h-16 bg-white dark:bg-slate-800 flex items-center justify-end px-6 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button onClick={() => setIsLogoutModalOpen(true)} className="p-2 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-500 transition" title="Cerrar sesión">
                <FiLogOut size={20} />
              </button>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-y-auto hide-scrollbar">
            <Outlet />
          </main>
        </div>
      </div>
      
      {/* El modal de confirmación no cambia */}
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Confirmar Cierre de Sesión"
        message="¿Estás seguro de que quieres salir de la aplicación?"
        confirmButtonText="Sí, Salir"
        confirmButtonColor="bg-red-600 hover:bg-red-700"
      />
    </>   
  );
}

export default DashboardLayout;