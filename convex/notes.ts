import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("notes")
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    content: v.string(),
    createdBy: v.string(),
    assignedTo: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("notes", {
      content: args.content,
      createdBy: args.createdBy,
      assignedTo: args.assignedTo,
    });
  },
});

export const markSeen = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { seenAt: Date.now() });
  },
});

export const markResolved = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { resolvedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
