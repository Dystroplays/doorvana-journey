import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all requirements
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("requirements").collect();
  },
});

// Get requirements by segment
export const getBySegment = query({
  args: { segmentId: v.id("segments") },
  handler: async (ctx, args) => {
    const requirements = await ctx.db
      .query("requirements")
      .withIndex("by_segment", (q) => q.eq("segmentId", args.segmentId))
      .collect();

    return requirements.sort((a, b) => a.displayOrder - b.displayOrder);
  },
});

// Create requirement
export const create = mutation({
  args: {
    segmentId: v.id("segments"),
    area: v.string(),
    items: v.array(v.string()),
    displayOrder: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("requirements", args);
  },
});

// Update requirement
export const update = mutation({
  args: {
    id: v.id("requirements"),
    area: v.optional(v.string()),
    items: v.optional(v.array(v.string())),
    displayOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

// Delete requirement
export const remove = mutation({
  args: { id: v.id("requirements") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
