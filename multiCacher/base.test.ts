import { MultiCacherService } from "./index";

describe("test/service/multiCacher.test.ts", () => {
  let multiCacherService: any;
  let lru;
  let local;
  let remote;

  beforeEach(async () => {
    lru = {
      get: jest.fn().mockReturnValue(null),
      set: jest.fn().mockReturnValue(null),
      del: jest.fn().mockReturnValue(null),
      expire: jest.fn().mockReturnValue(null),
    };
    local = {
      get: jest.fn().mockReturnValue(null),
      set: jest.fn().mockReturnValue(null),
      del: jest.fn().mockReturnValue(null),
      expire: jest.fn().mockReturnValue(null),
    };
    remote = {
      get: jest.fn().mockReturnValue(null),
      set: jest.fn().mockReturnValue(null),
      del: jest.fn().mockReturnValue(null),
      expire: jest.fn().mockReturnValue(null),
    };
    multiCacherService = new MultiCacherService({
      multiCacher: [
        {
          type: "lru",
          client: lru,
        },
        {
          type: "redis",
          client: local,
        },
        {
          type: "redis",
          client: remote,
        },
      ],
    });
  });

  describe("#get", () => {
    it("all miss", async () => {
      const keys = ["a", "b", "c"];

      const { hits, miss } = await multiCacherService.get(keys);

      expect(hits).toStrictEqual([]);
      expect(miss).toStrictEqual(keys);
      expect(lru.get).toBeCalledTimes(keys.length);
      expect(local.get).toBeCalledTimes(keys.length);
      expect(remote.get).toBeCalledTimes(keys.length);
    });

    it("from memory", async () => {
      const keys = ["a", "b", "c"];
      lru.get = jest.fn().mockReturnValue("1");

      const { hits, miss } = await multiCacherService.get(keys);

      expect(hits.length).toStrictEqual(keys.length);
      expect(miss).toStrictEqual([]);
      expect(lru.get).toBeCalledTimes(keys.length);
      expect(local.get).toBeCalledTimes(0);
      expect(remote.get).toBeCalledTimes(0);
    });

    it("from local", async () => {
      const keys = ["a", "b", "c"];
      local.get = jest.fn().mockResolvedValue("1");

      const { hits, miss } = await multiCacherService.get(keys);

      expect(hits.length).toStrictEqual(keys.length);
      expect(miss).toStrictEqual([]);
      expect(lru.get).toBeCalledTimes(keys.length);
      expect(lru.set).toBeCalledTimes(keys.length);
      expect(local.get).toBeCalledTimes(keys.length);
      expect(remote.get).toBeCalledTimes(0);
    });

    it("from remote", async () => {
      const keys = ["a", "b", "c"];
      remote.get = jest.fn().mockResolvedValue("1");

      const { hits, miss } = await multiCacherService.get(keys);

      expect(hits.length).toStrictEqual(keys.length);
      expect(miss).toStrictEqual([]);
      expect(lru.get).toBeCalledTimes(keys.length);
      expect(lru.set).toBeCalledTimes(keys.length);
      expect(local.get).toBeCalledTimes(keys.length);
      expect(local.set).toBeCalledTimes(keys.length);
      expect(remote.get).toBeCalledTimes(keys.length);
    });
  });

  describe("#get2", () => {
    it("all miss", async () => {
      const keys = ["a", "b", "c"];

      const { hits, miss } = await multiCacherService.get2(keys);

      expect(hits).toStrictEqual([]);
      expect(miss).toStrictEqual(keys);
      expect(lru.get).toBeCalledTimes(keys.length);
      expect(local.get).toBeCalledTimes(keys.length);
      expect(remote.get).toBeCalledTimes(keys.length);
    });

    it("from memory", async () => {
      const keys = ["a", "b", "c"];
      lru.get = jest.fn().mockReturnValue("1");

      const { hits, miss } = await multiCacherService.get2(keys);

      expect(hits.length).toStrictEqual(keys.length);
      expect(miss).toStrictEqual([]);
      expect(lru.get).toBeCalledTimes(keys.length);
      expect(local.get).toBeCalledTimes(0);
      expect(remote.get).toBeCalledTimes(0);
    });

    it("from local", async () => {
      const keys = ["a", "b", "c"];
      local.get = jest.fn().mockResolvedValue("1");

      const { hits, miss } = await multiCacherService.get2(keys);

      expect(hits.length).toStrictEqual(keys.length);
      expect(miss).toStrictEqual([]);
      expect(lru.get).toBeCalledTimes(keys.length);
      expect(lru.set).toBeCalledTimes(keys.length);
      expect(local.get).toBeCalledTimes(keys.length);
      expect(remote.get).toBeCalledTimes(0);
    });

    it("from remote", async () => {
      const keys = ["a", "b", "c"];
      remote.get = jest.fn().mockResolvedValue("1");

      const { hits, miss } = await multiCacherService.get2(keys);

      expect(hits.length).toStrictEqual(keys.length);
      expect(miss).toStrictEqual([]);
      expect(lru.get).toBeCalledTimes(keys.length);
      expect(lru.set).toBeCalledTimes(keys.length);
      expect(local.get).toBeCalledTimes(keys.length);
      expect(local.set).toBeCalledTimes(keys.length);
      expect(remote.get).toBeCalledTimes(keys.length);
    });
  });

  describe("#set", () => {
    it("set cache success", async () => {
      const list = [];
      for (let i = 0; i < 3; i++) {
        list.push({ key: `${i}`, value: `${i}`, expireSecond: [300, 600] });
      }

      await multiCacherService.set(list);

      expect(lru.set).toBeCalledTimes(list.length);
      expect(local.set).toBeCalledTimes(list.length);
      expect(remote.set).toBeCalledTimes(list.length);
    });
  });

  describe("#del", () => {
    it("del cache success", async () => {
      const keys = ["a", "b", "c"];

      await multiCacherService.del(keys);

      expect(lru.del).toBeCalledTimes(keys.length);
      expect(local.del).toBeCalledTimes(keys.length);
      expect(remote.del).toBeCalledTimes(keys.length);
    });
  });

  describe("#expire", () => {
    it("expire cache success", async () => {
      const keys = ["a", "b", "c"];
      lru.get = jest.fn().mockReturnValue("1");

      await multiCacherService.expire(keys, [300, 600]);

      expect(lru.expire).toBeCalledTimes(keys.length);
      expect(local.expire).toBeCalledTimes(keys.length);
      expect(remote.expire).toBeCalledTimes(keys.length);
    });
  });
});
