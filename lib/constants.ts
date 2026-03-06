// Segment color schemes
export const SEGMENT_COLORS = {
  builders: {
    dark: '#1a5276',
    accent: '#2980b9',
  },
  retail: {
    dark: '#b45309',
    accent: '#d97706',
  },
  dealers: {
    dark: '#7c2d12',
    accent: '#ea580c',
  },
  commercial: {
    dark: '#0e7490',
    accent: '#06b6d4',
  },
  service: {
    dark: '#059669',
    accent: '#10b981',
  },
} as const;

// Phase color schemes
export const PHASE_COLORS = {
  prospecting: { color: '#1a5276', accent: '#2980b9' },
  nurture: { color: '#7d3c98', accent: '#a569bd' },
  opportunity: { color: '#1e8449', accent: '#27ae60' },
  leadCapture: { color: '#b45309', accent: '#d97706' },
  scheduling: { color: '#0e7490', accent: '#06b6d4' },
  onsite: { color: '#7c3aed', accent: '#8b5cf6' },
  close: { color: '#16a34a', accent: '#22c55e' },
  activation: { color: '#b45309', accent: '#d97706' },
  ordering: { color: '#0e7490', accent: '#06b6d4' },
  bidding: { color: '#7c2d12', accent: '#ea580c' },
  waiting: { color: '#6b7280', accent: '#9ca3af' },
  install: { color: '#059669', accent: '#10b981' },
  intentSignal: { color: '#0e7490', accent: '#06b6d4' },
  msa: { color: '#7c3aed', accent: '#8b5cf6' },
  service: { color: '#059669', accent: '#10b981' },
} as const;
