// src/pages/DashboardPage.jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import ConfirmationModal from '../components/ConfirmationModal'; 
import useUserStore from '../store/userStore';
import RegisterPapeletaModal from '../components/RegisterPapeletaModal';
import PapeletaList from '../components/PapeletaList';
import Pagination from '../components/Pagination';
import { FiLogOut, FiPlusCircle, FiFileText, FiClock, FiCheckSquare, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle'; 
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'; 
import { CSVLink } from "react-csv"; 
import { FiDownload } from 'react-icons/fi';


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
 const { 
    userData, 
    papeletas, 
    paginationInfo, 
    fetchPapeletas, 
    isLoadingPapeletas, 
    logout 
  } = useUserStore();
  
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  const [activeFilter, setActiveFilter] = useState(0); 
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const csvHeaders = [
        { label: "Numero Papeleta", key: "numero_papeleta" },
        { label: "Fecha", key: "fecha_papeleta" },
        { label: "Motivo", key: "motivo_nombre" },
        { label: "Lugar de Destino", key: "lugar_destino" },
        { label: "Hora Salida", key: "hora_salida" },
        { label: "Hora Retorno", key: "hora_retorno" },
        { label: "Estado", key: "estado" } // Podríamos mapear '1' a 'Aprobado', etc. si quisiéramos
  ];
  useEffect(() => {
    if (userData?.nro_documento) {
      fetchPapeletas({
        nro_documento: userData.nro_documento,
        pagina: currentPage,
        limite: 9, 
        filtro_estado: activeFilter,
        busqueda: searchTerm
      });
    }
  }, [currentPage, activeFilter, searchTerm, userData, fetchPapeletas]);

  const chartData = useMemo(() => {
        if (!papeletas || papeletas.length === 0) return { byMonth: [], byMotive: [] };

        // Agrupar por motivo
        const motivesCount = papeletas.reduce((acc, curr) => {
            const motiveName = curr.motivo_nombre;
            acc[motiveName] = (acc[motiveName] || 0) + 1;
            return acc;
        }, {});

        const byMotive = Object.keys(motivesCount).map(key => ({
            name: key,
            value: motivesCount[key]
        }));

        // Agrupar por mes
        const monthsCount = papeletas.reduce((acc, curr) => {
            const month = new Date(curr.fecha_papeleta + 'T00:00:00').toLocaleString('es-ES', { month: 'short' });
            const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
            acc[capitalizedMonth] = (acc[capitalizedMonth] || 0) + 1;
            return acc;
        }, {});

        const byMonth = Object.keys(monthsCount).map(key => ({
            name: key,
            papeletas: monthsCount[key]
        }));

        return { byMonth, byMotive };

    }, [papeletas]);

  const stats = useMemo(() => {
    if (!paginationInfo) return { total: 0, pendientes: '...', aprobadas: '...' };
    // Nota: No podemos calcular pendientes/aprobadas con precisión sin datos adicionales,
    // pero podemos mostrar el total real.
    return {
      total: paginationInfo.totalRecords,
      pendientes: '...', 
      aprobadas: '...',
    };
  }, [paginationInfo]);

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
              <ThemeToggle />
              <button onClick={() => setIsLogoutModalOpen(true)} className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-500 transition" title="Cerrar sesión">
                  <FiLogOut size={24} />
              </button>
          </div>
          </motion.header>
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8" 
            variants={itemVariants}
        >
            <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md">
                <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-4">Papeletas por Mes</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.byMonth} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                        <YAxis stroke="#94a3b8" fontSize={12} />
                        <Tooltip cursor={{fill: 'rgba(148, 163, 184, 0.1)'}} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '0.5rem' }} />
                        <Bar dataKey="papeletas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Gráfico de Pastel (Distribución por Motivo) */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md">
                <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-4">Distribución por Motivo</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={chartData.byMotive} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
                            {/* Colores para cada sección del pastel */}
                            {chartData.byMotive.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={['#3b82f6', '#84cc16', '#f97316', '#ef4444', '#a855f7'][index % 5]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '0.5rem' }} />
                        <Legend iconSize={10} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
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
                <div className="flex-shrink-0 flex items-center gap-2">
                                    {/* --- 3. AÑADE EL BOTÓN DE DESCARGA AQUÍ --- */}
                                    <CSVLink
                                        data={papeletas}
                                        headers={csvHeaders}
                                        filename={`reporte_papeletas_${new Date().toISOString().slice(0, 10)}.csv`}
                                        className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg shadow-md hover:bg-green-700 transition"
                                    >
                                        <FiDownload size={16} />
                                        <span className="text-sm font-semibold">Exportar</span>
                                    </CSVLink>
                                  <div className="flex-shrink-0 flex items-center bg-slate-200 dark:bg-slate-700 p-1 rounded-lg">
                                    <button onClick={() => { setActiveFilter(0); setCurrentPage(1); }} className={`px-3 py-1 text-sm font-semibold rounded-md transition ${activeFilter === 0 ? 'bg-white dark:bg-slate-900 text-blue-600 shadow' : 'text-slate-600 dark:text-slate-300'}`}>Todas</button>
                                    <button onClick={() => { setActiveFilter(1); setCurrentPage(1); }} className={`px-3 py-1 text-sm font-semibold rounded-md transition ${activeFilter === 1 ? 'bg-white dark:bg-slate-900 text-blue-600 shadow' : 'text-slate-600 dark:text-slate-300'}`}>Aceptadas</button>
                                    {/* <button onClick={() => { setActiveFilter(1); setCurrentPage(1); }} className={`px-3 py-1 text-sm font-semibold rounded-md transition ${activeFilter === 2 ? 'bg-white dark:bg-slate-900 text-blue-600 shadow' : 'text-slate-600 dark:text-slate-300'}`}>Aprobadas</button> */}
                                    <button onClick={() => { setActiveFilter(3); setCurrentPage(1); }} className={`px-3 py-1 text-sm font-semibold rounded-md transition ${activeFilter === 3 ? 'bg-white dark:bg-slate-900 text-blue-600 shadow' : 'text-slate-600 dark:text-slate-300'}`}>Pendientes</button>
                                  </div>
                                </div>
              </div>

              {isLoadingPapeletas ? (
                <div className="min-h-[40vh] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <PapeletaList 
                  papeletas={papeletas} 
                  onOpenModal={() => setIsModalOpen(true)} 
                />
              )}
              <Pagination 
                currentPage={currentPage} 
                totalPages={paginationInfo?.totalPages || 1} 
                onPageChange={(page) => setCurrentPage(page)}
                />
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