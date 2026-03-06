// Database entity types (inferred from Drizzle schema)
export interface Segment {
  id: number;
  key: string;
  label: string;
  icon: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
  phases?: Phase[];
  requirements?: Requirement[];
  decisions?: OpenDecision[];
  flowDiagramItems?: FlowDiagramItem[];
}

export interface Phase {
  id: number;
  segmentId: number;
  key: string;
  label: string;
  duration: string;
  color: string;
  accent: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
  steps?: Step[];
}

export interface Step {
  id: number;
  phaseId: number;
  day: string;
  action: string;
  detail: string;
  tool: string;
  icon: string;
  displayOrder: number;
  isFuture: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Requirement {
  id: number;
  segmentId: number;
  area: string;
  items: string[];
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OpenDecision {
  id: number;
  segmentId: number;
  decision: string;
  displayOrder: number;
  isResolved: boolean;
  resolution: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface FlowDiagramItem {
  id: number;
  segmentId: number;
  text: string;
  bg: string;
  fg: string;
  isSmall: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// Input types for forms (without generated fields)
export type SegmentInput = Omit<Segment, 'id' | 'createdAt' | 'updatedAt' | 'phases' | 'requirements' | 'decisions' | 'flowDiagramItems'>;

export type PhaseInput = Omit<Phase, 'id' | 'createdAt' | 'updatedAt' | 'steps'>;

export type StepInput = Omit<Step, 'id' | 'createdAt' | 'updatedAt'>;

export type RequirementInput = Omit<Requirement, 'id' | 'createdAt' | 'updatedAt'>;

export type OpenDecisionInput = Omit<OpenDecision, 'id' | 'createdAt' | 'updatedAt'>;

export type FlowDiagramItemInput = Omit<FlowDiagramItem, 'id' | 'createdAt' | 'updatedAt'>;

// Extended types with relations for full data queries
export type SegmentWithRelations = Segment & {
  phases: (Phase & { steps: Step[] })[];
  requirements: Requirement[];
  decisions: OpenDecision[];
  flowDiagramItems: FlowDiagramItem[];
};
