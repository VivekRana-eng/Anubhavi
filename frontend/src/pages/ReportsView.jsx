import React, { useEffect, useState } from 'react';

export default function ReportsView() {
  const [reportsData, setReportsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reports')
      .then(res => res.json())
      .then(data => {
        setReportsData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleExportCsv = () => {
    window.open('/api/reports/export-csv', '_blank');
  };

  const handlePrintPdf = () => {
    window.open('/api/reports/pdf-summary', '_blank');
  };

  return (
    <div className="flex flex-col gap-spacing-lg w-full">
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-spacing-lg border border-surface-container-highest flex flex-col md:flex-row items-start md:items-center justify-between gap-spacing-md">
        <div className="flex flex-col">
          <div className="flex items-center gap-spacing-xs">
            <span className="px-spacing-xs py-spacing-3xs rounded bg-primary-container text-on-primary font-label-sm uppercase font-bold">
              OFFICIAL RECORDS
            </span>
            <span className="font-code-md text-on-surface-variant font-bold">CCTNS FIR LOGS</span>
          </div>
          <h1 className="font-headline-lg text-on-surface font-bold tracking-tight mt-1">
            FIR Logs & Official Station Reports
          </h1>
          <p className="font-body-sm text-on-surface-variant">
            Export station General Diary logs, emergency incident summaries, and statutory police reports.
          </p>
        </div>

        <div className="flex items-center gap-spacing-sm">
          <button
            onClick={handleExportCsv}
            className="px-spacing-md py-spacing-xs bg-primary text-on-primary font-label-lg font-bold rounded shadow hover:bg-on-surface flex items-center gap-spacing-xs"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            EXPORT CSV DATA
          </button>

          <button
            onClick={handlePrintPdf}
            className="px-spacing-md py-spacing-xs bg-surface-container-high text-on-surface font-label-lg font-bold rounded hover:bg-surface-container-highest border border-surface-container-highest flex items-center gap-spacing-xs"
          >
            <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            PRINT PDF SUMMARY
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-spacing-md">
        {loading ? (
          <div className="col-span-full py-spacing-2xl text-center font-label-md text-on-surface-variant">Loading station reports...</div>
        ) : (
          reportsData?.reports.map((rep) => (
            <div key={rep.id} className="bg-surface-container-lowest p-spacing-lg rounded-xl shadow-sm border border-surface-container-highest flex flex-col justify-between gap-spacing-md">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="font-code-md text-primary font-bold">{rep.id}</span>
                  <h3 className="font-headline-sm font-bold text-on-surface mt-1">{rep.name}</h3>
                  <span className="font-label-sm text-on-surface-variant">Category: {rep.category} • Cases: {rep.cases_count}</span>
                  <span className="font-label-sm text-secondary mt-1">Last Generated: {rep.generated_at}</span>
                </div>
                <span className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">description</span>
                </span>
              </div>

              <div className="flex items-center gap-spacing-sm border-t border-surface-container-highest pt-spacing-xs">
                <button
                  onClick={handleExportCsv}
                  className="flex-1 py-spacing-2xs bg-surface-container-low text-on-surface rounded font-label-sm font-bold hover:bg-surface-container"
                >
                  DOWNLOAD CSV
                </button>
                <button
                  onClick={handlePrintPdf}
                  className="flex-1 py-spacing-2xs bg-primary text-on-primary rounded font-label-sm font-bold hover:bg-on-surface"
                >
                  VIEW PRINTABLE PDF
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
