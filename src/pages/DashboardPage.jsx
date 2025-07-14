// src/pages/DashboardPage.jsx
import React, { useState, useMemo } from 'react';
import useUserStore from '../store/userStore';
import RegisterPapeletaModal from '../components/RegisterPapeletaModal';
import PapeletaList from '../components/PapeletaList';
import { FiLogOut, FiPlusCircle, FiFileText, FiClock, FiCheckSquare } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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
              <button onClick={handleLogout} className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-500 transition">
                <FiLogOut size={24} />
              </button>
            </div>
          </motion.header>

          <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8" variants={itemVariants}>
            <StatCard icon={<FiFileText size={24} className="text-blue-800"/>} label="Papeletas Totales" value={stats.total} color="bg-blue-200" />
            <StatCard icon={<FiCheckSquare size={24} className="text-green-800"/>} label="Aprobadas" value={stats.aprobadas} color="bg-green-200" />
            <StatCard icon={<FiClock size={24} className="text-orange-800"/>} label="Pendientes" value={stats.pendientes} color="bg-orange-200" />
          </motion.div>
          
          {/* AQUÍ ESTÁ LA SECCIÓN DEL ERROR */}
          <motion.main variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 p-2 sm:p-4 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 p-4">Historial de Papeletas</h2>
            <PapeletaList papeletas={userData.papeletas} onOpenModal={() => setIsModalOpen(true)} />            </div>
          </motion.main> {/* <- La etiqueta de cierre que faltaba o estaba corrupta */}
          
        </motion.div>
      </div>

      <RegisterPapeletaModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

export default DashboardPage;