import * as ioredis from "ioredis";
import { calcCacheExpires } from "./time";

export class Redis {
  client: ioredis.Redis;
  constructor(client: ioredis.Redis) {
    this.client = client;
  }

  async set(
    key: string,
    value: ioredis.ValueType,
    expireSecond: number | [number, number],
    setMode?: "NX" | "XX"
  ) {
    try {
      const expires = calcCacheExpires(expireSecond);

      value = typeof value === "object" ? JSON.stringify(value) : value;
      return setMode
        ? this.client.set(key, value, "EX", expires, setMode)
        : this.client.set(key, value, "EX", expires);
    } catch (err) {
      console.error("set", err);
      return false;
    }
  }

  async get(
    key: string,
    option: { toJson?: boolean; toNumber?: boolean } = {}
  ) {
    try {
      let result: any = await this.client.get(key);

      if (option.toJson) {
        result = JSON.parse(result);
      }

      if (option.toNumber) {
        result = Number(result);
      }

      return result;
    } catch (e) {
      console.error(
        "获取缓存失败 key: %s，option: %s，errmsg: %s",
        key,
        option,
        e.message
      );
      return;
    }
  }

  async expire(key: string, expireSecond: number | [number, number]) {
    try {
      // 计算缓存时间
      const expires = calcCacheExpires(expireSecond);

      return this.client.expire(key, expires);
    } catch (e) {
      console.error(
        "设置缓存时间失败 key: %s，expireSecond: %s，errmsg: %s",
        key,
        expireSecond,
        e.message
      );
    }
  }

  async del(key: string) {
    try {
      return await this.client.unlink(key);
    } catch (e) {
      console.error("删除缓存失败 key: %s，errmsg: %s", key, e.message);
      return false;
    }
  }
}
