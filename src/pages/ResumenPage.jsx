// src/pages/ResumenPage.jsx
import React, { useMemo } from 'react';
import useUserStore from '../store/userStore';
import { motion } from 'framer-motion';
import { FiFileText, FiClock, FiCheckSquare } from 'react-icons/fi';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md flex items-center gap-4">
      <div className={`p-3 rounded-full ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
  );
}

function ResumenPage() {
  const { papeletas, paginationInfo } = useUserStore();

  const stats = useMemo(() => {
    if (!paginationInfo) return { total: 0 };
    return {
      total: paginationInfo.totalRecords,
      pendientes: 'N/A', // Estos datos requerirían otra llamada a la API
      aprobadas: 'N/A',
    };
  }, [paginationInfo]);

  const chartData = useMemo(() => {
    if (!papeletas || papeletas.length === 0) return { byMonth: [], byMotive: [] };
    const motivesCount = papeletas.reduce((acc, curr) => {
      const motiveName = curr.motivo_nombre;
      acc[motiveName] = (acc[motiveName] || 0) + 1;
      return acc;
    }, {});
    const byMotive = Object.keys(motivesCount).map(key => ({ name: key, value: motivesCount[key] }));

    const monthsCount = papeletas.reduce((acc, curr) => {
      const month = new Date(curr.fecha_papeleta + 'T00:00:00').toLocaleString('es-ES', { month: 'short' });
      const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
      acc[capitalizedMonth] = (acc[capitalizedMonth] || 0) + 1;
      return acc;
    }, {});
    const byMonth = Object.keys(monthsCount).map(key => ({ name: key, papeletas: monthsCount[key] }));

    return { byMonth, byMotive };
  }, [papeletas]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Resumen General</h1>
        <p className="text-slate-500 dark:text-slate-400">Una vista general de tu actividad reciente.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <StatCard icon={<FiFileText size={24} className="text-blue-800"/>} label="Papeletas Totales" value={stats.total} color="bg-blue-100 dark:bg-blue-900/50" />
        <StatCard icon={<FiCheckSquare size={24} className="text-green-800"/>} label="Aprobadas" value={stats.aprobadas} color="bg-green-100 dark:bg-green-900/50" />
        <StatCard icon={<FiClock size={24} className="text-orange-800"/>} label="Pendientes" value={stats.pendientes} color="bg-orange-100 dark:bg-orange-900/50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md">
          <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-4">Papeletas por Mes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.byMonth} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip cursor={{fill: 'rgba(148, 163, 184, 0.1)'}} contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', border: 'none', borderRadius: '0.5rem' }} />
              <Bar dataKey="papeletas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md">
          <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-4">Distribución por Motivo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={chartData.byMotive} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
                {chartData.byMotive.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#3b82f6', '#84cc16', '#f97316', '#ef4444', '#a855f7'][index % 5]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', border: 'none', borderRadius: '0.5rem' }} />
              <Legend iconSize={10} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}

export default ResumenPage;