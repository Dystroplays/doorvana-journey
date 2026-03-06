'use client';

import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import SegmentSelector from './SegmentSelector';
import PhaseCard from './PhaseCard';
import StepRow from './StepRow';
import RequirementsView from './RequirementsView';
import FlowDiagram from './FlowDiagram';
import ExportButton from './ExportButton';

export default function JourneyViewer() {
  const segments = useQuery(api.segments.getAllWithRelations);
  const [selectedSegmentKey, setSelectedSegmentKey] = useState<string>('');
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);
  const [showRequirements, setShowRequirements] = useState(false);

  // Set default segment when data loads
  if (segments && segments.length > 0 && !selectedSegmentKey) {
    setSelectedSegmentKey(segments[0].key);
  }

  if (!segments) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔄</div>
          <div className="text-sm font-semibold text-gray-600">Loading journey map...</div>
        </div>
      </div>
    );
  }

  const currentSegment = segments.find((s) => s.key === selectedSegmentKey);
  const currentPhase = currentSegment?.phases?.find((p) => p._id === selectedPhaseId);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="border-b border-gray-200 px-6 py-5">
        <div className="text-xs font-bold tracking-wider uppercase text-gray-500 mb-1">
          Doorvana × Salesforce Implementation
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Customer Journey Map</h1>
        <p className="text-sm text-gray-500 mt-1">
          All segments — SF config, automations & integration reference for Jeff
        </p>
        <ExportButton segment={currentSegment} />
      </header>

      {/* Segment Selector */}
      <SegmentSelector
        segments={segments}
        selectedKey={selectedSegmentKey}
        onSelect={(key) => {
          setSelectedSegmentKey(key);
          setSelectedPhaseId(null);
          setShowRequirements(false);
        }}
      />

      {/* Flow Diagram */}
      {currentSegment && currentSegment.flowDiagramItems && (
        <FlowDiagram items={currentSegment.flowDiagramItems} />
      )}

      {/* Phase Cards + Requirements Button */}
      <div className="flex gap-2 p-4 flex-wrap">
        {currentSegment?.phases?.map((phase) => (
          <PhaseCard
            key={phase._id}
            phase={phase}
            isActive={selectedPhaseId === phase._id && !showRequirements}
            onClick={() => {
              setSelectedPhaseId(phase._id);
              setShowRequirements(false);
            }}
          />
        ))}
        <button
          onClick={() => {
            setShowRequirements(true);
            setSelectedPhaseId(null);
          }}
          className={`flex-1 min-w-[100px] px-3 py-2 rounded-lg border-2 transition-all ${
            showRequirements
              ? 'bg-red-600 border-red-600 text-white'
              : 'bg-gray-50 border-gray-300 text-red-600'
          }`}
        >
          <div className="text-xs font-bold uppercase tracking-wide opacity-60 mb-0.5">
            For Jeff
          </div>
          <div className="text-sm font-bold">SF Requirements</div>
        </button>
      </div>

      {/* Content Area */}
      <div className="px-6 pb-8">
        {!showRequirements && currentPhase && (
          <div className="max-w-2xl">
            <div
              className="text-xs font-bold uppercase tracking-wider mb-4 pb-2 border-b-2"
              style={{
                color: currentPhase.accent,
                borderColor: `${currentPhase.accent}22`,
              }}
            >
              {currentPhase.label} — Step by Step
            </div>
            {currentPhase.steps?.map((step, i) => (
              <StepRow
                key={step._id}
                step={step}
                phase={currentPhase}
                index={i}
                total={currentPhase.steps?.length || 0}
              />
            ))}
          </div>
        )}

        {!showRequirements && !currentPhase && currentSegment && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-2">{currentSegment.icon}</div>
            <div className="text-sm font-semibold">Select a phase to see the workflow</div>
            <div className="text-xs mt-1">Or click "SF Requirements" for Jeff's build list</div>
          </div>
        )}

        {showRequirements && currentSegment && (
          <RequirementsView
            requirements={currentSegment.requirements || []}
            decisions={currentSegment.decisions || []}
            segmentLabel={currentSegment.label}
          />
        )}
      </div>
    </div>
  );
}
