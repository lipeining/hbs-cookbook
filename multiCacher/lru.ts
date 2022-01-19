import * as LRUCache from "lru-cache";
import { calcCacheExpires } from "./time";

export class LRU<K, V> extends LRUCache<K, V> {
  constructor(options: LRUCache.Options<any, any>) {
    super(options);
  }

  /**
   * set
   * @param key
   * @param value
   * @param expireSecond
   * @returns
   */
  set(key: K, value: V, expireSecond?: number | [number, number]): boolean {
    const expires = calcCacheExpires(expireSecond);

    return super.set(key, value, expires * 1000);
  }

  /**
   * expire
   * @param key
   * @param expireSecond
   * @returns
   */
  expire(key: K, expireSecond: number | [number, number]): any {
    const value = this.get(key);

    return value && this.set(key, value, expireSecond);
  }
}
