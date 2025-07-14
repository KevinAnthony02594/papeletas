// src/components/PapeletaList.jsx
import PapeletaItem from './PapeletaItem';
import { motion } from 'framer-motion';
import { FiInbox, FiPlus } from 'react-icons/fi';

// Ahora, el componente también recibirá una función para abrir el modal
function PapeletaList({ papeletas, onOpenModal }) {

  // --- 1. Estado Vacío Mejorado ---
  // Este es el diseño que se mostrará si no hay papeletas
  if (!papeletas || papeletas.length === 0) {
    return (
      <div className="text-center py-16 px-6">
        <FiInbox className="mx-auto text-5xl text-slate-300 dark:text-slate-600 mb-4" />
        <h3 className="font-semibold text-lg text-slate-700 dark:text-slate-200">No hay papeletas registradas</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-1 mb-6 text-sm">
          Cuando crees una nueva papeleta, aparecerá aquí.
        </p>
        <button
          onClick={onOpenModal} // Llama a la función del Dashboard para abrir el modal
          className="flex items-center gap-2 mx-auto bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-lg hover:bg-blue-700 transition-transform active:scale-95"
        >
          <FiPlus />
          <span className="font-semibold">Registrar mi primera papeleta</span>
        </button>
      </div>
    );
  }

  // --- 2. Contenedor de la lista con animación escalonada ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08 // Cada item aparecerá 0.08s después del anterior
      }
    }
  };
  
  // Como PapeletaItem ya es un componente de motion, la animación funcionará automáticamente
  return (
    <motion.div 
      className="space-y-3 p-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {papeletas.map(papeleta => (
        <PapeletaItem key={papeleta.id_papeleta || papeleta.numero_papeleta} papeleta={papeleta} />
      ))}
    </motion.div>
  );
}

export default PapeletaList;