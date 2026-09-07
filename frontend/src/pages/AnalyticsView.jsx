import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const DEFAULT_CHARTS = {
  sos_by_day: [
    { day: 'Mon', sos: 12, assistance: 8 },
    { day: 'Tue', sos: 9, assistance: 14 },
    { day: 'Wed', sos: 15, assistance: 11 },
    { day: 'Thu', sos: 7, assistance: 16 },
    { day: 'Fri', sos: 18, assistance: 13 },
    { day: 'Sat', sos: 22, assistance: 19 },
    { day: 'Sun', sos: 14, assistance: 10 }
  ],
  sos_by_type: [
    { name: 'Medical Emergency', value: 45, color: '#DC2626' },
    { name: 'Home Safety / Intrusion', value: 20, color: '#EA580C' },
    { name: 'Accident / Fall', value: 18, color: '#D97706' },
    { name: 'Harassment / Dispute', value: 12, color: '#2563EB' },
    { name: 'Other Urgent Assistance', value: 5, color: '#059669' }
  ],
  response_trend: [
    { time: '08:00', avg_mins: 6.2 },
    { time: '11:00', avg_mins: 7.8 },
    { time: '14:00', avg_mins: 5.4 },
    { time: '17:00', avg_mins: 8.1 },
    { time: '20:00', avg_mins: 6.9 },
    { time: '23:00', avg_mins: 4.8 }
  ]
};

export default function AnalyticsView() {
  const [charts, setCharts] = useState(DEFAULT_CHARTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/analytics/charts')
      .then(res => {
        if (!res.ok) throw new Error('API offline');
        return res.json();
      })
      .then(data => {
        if (data && data.sos_by_day) {
          setCharts(data);
        }
      })
      .catch(() => {
        // Retain default demo charts
      });
  }, []);

  return (
    <div className="flex flex-col gap-spacing-lg w-full">
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-spacing-lg border border-surface-container-highest flex flex-col md:flex-row items-start md:items-center justify-between gap-spacing-md">
        <div className="flex flex-col">
          <div className="flex items-center gap-spacing-xs">
            <span className="px-spacing-xs py-spacing-3xs rounded bg-primary-container text-on-primary font-label-sm uppercase font-bold">
              INTELLIGENCE ANALYTICS
            </span>
            <span className="font-code-md text-on-surface-variant font-bold">STATION METRICS</span>
          </div>
          <h1 className="font-headline-lg text-on-surface font-bold tracking-tight mt-1">
            Station Analytics & Response Performance
          </h1>
          <p className="font-body-sm text-on-surface-variant">
            Historical response time trends, emergency incident distribution, and SLA resolution velocity.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-spacing-2xl text-center font-label-md text-on-surface-variant">Loading analytics charts...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-spacing-lg">
          {/* CHART 1: SOS & ASSISTANCE BY DAY */}
          <div className="bg-surface-container-lowest p-spacing-lg rounded-xl shadow-sm border border-surface-container-highest flex flex-col gap-spacing-md">
            <span className="font-headline-sm font-bold text-on-surface">Weekly Emergency Volume by Day</span>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.sos_by_day}>
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="sos" fill="#DC2626" name="SOS Alerts" />
                  <Bar dataKey="assistance" fill="#2563EB" name="Assistance Requests" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* CHART 2: STATUS DISTRIBUTION */}
          <div className="bg-surface-container-lowest p-spacing-lg rounded-xl shadow-sm border border-surface-container-highest flex flex-col gap-spacing-md">
            <span className="font-headline-sm font-bold text-on-surface">Case Status Distribution</span>
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.status_distribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {charts.status_distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* CHART 3: RESPONSE TIME TREND */}
          <div className="bg-surface-container-lowest p-spacing-lg rounded-xl shadow-sm border border-surface-container-highest flex flex-col gap-spacing-md lg:col-span-2">
            <span className="font-headline-sm font-bold text-on-surface">Average Police Response Time Trend (Minutes)</span>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts.response_time_trend}>
                  <XAxis dataKey="week" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Line type="monotone" dataKey="minutes" stroke="#059669" strokeWidth={3} name="Response Time (Min)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
