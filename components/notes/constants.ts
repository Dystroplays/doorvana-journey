export const USERS = ["Blake", "Bobby", "Jeff"] as const;
export type User = (typeof USERS)[number];

export const USER_STORAGE_KEY = "dv_user";
