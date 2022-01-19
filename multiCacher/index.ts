import { multiCacher } from "./config";
import { LRU } from "./lru";
import { Redis } from "./redis";
import { MultiCacherConfig } from "./interface";
import * as ioredis from "ioredis";
import * as _ from "lodash";

export class MultiCacherService {
  multiCacher: MultiCacherConfig[];

  constructor(options: { multiCacher?: MultiCacherConfig[] }) {
    this.multiCacher = options.multiCacher || multiCacher;
  }

  /**
   * 解析 multiCacher 配置，返回 cachers
   */
  getCachers(): Array<LRU<any, any> | Redis> {
    const cachers = [];
    for (let i = 0; i < this.multiCacher.length; i++) {
      const { type, client } = this.multiCacher[i];

      if (client) {
        cachers.push(client);
        continue;
      }

      if (type === "lru") {
        const cacher = new LRU<any, any>({});
        cachers.push(cacher);
      } else if (type === "redis") {
        const cacher = new Redis(new ioredis());
        cachers.push(cacher);
      }
    }

    return cachers.filter(Boolean);
  }

  /**
   * get
   */
  async get(
    keys: string[],
    options?: {
      toJson?: boolean;
      toNumber?: boolean;
      toBuffer?: boolean;
      expireSecond: number | [number, number];
    }
  ): Promise<{ hits: { key: string; value: any }[]; miss: string[] }> {
    const hits = [];
    function missKeys(request: any[], results: any[]) {
      const miss = [];
      for (let i = 0; i < results.length; i++) {
        if (_.isNil(results[i])) {
          miss.push(request[i]);
        } else {
          hits.push({ key: request[i], value: results[i] });
        }
      }
      return miss;
    }

    const cachers = this.getCachers();
    const expireSecond = options?.expireSecond || 100000;
    const toBuffer = options?.toBuffer || false;

    let tasks = [];
    let miss = [];
    // keys 为当前还没有查询到值的请求列表
    const writeBackTasks = [];
    for (let i = 0; i < cachers.length; i++) {
      if (!keys.length) break;

      const cacher = cachers[i];
      tasks = keys.map((key) => {
        return cacher.get(key, options);
      });

      const rets = await Promise.all(tasks);
      miss = missKeys(keys, rets);

      for (let j = 0; j < i; j++) {
        for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
          if (_.isNil(rets[keyIndex])) continue;
          const value = toBuffer ? Buffer.from(rets[keyIndex]) : rets[keyIndex];
          writeBackTasks.push(
            cachers[j].set(keys[keyIndex], value, expireSecond)
          );
        }
      }
      keys = miss;
    }

    // writeBackTasks 利用下一级缓存更新当前这级缓存
    Promise.all(writeBackTasks);

    return { hits, miss };
  }

  /**
   * get2
   */
  async get2(
    keys: string[],
    options?: {
      toJson?: boolean;
      toNumber?: boolean;
      toBuffer?: boolean;
      expireSecond: number | [number, number];
    }
  ): Promise<{ hits: { key: string; value: any }[]; miss: string[] }> {
    function missKeys(request: any[], results: any[]) {
      const miss = [];
      const hits = [];
      for (let i = 0; i < results.length; i++) {
        if (_.isNil(results[i])) {
          miss.push(request[i]);
        } else {
          hits.push({ key: request[i], value: results[i] });
        }
      }
      return { hits, miss };
    }

    const cachers = this.getCachers();
    const expireSecond = options?.expireSecond || 100000;
    const toBuffer = options?.toBuffer || false;

    let hits = [];
    let tasks = [];
    let miss = [];
    // keys 为当前还没有查询到值的请求列表
    const writeBackTasks = [];
    for (let i = 0; i < cachers.length; i++) {
      if (!keys.length) break;

      const cacher = cachers[i];
      tasks = keys.map((key) => {
        return cacher.get(key, options);
      });

      const rets = await Promise.all(tasks);
      const funcRet = missKeys(keys, rets);

      miss = funcRet.miss;
      hits = hits.concat(funcRet.hits);
      keys = miss;

      for (let j = 0; j < i; j++) {
        for (const { key, value } of funcRet.hits) {
          writeBackTasks.push(
            cachers[j].set(
              key,
              toBuffer ? Buffer.from(value) : value,
              expireSecond
            )
          );
        }
      }
    }

    // writeBackTasks 利用下一级缓存更新当前这级缓存
    Promise.all(writeBackTasks);

    return { hits, miss };
  }

  /**
   * set
   */
  async set(
    list: {
      key: string;
      value: any;
      expireSecond: number | [number, number];
      setMode?: "NX" | "XX";
      options?: { toBuffer?: boolean };
    }[]
  ) {
    const tasks = [];
    const cachers = this.getCachers();

    for (let i = 0; i < list.length; i++) {
      const { key, value, expireSecond, setMode, options } = list[i];

      for (const cacher of cachers) {
        if (options?.toBuffer === true) {
          tasks.push(
            cacher.set(key, Buffer.from(value), expireSecond, setMode)
          );
        } else {
          tasks.push(cacher.set(key, value, expireSecond, setMode));
        }
      }
    }

    await Promise.all(tasks);
  }

  /**
   * del
   */
  async del(keys: string[]) {
    const tasks = [];
    const cachers = this.getCachers();

    for (const key of keys) {
      for (const cacher of cachers) {
        tasks.push(cacher.del(key));
      }
    }

    await Promise.all(tasks);
  }

  /**
   * expire
   */
  async expire(keys: string[], expireSecond: number | [number, number]) {
    const tasks = [];
    const cachers = this.getCachers();

    for (const key of keys) {
      for (const cacher of cachers) {
        tasks.push(cacher.expire(key, expireSecond));
      }
    }

    await Promise.all(tasks);
  }
}
