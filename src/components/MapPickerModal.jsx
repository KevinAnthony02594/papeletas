// src/components/MapPickerModal.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet'; // Importamos Leaflet para manejar el ícono
import 'leaflet/dist/leaflet.css'; // ¡Muy importante! Importar los estilos de Leaflet
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiCheck } from 'react-icons/fi';

// --- Arreglo para el ícono por defecto de Leaflet ---
// Esto es necesario porque a veces Webpack no encuentra los íconos por defecto.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});
// --- Fin del arreglo ---

const containerStyle = {
  width: '100%',
  height: '100%'
};

// Coordenadas iniciales (Plaza de Armas de Moche, Perú)
const initialCenter = [-8.1586, -79.0094];

// Componente interno para manejar los clics en el mapa
function LocationMarker({ onMarkerSet }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onMarkerSet(e.latlng); // Avisamos al componente padre de la nueva posición
    }
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}


function MapPickerModal({ isOpen, onClose, onLocationSelect }) {
  const [marker, setMarker] = useState(null);
  const [address, setAddress] = useState('Haz clic en el mapa para seleccionar una ubicación.');

  // Efecto para obtener la dirección cuando el marcador cambia (Reverse Geocoding con Nominatim)
  useEffect(() => {
    if (marker) {
      const { lat, lng } = marker;
      setAddress('Buscando dirección...');
      // Usamos la API gratuita de Nominatim (basada en OpenStreetMap)
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(response => response.json())
        .then(data => {
          if (data && data.display_name) {
            setAddress(data.display_name);
          } else {
            setAddress('No se pudo obtener la dirección.');
          }
        })
        .catch(() => {
          setAddress('Error al buscar la dirección.');
        });
    } else {
      setAddress('Haz clic en el mapa para seleccionar una ubicación.');
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
              <MapContainer
                center={initialCenter}
                zoom={15}
                scrollWheelZoom={true}
                style={containerStyle}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker onMarkerSet={(latlng) => setMarker(latlng)} />
              </MapContainer>
               <div className="absolute bottom-4 left-4 right-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-3 rounded-lg shadow-lg text-sm dark:text-slate-200 flex items-center gap-2 z-[1000]">
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