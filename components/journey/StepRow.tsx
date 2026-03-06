'use client';

interface Step {
  _id: string;
  day: string;
  action: string;
  detail: string;
  tool: string;
  icon: string;
  isFuture: boolean;
}

interface Phase {
  accent: string;
}

interface StepRowProps {
  step: Step;
  phase: Phase;
  index: number;
  total: number;
}

export default function StepRow({ step, phase, index, total }: StepRowProps) {
  const isFuture = step.isFuture || step.detail.includes('Future state') || step.day.includes('Future');

  return (
    <div className="flex gap-3 items-start" style={{ opacity: isFuture ? 0.6 : 1 }}>
      {/* Timeline Icon */}
      <div className="flex flex-col items-center min-w-[26px]">
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 z-10 ${
            isFuture ? 'border-2 border-dashed border-gray-400 bg-gray-300' : ''
          }`}
          style={{
            background: isFuture ? '#adb5bd' : phase.accent,
            color: '#fff',
          }}
        >
          {step.icon}
        </div>
        {index < total - 1 && (
          <div
            className="w-0.5 h-8 mt-0.5"
            style={{
              background: `${phase.accent}33`,
            }}
          />
        )}
      </div>

      {/* Step Content */}
      <div className="flex-1 pb-2">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span
            className={`text-xs font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${
              isFuture ? 'bg-gray-200 text-gray-600' : ''
            }`}
            style={{
              color: isFuture ? '#868e96' : phase.accent,
              background: isFuture ? '#e9ecef' : `${phase.accent}15`,
            }}
          >
            {step.day}
          </span>
          <span className="text-sm font-bold text-gray-900">{step.action}</span>
          {isFuture && (
            <span className="text-xs font-bold text-gray-500 bg-gray-200 px-1 py-0.5 rounded">
              FUTURE
            </span>
          )}
        </div>
        <div className="text-sm text-gray-700 leading-snug">{step.detail}</div>
        <div className="mt-1 text-xs font-semibold text-gray-500 bg-gray-100 inline-block px-2 py-0.5 rounded">
          {step.tool}
        </div>
      </div>
    </div>
  );
}
