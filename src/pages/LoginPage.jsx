// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/userStore';
import { FiDelete, FiLogIn, FiUserCheck } from 'react-icons/fi';
import { motion } from 'framer-motion'; // <-- 1. Importamos Framer Motion para las animaciones

// El componente del botón del teclado no necesita cambios, está perfecto.
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
    if (dni.length < 8 && !isLoading) { // Evitamos que se pueda escribir mientras carga
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

  // 2. Variantes de animación para Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        staggerChildren: 0.1 // Animará los hijos uno tras otro
      }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };


  return (
    // 3. Cambiamos el fondo a uno más limpio y corporativo
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 p-4 font-sans">
      
      {/* 4. El contenedor principal ahora es una "tarjeta" con sombra y bordes redondeados */}
      <motion.div 
        className="w-full max-w-sm bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 5. Añadimos un logo/ícono principal */}
        <motion.div className="text-center" variants={itemVariants}>
          <div className="inline-block bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
            <FiUserCheck className="text-blue-600 dark:text-blue-400" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">Acceso de Personal</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Ingrese su DNI para ver sus papeletas</p>
        </motion.div>
        
        {/* 6. Mejoramos el display del DNI */}
        <motion.div className="w-full h-20 bg-slate-100 dark:bg-slate-900 rounded-lg flex items-center justify-center" variants={itemVariants}>
          <p className="text-slate-800 dark:text-slate-200 text-5xl tracking-[10px] font-mono select-none">
            {dni.padEnd(8, '•')}
          </p>
        </motion.div>

        {/* 7. Le damos un estilo más sutil al teclado */}
        <motion.div className="grid grid-cols-3 gap-3 w-full" variants={itemVariants}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <KeypadButton key={num} number={num.toString()} onClick={handleKeyPress} />
          ))}
          
          <button onClick={handleDelete} disabled={isLoading} className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-2xl font-semibold rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50">
            <FiDelete />
          </button>
          
          <KeypadButton number="0" onClick={handleKeyPress} />
          
          <button onClick={handleSubmit} disabled={isLoading || dni.length !== 8} className="bg-blue-600 text-white text-2xl font-semibold rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed">
            {isLoading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> : <FiLogIn />}
          </button>
        </motion.div>
        
        {/* 8. El mensaje de error ahora ocupa un espacio fijo para que no mueva el layout */}
        <div className="h-5 text-center">
            {error && <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-red-500 text-sm">{error}</motion.p>}
        </div>
      </motion.div>
    </div>
  );
}

export default LoginPage;