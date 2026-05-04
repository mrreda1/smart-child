import { Calendar, Download, Smile, TrendingUp } from 'lucide-react';
import { THEME } from '@/constants/config';

const DashboardHeader = ({ child, onPrintOverall }) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 border-b border-gray-200 pb-8 mb-8">
      <div className="flex items-center gap-6">
        <img
          src={`${import.meta.env.VITE_IMG_BASE_URL}/${child.photo}`}
          className="w-20 h-20 rounded-full bg-blue-50 border-4 border-white shadow-sm object-cover"
          alt={child.name}
        />
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-1">{child.name}'s Progress</h1>
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
        onClick={onPrintOverall}
        className={`${THEME.primaryYellow} text-black font-black px-6 py-4 rounded-full shadow-sm hover:-translate-y-1 transition-all flex items-center gap-2 text-lg`}
      >
        <Download size={22} /> Overall Report
      </button>
    </div>
  );
};

export default DashboardHeader;
