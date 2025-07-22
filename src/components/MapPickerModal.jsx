// src/components/MapPickerModal.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiCheck } from 'react-icons/fi';

// --- Arreglo para el ícono por defecto de Leaflet (sin cambios) ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const containerStyle = {
  width: '100%',
  height: '100%'
};

const initialCenter = [-8.1586, -79.0094]; // Moche, Perú

// --- NUEVO: Componente que maneja TODOS los eventos del mapa ---
function MapEventsHandler({ onMarkerSet }) {
  const map = useMap();

  // 1. Maneja los clics del usuario en el mapa
  map.on('click', (e) => {
    onMarkerSet(e.latlng);
  });

  // 2. Maneja la barra de búsqueda
  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider: provider,
      style: 'bar',
      showMarker: false,
      autoClose: true,
      searchLabel: 'Buscar dirección...'
    });

    map.addControl(searchControl);

    const onLocationSelect = (result) => {
      const { x, y } = result.location; // x: lng, y: lat
      const latlng = { lat: y, lng: x };
      onMarkerSet(latlng);
      map.setView(latlng, 15); // Centra el mapa en la ubicación encontrada
    };

    map.on('geosearch/showlocation', onLocationSelect);

    return () => map.removeControl(searchControl);
  }, [map, onMarkerSet]);

  return null;
}


function MapPickerModal({ isOpen, onClose, onLocationSelect }) {
  const [marker, setMarker] = useState(null);
  const [address, setAddress] = useState('Haz clic o busca una ubicación en el mapa.');

  // Efecto para obtener la dirección (Reverse Geocoding) - sin cambios
  useEffect(() => {
    if (marker) {
      const { lat, lng } = marker;
      setAddress('Buscando dirección...');
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(response => response.json())
        .then(data => {
          setAddress(data?.display_name || 'No se pudo obtener la dirección.');
        })
        .catch(() => setAddress('Error al buscar la dirección.'));
    } else {
      setAddress('Haz clic o busca una ubicación en el mapa.');
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
                
                {/* El marcador se muestra donde esté la variable 'marker' */}
                {marker && <Marker position={marker}></Marker>}
                
                {/* El nuevo componente se encarga de actualizar 'marker' */}
                <MapEventsHandler onMarkerSet={setMarker} />
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
