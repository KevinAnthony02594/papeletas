// src/store/userStore.js
import { create } from 'zustand';
import axios from 'axios';

const useUserStore = create((set, get) => ({
  userData: null,
  isLoading: false,
  error: null,

  // Acción para "iniciar sesión"
  loginByDNI: async (dni) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      params.append('accion', 'formularioPorDocumento');
      params.append('nro_documento', dni);

      // Usamos la ruta del proxy
      const response = await axios.post('/api/Controllers/PlanillaController/PapeletasController.php', params);

      if (response.data.codigo !== 0) {
        throw new Error(response.data.mensaje || 'DNI no encontrado o inválido.');
      }

      set({ userData: response.data.data, isLoading: false });
      return true; // Login exitoso
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false; // Login fallido
    }
  },

  // Acción para añadir una papeleta nueva a la lista
  addPapeleta: (newPapeleta) => {
    set((state) => ({
      userData: {
        ...state.userData,
        papeletas: [newPapeleta, ...state.userData.papeletas],
      },
    }));
  },

  // Acción para "cerrar sesión"
  logout: () => set({ userData: null }),
}));

export default useUserStore;