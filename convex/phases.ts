import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all phases
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("phases").collect();
  },
});

// Get phases by segment
export const getBySegment = query({
  args: { segmentId: v.id("segments") },
  handler: async (ctx, args) => {
    const phases = await ctx.db
      .query("phases")
      .withIndex("by_segment", (q) => q.eq("segmentId", args.segmentId))
      .collect();

    return phases.sort((a, b) => a.displayOrder - b.displayOrder);
  },
});

// Create phase
export const create = mutation({
  args: {
    segmentId: v.id("segments"),
    key: v.string(),
    label: v.string(),
    duration: v.string(),
    color: v.string(),
    accent: v.string(),
    displayOrder: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("phases", args);
  },
});

// Update phase
export const update = mutation({
  args: {
    id: v.id("phases"),
    key: v.optional(v.string()),
    label: v.optional(v.string()),
    duration: v.optional(v.string()),
    color: v.optional(v.string()),
    accent: v.optional(v.string()),
    displayOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

// Delete phase (and all its steps)
export const remove = mutation({
  args: { id: v.id("phases") },
  handler: async (ctx, args) => {
    // Delete all steps first
    const steps = await ctx.db
      .query("steps")
      .withIndex("by_phase", (q) => q.eq("phaseId", args.id))
      .collect();

    for (const step of steps) {
      await ctx.db.delete(step._id);
    }

    // Delete the phase
    await ctx.db.delete(args.id);
  },
});
