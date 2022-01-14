"use strict";

const Benchmark = require("benchmark");
const benchmarks = require("beautify-benchmark");
const suite = new Benchmark.Suite();
const handlebars = require("./egg-handlebars");
const files = require("./expect/files.json");
const assets = require("./expect/assets.json");
const locale = require("./expect/locale.json");
// const context = require("./expect/data.json");
const config = require("./config");
const { IRender } = config;

const ioredis = require("ioredis");
const SharedCache = require("node-shared-cache");
const LRUCache = require("lru-cache");
const maxSize = 10000;

const lruCache = new LRUCache({ max: maxSize });
function LRUCachePrecompile() {
  console.time("lru-cache-precompiled");
  const paths = Object.keys(files);

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const p = handlebars.precompile(files[path]);
    lruCache.set(path, Buffer.from(p));
  }
  console.timeEnd("lru-cache-precompiled");
}

const total_size = 1024 * 1024 * 128; // 128MB
const sharedCache = new SharedCache.Cache(
  "templates",
  total_size,
  SharedCache.SIZE_512
);
function SharedCachePrecompile() {
  console.time("shared-cache-precompile");
  const paths = Object.keys(files);

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const p = handlebars.precompile(files[path]);
    sharedCache[`_file_${path}`] = p;
  }
  console.timeEnd("shared-cache-precompile");
}

const redis = new ioredis(6379);
async function ioredisPrecompile() {
  console.time("ioredis-precompile");
  const paths = Object.keys(files);

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const p = handlebars.precompile(files[path]);
    await redis.set(path, p);
  }
  console.timeEnd("ioredis-precompile");
}

function lruCacheGet() {
  const context = {};
  const paths = Object.keys(files);

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const precompiled = lruCache.get(path) || "";
    if (!precompiled) console.log("buffer:miss:", path);
    context[IRender.FILES(path)] = precompiled;
  }
}

function SharedCacheGet() {
  const context = {};
  const paths = Object.keys(files);

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const precompiled = sharedCache[`_file_${path}`] || "";
    if (!precompiled) console.log("share:miss:", path);
    context[IRender.FILES(path)] = precompiled;
  }
}

async function redisGet() {
  const context = {};
  const paths = Object.keys(files);

  const tasks = paths.map((path) => {
    return redis.get(path);
  });
  // console.time("redis batch get");
  const lists = await Promise.all(tasks);
  // console.timeEnd("redis batch get");
  for (let i = 0; i < lists.length; i++) {
    const path = paths[i];
    const precompiled = lists[i] || "";
    if (!precompiled) console.log("redis:miss:", path);
    context[IRender.FILES(path)] = precompiled;
  }
}

async function logTime() {
  console.time("lru");
  lruCacheGet();
  console.timeEnd("lru");
  console.time("shared");
  SharedCacheGet();
  console.timeEnd("shared");
  console.time("redis");
  await redisGet();
  console.timeEnd("redis");
}

function startBenchmark() {
  suite.add(`lru-cache`, function () {
    lruCacheGet();
  });
  suite.add(`shared-cache`, function () {
    SharedCacheGet();
  });
  suite.add(`redis`, async function () {
    redisGet();
  });

  suite
    .on("cycle", function (event) {
      benchmarks.add(event.target);
    })
    .on("start", function () {
      console.log(
        "\n  arguments to Benchmark\n  node version: %s, date: %s\n  Starting...",
        process.version,
        Date()
      );
    })
    .on("complete", async function done() {
      benchmarks.log();
    })
    .run({ async: false });
}

async function main() {
  LRUCachePrecompile();
  SharedCachePrecompile();
  await ioredisPrecompile();
//   startBenchmark();
//   await logTime();
//   lruCache.reset();
//   // process.exit(0);
//   SharedCache.release("templates");
}

main();
