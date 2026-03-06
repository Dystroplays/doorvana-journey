import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all decisions
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("openDecisions").collect();
  },
});

// Get decisions by segment
export const getBySegment = query({
  args: { segmentId: v.id("segments") },
  handler: async (ctx, args) => {
    const decisions = await ctx.db
      .query("openDecisions")
      .withIndex("by_segment", (q) => q.eq("segmentId", args.segmentId))
      .collect();

    return decisions.sort((a, b) => a.displayOrder - b.displayOrder);
  },
});

// Create decision
export const create = mutation({
  args: {
    segmentId: v.id("segments"),
    decision: v.string(),
    displayOrder: v.number(),
    isResolved: v.boolean(),
    resolution: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("openDecisions", args);
  },
});

// Update decision
export const update = mutation({
  args: {
    id: v.id("openDecisions"),
    decision: v.optional(v.string()),
    displayOrder: v.optional(v.number()),
    isResolved: v.optional(v.boolean()),
    resolution: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

// Delete decision
export const remove = mutation({
  args: { id: v.id("openDecisions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Toggle resolved status
export const toggleResolved = mutation({
  args: {
    id: v.id("openDecisions"),
  },
  handler: async (ctx, args) => {
    const decision = await ctx.db.get(args.id);
    if (!decision) throw new Error("Decision not found");

    await ctx.db.patch(args.id, {
      isResolved: !decision.isResolved,
    });
  },
});
