import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { MOCK_HISTORY_DATA, MOCK_REPORTS_DATA } from '@/constants/mockData';

import DashboardHeader from '@/components/dashboard/reportDashboard/Header';
import ProgressSection from '@/components/dashboard/reportDashboard/ProgressSection';
import ReportsSection from '@/components/dashboard/reportDashboard/HistorySection';
import HistoryDetailModal from '@/components/dashboard/reportDashboard/HistoryDetailModal';
import PrintViewModal from '@/components/dashboard/reportDashboard/PrintViewModal';

const ReportsDashboard = () => {
  const { state } = useLocation();

  if (!state || !state.child) return <Navigate to="/parent/dashboard" />;

  const [activePrintReport, setActivePrintReport] = useState(null);
  const [selectedAssessmentReport, setselectedAssessmentReport] = useState(null);

  const child = state.child;

  const handlePrint = (reportType, payload = null) => {
    setActivePrintReport({ type: reportType, data: payload });
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <>
      {/* Global Print Styles */}
      <style>{`@media print { body { background-color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; } .no-print { display: none !important; } @page { margin: 15mm; size: A4 portrait; } }`}</style>

      <div className={`no-print ${activePrintReport ? 'hidden' : 'block'}`}>
        <DashboardHeader child={child} onPrintOverall={() => handlePrint('overall')} />

        <ProgressSection reportsData={MOCK_REPORTS_DATA} />

        <ReportsSection child={child} onSelectHistoryItem={setselectedAssessmentReport} />
      </div>

      {selectedAssessmentReport && (
        <HistoryDetailModal
          assessmentReport={selectedAssessmentReport}
          onClose={() => setselectedAssessmentReport(null)}
          onDownload={(assessmentReport) => {
            handlePrint('individual', assessmentReport);
            setselectedAssessmentReport(null);
          }}
        />
      )}

      {activePrintReport && (
        <PrintViewModal printState={activePrintReport} child={child} onClose={() => setActivePrintReport(null)} />
      )}
    </>
  );
};

export default ReportsDashboard;
