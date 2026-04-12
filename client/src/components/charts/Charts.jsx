const MiniLineChart = ({ data, colorClass }) => {
  const max = Math.max(...data) * 1.1;
  const min = 0;
  const range = max - min || 1;
  const points = data
    .map(
      (val, i) =>
        `${(i / (data.length - 1)) * 100},${100 - ((val - min) / range) * 100}`,
    )
    .join(" ");

  return (
    <svg viewBox="0 -10 100 120" className="w-full h-16 overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        className={colorClass}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((val, i) => (
        <circle
          key={i}
          cx={(i / (data.length - 1)) * 100}
          cy={100 - ((val - min) / range) * 100}
          r="4"
          fill="white"
          stroke="currentColor"
          strokeWidth="2"
          className={colorClass}
        />
      ))}
    </svg>
  );
};

const MemoryChartVisual = ({ data }) => {
  const maxArl = 5;
  const arPoints = data
    .map((d, i) => `${(i / (data.length - 1)) * 100},${100 - d.ar}`)
    .join(" ");
  const arlPoints = data
    .map(
      (d, i) =>
        `${(i / (data.length - 1)) * 100},${100 - (d.arl / maxArl) * 100}`,
    )
    .join(" ");

  return (
    <div className="w-full h-32 relative flex pt-2 pb-4">
      <div className="absolute left-0 top-2 bottom-4 flex flex-col justify-between text-[9px] font-black text-[#22c55e] z-10">
        <span>100%</span>
        <span>0%</span>
      </div>
      <div className="absolute right-0 top-2 bottom-4 flex flex-col justify-between text-[9px] font-black text-[#f97316] z-10 items-end">
        <span>5s</span>
        <span>0s</span>
      </div>
      <div className="w-full h-full px-6">
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <line
            x1="0"
            y1="50"
            x2="100"
            y2="50"
            stroke="#e5e7eb"
            strokeDasharray="2"
          />
          <polyline
            points={arPoints}
            fill="none"
            stroke="#22c55e"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points={arlPoints}
            fill="none"
            stroke="#f97316"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="4 2"
          />
          {data.map((d, i) => {
            const x = (i / (data.length - 1)) * 100;
            return (
              <g key={i}>
                <circle
                  cx={x}
                  cy={100 - d.ar}
                  r="3"
                  fill="#22c55e"
                  stroke="white"
                  strokeWidth="1.5"
                />
                <circle
                  cx={x}
                  cy={100 - (d.arl / maxArl) * 100}
                  r="3"
                  fill="#f97316"
                  stroke="white"
                  strokeWidth="1.5"
                />
              </g>
            );
          })}
        </svg>
      </div>
      <div className="absolute -bottom-2 w-full flex justify-center gap-4 text-[9px] font-bold">
        <span className="text-[#22c55e] flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#22c55e] inline-block"></span>{" "}
          Accuracy (AR)
        </span>
        <span className="text-[#f97316] flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#f97316] inline-block"></span>{" "}
          Latency (ARL)
        </span>
      </div>
    </div>
  );
};

const ReactionChartVisual = ({ data }) => {
  const maxMrt = 2000;
  const barW = 8;
  const mrtPoints = data
    .map(
      (d, i) =>
        `${(i / (data.length - 1)) * 90 + 5},${100 - (d.mrt / maxMrt) * 100}`,
    )
    .join(" ");

  return (
    <div className="w-full h-32 relative flex pt-2 pb-4">
      <div className="absolute left-0 top-2 bottom-4 flex flex-col justify-between text-[9px] font-black text-[#ef4444] z-10">
        <span>2s</span>
        <span>0s</span>
      </div>
      <div className="absolute right-0 top-2 bottom-4 flex flex-col justify-between text-[9px] font-black text-[#60a5fa] z-10 items-end">
        <span>100%</span>
        <span>0%</span>
      </div>
      <div className="w-full h-full px-6">
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          {data.map((d, i) => {
            const x = (i / (data.length - 1)) * 90 + 5;
            const h = d.pi;
            return (
              <rect
                key={`bar-${i}`}
                x={x - barW / 2}
                y={100 - h}
                width={barW}
                height={h}
                fill="#93c5fd"
                rx="2"
                opacity="0.8"
              />
            );
          })}
          <polyline
            points={mrtPoints}
            fill="none"
            stroke="#ef4444"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {data.map((d, i) => {
            const x = (i / (data.length - 1)) * 90 + 5;
            return (
              <circle
                key={`dot-${i}`}
                cx={x}
                cy={100 - (d.mrt / maxMrt) * 100}
                r="3"
                fill="#ef4444"
                stroke="white"
                strokeWidth="1.5"
              />
            );
          })}
        </svg>
      </div>
      <div className="absolute -bottom-2 w-full flex justify-center gap-4 text-[9px] font-bold">
        <span className="text-[#ef4444] flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#ef4444] inline-block"></span>{" "}
          Mean Response Time (MRT)
        </span>
        <span className="text-[#3b82f6] flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#93c5fd] inline-block"></span>{" "}
          Precision (PI)
        </span>
      </div>
    </div>
  );
};

