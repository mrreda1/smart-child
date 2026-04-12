// ============================================================================
// FILE: src/views/Dashboards/ReportsDashboard.jsx

import { ASSETS } from "@/assets";
import {
  ColorChartVisual,
  HearingChartVisual,
  MemoryChartVisual,
  MiniLineChart,
  ReactionChartVisual,
} from "@/components/charts/Charts";
import { THEME } from "@/constants/config";
import {
  MOCK_HISTORY_DATA,
  MOCK_REPORTS_DATA,
  OVERALL_RECOMMENDATION,
} from "@/constants/mockData";
import { useAppContext } from "@/context/AppContext";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Download,
  FileText,
  Printer,
  Puzzle,
  Smile,
  TrendingUp,
  X,
} from "lucide-react";
import React, { Activity, useState } from "react";
import { useNavigate } from "react-router-dom";

// ============================================================================
const ReportsDashboard = () => {
  const navigate = useNavigate();
  const { activeChild } = useAppContext();
  const [activePrintReport, setActivePrintReport] = useState(null);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

  const childName = activeChild?.name || "Child";
  const childAge = activeChild?.age || "-";
  const childAvatar = activeChild?.avatar || ASSETS.avatars.child1;

  const handlePrint = (reportType, payload = null) => {
    setActivePrintReport({ type: reportType, data: payload });
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <>
      <style>{`@media print { body { background-color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; } .no-print { display: none !important; } @page { margin: 15mm; size: A4 portrait; } }`}</style>
      <div className={`no-print ${activePrintReport ? "hidden" : "block"}`}>
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 border-b border-gray-200 pb-8">
          <div className="flex items-center gap-6">
            <img
              src={childAvatar}
              className="w-20 h-20 rounded-full bg-blue-50 border-4 border-white shadow-sm object-cover"
              alt={childName}
            />
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-1">
                {childName}'s Progress
              </h1>
              <p className="text-gray-500 font-medium flex items-center gap-2 mb-3">
                <Calendar size={16} /> Last Assessment: Today, 2:30 PM
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <div className="bg-green-50 text-green-700 font-bold px-3 py-1.5 rounded-xl flex items-center gap-2 border border-green-100 w-fit text-sm">
                  <TrendingUp size={16} /> Overall Growth: +15%
                </div>
                <div className="bg-yellow-50 text-yellow-700 font-bold px-3 py-1.5 rounded-xl flex items-center gap-2 border border-yellow-100 w-fit text-sm">
                  <Smile size={16} /> Overall Feeling: Happy 😊
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => handlePrint("overall")}
            className={`${THEME.primaryYellow} text-black font-black px-6 py-4 rounded-full shadow-sm hover:-translate-y-1 transition-all flex items-center gap-2 text-lg`}
          >
            <Download size={22} /> Overall Report
          </button>
        </div>

        <section>
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp size={24} className="text-blue-500" /> General Progress
            (Last 5 Sessions)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(MOCK_REPORTS_DATA)
              .filter(([key]) => key !== "drawing")
              .map(([key, data]) => {
                const Icon = data.icon;
                let ChartComponent;
                if (key === "memory")
                  ChartComponent = <MemoryChartVisual data={data.history} />;
                else if (key === "reaction")
                  ChartComponent = <ReactionChartVisual data={data.history} />;
                else if (key === "color")
                  ChartComponent = (
                    <ColorChartVisual
                      history={data.history}
                      rgb={data.rgbProfile}
                    />
                  );
                else if (key === "hearing")
                  ChartComponent = <HearingChartVisual data={data.history} />;
                else
                  ChartComponent = (
                    <MiniLineChart
                      data={data.history}
                      colorClass={data.textColor}
                    />
                  );

                return (
                  <div
                    key={key}
                    className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col h-full"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div
                        className={`w-12 h-12 rounded-2xl ${data.color} flex items-center justify-center text-white shadow-sm`}
                      >
                        <Icon size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-gray-900">
                          {data.title}
                        </h3>
                        <p
                          className={`text-xs font-bold text-gray-400 flex items-center gap-1 uppercase tracking-wider`}
                        >
                          {key === "drawing"
                            ? "Interactions"
                            : "Metrics & Trends"}
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-5 relative flex-none mb-6">
                      {ChartComponent}
                    </div>
                    <div className="mt-auto p-4 bg-blue-50/50 rounded-xl text-sm text-gray-700 font-medium leading-relaxed border border-blue-100/50">
                      <strong className="text-blue-900 block mb-1 flex items-center gap-1.5">
                        <Activity size={16} /> Insight:
                      </strong>
                      {data.insight}
                    </div>
                  </div>
                );
              })}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <FileText size={24} className="text-pink-500" /> Assessment History
          </h2>
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            {MOCK_HISTORY_DATA.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedHistoryItem(item)}
                className="p-5 md:p-6 border-b border-gray-50 flex items-center justify-between gap-4 hover:bg-gray-50 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Puzzle size={20} />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 text-lg">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-500 font-bold">
                      {item.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline-block bg-gray-100 text-gray-700 text-xs font-black px-3 py-1.5 rounded-lg border border-gray-200">
                    Score: {item.score}
                  </span>
                  <ChevronRight
                    className="text-gray-300 group-hover:text-gray-600 transition-colors"
                    size={20}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {selectedHistoryItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={`${THEME.cardWhite} w-full max-w-lg p-8 relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto`}
          >
            <button
              onClick={() => setSelectedHistoryItem(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors bg-gray-50 hover:bg-gray-100 p-2 rounded-full"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-4 mb-6 pr-8">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-sm">
                <Puzzle size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900 leading-tight">
                  {selectedHistoryItem.title}
                </h2>
                <p className="text-gray-500 font-bold text-sm">
                  {selectedHistoryItem.date}
                </p>
              </div>
            </div>
            <div className="bg-blue-50 p-5 rounded-2xl mb-6 border border-blue-100 text-blue-900">
              <h3 className="font-black text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                <Activity size={16} className="text-blue-500" /> System
                Recommendation
              </h3>
              <p className="text-sm font-medium leading-relaxed">
                {selectedHistoryItem.recommendation}
              </p>
            </div>
            <div className="mb-8 space-y-4">
              <h3 className="font-black text-gray-900 mb-3 text-sm uppercase tracking-wider">
                Detailed Test Results
              </h3>
              {selectedHistoryItem.tests.map((test, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 p-4 rounded-xl border border-gray-100"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="font-bold text-gray-800 flex items-center gap-2">
                      {React.createElement(
                        MOCK_REPORTS_DATA[test.testId].icon,
                        {
                          size: 16,
                          className: MOCK_REPORTS_DATA[test.testId].textColor,
                        },
                      )}
                      {test.title}
                    </div>
                    <div className="font-black text-gray-900">{test.score}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(test.metrics).map(([mKey, mVal], i) => (
                      <div
                        key={i}
                        className="bg-white p-2 rounded-lg border border-gray-100 flex justify-between items-center"
                      >
                        <span className="text-[10px] uppercase font-bold text-gray-400">
                          {mKey}
                        </span>
                        <span className="text-sm font-black text-gray-800">
                          {mVal}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedHistoryItem(null)}
                className="flex-1 bg-gray-100 text-gray-700 font-bold py-3.5 rounded-full hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handlePrint("individual", selectedHistoryItem);
                  setSelectedHistoryItem(null);
                }}
                className={`flex-[2] ${THEME.primaryYellow} ${THEME.textBlack} font-black py-3.5 rounded-full ${THEME.primaryYellowHover} transition-colors flex items-center justify-center gap-2`}
              >
                <Download size={18} /> Download Report
              </button>
            </div>
          </div>
        </div>
      )}

      {activePrintReport && (
        <div className="fixed inset-0 z-50 bg-gray-500/50 backdrop-blur-sm overflow-y-auto print:bg-transparent print:static">
          <div className="min-h-full flex justify-center items-start p-4 sm:p-10">
            <div className="fixed top-4 right-4 flex gap-3 z-[60]">
              <button
                onClick={() => window.print()}
                className="bg-blue-600 text-white font-bold px-6 py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-blue-700 no-print"
              >
                <Printer size={20} /> Print PDF
              </button>
              <button
                onClick={() => setActivePrintReport(null)}
                className="bg-white text-gray-600 font-bold p-3 rounded-full shadow-lg hover:bg-gray-100 no-print"
              >
                <X size={20} />
              </button>
            </div>
            <div className="bg-white w-full max-w-4xl shadow-2xl rounded-2xl relative print:rounded-none print:shadow-none print:w-full print:max-w-none print:h-auto print:static print:bg-transparent print:p-0">
              {activePrintReport.type === "overall" ? (
                <div className="p-6 sm:p-10 print:p-0">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b-2 border-gray-200 pb-8 mb-8 print:flex-row">
                    <div>
                      <img src={ASSETS.logo} alt="logo" className="w-16" />
                      <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
                        Comprehensive Progress Report
                      </h1>
                      <h2 className="text-xl font-bold text-gray-500 mt-2">
                        Overall Cognitive Growth
                      </h2>
                    </div>
                    <div className="text-left sm:text-right print:text-right flex flex-col items-start sm:items-end print:items-end w-full sm:w-auto">
                      <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Generated On
                      </div>
                      <div className="text-lg font-bold text-gray-800 mb-4">
                        {new Date().toLocaleDateString()}
                      </div>
                      <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Child Profile
                      </div>
                      <div className="text-lg font-bold text-gray-800 mb-4">
                        {childName} (Age: {childAge})
                      </div>
                      <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Overall Feeling
                      </div>
                      <div className="text-lg font-bold text-gray-800">
                        Happy 😊
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-4 border-b border-gray-100 pb-2">
                    System Recommendation
                  </h3>
                  <div className="bg-blue-50 p-6 rounded-2xl mb-10 border border-blue-100 text-blue-900 font-medium leading-relaxed text-lg">
                    {OVERALL_RECOMMENDATION}
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-4 border-b border-gray-100 pb-2">
                    Test Trajectories (Last 5 Sessions)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 print:grid-cols-2">
                    {Object.entries(MOCK_REPORTS_DATA)
                      .filter(([key]) => key !== "drawing")
                      .map(([key, data]) => {
                        const Icon = data.icon;
                        let ChartComponent;
                        if (key === "memory")
                          ChartComponent = (
                            <MemoryChartVisual data={data.history} />
                          );
                        else if (key === "reaction")
                          ChartComponent = (
                            <ReactionChartVisual data={data.history} />
                          );
                        else if (key === "color")
                          ChartComponent = (
                            <ColorChartVisual
                              history={data.history}
                              rgb={data.rgbProfile}
                            />
                          );
                        else if (key === "hearing")
                          ChartComponent = (
                            <HearingChartVisual data={data.history} />
                          );
                        else
                          ChartComponent = (
                            <MiniLineChart
                              data={data.history}
                              colorClass={data.textColor}
                            />
                          );

                        return (
                          <div
                            key={key}
                            className="bg-white p-6 rounded-2xl border-2 border-gray-100 flex flex-col break-inside-avoid"
                          >
                            <div className="flex items-center gap-3 mb-4">
                              <Icon size={20} className={data.textColor} />
                              <span className="font-black text-gray-900 text-lg">
                                {data.title}
                              </span>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 flex-none">
                              {ChartComponent}
                            </div>
                            <div className="mt-4 p-3 bg-blue-50/50 rounded-lg text-xs text-gray-700 font-medium leading-relaxed border border-blue-100/50 flex-1">
                              <strong className="text-blue-900 block mb-1 flex items-center gap-1.5">
                                <Activity size={12} /> Insight:
                              </strong>
                              {data.insight}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  <div className="mt-12 border-t border-gray-200 pt-6 flex justify-between items-center">
                    <p className="text-xs font-bold text-gray-400">
                      SMARTCHILD CONFIDENTIAL REPORT
                    </p>
                    <p className="text-xs font-bold text-gray-400 border border-gray-200 px-3 py-1 rounded-full">
                      Overall Summary Record
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-6 sm:p-10 print:p-0">
                  {(() => {
                    const item = activePrintReport.data;
                    return (
                      <>
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b-2 border-gray-200 pb-8 mb-8 print:flex-row">
                          <div>
                            <img
                              src={ASSETS.logo}
                              alt="logo"
                              className="w-16"
                            />
                            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
                              Assessment Result
                            </h1>
                            <h2 className="text-2xl font-bold text-indigo-500 mt-2 flex items-center gap-2">
                              <Puzzle size={24} /> {item.title}
                            </h2>
                          </div>
                          <div className="text-left sm:text-right print:text-right w-full sm:w-auto">
                            <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">
                              Assessment Date
                            </div>
                            <div className="text-lg font-bold text-gray-800 mb-4 sm:mb-0">
                              {item.date}
                            </div>
                            <div className="mt-4 text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">
                              Child Profile
                            </div>
                            <div className="text-lg font-bold text-gray-800">
                              {childName} (Age: {childAge})
                            </div>
                          </div>
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-4 border-b border-gray-100 pb-2">
                          System Recommendation
                        </h3>
                        <div className="bg-gray-50 p-6 rounded-2xl mb-10 border border-gray-100 text-gray-700 font-medium leading-relaxed text-lg">
                          {item.recommendation}
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-4 border-b border-gray-100 pb-2">
                          Detailed Test Results
                        </h3>
                        <div className="space-y-6 mb-10">
                          {item.tests.map((test, idx) => {
                            const testData = MOCK_REPORTS_DATA[test.testId];
                            const Icon = testData.icon;
                            return (
                              <div
                                key={idx}
                                className="bg-white p-6 rounded-2xl border-2 border-gray-100 break-inside-avoid"
                              >
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 border-b border-gray-100 pb-4 gap-2">
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`p-2 rounded-lg ${testData.color} text-white`}
                                    >
                                      <Icon size={20} />
                                    </div>
                                    <span className="font-black text-gray-900 text-lg">
                                      {test.title}
                                    </span>
                                  </div>
                                  <div className="text-2xl font-black text-gray-900">
                                    {test.score}
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 print:grid-cols-4">
                                  {Object.entries(test.metrics).map(
                                    ([mKey, mVal], i) => (
                                      <div key={i}>
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                                          {mKey}
                                        </div>
                                        <div className="text-xl font-black text-gray-800">
                                          {mVal}
                                        </div>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="mt-12 border-t border-gray-200 pt-6 flex justify-between items-center">
                          <p className="text-xs font-bold text-gray-400">
                            SMARTCHILD CONFIDENTIAL REPORT
                          </p>
                          <p className="text-xs font-bold text-gray-400 border border-gray-200 px-3 py-1 rounded-full">
                            Assessment ID: {item.id}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportsDashboard;
