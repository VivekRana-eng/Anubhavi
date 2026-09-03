import React from 'react';
import { useFilter } from '../context/FilterContext';

export default function FilterChips() {
  const { searchQuery, setSearchQuery, filters, removeFilter, clearAllFilters, activeFilterCount } = useFilter();

  const hasAnyFilter = searchQuery.trim().length > 0 || activeFilterCount > 0;

  if (!hasAnyFilter) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 py-2 px-1 text-xs">
      <span className="font-extrabold uppercase text-slate-400 text-[10px] tracking-wider">
        ACTIVE FILTERS:
      </span>

      {searchQuery.trim().length > 0 && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-[#2e5746] font-bold border border-emerald-200">
          <span>Search: "{searchQuery}"</span>
          <button
            onClick={() => setSearchQuery('')}
            className="hover:text-red-700 font-black text-sm leading-none"
            title="Remove search filter"
          >
            ×
          </button>
        </span>
      )}

      {filters.policeStation !== 'ALL' && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-[#2e5746] font-bold border border-emerald-200">
          <span>Police Station: {filters.policeStation}</span>
          <button
            onClick={() => removeFilter('policeStation')}
            className="hover:text-red-700 font-black text-sm leading-none"
            title="Remove Police Station filter"
          >
            ×
          </button>
        </span>
      )}

      {filters.assignedOfficer !== 'ALL' && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-[#2e5746] font-bold border border-emerald-200">
          <span>Officer: {filters.assignedOfficer}</span>
          <button
            onClick={() => removeFilter('assignedOfficer')}
            className="hover:text-red-700 font-black text-sm leading-none"
            title="Remove Officer filter"
          >
            ×
          </button>
        </span>
      )}

      {filters.status !== 'ALL' && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-[#2e5746] font-bold border border-emerald-200">
          <span>Status: {filters.status}</span>
          <button
            onClick={() => removeFilter('status')}
            className="hover:text-red-700 font-black text-sm leading-none"
            title="Remove Status filter"
          >
            ×
          </button>
        </span>
      )}

      {filters.caseType !== 'ALL' && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-[#2e5746] font-bold border border-emerald-200">
          <span>Case Type: {filters.caseType}</span>
          <button
            onClick={() => removeFilter('caseType')}
            className="hover:text-red-700 font-black text-sm leading-none"
            title="Remove Case Type filter"
          >
            ×
          </button>
        </span>
      )}

      <button
        onClick={clearAllFilters}
        className="px-2.5 py-1 rounded-full text-slate-500 hover:text-red-600 font-bold hover:underline underline-offset-2 transition-all ml-1"
      >
        CLEAR ALL
      </button>
    </div>
  );
}
