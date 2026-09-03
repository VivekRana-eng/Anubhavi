import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SosAlertModal from './components/SosAlertModal';
import SeniorApp from './SeniorApp';
import Login from './pages/Login';

// Pages
import DashboardOverview from './pages/DashboardOverview';
import CaseDetails from './pages/CaseDetails';
import SeniorCitizensRegistry from './pages/SeniorCitizensRegistry';
import CitizenProfile from './pages/CitizenProfile';
import AssistanceRequests from './pages/AssistanceRequests';
import MissedCheckIns from './pages/MissedCheckIns';
import WelfareChecks from './pages/WelfareChecks';
import EscalationsView from './pages/EscalationsView';
import AnalyticsView from './pages/AnalyticsView';
import ReportsView from './pages/ReportsView';
import StationSettings from './pages/StationSettings';
import TacticalLiveMap from './pages/TacticalLiveMap';

export default function App() {
  const { user, isAuthenticated, logout } = useAuth();
  const [stats, setStats] = useState({});

  const loadStats = () => {
    fetch('/api/analytics/dashboard-stats')
      .then(res => {
        if (!res.ok) throw new Error('API offline');
        return res.json();
      })
      .then(data => setStats(data))
      .catch(err => {
        // Fallback demo stats
        setStats({
          active_sos_alerts: 3,
          pending_assistance: 8,
          missed_checkins: 5,
          total_senior_citizens: 1248,
          active_cases: 17,
          resolved_cases: 126
        });
      });
  };

  useEffect(() => {
    if (user && (user.role === 'SHO' || user.role === 'DSP' || user.role === 'POLICE_OFFICER')) {
      loadStats();
    }
  }, [user]);

  // 1. UNAUTHENTICATED ROUTE
  if (!isAuthenticated || !user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // 2. SENIOR CITIZEN MOBILE APP INTERFACE
  if (user.role === 'SENIOR_CITIZEN' || user.role === 'CITIZEN') {
    return <SeniorApp username={user.name} onLogout={logout} />;
  }

  // 3. POLICE COMMAND CONSOLE INTERFACE (SHO / DSP / OFFICER)
  return (
    <div className="min-h-screen bg-background font-body-md text-on-surface antialiased flex">
      {/* SIDEBAR */}
      <Sidebar stats={stats} />

      {/* HEADER & MAIN CONTENT AREA */}
      <div className="pl-72 flex-1 flex flex-col min-h-screen">
        <Header user={user} onLogout={logout} />

        <main className="relative pt-20 bg-background min-h-screen w-full px-spacing-lg pb-spacing-2xl">
          <Routes>
            <Route path="/" element={<Navigate to="/sho/dashboard" replace />} />
            <Route path="/login" element={<Navigate to="/sho/dashboard" replace />} />
            <Route path="/sho/dashboard" element={<DashboardOverview />} />
            <Route path="/sho/sos-alerts" element={<DashboardOverview />} />
            <Route path="/sho/cases/:caseId" element={<CaseDetails />} />
            <Route path="/sho/citizens" element={<SeniorCitizensRegistry />} />
            <Route path="/sho/citizens/:citizenId" element={<CitizenProfile />} />
            <Route path="/sho/assistance" element={<AssistanceRequests />} />
            <Route path="/sho/check-ins" element={<MissedCheckIns />} />
            <Route path="/sho/welfare-checks" element={<WelfareChecks />} />
            <Route path="/sho/active-cases" element={<DashboardOverview />} />
            <Route path="/sho/resolved-cases" element={<DashboardOverview />} />
            <Route path="/sho/tactical-map" element={<TacticalLiveMap />} />
            <Route path="/sho/escalations" element={<EscalationsView />} />
            <Route path="/sho/analytics" element={<AnalyticsView />} />
            <Route path="/sho/reports" element={<ReportsView />} />
            <Route path="/sho/settings" element={<StationSettings />} />
            <Route path="*" element={<Navigate to="/sho/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {/* REAL-TIME ALERT POPUP MODAL */}
      <SosAlertModal />
    </div>
  );
}
