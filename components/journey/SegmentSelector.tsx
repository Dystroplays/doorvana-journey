'use client';

interface Segment {
  _id: string;
  key: string;
  label: string;
  icon: string;
}

interface SegmentSelectorProps {
  segments: Segment[];
  selectedKey: string;
  onSelect: (key: string) => void;
}

export default function SegmentSelector({ segments, selectedKey, onSelect }: SegmentSelectorProps) {
  return (
    <div className="px-6 py-2 border-b border-gray-200 bg-gray-50 flex gap-1 flex-wrap">
      {segments.map((segment) => (
        <button
          key={segment._id}
          onClick={() => onSelect(segment.key)}
          className={`px-3 py-1.5 rounded-md border-2 transition-all text-xs font-bold whitespace-nowrap ${
            selectedKey === segment.key
              ? 'border-gray-900 bg-gray-900 text-white'
              : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
          }`}
        >
          {segment.icon} {segment.label}
        </button>
      ))}
    </div>
  );
}
