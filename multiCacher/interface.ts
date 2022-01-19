import { LRU } from "./lru";
import { Redis } from "./redis";

export interface MultiCacherConfig {
  type: "lru" | "redis";
  client?: LRU<any, any> | Redis;
}
