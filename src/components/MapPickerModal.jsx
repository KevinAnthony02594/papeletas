// src/components/MapPickerModal.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiCheck } from 'react-icons/fi';

const containerStyle = {
  width: '100%',
  height: '100%'
};

// Coordenadas iniciales (Plaza de Armas de Moche, Perú)
const initialCenter = {
  lat: -8.1586,
  lng: -79.0094
};

// Usamos el API Key de nuestro archivo .env
const apiKey = import.meta.env.VITE_Maps_API_KEY;

function MapPickerModal({ isOpen, onClose, onLocationSelect }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
  });

  const [marker, setMarker] = useState(null);
  const [address, setAddress] = useState('Haz clic en el mapa para seleccionar una ubicación.');

  const onMapClick = useCallback((e) => {
    setMarker({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  }, []);
  
  // Efecto para obtener la dirección cuando el marcador cambia (Reverse Geocoding)
  useEffect(() => {
    if (marker && window.google) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: marker }, (results, status) => {
        if (status === 'OK' && results[0]) {
          setAddress(results[0].formatted_address);
        } else {
          setAddress('No se pudo obtener la dirección.');
        }
      });
    }
  }, [marker]);

  const handleConfirm = () => {
    if (marker) {
      onLocationSelect(address);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[60] backdrop-blur-sm">
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-3xl h-[80vh] flex flex-col overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <header className="p-4 flex-shrink-0 border-b dark:border-slate-700">
                <h3 className="font-bold text-lg dark:text-white">Seleccionar Ubicación</h3>
            </header>
            <div className="relative flex-grow">
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={initialCenter}
                  zoom={15}
                  onClick={onMapClick}
                >
                  {marker && <MarkerF position={marker} />}
                </GoogleMap>
              ) : (
                <div>Cargando mapa...</div>
              )}
               <div className="absolute bottom-4 left-4 right-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-3 rounded-lg shadow-lg text-sm dark:text-slate-200 flex items-center gap-2">
                    <FiMapPin className="text-blue-500 flex-shrink-0"/>
                    <p className="truncate">{address}</p>
                </div>
            </div>
            <footer className="p-4 flex justify-end gap-3 border-t dark:border-slate-700 flex-shrink-0">
                <button onClick={onClose} className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md">Cancelar</button>
                <button onClick={handleConfirm} disabled={!marker} className="px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:bg-blue-300 flex items-center gap-2">
                    <FiCheck/> Confirmar Ubicación
                </button>
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default MapPickerModal;