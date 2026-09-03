import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MOCK_CITIZENS = [
  {
    id: "CIT-8841",
    name: "Rajesh Sharma",
    age: 72,
    gender: "Male",
    mobile: "+91 98721-00214",
    address: "H.No 412, Lane 4, Model Town Phase 2, Ludhiana",
    medical_conditions: "Severe Cardiac History, Pacemaker Fitted (2023)",
    risk_level: "HIGH",
    living_status: "LIVES_ALONE",
    status: "SOS_ACTIVE",
    avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBat7vHn7EPcTZDqJ7rBrJuDdgA-FnLHTqp2a2PWOZ1WqsADGRMSx3KVckgN3anh5JkBJ8ywxMarf-TvyqGQiVvVUKpqr5lyqfLW_5T9RQcv3yzwQ75I0rrptSsmNgrn1x43heM4Yp-OlkO028N2LauSoBYrstyjrEYuuhG6_eUIiCSFYTnIgsdxoVVJiC-sL69UfoICnJfO4J11hBsDzNgrnGvA294LZTRRJAvxHkthKwX0Wrcf2nD"
  },
  {
    id: "CIT-8842",
    name: "Sunita Devi",
    age: 68,
    gender: "Female",
    mobile: "+91 97812-33412",
    address: "H.No 88, Block C, Model Town, Ludhiana",
    medical_conditions: "Hypertension, Arthritis, Blood: A+ Positive",
    risk_level: "MEDIUM",
    living_status: "WITH_SPOUSE",
    status: "SAFE",
    avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "CIT-8843",
    name: "Mohan Lal",
    age: 75,
    gender: "Male",
    mobile: "+91 99145-88210",
    address: "H.No 125, Sector 3, Model Town, Ludhiana",
    medical_conditions: "Diabetes Type 2, Reduced Mobility, Blood: B+ Positive",
    risk_level: "HIGH",
    living_status: "LIVES_ALONE",
    status: "MISSED_CHECKIN",
    avatar_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "CIT-8844",
    name: "Kamla Sharma",
    age: 70,
    gender: "Female",
    mobile: "+91 96461-44912",
    address: "H.No 64, Phase 1, Model Town, Ludhiana",
    medical_conditions: "Asthma, Mild Cognitive Impairment, Blood: AB+ Positive",
    risk_level: "MEDIUM",
    living_status: "LIVES_ALONE",
    status: "SAFE",
    avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "CIT-8845",
    name: "Harish Kumar",
    age: 74,
    gender: "Male",
    mobile: "+91 98881-22901",
    address: "H.No 204, Lane 2, Model Town, Ludhiana",
    medical_conditions: "Hypertension, Post-Stroke Recovery, Blood: O- Negative",
    risk_level: "HIGH",
    living_status: "WITH_SPOUSE",
    status: "SAFE",
    avatar_url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80"
  }
];

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
        if (data && Array.isArray(data) && data.length > 0) {
          setCitizens(data);
        } else {
          setCitizens(MOCK_CITIZENS);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setCitizens(MOCK_CITIZENS);
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

        <div className="flex items-center gap-spacing-sm w-full sm:w-auto">
          <span className="font-label-sm text-on-surface-variant uppercase font-bold">Risk Level:</span>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="h-10 px-spacing-sm bg-surface-container-low rounded-lg border border-surface-container-highest font-body-sm focus:outline-none font-bold"
          >
            <option value="">ALL RISKS</option>
            <option value="HIGH">🔴 HIGH RISK</option>
            <option value="MEDIUM">🟡 MEDIUM RISK</option>
            <option value="LOW">🟢 LOW RISK</option>
          </select>
        </div>
      </div>

      {/* CITIZENS GRID */}
      {loading ? (
        <div className="py-spacing-3xl text-center font-headline-sm text-on-surface-variant">Loading citizen registry...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-spacing-md">
          {citizens.map((c) => (
            <div key={c.id} className="bg-surface-container-lowest p-spacing-md rounded-xl shadow-sm border border-surface-container-highest flex flex-col justify-between gap-spacing-md">
              <div className="flex items-start gap-spacing-md">
                <img
                  src={c.avatar_url || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"}
                  alt={c.name}
                  className="w-16 h-16 rounded-full object-cover shadow-sm bg-surface-container flex-shrink-0"
                />
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-spacing-xs">
                    <span className="font-headline-sm font-bold text-on-surface">{c.name}</span>
                    <span className={`px-spacing-2xs py-spacing-3xs rounded text-[10px] font-bold uppercase ${
                      c.risk_level === 'HIGH' ? 'bg-error-container text-on-error-container' : 'bg-surface-container-highest text-on-surface-variant'
                    }`}>
                      {c.risk_level} RISK
                    </span>
                  </div>
                  <span className="font-label-sm text-on-surface-variant">{c.age} Yrs • {c.gender} • {c.living_status}</span>
                  <span className="font-code-md text-primary font-bold mt-1">{c.mobile}</span>
                </div>
              </div>

              <div className="bg-surface-container-low p-spacing-xs rounded-lg text-left border border-surface-container-highest">
                <span className="font-label-sm text-on-surface-variant uppercase font-bold block">Residence</span>
                <span className="font-body-sm text-on-surface line-clamp-1">{c.address}</span>
              </div>

              <div className="flex items-center justify-between pt-spacing-2xs border-t border-surface-container-highest">
                <span className={`px-spacing-xs py-spacing-3xs rounded font-label-sm font-bold uppercase ${
                  c.status === 'SOS_ACTIVE' ? 'bg-error text-on-error animate-pulse' :
                  c.status === 'MISSED_CHECKIN' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                }`}>
                  {c.status}
                </span>

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
