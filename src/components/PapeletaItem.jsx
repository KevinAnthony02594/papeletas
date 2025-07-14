// src/components/PapeletaItem.jsx
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiCalendar, FiClock, FiMapPin, FiFileText, FiCheckCircle, FiDownload } from 'react-icons/fi';
import { motion } from 'framer-motion';

// --- Las funciones de ayuda para formatear no cambian ---
function formatDate(dateString) {
  if (!dateString) return 'Fecha no especificada';
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'long',
  }).format(date);
}

function formatTime(timeString) {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

// --- Componente Principal ---

function PapeletaItem({ papeleta }) {
  // 1. Añadimos un estado local para saber si se está descargando
  const [isDownloading, setIsDownloading] = useState(false);

  const getStatusInfo = (estado) => {
    // ... (esta función no cambia)
    if (estado === "1") {
      return {
        text: "Aprobado",
        styles: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
        icon: <FiCheckCircle className="mr-1.5" />
      };
    }
    return {
      text: "Pendiente",
      styles: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
      icon: <FiClock className="mr-1.5" />
    };
  }
  
  // 2. Nueva función para manejar la descarga del PDF
  const handleDownload = async () => {
    setIsDownloading(true);
    toast.loading('Generando PDF...', { id: 'pdf-toast' });
    
    try {
      const params = new URLSearchParams();
      params.append('accion', 'generarPapeletaPDF');
      params.append('id_papeleta', papeleta.id_papeleta);

    const response = await axios.post('https://gth.munimoche.gob.pe/Controllers/PlanillaController/PapeletasController.php', params, { responseType: 'blob' });

      // Creamos una URL temporal para el archivo recibido
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      // Le damos un nombre al archivo que se va a descargar
      link.setAttribute('download', `papeleta_${papeleta.numero_papeleta || papeleta.id_papeleta}.pdf`);
      
      // Añadimos el link al documento, lo clickeamos y lo removemos
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // Liberamos la memoria

      toast.success('PDF descargado con éxito.', { id: 'pdf-toast' });

    } catch (error) {
      toast.error('No se pudo generar el PDF.', { id: 'pdf-toast' });
      console.error("Error al descargar el PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };


  const status = getStatusInfo(papeleta.estado);
  const formattedTime = `${formatTime(papeleta.hora_salida)} - ${formatTime(papeleta.hora_retorno)}`;

  return (
    <motion.div 
      className="bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-4 transition-all duration-300 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700"
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    >
      <div className="flex justify-between items-start mb-4 gap-2">
        <div>
          <p className="font-bold text-base text-slate-800 dark:text-slate-100">{papeleta.motivo_nombre}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">N°: {papeleta.numero_papeleta || 'N/A'}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${status.styles}`}>
            {status.icon}
            {status.text}
          </span>
          
          {/* 3. El nuevo botón de descarga */}
          <button 
            onClick={handleDownload} 
            disabled={isDownloading}
            className="p-2 text-slate-500 dark:text-slate-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-wait"
            title="Descargar Papeleta en PDF"
          >
            {isDownloading ? (
              <div className="w-5 h-5 animate-spin rounded-full border-2 border-slate-400 border-t-transparent"></div>
            ) : (
              <FiDownload />
            )}
          </button>
        </div>
      </div>
      
      {/* El resto del JSX no cambia */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <div className="flex items-center gap-2">
          <FiCalendar className="text-slate-400 flex-shrink-0"/>
          <div>
              <p className="font-medium text-slate-700 dark:text-slate-300">{formatDate(papeleta.fecha_papeleta)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FiClock className="text-slate-400 flex-shrink-0"/>
          <div>
              <p className="font-medium text-slate-700 dark:text-slate-300">{formattedTime}</p>
          </div>
        </div>
        <div className="flex items-start gap-2 col-span-2">
          <FiMapPin className="text-slate-400 flex-shrink-0 mt-0.5"/>
          <div>
              <p className="font-medium text-slate-700 dark:text-slate-300 truncate" title={papeleta.lugar_destino}>
                {papeleta.lugar_destino}
              </p>
          </div>
        </div>
      </div>
      
      {papeleta.motivo && (
        <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-700 flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
          <FiFileText className="text-slate-400 mt-0.5 flex-shrink-0"/>
          <p className="italic">{papeleta.motivo}</p>
        </div>
      )}
    </motion.div>
  )
}

export default PapeletaItem;