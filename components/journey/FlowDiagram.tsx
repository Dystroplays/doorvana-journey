'use client';

interface FlowItem {
  _id: string;
  text: string;
  bg: string;
  fg: string;
  isSmall: boolean;
}

interface FlowDiagramProps {
  items: FlowItem[];
}

export default function FlowDiagram({ items }: FlowDiagramProps) {
  return (
    <div className="px-6 py-3 bg-gray-100 border-b border-gray-200 overflow-x-auto">
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        {items.map((item, i) => (
          <div key={item._id} className="flex items-center gap-1.5">
            <span
              className={`rounded-full font-bold whitespace-nowrap ${
                item.isSmall ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs'
              }`}
              style={{
                background: item.bg,
                color: item.fg,
              }}
            >
              {item.text}
            </span>
            {i < items.length - 1 && !item.isSmall && !items[i + 1]?.isSmall && (
              <span className="text-gray-400 font-bold text-sm">→</span>
            )}
            {item.isSmall && i < items.length - 1 && !items[i + 1]?.isSmall && (
              <span className="text-gray-400 font-bold text-sm">→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
