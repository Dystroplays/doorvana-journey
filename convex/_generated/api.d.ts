/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as decisions from "../decisions.js";
import type * as notes from "../notes.js";
import type * as phases from "../phases.js";
import type * as requirements from "../requirements.js";
import type * as seed from "../seed.js";
import type * as segments from "../segments.js";
import type * as steps from "../steps.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  decisions: typeof decisions;
  notes: typeof notes;
  phases: typeof phases;
  requirements: typeof requirements;
  seed: typeof seed;
  segments: typeof segments;
  steps: typeof steps;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
