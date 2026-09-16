import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_RESIDENTS } from '../data/mockResidents';

export default function SeniorCitizensRegistry() {
  const [citizens, setCitizens] = useState([]);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [registryView, setRegistryView] = useState('grid');
  const navigate = useNavigate();

  const filterLocalResidents = () => {
    let filtered = [...MOCK_RESIDENTS];
    if (search) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(c =>
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.mobile && c.mobile.toLowerCase().includes(q)) ||
        (c.id && c.id.toLowerCase().includes(q)) ||
        (c.address && c.address.toLowerCase().includes(q)) ||
        (c.residence && c.residence.toLowerCase().includes(q)) ||
        (c.aadhaar_masked && c.aadhaar_masked.toLowerCase().includes(q))
      );
    }
    if (riskFilter) {
      filtered = filtered.filter(c => (c.risk_level || c.riskLevel) === riskFilter);
    }
    setCitizens(filtered);
  };

  const loadCitizens = () => {
    setLoading(true);
    let url = '/api/citizens';
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (riskFilter) params.append('risk', riskFilter);
    if (params.toString()) url += `?${params.toString()}`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('API offline');
        return res.json();
      })
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          setCitizens(data);
        } else {
          filterLocalResidents();
        }
        setLoading(false);
      })
      .catch(err => {
        filterLocalResidents();
        setLoading(false);
      });
  };

  useEffect(() => {
    loadCitizens();
  }, [search, riskFilter]);

  return (
    <div className="flex flex-col gap-spacing-lg w-full">
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-spacing-lg border border-surface-container-highest flex flex-col md:flex-row items-start md:items-center justify-between gap-spacing-md">
        <div className="flex flex-col">
          <div className="flex items-center gap-spacing-xs">
            <span className="px-spacing-xs py-spacing-3xs rounded bg-primary-container text-on-primary font-label-sm uppercase font-bold">
              REGISTRY DATABASE
            </span>
            <span className="font-code-md text-on-surface-variant font-bold">CCTNS SENIOR INDEX</span>
          </div>
          <h1 className="font-headline-lg text-on-surface font-bold tracking-tight mt-1">
            Senior Citizen 360 Registry
          </h1>
          <p className="font-body-sm text-on-surface-variant">
            Registered elderly residents in Model Town Police Station jurisdiction with medical & emergency dossiers.
          </p>
        </div>
      </div>

      {/* FILTER & SEARCH STRIP */}
      <div className="bg-surface-container-lowest p-spacing-md rounded-xl shadow-sm border border-surface-container-highest flex flex-col sm:flex-row items-center justify-between gap-spacing-md">
        <div className="relative w-full sm:w-96">
          <span className="material-symbols-outlined absolute left-spacing-sm top-1/2 -translate-y-1/2 text-outline text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search citizen name, phone, Aadhaar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-spacing-sm bg-surface-container-low rounded-lg border border-surface-container-highest font-body-sm focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center rounded-lg border border-surface-container-highest bg-surface-container-low p-1" role="group" aria-label="Registry view">
          <button
            type="button"
            onClick={() => setRegistryView('grid')}
            className={`flex h-8 w-8 items-center justify-center rounded-md transition ${registryView === 'grid' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
            aria-label="Grid view"
            aria-pressed={registryView === 'grid'}
            title="Grid view"
          >
            <span className="material-symbols-outlined text-[18px]">grid_view</span>
          </button>
          <button
            type="button"
            onClick={() => setRegistryView('list')}
            className={`flex h-8 w-8 items-center justify-center rounded-md transition ${registryView === 'list' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
            aria-label="List view"
            aria-pressed={registryView === 'list'}
            title="List view"
          >
            <span className="material-symbols-outlined text-[18px]">view_list</span>
          </button>
        </div>


      </div>

      {/* CITIZENS GRID */}
      {loading ? (
        <div className="py-spacing-3xl text-center font-headline-sm text-on-surface-variant">Loading citizen registry...</div>
      ) : (
        <div className={registryView === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-spacing-md' : 'flex flex-col gap-spacing-md'}>
          {citizens.map((c) => (
            <div key={c.id} className={`bg-surface-container-lowest p-spacing-md rounded-xl shadow-sm border border-surface-container-highest flex ${registryView === 'list' ? 'flex-col sm:flex-row sm:items-center' : 'flex-col'} justify-between gap-spacing-md`}>
              <div className="flex items-start gap-spacing-md">
                <img
                  src={c.avatar_url || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"}
                  alt={c.name}
                  className="w-16 h-16 rounded-full object-cover shadow-sm bg-surface-container flex-shrink-0"
                />
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-spacing-xs">
                    <span className="font-headline-sm font-bold text-on-surface">{c.name}</span>
                  </div>
                  <span className="font-label-sm text-on-surface-variant">{c.age} Yrs • {c.gender} • {c.living_status}</span>
                  <span className="font-code-md text-primary font-bold mt-1">{c.mobile}</span>
                </div>
              </div>

              <div className="bg-surface-container-low p-spacing-xs rounded-lg text-left border border-surface-container-highest">
                <span className="font-label-sm text-on-surface-variant uppercase font-bold block">Residence</span>
                <span className="font-body-sm text-on-surface line-clamp-1">{c.address}</span>
              </div>

              <div className="flex items-center justify-end pt-spacing-2xs border-t border-surface-container-highest">

                <button
                  onClick={() => navigate(`/sho/citizens/${c.id}`)}
                  className="px-spacing-md py-spacing-xs bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface rounded font-label-sm font-bold transition-all"
                >
                  VIEW PROFILE →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
