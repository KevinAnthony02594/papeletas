// src/pages/PapeletasPage.jsx
import React, { useState, useEffect } from 'react';
import useUserStore from '../store/userStore';
import RegisterPapeletaModal from '../components/RegisterPapeletaModal';
import PapeletaList from '../components/PapeletaList';
import Pagination from '../components/Pagination';
import { FiPlusCircle, FiSearch, FiDownload } from 'react-icons/fi';
import { CSVLink } from "react-csv";

function PapeletasPage() {
    const { userData, papeletas, paginationInfo, fetchPapeletas, isLoadingPapeletas } = useUserStore();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState(0); 
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const csvHeaders = [
        { label: "Numero Papeleta", key: "numero_papeleta" },
        { label: "Fecha", key: "fecha_papeleta" },
        { label: "Motivo", key: "motivo_nombre" },
        // ... (resto de tus cabeceras)
    ];

    useEffect(() => {
        if (userData?.nro_documento) {
            fetchPapeletas({
                nro_documento: userData.nro_documento,
                pagina: currentPage,
                limite: 9, 
                filtro_estado: activeFilter,
                busqueda: searchTerm
            });
        }
    }, [currentPage, activeFilter, searchTerm, userData, fetchPapeletas]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Volver a la página 1 al buscar
    };

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
        setCurrentPage(1); // Volver a la página 1 al filtrar
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Gestión de Papeletas</h2>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg shadow-lg hover:bg-blue-700 transition-transform active:scale-95">
                    <FiPlusCircle />
                    <span className="font-semibold">Nueva Papeleta</span>
                </button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div className="relative flex-grow">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="search"
                        placeholder="Buscar por motivo o lugar..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                </div>
                <div className="flex-shrink-0 flex items-center gap-2">
                    <CSVLink
                        data={papeletas}
                        headers={csvHeaders}
                        filename={`reporte_papeletas.csv`}
                        className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg shadow-md hover:bg-green-700 transition"
                    >
                        <FiDownload size={16} />
                        <span className="text-sm font-semibold">Exportar</span>
                    </CSVLink>
                    <div className="flex items-center bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                        <button onClick={() => handleFilterChange(0)} className={`px-3 py-1 text-sm font-semibold rounded-md transition ${activeFilter === 0 ? 'bg-white dark:bg-slate-900 text-blue-600 shadow' : 'text-slate-600 dark:text-slate-300'}`}>Todas</button>
                        <button onClick={() => handleFilterChange(1)} className={`px-3 py-1 text-sm font-semibold rounded-md transition ${activeFilter === 1 ? 'bg-white dark:bg-slate-900 text-blue-600 shadow' : 'text-slate-600 dark:text-slate-300'}`}>Aprobadas</button>
                        <button onClick={() => handleFilterChange(2)} className={`px-3 py-1 text-sm font-semibold rounded-md transition ${activeFilter === 2 ? 'bg-white dark:bg-slate-900 text-blue-600 shadow' : 'text-slate-600 dark:text-slate-300'}`}>Pendientes</button>
                    </div>
                </div>
            </div>

            {isLoadingPapeletas ? (
                <div className="min-h-[40vh] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <PapeletaList 
                    papeletas={papeletas} 
                    onOpenModal={() => setIsModalOpen(true)} 
                />
            )}
            
            <Pagination 
                currentPage={currentPage} 
                totalPages={paginationInfo?.totalPages || 1} 
                onPageChange={(page) => setCurrentPage(page)}
            />

            <RegisterPapeletaModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
export default PapeletasPage;