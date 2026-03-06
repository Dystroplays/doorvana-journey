import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Query to get all segments with all related data
export const getAllWithRelations = query({
  handler: async (ctx) => {
    const segments = await ctx.db.query("segments").collect();

    // Fetch all related data for each segment
    const segmentsWithRelations = await Promise.all(
      segments.map(async (segment) => {
        const phases = await ctx.db
          .query("phases")
          .withIndex("by_segment", (q) => q.eq("segmentId", segment._id))
          .collect();

        const phasesWithSteps = await Promise.all(
          phases.map(async (phase) => {
            const steps = await ctx.db
              .query("steps")
              .withIndex("by_phase", (q) => q.eq("phaseId", phase._id))
              .collect();

            return {
              ...phase,
              steps: steps.sort((a, b) => a.displayOrder - b.displayOrder),
            };
          })
        );

        const requirements = await ctx.db
          .query("requirements")
          .withIndex("by_segment", (q) => q.eq("segmentId", segment._id))
          .collect();

        const decisions = await ctx.db
          .query("openDecisions")
          .withIndex("by_segment", (q) => q.eq("segmentId", segment._id))
          .collect();

        const flowDiagramItems = await ctx.db
          .query("flowDiagramItems")
          .withIndex("by_segment", (q) => q.eq("segmentId", segment._id))
          .collect();

        return {
          ...segment,
          phases: phasesWithSteps.sort((a, b) => a.displayOrder - b.displayOrder),
          requirements: requirements.sort((a, b) => a.displayOrder - b.displayOrder),
          decisions: decisions.sort((a, b) => a.displayOrder - b.displayOrder),
          flowDiagramItems: flowDiagramItems.sort((a, b) => a.displayOrder - b.displayOrder),
        };
      })
    );

    return segmentsWithRelations.sort((a, b) => a.displayOrder - b.displayOrder);
  },
});

// Create a new segment
export const create = mutation({
  args: {
    key: v.string(),
    label: v.string(),
    icon: v.string(),
    displayOrder: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("segments", args);
  },
});

// Update a segment
export const update = mutation({
  args: {
    id: v.id("segments"),
    key: v.optional(v.string()),
    label: v.optional(v.string()),
    icon: v.optional(v.string()),
    displayOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

// Delete a segment (cascade delete related items)
export const remove = mutation({
  args: { id: v.id("segments") },
  handler: async (ctx, args) => {
    // Delete all related data first
    const phases = await ctx.db
      .query("phases")
      .withIndex("by_segment", (q) => q.eq("segmentId", args.id))
      .collect();

    for (const phase of phases) {
      const steps = await ctx.db
        .query("steps")
        .withIndex("by_phase", (q) => q.eq("phaseId", phase._id))
        .collect();
      for (const step of steps) {
        await ctx.db.delete(step._id);
      }
      await ctx.db.delete(phase._id);
    }

    const requirements = await ctx.db
      .query("requirements")
      .withIndex("by_segment", (q) => q.eq("segmentId", args.id))
      .collect();
    for (const req of requirements) {
      await ctx.db.delete(req._id);
    }

    const decisions = await ctx.db
      .query("openDecisions")
      .withIndex("by_segment", (q) => q.eq("segmentId", args.id))
      .collect();
    for (const decision of decisions) {
      await ctx.db.delete(decision._id);
    }

    const flowItems = await ctx.db
      .query("flowDiagramItems")
      .withIndex("by_segment", (q) => q.eq("segmentId", args.id))
      .collect();
    for (const item of flowItems) {
      await ctx.db.delete(item._id);
    }

    // Finally delete the segment
    await ctx.db.delete(args.id);
  },
});
