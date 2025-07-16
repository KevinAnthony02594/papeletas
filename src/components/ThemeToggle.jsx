// src/components/ThemeToggle.jsx
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="w-14 h-8 rounded-full p-1 flex items-center transition-colors duration-300 bg-slate-200 dark:bg-slate-700"
      title={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={theme}
          className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ marginLeft: theme === 'dark' ? 'auto' : '0' }}
        >
          {theme === 'dark' ? (
            <FiMoon className="text-slate-400" size={14} />
          ) : (
            <FiSun className="text-yellow-500" size={14} />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}

export default ThemeToggle;