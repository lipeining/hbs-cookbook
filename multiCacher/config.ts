import { MultiCacherConfig } from "./interface";

export const multiCacher: MultiCacherConfig[] = [
  { type: "lru" },
  { type: "redis" },
  { type: "redis" },
];
