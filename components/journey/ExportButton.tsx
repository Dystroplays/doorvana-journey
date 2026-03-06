'use client';

import { useState } from 'react';
import { Printer, Download, Upload, CheckCircle, AlertCircle } from 'lucide-react';

interface ExportButtonProps {
  segment?: any;
}

type TrelloStatus = 'idle' | 'loading' | 'success' | 'error';

export default function ExportButton({ segment }: ExportButtonProps) {
  const [trelloStatus, setTrelloStatus] = useState<TrelloStatus>('idle');
  const [trelloMessage, setTrelloMessage] = useState('');

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

  const handleExportTrello = async () => {
    if (!segment) return;
    setTrelloStatus('loading');
    setTrelloMessage('');

    try {
      const res = await fetch('/api/trello/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: segment.label,
          requirements: segment.requirements ?? [],
          decisions: segment.decisions ?? [],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? 'Export failed');
      }

      setTrelloStatus('success');
      setTrelloMessage(`${data.cardsCreated} cards added to Trello`);
      setTimeout(() => setTrelloStatus('idle'), 4000);
    } catch (err: any) {
      setTrelloStatus('error');
      setTrelloMessage(err.message ?? 'Something went wrong');
      setTimeout(() => setTrelloStatus('idle'), 5000);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-3 print:hidden">
      <button
        onClick={handlePrint}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        <Printer className="w-4 h-4" />
        Print
      </button>
      {segment && (
        <>
          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export JSON
          </button>
          <button
            onClick={handleExportTrello}
            disabled={trelloStatus === 'loading'}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors ${
              trelloStatus === 'success'
                ? 'bg-green-50 border-green-300 text-green-700'
                : trelloStatus === 'error'
                ? 'bg-red-50 border-red-300 text-red-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {trelloStatus === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : trelloStatus === 'error' ? (
              <AlertCircle className="w-4 h-4" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {trelloStatus === 'loading'
              ? 'Exporting…'
              : trelloStatus === 'success' || trelloStatus === 'error'
              ? trelloMessage
              : 'Export to Trello'}
          </button>
        </>
      )}
    </div>
  );
}