const ColorChartVisual = ({ history, rgb }) => {
  const linePts = history
    .map((val, i) => `${(i / (history.length - 1)) * 100},${100 - val}`)
    .join(" ");
  const rad = Math.PI / 180;
  const getPt = (val, angle) => {
    const r = 35 * (val / 100);
    return `${50 + r * Math.sin(angle * rad)},${50 - r * Math.cos(angle * rad)}`;
  };
  const radarPts = `${getPt(rgb.r, 0)} ${getPt(rgb.g, 120)} ${getPt(rgb.b, 240)}`;
  const radarBg = `${getPt(100, 0)} ${getPt(100, 120)} ${getPt(100, 240)}`;

  return (
    <div className="w-full h-32 flex items-center gap-2 pt-2 pb-4">
      <div className="flex-[3] h-full relative border-r border-gray-200 pr-4">
        <div className="absolute left-0 top-2 bottom-4 flex flex-col justify-between text-[9px] font-black text-gray-400 z-10">
          <span>100%</span>
          <span>0%</span>
        </div>
        <div className="w-full h-full pl-6">
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            <polyline
              points={linePts}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {history.map((val, i) => (
              <circle
                key={i}
                cx={(i / (history.length - 1)) * 100}
                cy={100 - val}
                r="3"
                fill="#3b82f6"
                stroke="white"
                strokeWidth="1.5"
              />
            ))}
          </svg>
        </div>
      </div>
      <div className="flex-[2] h-full flex flex-col items-center justify-center relative">
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <polygon
            points={radarBg}
            fill="#f3f4f6"
            stroke="#d1d5db"
            strokeWidth="1"
          />
          <line
            x1="50"
            y1="50"
            x2={getPt(100, 0).split(",")[0]}
            y2={getPt(100, 0).split(",")[1]}
            stroke="#e5e7eb"
          />
          <line
            x1="50"
            y1="50"
            x2={getPt(100, 120).split(",")[0]}
            y2={getPt(100, 120).split(",")[1]}
            stroke="#e5e7eb"
          />
          <line
            x1="50"
            y1="50"
            x2={getPt(100, 240).split(",")[0]}
            y2={getPt(100, 240).split(",")[1]}
            stroke="#e5e7eb"
          />
          <polygon
            points={radarPts}
            fill="rgba(59, 130, 246, 0.5)"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <text
            x="50"
            y="8"
            fontSize="10"
            textAnchor="middle"
            fill="#ef4444"
            fontWeight="black"
          >
            R
          </text>
          <text
            x="92"
            y="80"
            fontSize="10"
            textAnchor="middle"
            fill="#22c55e"
            fontWeight="black"
          >
            G
          </text>
          <text
            x="8"
            y="80"
            fontSize="10"
            textAnchor="middle"
            fill="#3b82f6"
            fontWeight="black"
          >
            B
          </text>
        </svg>
      </div>
      <div className="absolute -bottom-2 w-full flex justify-between px-8 text-[9px] font-bold text-gray-500">
        <span>Accuracy Line</span>
        <span>RGB Profile Radar</span>
      </div>
    </div>
  );
};

const HearingChartVisual = ({ data }) => {
  const maxAarl = 5;
  const barW = 8;
  const isrPoints = data
    .map((d, i) => `${(i / (data.length - 1)) * 90 + 5},${100 - d.isr}`)
    .join(" ");

  return (
    <div className="w-full h-32 relative flex pt-2 pb-4">
      <div className="absolute left-0 top-2 bottom-4 flex flex-col justify-between text-[9px] font-black text-[#a855f7] z-10">
        <span>100%</span>
        <span>0%</span>
      </div>
      <div className="absolute right-0 top-2 bottom-4 flex flex-col justify-between text-[9px] font-black text-gray-400 z-10 items-end">
        <span>5s</span>
        <span>0s</span>
      </div>
      <div className="w-full h-full px-6">
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          {data.map((d, i) => {
            const x = (i / (data.length - 1)) * 90 + 5;
            const h = (d.aarl / maxAarl) * 100;
            return (
              <rect
                key={`bar-${i}`}
                x={x - barW / 2}
                y={100 - h}
                width={barW}
                height={h}
                fill="#e5e7eb"
                rx="2"
              />
            );
          })}
          <polyline
            points={isrPoints}
            fill="none"
            stroke="#a855f7"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {data.map((d, i) => {
            const x = (i / (data.length - 1)) * 90 + 5;
            return (
              <circle
                key={`dot-${i}`}
                cx={x}
                cy={100 - d.isr}
                r="3"
                fill="#a855f7"
                stroke="white"
                strokeWidth="1.5"
              />
            );
          })}
        </svg>
      </div>
      <div className="absolute -bottom-2 w-full flex justify-center gap-4 text-[9px] font-bold">
        <span className="text-[#a855f7] flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#a855f7] inline-block"></span>{" "}
          Success Rate (ISR)
        </span>
        <span className="text-gray-500 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-gray-200 inline-block"></span>{" "}
          Latency (AARL)
        </span>
      </div>
    </div>
  );
};

export {
  MiniLineChart,
  MemoryChartVisual,
  ReactionChartVisual,
  ColorChartVisual,
  HearingChartVisual,
};
