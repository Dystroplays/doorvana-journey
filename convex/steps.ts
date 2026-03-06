import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all steps
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("steps").collect();
  },
});

// Get steps by phase
export const getByPhase = query({
  args: { phaseId: v.id("phases") },
  handler: async (ctx, args) => {
    const steps = await ctx.db
      .query("steps")
      .withIndex("by_phase", (q) => q.eq("phaseId", args.phaseId))
      .collect();

    return steps.sort((a, b) => a.displayOrder - b.displayOrder);
  },
});

// Create step
export const create = mutation({
  args: {
    phaseId: v.id("phases"),
    day: v.string(),
    action: v.string(),
    detail: v.string(),
    tool: v.string(),
    icon: v.string(),
    displayOrder: v.number(),
    isFuture: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("steps", args);
  },
});

// Update step
export const update = mutation({
  args: {
    id: v.id("steps"),
    day: v.optional(v.string()),
    action: v.optional(v.string()),
    detail: v.optional(v.string()),
    tool: v.optional(v.string()),
    icon: v.optional(v.string()),
    displayOrder: v.optional(v.number()),
    isFuture: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

// Delete step
export const remove = mutation({
  args: { id: v.id("steps") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
