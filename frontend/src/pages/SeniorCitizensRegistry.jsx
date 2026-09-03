import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SeniorCitizensRegistry() {
  const [citizens, setCitizens] = useState([]);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadCitizens = () => {
    setLoading(true);
    let url = '/api/citizens';
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (riskFilter) params.append('risk', riskFilter);
    if (params.toString()) url += `?${params.toString()}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setCitizens(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Senior Name, Mobile, Address, ID..."
            className="w-full h-10 pl-10 pr-spacing-sm bg-surface-container-low text-on-surface font-body-sm rounded border border-outline-variant focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-spacing-sm w-full sm:w-auto">
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="h-10 px-spacing-sm bg-surface-container-low text-on-surface font-label-sm rounded border border-outline-variant font-bold focus:outline-none"
          >
            <option value="">ALL RISK LEVELS</option>
            <option value="HIGH">🔴 HIGH RISK (LIVES ALONE)</option>
            <option value="MEDIUM">🟡 MEDIUM RISK</option>
            <option value="LOW">🟢 LOW RISK</option>
          </select>
        </div>
      </div>

      {/* REGISTRY TABLE */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-highest overflow-hidden">
        {loading ? (
          <div className="py-spacing-2xl text-center font-label-md text-on-surface-variant">
            Loading senior citizen records...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-surface-container-highest text-on-surface-variant font-label-sm uppercase">
                  <th className="p-spacing-md">Citizen ID</th>
                  <th className="p-spacing-md">Name & Age</th>
                  <th className="p-spacing-md">Contact Number</th>
                  <th className="p-spacing-md">Registered Residence</th>
                  <th className="p-spacing-md text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-highest">
                {citizens.map((c) => (
                  <tr key={c.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-spacing-md font-code-md text-primary font-bold">{c.id}</td>
                    <td className="p-spacing-md">
                      <div className="flex items-center gap-spacing-sm">
                        <img src={c.avatar_url} alt={c.name} className="w-9 h-9 rounded-full object-cover bg-surface-container" />
                        <div className="flex flex-col">
                          <span className="font-label-lg text-on-surface font-bold">{c.name}</span>
                          <span className="font-label-sm text-on-surface-variant">{c.age} Yrs • {c.gender}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-spacing-md font-code-md text-on-surface font-semibold">{c.mobile}</td>
                    <td className="p-spacing-md font-body-sm text-on-surface-variant max-w-xs truncate">{c.address}</td>
                    <td className="p-spacing-md text-right">
                      <button
                        onClick={() => navigate(`/sho/citizens/${c.id}`)}
                        className="py-spacing-2xs px-spacing-md bg-primary text-on-primary font-label-sm font-bold rounded shadow-sm hover:bg-on-surface transition-all"
                      >
                        VIEW ONLY
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
