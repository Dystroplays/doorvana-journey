'use client';

import { Printer, Download } from 'lucide-react';

interface ExportButtonProps {
  segment?: any;
}

export default function ExportButton({ segment }: ExportButtonProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    if (!segment) return;

    const dataStr = JSON.stringify(segment, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `doorvana-${segment.key}-journey.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="flex gap-2 mt-3 print:hidden">
      <button
        onClick={handlePrint}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        <Printer className="w-4 h-4" />
        Print
      </button>
      {segment && (
        <button
          onClick={handleExportJSON}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export JSON
        </button>
      )}
    </div>
  );
}
