// src/components/Pagination.jsx
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null; 
  }

  return (
    <div className="flex items-center justify-between mt-4 px-4 py-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 rounded-md border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FiChevronLeft />
        Anterior
      </button>

      <span className="text-sm text-slate-700 dark:text-slate-400">
        Página <span className="font-bold">{currentPage}</span> de <span className="font-bold">{totalPages}</span>
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 rounded-md border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Siguiente
        <FiChevronRight />
      </button>
    </div>
  );
}

export default Pagination;