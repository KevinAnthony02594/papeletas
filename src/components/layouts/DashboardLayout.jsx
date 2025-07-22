// src/components/layouts/DashboardLayout.jsx
import React, { useState } from 'react'; 
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import useUserStore from '../../store/userStore';
import { FiGrid, FiFileText, FiLogOut, FiBriefcase, FiMenu, FiX } from 'react-icons/fi';
import ThemeToggle from '../ThemeToggle';
import ConfirmationModal from '../ConfirmationModal';
import { motion, AnimatePresence } from 'framer-motion'; 

function DashboardLayout() {
  const { userData, logout } = useUserStore();
  const navigate = useNavigate();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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

  const NavigationLinks = () => (
    <nav className="flex-grow p-4 space-y-2">
      <NavLink to="/app/resumen" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-semibold' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
        <FiGrid size={20} className="flex-shrink-0" />
        <span className={`transition-opacity duration-200 ${isSidebarExpanded || isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}>Resumen</span>
      </NavLink>
      <NavLink to="/app/papeletas" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-semibold' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
        <FiFileText size={20} className="flex-shrink-0" />
        <span className={`transition-opacity duration-200 ${isSidebarExpanded || isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}>Mis Papeletas</span>
      </NavLink>
    </nav>
  );

  return (
    <>
      <div className="flex h-screen bg-slate-100 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-200">
        
        <aside 
          className={`hidden md:flex flex-col flex-shrink-0 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'w-64' : 'w-20'}`}
          onMouseEnter={() => setIsSidebarExpanded(true)}
          onMouseLeave={() => setIsSidebarExpanded(false)}
        >
          {/* Logo */}
          <div className="h-16 flex items-center justify-center border-b border-slate-200 dark:border-slate-700">
             {/* ... (tu logo aquí) ... */}
          </div>

          <NavigationLinks />
          
          {/* Perfil de Usuario */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            {/* ... (tu perfil aquí) ... */}
          </div>
        </aside>

        {/* --- Contenido Principal --- */}
        <div className="flex-1 flex flex-col max-h-screen">
          <header className="h-16 bg-white dark:bg-slate-800 flex items-center justify-between md:justify-end px-6 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 text-slate-500">
              <FiMenu size={24} />
            </button>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button onClick={() => setIsLogoutModalOpen(true)} className="p-2 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-500 transition" title="Cerrar sesión">
                <FiLogOut size={20} />
              </button>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 overflow-y-auto hide-scrollbar">
            <Outlet />
          </main>
        </div>
      </div>
      
      {/* --- 4. NUEVO MENÚ MÓVIL DESLIZABLE --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Fondo oscuro */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-30 md:hidden"
            />
            {/* Panel del menú */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-800 z-40 flex flex-col"
            >
              <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-700">
                <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">Papeletas</h1>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
                  <FiX />
                </button>
              </div>
              <NavigationLinks />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      
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