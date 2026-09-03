import React, { createContext, useContext, useState, useMemo } from 'react';

const FilterContext = createContext();

export const INITIAL_FILTERS = {
  policeStation: 'ALL',
  assignedOfficer: 'ALL',
  status: 'ALL',
  caseType: 'ALL'
};

export const POLICE_STATIONS_OPTIONS = [
  'All Police Stations',
  'Model Town Police Station',
  'Sector 17 Police Station',
  'Phase 8 Police Station',
  'Central Police Station',
  'North Zone Police Station',
  'South Zone Police Station'
];

export const OFFICERS_OPTIONS = [
  'All Officers',
  'ASI Amit Singh',
  'HC Raj Kumar',
  'SI Neeraj Kumar',
  'Const. Vikram Sharma',
  'SI Rahul Verma',
  'HC Manpreet Singh'
];

export const STATUS_OPTIONS = [
  'All Statuses',
  'ACTIVE',
  'ACKNOWLEDGED',
  'ASSIGNED',
  'OFFICER DISPATCHED',
  'ON THE WAY',
  'ARRIVED',
  'RESOLVED',
  'CANCELLED'
];

export const CASE_TYPE_OPTIONS = [
  'All Case Types',
  'Medical Emergency',
  'Women Safety',
  'Harassment',
  'Accident',
  'Missing Person',
  'Senior Citizen Assistance',
  'General Emergency'
];

export function applyFiltersAndSearch(cases, searchQuery, filters) {
  if (!cases || !Array.isArray(cases)) return [];

  const query = (searchQuery || '').trim().toLowerCase();

  return cases.filter((c) => {
    // 1. SEARCH QUERY MATCH
    if (query) {
      const caseId = (c.id || c.caseId || '').toLowerCase();
      const citizenName = (c.citizen_name || c.citizenName || '').toLowerCase();
      const mobile = (c.citizen_mobile || c.phone || '').toLowerCase();
      const emergencyType = (c.emergency_type || c.caseType || '').toLowerCase();
      
      const assignment = c.assignment_details || {};
      const officerName = (c.assigned_officer_name || assignment.officer_name || c.assignedOfficer || '').toLowerCase();
      const policeStation = (assignment.police_station || c.police_station || c.policeStation || 'Model Town Police Station').toLowerCase();

      const matchesSearch =
        caseId.includes(query) ||
        citizenName.includes(query) ||
        mobile.includes(query) ||
        officerName.includes(query) ||
        policeStation.includes(query) ||
        emergencyType.includes(query);

      if (!matchesSearch) return false;
    }

    // 2. POLICE STATION FILTER
    if (filters.policeStation && filters.policeStation !== 'ALL') {
      const assignment = c.assignment_details || {};
      const station = assignment.police_station || c.police_station || c.policeStation || 'Model Town Police Station';
      if (station.trim().toLowerCase() !== filters.policeStation.trim().toLowerCase()) {
        return false;
      }
    }

    // 3. ASSIGNED OFFICER FILTER
    if (filters.assignedOfficer && filters.assignedOfficer !== 'ALL') {
      const assignment = c.assignment_details || {};
      const officer = assignment.officer_name || c.assigned_officer_name || c.assignedOfficer || '';
      if (officer.trim().toLowerCase() !== filters.assignedOfficer.trim().toLowerCase()) {
        return false;
      }
    }

    // 4. STATUS FILTER
    if (filters.status && filters.status !== 'ALL') {
      const status = (c.status || '').toUpperCase();
      const targetStatus = filters.status.toUpperCase();
      const normalizedStatus = status.replace(/_/g, ' ');
      const normalizedTarget = targetStatus.replace(/_/g, ' ');
      if (normalizedStatus !== normalizedTarget) {
        return false;
      }
    }

    // 5. CASE TYPE FILTER
    if (filters.caseType && filters.caseType !== 'ALL') {
      const caseType = c.emergency_type || c.caseType || '';
      if (caseType.trim().toLowerCase() !== filters.caseType.trim().toLowerCase()) {
        return false;
      }
    }

    return true;
  });
}

export function FilterProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const setFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const removeFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: 'ALL' }));
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setFilters(INITIAL_FILTERS);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== 'ALL') count++;
    });
    return count;
  }, [filters]);

  const value = {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    setFilter,
    removeFilter,
    clearAllFilters,
    activeFilterCount,
    isFilterPanelOpen,
    setIsFilterPanelOpen
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
}
