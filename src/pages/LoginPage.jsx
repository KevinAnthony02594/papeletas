// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/userStore';
import { FiDelete, FiLogIn, FiUserCheck } from 'react-icons/fi';
import { motion } from 'framer-motion'; 

// --- Componente del botón del teclado (sin cambios) ---
// La magia responsive la haremos en el contenedor del grid.
function KeypadButton({ number, onClick }) {
  return (
    <button
      onClick={() => onClick(number)}
      className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-2xl font-semibold rounded-lg aspect-square flex items-center justify-center transition-all duration-200 hover:bg-slate-200 dark:hover:bg-slate-600 active:scale-90"
    >
      {number}
    </button>
  );
}

function LoginPage() {
  const [dni, setDni] = useState('');
  const { loginByDNI, isLoading, error } = useUserStore();
  const navigate = useNavigate();

  const handleKeyPress = (num) => {
    if (dni.length < 8 && !isLoading) { 
      setDni(dni + num);
    }
  };

  const handleDelete = () => {
    if (!isLoading) {
      setDni(dni.slice(0, -1));
    }
  };

  const handleSubmit = async () => {
    if (dni.length === 8 && !isLoading) {
      const success = await loginByDNI(dni);
      if (success) {
        navigate('/app/resumen');
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        staggerChildren: 0.1 
      }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    // --- 1. Usamos flex-col para centrar mejor en todas las alturas de pantalla ---
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 p-4 font-sans">
      
      {/* --- 2. Padding adaptable: p-6 en móvil, p-8 en pantallas más grandes --- */}
      <motion.div 
        className="w-full max-w-sm bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl space-y-4 sm:space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center" variants={itemVariants}>
          <div className="inline-block bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
            <FiUserCheck className="text-blue-600 dark:text-blue-400" size={32} />
          </div>
          {/* --- 3. Títulos con tamaño de fuente adaptable --- */}
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">Acceso de Personal</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Ingrese su DNI para continuar</p>
        </motion.div>
        
        {/* --- 4. Display de DNI con altura, fuente y espaciado adaptables --- */}
        <motion.div className="w-full h-16 sm:h-20 bg-slate-100 dark:bg-slate-900 rounded-lg flex items-center justify-center" variants={itemVariants}>
          <p className="text-slate-800 dark:text-slate-200 text-4xl sm:text-5xl tracking-[8px] sm:tracking-[10px] font-mono select-none">
            {dni.padEnd(8, '•')}
          </p>
        </motion.div>

        {/* --- 5. Teclado con espacio entre botones adaptable --- */}
        <motion.div className="grid grid-cols-3 gap-2 sm:gap-3 w-full" variants={itemVariants}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <KeypadButton key={num} number={num.toString()} onClick={handleKeyPress} />
          ))}
          
          <button onClick={handleDelete} disabled={isLoading} className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-2xl font-semibold rounded-lg aspect-square flex items-center justify-center transition-all duration-200 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50">
            <FiDelete />
          </button>
          
          <KeypadButton number="0" onClick={handleKeyPress} />
          
          <button onClick={handleSubmit} disabled={isLoading || dni.length !== 8} className="bg-blue-600 text-white text-2xl font-semibold rounded-lg aspect-square flex items-center justify-center transition-all duration-200 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed">
            {isLoading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> : <FiLogIn />}
          </button>
        </motion.div>
        
        <div className="h-5 text-center">
            {error && <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-red-500 text-sm">{error}</motion.p>}
        </div>
      </motion.div>
    </div>
  );
}

export default LoginPage;
