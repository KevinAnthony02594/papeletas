// src/store/userStore.js
import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'https://gth.munimoche.gob.pe/Controllers/PlanillaController/PapeletasController.php';

const useUserStore = create((set, get) => ({
  userData: null,
  papeletas: [],
  paginationInfo: null,
  isLoading: false,
  isLoadingPapeletas: false,
  error: null,

  loginByDNI: async (dni) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      params.append('accion', 'validarUsuario');
      params.append('nro_documento', dni);

      const response = await axios.post(API_URL, params);

      if (response.data.codigo != 0 || !response.data.data.contrato) {
        throw new Error(response.data.mensaje || 'DNI no encontrado o inválido.');
      }
      
      set({ 
        userData: { 
          contrato: response.data.data.contrato, 
          motivos: response.data.data.motivos,
          nro_documento: dni 
        }, 
        isLoading: false 
      });
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  fetchPapeletas: async (params) => {
    set({ isLoadingPapeletas: true });
    try {
      const apiParams = new URLSearchParams();
      apiParams.append('accion', 'listarPapeletas');
      apiParams.append('nro_documento', params.nro_documento);
      apiParams.append('pagina', params.pagina || 1);
      apiParams.append('limite', params.limite || 10);
      apiParams.append('filtro_estado', params.filtro_estado || 0);
      apiParams.append('busqueda', params.busqueda || '');

      const response = await axios.post(API_URL, apiParams);

      if (response.data.codigo != 0) {
        throw new Error(response.data.mensaje || 'Error al cargar las papeletas.');
      }
      
      set({
        papeletas: response.data.data.papeletas,
        paginationInfo: response.data.data.pagination,
        isLoadingPapeletas: false
      });

    } catch (error) {
      console.error("Error fetching papeletas:", error);
      set({ isLoadingPapeletas: false });
    }
  },
  
  addPapeleta: (newPapeleta) => {
    set((state) => ({
      papeletas: [newPapeleta, ...state.papeletas],
      paginationInfo: {
        ...state.paginationInfo,
        totalRecords: state.paginationInfo.totalRecords + 1
      }
    }));
  },

  registerPapeleta: async (formData) => {
    const nro_documento = get().userData.nro_documento;
    if (!nro_documento) {
      throw new Error("No se pudo registrar. Faltan datos del usuario.");
    }
  
    const params = new URLSearchParams();
    params.append('accion', 'registrar');
    params.append('nro_documento', nro_documento); 
    params.append('id_empleadocontrato', get().userData.contrato.codigo_Contrato);
    for (const key in formData) {
      params.append(key, formData[key]);
    }

    const response = await axios.post(API_URL, params);
    
    if (response.data.codigo != 0) {
      throw new Error(response.data.mensaje || 'Error al registrar la papeleta.');
    }
    
    await get().fetchPapeletas({
      nro_documento: nro_documento,
      pagina: 1,
      limite: 10,
    });

    return response.data.mensaje;
  },

  logout: () => set({ userData: null, papeletas: [], paginationInfo: null }),
}));

export default useUserStore;