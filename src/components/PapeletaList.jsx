// src/components/PapeletaList.jsx
import PapeletaItem from './PapeletaItem';
import { motion } from 'framer-motion';
import { FiInbox, FiPlus } from 'react-icons/fi';

function PapeletaList({ papeletas, onOpenModal }) {

  // El estado vacío no necesita grandes cambios, ya es bastante bueno.
  // Solo nos aseguramos de que el contenedor principal tenga una altura mínima
  // para que no haya un salto visual brusco si se pasa de 0 a 1 papeleta.
  if (!papeletas || papeletas.length === 0) {
    return (
      <div className="text-center py-16 px-6 min-h-[40vh] flex flex-col items-center justify-center">
        <FiInbox className="mx-auto text-5xl text-slate-300 dark:text-slate-600 mb-4" />
        <h3 className="font-semibold text-lg text-slate-700 dark:text-slate-200">No hay papeletas registradas</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-1 mb-6 text-sm">
          Cuando crees una nueva papeleta, aparecerá aquí.
        </p>
        <button
          onClick={onOpenModal}
          className="flex items-center gap-2 mx-auto bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-lg hover:bg-blue-700 transition-transform active:scale-95"
        >
          <FiPlus />
          <span className="font-semibold">Registrar mi primera papeleta</span>
        </button>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };
  
  return (
    // --- AQUÍ ESTÁN LOS CAMBIOS PRINCIPALES ---
    <motion.div 
      // 1. Le damos una altura fija y scroll vertical.
      // h-[65vh] significa 65% de la altura de la pantalla. ¡Ajusta este valor si lo necesitas!
      className="h-[65vh] overflow-y-auto p-4" 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 2. Reemplazamos 'space-y-3' por una cuadrícula (grid) responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {papeletas.map(papeleta => (
          <PapeletaItem key={papeleta.id_papeleta || papeleta.numero_papeleta} papeleta={papeleta} />
        ))}
      </div>
    </motion.div>
  );
}

export default PapeletaList;