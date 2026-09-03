import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SosAlertModal from './components/SosAlertModal';

// Pages
import DashboardOverview from './pages/DashboardOverview';
import CaseDetails from './pages/CaseDetails';
import SeniorCitizensRegistry from './pages/SeniorCitizensRegistry';
import CitizenProfile from './pages/CitizenProfile';
import AssistanceRequests from './pages/AssistanceRequests';
import MissedCheckIns from './pages/MissedCheckIns';
import WelfareChecks from './pages/WelfareChecks';
import OfficersOnDuty from './pages/OfficersOnDuty';
import EscalationsView from './pages/EscalationsView';
import AnalyticsView from './pages/AnalyticsView';
import ReportsView from './pages/ReportsView';
import StationSettings from './pages/StationSettings';

export default function App() {
  const [stats, setStats] = useState({});

  const loadStats = () => {
    fetch('/api/analytics/dashboard-stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-background font-body-md text-on-surface antialiased flex">
      {/* SIDEBAR */}
      <Sidebar stats={stats} />

      {/* HEADER & MAIN CONTENT AREA */}
      <div className="pl-72 flex-1 flex flex-col min-h-screen">
        <Header />

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
            <Route path="/sho/officers" element={<OfficersOnDuty />} />
            <Route path="/sho/active-cases" element={<DashboardOverview />} />
            <Route path="/sho/resolved-cases" element={<DashboardOverview />} />
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
