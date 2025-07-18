// src/components/RegisterPapeletaModal.jsx
import React, { useState, useEffect } from 'react';
import useUserStore from '../store/userStore';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSave, FiUser, FiFileText, FiClock, FiMap } from 'react-icons/fi';
import toast from 'react-hot-toast'; // <-- Importamos toast
import MapPickerModal from './MapPickerModal';

function FormField({ label, children }) {
  // ... (este componente no cambia)
  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

const initialFormData = {
  id_motivo: '',
  fecha_papeleta: new Date().toISOString().split('T')[0],
  hora_salida: '',
  hora_retorno: '',
  lugar_destino: '',
  motivo: ''
};

function RegisterPapeletaModal({ isOpen, onClose }) {
  const { userData, addPapeleta } = useUserStore();
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [isMapOpen, setIsMapOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setError(null);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationSelect = (selectedAddress) => {
    setFormData(prev => ({ ...prev, lugar_destino: selectedAddress }));
  };
  // --- LÓGICA DE ENVÍO MEJORADA ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validacion del lado del cliente para el motivo "OTROS"
    const motivoSeleccionado = userData.motivos.find(m => m.id_motivo === formData.id_motivo);
    if (motivoSeleccionado?.motivo.toUpperCase().includes('OTROS') && !formData.motivo.trim()) {
        toast.error("Debe ingresar un detalle si selecciona el motivo 'OTROS'.");
        setError("Debe ingresar un detalle si selecciona el motivo 'OTROS'.");
        return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    const loadingToast = toast.loading('Registrando papeleta...');

    try {
      const params = new URLSearchParams();
      params.append('accion', 'registrar');
      params.append('id_empleadocontrato', userData.contrato.codigo_Contrato);
      for (const key in formData) {
        params.append(key, formData[key]);
      }

      const response = await axios.post('https://gth.munimoche.gob.pe/Controllers/PlanillaController/PapeletasController.php', params);      
      toast.dismiss(loadingToast); // Ocultamos el toast de "cargando"

      // Usamos '!=' para comparar, ya que el código de éxito puede ser "0" (string) o 0 (number)
      if (response.data.codigo != 0) {
        // Lanzamos un error si la API devuelve un código de error
        throw new Error(response.data.mensaje || 'Error al registrar la papeleta.');
      }
      
      // --- Éxito ---
      toast.success(response.data.mensaje); // Mostramos el mensaje de éxito de la API

      // Construimos la nueva papeleta con los DATOS REALES de la respuesta
      const newPapeleta = {
        id_papeleta: response.data.id_papeleta, // ID real de la base de datos
        ...formData,
        motivo_nombre: motivoSeleccionado?.motivo || 'Desconocido',
        // Extraemos el número de papeleta del mensaje de éxito
        numero_papeleta: response.data.mensaje.split(': ')[1] || 'N/A',
        estado: '0' 
      };

      addPapeleta(newPapeleta);
      
      // Esperamos un momento para que el usuario vea el toast y luego cerramos
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.message); // Mostramos el error en un toast
      setError(err.message); // Y también dentro del modal
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // El resto del JSX del return no cambia, es solo la lógica de arriba.
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            {/* El resto del código JSX es el mismo... */}
            <motion.div
              className="bg-slate-50 dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <header className="p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Registrar Nueva Papeleta</h2>
                <button onClick={onClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700">
                  <FiX size={20} />
                </button>
              </header>
              
              <form id="papeleta-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
                
                <fieldset className="space-y-4">
                    <legend className="text-base font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2 mb-2"><FiUser/>Datos del Trabajador</legend>
                    <div className="p-4 bg-blue-50 dark:bg-slate-700/50 rounded-lg">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Nombre</p>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{userData.contrato.nombre_completo}</p>
                    </div>
                </fieldset>

                <fieldset className="space-y-4">
                    <legend className="text-base font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2 mb-2"><FiFileText/>Motivo de la Papeleta</legend>
                    <div className="grid grid-cols-1 gap-4">
                        <FormField label="Motivo (*)">
                            <select name="id_motivo" value={formData.id_motivo} onChange={handleChange} required className="w-full rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 focus:border-blue-500 focus:ring-blue-500">
                                <option value="" disabled>Seleccione un motivo...</option>
                                {userData?.motivos.map(motivo => (
                                    <option key={motivo.id_motivo} value={motivo.id_motivo}>{motivo.motivo}</option>
                                ))}
                            </select>
                        </FormField>
                        <FormField label="Detalle del Motivo (si es 'OTROS')">
                            <input type="text" name="motivo" value={formData.motivo} onChange={handleChange} className="w-full rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 focus:border-blue-500 focus:ring-blue-500"/>
                        </FormField>
                    </div>
                </fieldset>

                <fieldset className="space-y-4">
                    <legend className="text-base font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2 mb-2"><FiClock/>Registro de Horario</legend>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField label="Fecha (*)">
                            <input type="date" name="fecha_papeleta" value={formData.fecha_papeleta} onChange={handleChange} required className="w-full rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 focus:border-blue-500 focus:ring-blue-500"/>
                        </FormField>
                        <FormField label="Hora Salida (*)">
                            <input type="time" name="hora_salida" value={formData.hora_salida} onChange={handleChange} required className="w-full rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 focus:border-blue-500 focus:ring-blue-500"/>
                        </FormField>
                        <FormField label="Hora Retorno (*)">
                            <input type="time" name="hora_retorno" value={formData.hora_retorno} onChange={handleChange} required className="w-full rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 focus:border-blue-500 focus:ring-blue-500"/>
                        </FormField>
                    </div>
                </fieldset>

                <fieldset className="space-y-4">
                      <legend className="text-base font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2 mb-2"><FiMap/>Datos Adicionales</legend>
                      
                      {/* ---- CAMPO DE LUGAR DE DESTINO MEJORADO ---- */}
                      <FormField label="Lugar de Destino (*)">
                          <div className="flex gap-2">
                              <input 
                                  type="text" 
                                  name="lugar_destino" 
                                  value={formData.lugar_destino} 
                                  onChange={handleChange} 
                                  required 
                                  className="w-full rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                  placeholder="Escribe o selecciona en el mapa"
                              />
                              <button 
                                  type="button" 
                                  onClick={() => setIsMapOpen(true)}
                                  className="p-2.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 flex-shrink-0"
                                  title="Seleccionar en el mapa"
                              >
                                  <FiMapPin/>
                              </button>
                          </div>
                      </FormField>

                  </fieldset>

                {error && <div className="p-3 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-md text-sm">{error}</div>}
              </form>

              <footer className="p-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-transparent text-slate-800 dark:text-slate-200 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-semibold">Cerrar</button>
                <button type="submit" form="papeleta-form" disabled={isSubmitting} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-wait font-semibold">
                  {isSubmitting ? 'Guardando...' : <><FiSave/> Guardar Papeleta</>}
                </button>
              </footer>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <MapPickerModal
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          onLocationSelect={handleLocationSelect}
      />
    </>
  );
}

export default RegisterPapeletaModal;