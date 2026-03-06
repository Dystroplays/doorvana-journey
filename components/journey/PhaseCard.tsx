'use client';

interface Phase {
  _id: string;
  label: string;
  duration: string;
  color: string;
  accent: string;
}

interface PhaseCardProps {
  phase: Phase;
  isActive: boolean;
  onClick: () => void;
}

export default function PhaseCard({ phase, isActive, onClick }: PhaseCardProps) {
  return (
    <div
      onClick={onClick}
      className={`flex-1 min-w-[100px] px-3 py-2 rounded-lg border-2 cursor-pointer transition-all`}
      style={{
        background: isActive ? phase.color : '#f8f9fa',
        borderColor: isActive ? phase.color : '#dee2e6',
      }}
    >
      <div
        className="text-xs font-bold uppercase tracking-wide mb-0.5"
        style={{
          color: isActive ? 'rgba(255,255,255,0.6)' : '#868e96',
        }}
      >
        {phase.duration}
      </div>
      <div
        className="text-sm font-bold leading-tight"
        style={{
          color: isActive ? '#fff' : phase.color,
        }}
      >
        {phase.label}
      </div>
    </div>
  );
}
