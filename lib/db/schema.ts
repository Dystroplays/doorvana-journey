import { pgTable, serial, text, varchar, integer, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// SEGMENTS TABLE
export const segments = pgTable('segments', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 50 }).notNull().unique(),
  label: varchar('label', { length: 100 }).notNull(),
  icon: varchar('icon', { length: 10 }).notNull(),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// PHASES TABLE
export const phases = pgTable('phases', {
  id: serial('id').primaryKey(),
  segmentId: integer('segment_id').notNull().references(() => segments.id, { onDelete: 'cascade' }),
  key: varchar('key', { length: 50 }).notNull(),
  label: varchar('label', { length: 150 }).notNull(),
  duration: varchar('duration', { length: 50 }).notNull(),
  color: varchar('color', { length: 7 }).notNull(),
  accent: varchar('accent', { length: 7 }).notNull(),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// STEPS TABLE
export const steps = pgTable('steps', {
  id: serial('id').primaryKey(),
  phaseId: integer('phase_id').notNull().references(() => phases.id, { onDelete: 'cascade' }),
  day: varchar('day', { length: 50 }).notNull(),
  action: varchar('action', { length: 200 }).notNull(),
  detail: text('detail').notNull(),
  tool: varchar('tool', { length: 100 }).notNull(),
  icon: varchar('icon', { length: 10 }).notNull(),
  displayOrder: integer('display_order').notNull().default(0),
  isFuture: boolean('is_future').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// REQUIREMENTS TABLE
export const requirements = pgTable('requirements', {
  id: serial('id').primaryKey(),
  segmentId: integer('segment_id').notNull().references(() => segments.id, { onDelete: 'cascade' }),
  area: varchar('area', { length: 150 }).notNull(),
  items: jsonb('items').notNull(),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// OPEN DECISIONS TABLE
export const openDecisions = pgTable('open_decisions', {
  id: serial('id').primaryKey(),
  segmentId: integer('segment_id').notNull().references(() => segments.id, { onDelete: 'cascade' }),
  decision: text('decision').notNull(),
  displayOrder: integer('display_order').notNull().default(0),
  isResolved: boolean('is_resolved').default(false).notNull(),
  resolution: text('resolution'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// FLOW DIAGRAM ITEMS TABLE
export const flowDiagramItems = pgTable('flow_diagram_items', {
  id: serial('id').primaryKey(),
  segmentId: integer('segment_id').notNull().references(() => segments.id, { onDelete: 'cascade' }),
  text: varchar('text', { length: 100 }).notNull(),
  bg: varchar('bg', { length: 7 }).notNull(),
  fg: varchar('fg', { length: 7 }).notNull(),
  isSmall: boolean('is_small').default(false).notNull(),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// RELATIONS
export const segmentsRelations = relations(segments, ({ many }) => ({
  phases: many(phases),
  requirements: many(requirements),
  decisions: many(openDecisions),
  flowDiagramItems: many(flowDiagramItems),
}));

export const phasesRelations = relations(phases, ({ one, many }) => ({
  segment: one(segments, {
    fields: [phases.segmentId],
    references: [segments.id],
  }),
  steps: many(steps),
}));

export const stepsRelations = relations(steps, ({ one }) => ({
  phase: one(phases, {
    fields: [steps.phaseId],
    references: [phases.id],
  }),
}));

export const requirementsRelations = relations(requirements, ({ one }) => ({
  segment: one(segments, {
    fields: [requirements.segmentId],
    references: [segments.id],
  }),
}));

export const openDecisionsRelations = relations(openDecisions, ({ one }) => ({
  segment: one(segments, {
    fields: [openDecisions.segmentId],
    references: [segments.id],
  }),
}));

export const flowDiagramItemsRelations = relations(flowDiagramItems, ({ one }) => ({
  segment: one(segments, {
    fields: [flowDiagramItems.segmentId],
    references: [segments.id],
  }),
}));
