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

function DetailItem({ icon, value, title = '' }) {
  return (
    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
      <div className="flex-shrink-0 w-5 text-center">{icon}</div>
      <p className="font-medium text-slate-700 dark:text-slate-300 truncate" title={title || value}>
        {value}
      </p>
    </div>
  );
}

// --- Componente Principal ---
function PapeletaItem({ papeleta }) {
  const [isDownloading, setIsDownloading] = useState(false);

 const getStatusInfo = (estado) => {
    switch (String(estado)) { 
      case '1':
        return {
          text: "Aprobado",
          styles: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
          icon: <FiCheckCircle className="mr-1.5" />
        };
      case '2': // Estado 2 es 'Rechazado'
        return {
          text: "Rechazado",
          styles: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
          icon: <FiXCircle className="mr-1.5" />
        };
      default: 
        return {
          text: "Pendiente",
          styles: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
          icon: <FiClock className="mr-1.5" />
        };
    }
  }
  
const handleDownload = () => {
    // Notificación visual rápida
    toast.loading('Abriendo documento...', { duration: 2000 });

    // 1. Crear un formulario invisible en el DOM
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://gth.munimoche.gob.pe/Controllers/PlanillaController/PapeletasController.php';
    form.target = '_blank'; // IMPORTANTE: Esto abre la nueva pestaña

    // 2. Crear los inputs necesarios (accion e id_papeleta)
    const inputAccion = document.createElement('input');
    inputAccion.type = 'hidden';
    inputAccion.name = 'accion';
    inputAccion.value = 'generarPapeletaPDF';
    form.appendChild(inputAccion);

    const inputId = document.createElement('input');
    inputId.type = 'hidden';
    inputId.name = 'id_papeleta';
    inputId.value = papeleta.id_papeleta; // Tu variable del ID
    form.appendChild(inputId);

    // 3. Agregar al documento, enviar y eliminar
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <DetailItem icon={<FiCalendar className="text-slate-400"/>} value={formatDate(papeleta.fecha_papeleta)} />
        <DetailItem icon={<FiClock className="text-slate-400"/>} value={formattedTime} />
        <div className="sm:col-span-2">
          <DetailItem icon={<FiMapPin className="text-slate-400"/>} value={papeleta.lugar_destino} />
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