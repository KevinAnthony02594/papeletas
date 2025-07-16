// src/components/ConfirmationModal.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  title,
  message,
  confirmButtonText = "Confirmar",
  confirmButtonColor = "bg-red-600 hover:bg-red-700"
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[70] backdrop-blur-sm">
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="p-6 text-center">
              <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${confirmButtonColor.replace('bg-', 'bg-').replace('600', '100').replace('hover:bg-red-700', '')}`}>
                  <FiAlertTriangle size={24} className={confirmButtonColor.replace('bg-', 'text-').replace('hover:bg-red-700', '')} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-5">{title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{message}</p>
            </div>
            
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 grid grid-cols-2 gap-3">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-4 py-2 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors font-semibold"
              >
                Cancelar
              </button>
              <button 
                type="button" 
                onClick={onConfirm} 
                className={`flex items-center justify-center gap-2 px-4 py-2 text-white rounded-md transition-colors font-semibold ${confirmButtonColor}`}
              >
                {confirmButtonText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default ConfirmationModal;