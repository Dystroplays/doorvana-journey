import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  segments: defineTable({
    key: v.string(),
    label: v.string(),
    icon: v.string(),
    displayOrder: v.number(),
  }).index("by_key", ["key"]),

  phases: defineTable({
    segmentId: v.id("segments"),
    key: v.string(),
    label: v.string(),
    duration: v.string(),
    color: v.string(),
    accent: v.string(),
    displayOrder: v.number(),
  }).index("by_segment", ["segmentId"]),

  steps: defineTable({
    phaseId: v.id("phases"),
    day: v.string(),
    action: v.string(),
    detail: v.string(),
    tool: v.string(),
    icon: v.string(),
    displayOrder: v.number(),
    isFuture: v.boolean(),
  }).index("by_phase", ["phaseId"]),

  requirements: defineTable({
    segmentId: v.id("segments"),
    area: v.string(),
    items: v.array(v.string()),
    displayOrder: v.number(),
  }).index("by_segment", ["segmentId"]),

  openDecisions: defineTable({
    segmentId: v.id("segments"),
    decision: v.string(),
    displayOrder: v.number(),
    isResolved: v.boolean(),
    resolution: v.optional(v.string()),
  }).index("by_segment", ["segmentId"]),

  flowDiagramItems: defineTable({
    segmentId: v.id("segments"),
    text: v.string(),
    bg: v.string(),
    fg: v.string(),
    isSmall: v.boolean(),
    displayOrder: v.number(),
  }).index("by_segment", ["segmentId"]),

  notes: defineTable({
    content: v.string(),
    createdBy: v.string(),
    assignedTo: v.string(),
    seenAt: v.optional(v.number()),
    resolvedAt: v.optional(v.number()),
  }).index("by_resolved", ["resolvedAt"]),
});
