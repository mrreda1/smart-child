import { Activity, TrendingUp } from 'lucide-react';
import {
  ColorChartVisual,
  HearingChartVisual,
  MemoryChartVisual,
  MiniLineChart,
  ReactionChartVisual,
} from '@/components/charts/Charts';

const ProgressSection = ({ reportsData }) => {
  const renderChart = (key, data) => {
    switch (key) {
      case 'memory':
        return <MemoryChartVisual data={data.history} />;
      case 'reaction':
        return <ReactionChartVisual data={data.history} />;
      case 'color':
        return <ColorChartVisual history={data.history} rgb={data.rgbProfile} />;
      case 'hearing':
        return <HearingChartVisual data={data.history} />;
      default:
        return <MiniLineChart data={data.history} colorClass={data.textColor} />;
    }
  };

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
        <TrendingUp size={24} className="text-blue-500" /> General Progress (Last 5 Sessions)
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.entries(reportsData)
          .filter(([key]) => key !== 'drawing')
          .map(([key, data]) => {
            const Icon = data.icon;
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
                    <h3 className="text-xl font-black text-gray-900">{data.title}</h3>
                    <p className={`text-xs font-bold text-gray-400 flex items-center gap-1 uppercase tracking-wider`}>
                      Metrics & Trends
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 relative flex-none mb-6">{renderChart(key, data)}</div>
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
  );
};

export default ProgressSection;
