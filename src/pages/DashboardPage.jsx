// src/pages/DashboardPage.jsx
import React, { useState, useMemo } from 'react';
import ConfirmationModal from '../components/ConfirmationModal'; 
import useUserStore from '../store/userStore';
import RegisterPapeletaModal from '../components/RegisterPapeletaModal';
import PapeletaList from '../components/PapeletaList';
import { FiLogOut, FiPlusCircle, FiFileText, FiClock, FiCheckSquare, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle'; 

// --- Sub-componente para las tarjetas de estadísticas ---
function StatCard({ icon, label, value, color }) {
  return (
    <motion.div 
      className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md flex items-center gap-4"
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    >
      <div className={`p-3 rounded-full ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </motion.div>
  );
}

function DashboardPage() {
  const { userData, logout } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
 
  const stats = useMemo(() => {
    if (!userData?.papeletas) return { total: 0, pendientes: 0, aprobadas: 0 };
    const papeletas = userData.papeletas;
    return {
      total: papeletas.length,
      pendientes: papeletas.filter(p => p.estado !== '1').length,
      aprobadas: papeletas.filter(p => p.estado === '1').length,
    };
  }, [userData]);

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  // --- SE MANTIENE ESTA ÚNICA DECLARACIÓN DE handleLogout ---
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const filteredPapeletas = useMemo(() => {
    if (!userData?.papeletas) return [];
    
    return userData.papeletas
      .filter(papeleta => {
        if (searchTerm.trim() === '') return true;
        const searchLower = searchTerm.toLowerCase();
        return (
          papeleta.motivo_nombre.toLowerCase().includes(searchLower) ||
          papeleta.lugar_destino.toLowerCase().includes(searchLower)
        );
      })
      .filter(papeleta => {
        if (activeFilter === 'todas') return true;
        if (activeFilter === 'aprobadas') return papeleta.estado === '1';
        if (activeFilter === 'pendientes') return papeleta.estado !== '1';
        return true;
      });
  }, [userData, activeFilter, searchTerm]);
  

  if (!userData) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
        <motion.div 
          className="max-w-5xl mx-auto p-4 sm:p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4" variants={itemVariants}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {getInitials(userData.contrato.nombre_completo)}
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400">Bienvenido de vuelta,</p>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">{userData.contrato.nombre_completo}</h1>
              </div>
            </div>
            <div className="flex items-center gap-4 self-end sm:self-center">
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg shadow-lg hover:bg-blue-700 transition-transform active:scale-95">
                <FiPlusCircle />
                <span className="font-semibold">Nueva Papeleta</span>
              </button>
              <button /* ... (botón de nueva papeleta) ... */></button>
              <ThemeToggle /> {/* <-- AÑADE EL BOTÓN AQUÍ */}
              <button /* ... (botón de logout) ... */></button>
              <button 
                onClick={() => setIsLogoutModalOpen(true)}
                className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-500 transition"
                title="Cerrar sesión"
              >
                <FiLogOut size={24} />
              </button>
            </div>
          </motion.header>

          <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8" variants={itemVariants}>
            <StatCard icon={<FiFileText size={24} className="text-blue-800"/>} label="Papeletas Totales" value={stats.total} color="bg-blue-200" />
            <StatCard icon={<FiCheckSquare size={24} className="text-green-800"/>} label="Aprobadas" value={stats.aprobadas} color="bg-green-200" />
            <StatCard icon={<FiClock size={24} className="text-orange-800"/>} label="Pendientes" value={stats.pendientes} color="bg-orange-200" />
          </motion.div>
          
          <motion.main variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 p-2 sm:p-4 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 p-4">Historial de Papeletas</h2>
              <div className="flex flex-col sm:flex-row gap-4 my-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div className="relative flex-grow">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    placeholder="Buscar por motivo o lugar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
                <div className="flex-shrink-0 flex items-center bg-slate-200 dark:bg-slate-700 p-1 rounded-lg">
                  <button onClick={() => setActiveFilter('todas')} className={`px-3 py-1 text-sm font-semibold rounded-md transition ${activeFilter === 'todas' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow' : 'text-slate-600 dark:text-slate-300'}`}>Todas</button>
                  <button onClick={() => setActiveFilter('aprobadas')} className={`px-3 py-1 text-sm font-semibold rounded-md transition ${activeFilter === 'aprobadas' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow' : 'text-slate-600 dark:text-slate-300'}`}>Aprobadas</button>
                  <button onClick={() => setActiveFilter('pendientes')} className={`px-3 py-1 text-sm font-semibold rounded-md transition ${activeFilter === 'pendientes' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow' : 'text-slate-600 dark:text-slate-300'}`}>Pendientes</button>
                </div>
              </div>
            <PapeletaList papeletas={filteredPapeletas} onOpenModal={() => setIsModalOpen(true)} />           
            </div>
          </motion.main>
        </motion.div>
      </div>
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Confirmar Cierre de Sesión"
        message="¿Estás seguro de que quieres salir de la aplicación?"
        confirmButtonText="Sí, Salir"
        confirmButtonColor="bg-red-600 hover:bg-red-700"
      />
      <RegisterPapeletaModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

export default DashboardPage;