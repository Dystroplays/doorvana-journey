'use client';

interface Requirement {
  _id: string;
  area: string;
  items: string[];
  displayOrder: number;
}

interface Decision {
  _id: string;
  decision: string;
}

interface RequirementsViewProps {
  requirements: Requirement[];
  decisions: Decision[];
  segmentLabel: string;
}

export default function RequirementsView({
  requirements,
  decisions,
  segmentLabel,
}: RequirementsViewProps) {
  return (
    <div className="max-w-3xl">
      <div className="text-xs font-bold uppercase tracking-wider text-red-600 mb-4 pb-2 border-b-2 border-red-100">
        SF Build Requirements — {segmentLabel}
      </div>

      <p className="text-sm text-gray-700 leading-relaxed mb-6">
        Doorvana owns content and messaging. Jeff owns plumbing, automations, and object config.
      </p>

      {requirements.map((req, ri) => (
        <div key={req._id} className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`w-5 h-5 rounded flex items-center justify-center text-white text-xs font-bold ${
                req.items.some((i) => i.includes('⚠️')) ? 'bg-red-600' : 'bg-gray-600'
              }`}
            >
              {ri + 1}
            </span>
            <span className="text-sm font-bold text-gray-900">{req.area}</span>
          </div>

          {req.items.map((item, ii) => {
            const isKeyDecision = item.includes('⚠️');
            return (
              <div
                key={ii}
                className={`flex gap-2 items-start px-2 py-1.5 ml-7 rounded text-sm leading-relaxed ${
                  isKeyDecision
                    ? 'bg-yellow-50 border border-yellow-300 text-yellow-900 font-semibold'
                    : ii % 2 === 0
                    ? 'bg-gray-50'
                    : ''
                }`}
              >
                <span className={`${isKeyDecision ? 'text-yellow-600' : 'text-red-600'} font-bold flex-shrink-0`}>
                  →
                </span>
                <span>{item}</span>
              </div>
            );
          })}
        </div>
      ))}

      {decisions && decisions.length > 0 && (
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-300">
          <div className="text-sm font-bold text-yellow-900 mb-2">
            Open Decisions — {segmentLabel}
          </div>
          <div className="text-sm text-yellow-900 space-y-1.5">
            {decisions.map((d, i) => (
              <div key={d._id}>
                <strong>{i + 1}.</strong> {d.decision}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
