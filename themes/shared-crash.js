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

var SegfaultHandler = require('segfault-handler');
 
SegfaultHandler.registerHandler("crash.log"); 

const ioredis = require("ioredis");
const SharedCache = require("node-shared-cache");
const LRUCache = require("lru-cache");
const maxSize = 10000;

function safeEval(templateSpec) {
  try {
    var ret;
    eval("ret = " + templateSpec);
    return ret;
  } catch (err) {
    console.error(templateSpec);
    throw err;
  }
}

// 设置缓存的时间只打印，不计算在 benchmark 之中？

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

const redis = new ioredis(6380);
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

LRUCachePrecompile();
SharedCachePrecompile();

suite.add(`compile`, function () {
  const context = require("./expect/data.json");
  const paths = Object.keys(files);

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const file = files[path];
    context[IRender.FILES(path)] = handlebars.compile(file);
  }
  context[IRender.ASSETS] = assets;

  const path = "templates/products/detail.html";
  const templateRender = context[IRender.FILES(path)];
  templateRender(context);
});

function lruCacheRender() {
  const context = require("./expect/data.json");
  const paths = Object.keys(files);

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const precompiled = lruCache.get(path) || "";
    context[IRender.FILES(path)] = handlebars.template(
      safeEval(precompiled?.toString())
    );
  }
  context[IRender.ASSETS] = assets;

  const path = "templates/products/detail.html";
  const templateRender = context[IRender.FILES(path)];
  templateRender(context);
}

suite.add(`lru-cache`, function () {
  lruCacheRender();
});

function SharedCacheRender() {
  const context = require("./expect/data.json");
  const paths = Object.keys(files);

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const precompiled = sharedCache[`_file_${path}`] || "";
    context[IRender.FILES(path)] = handlebars.template(
      safeEval(precompiled?.toString())
    );
  }
  context[IRender.ASSETS] = assets;

  const path = "templates/products/detail.html";
  const templateRender = context[IRender.FILES(path)];
  templateRender(context);
}

async function redisRender() {
  const context = require("./expect/data.json");
  const paths = Object.keys(files);

  const tasks = paths.map((path) => {
    return redis.get(path);
  });
  console.time("redis batch get");
  const lists = await Promise.all(tasks);
  console.timeEnd("redis batch get");
  for (let i = 0; i < lists.length; i++) {
    const path = paths[i];
    const precompiled = lists[i] || "";
    //   const precompiled = await redis.get(path) || "";
    context[IRender.FILES(path)] = handlebars.template(
      safeEval(precompiled?.toString())
    );
  }
  context[IRender.ASSETS] = assets;

  const path = "templates/products/detail.html";
  const templateRender = context[IRender.FILES(path)];
  templateRender(context);
}

async function logTime() {
  console.time("lru");
  lruCacheRender();
  console.timeEnd("lru");
  console.time("shared");
  SharedCacheRender();
  SharedCache.release("templates");
  console.timeEnd("shared");
  await ioredisPrecompile();
  console.time("redis");
  await redisRender();
  console.timeEnd("redis");
}

suite.add(`shared-cache`, function () {
    SharedCacheRender();
});

// suite.add(`redis`, async function () {

// });

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

    await logTime();
    lruCache.reset();
    process.exit(0);
    // SharedCache.release('templates');
  })
  .run({ async: false });