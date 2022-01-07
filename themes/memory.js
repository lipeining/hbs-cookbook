const CPPLRU = require("cpp-lru-cache");
const JSLRU = require("lru-cache");
const maxSize = 10000;

function testCPP() {
  const before = process.memoryUsage();
  const cache = new CPPLRU({ maxSize: maxSize * 5 });
  for (let i = 0; i < maxSize * 2; i++) {
    const obj = {
      key: "hello".repeat(100000),
    };
    cache.set(`${i}`, obj);
  }
  for (let i = 0; i < maxSize; i++) {
    cache.get(`${i}`);
  }
  console.log("size: ", cache.size());
  const after = process.memoryUsage();
  console.log("process memory diff");
  const keys = Object.keys(before);
  for (const key of keys) {
    console.log(`${key}: ${before[key]} -> ${after[key]}`);
  }
    // PS D:\github-project\hbs-cookbook\themes> node cache.js
    // size:  20000
    // process memory diff
    // rss: 21377024 -> 59080704
    // heapTotal: 4517888 -> 53473280
    // heapUsed: 2840552 -> 19420064
    // external: 872460 -> 1040356
    // arrayBuffers: 26495 -> 9898
    // [2022-01-05 16:18:54] logINFO : [cache] is deleted
}

// testCPP();

function testJS() {
  const before = process.memoryUsage();
  const cache = new JSLRU({ max: maxSize * 5 });
  for (let i = 0; i < maxSize * 2; i++) {
    const obj = {
      key: "hello".repeat(100000),
    };
    cache.set(`${i}`, obj);
  }
  for (let i = 0; i < maxSize; i++) {
    cache.get(`${i}`);
  }
  console.log("length, itemCount: ", cache.length, cache.itemCount);
  const after = process.memoryUsage();
  console.log("process memory diff");
  const keys = Object.keys(before);
  for (const key of keys) {
    console.log(`${key}: ${before[key]} -> ${after[key]}`);
  }
    // PS D:\github-project\hbs-cookbook\themes> node cache.js
    // length, itemCount:  20000 20000
    // process memory diff
    // rss: 21426176 -> 56422400
    // heapTotal: 4517888 -> 53850112
    // heapUsed: 2886848 -> 22136920
    // external: 872460 -> 1040356
    // arrayBuffers: 26495 -> 9898
}

// testJS();

function testJSBuffer() {
  const before = process.memoryUsage();
  const cache = new JSLRU({ max: maxSize });
  for (let i = 0; i < maxSize * 2; i++) {
    const obj = Buffer.from('hello'.repeat(100000))
    cache.set(`${i}`, obj);
  }
  for (let i = 0; i < maxSize; i++) {
    cache.get(`${i}`);
  }
  console.log("length, itemCount: ", cache.length, cache.itemCount);
  const after = process.memoryUsage();
  console.log("process memory diff");
  const keys = Object.keys(before);
  for (const key of keys) {
    console.log(`${key}: ${before[key]} -> ${after[key]}`);
  }
  // Buffer('') 50000
  // PS D:\github-project\hbs-cookbook\themes> node memory.js
  // length, itemCount:  20000 20000
  // process memory diff
  // rss: 21479424 -> 7496925184
  // heapTotal: 4517888 -> 49823744
  // heapUsed: 2876472 -> 15296032
  // external: 872460 -> 10001033190
  // arrayBuffers: 26495 -> 9898

  // Buffer('') 10000
  //   PS D:\github-project\hbs-cookbook\themes> node memory.js
  // length, itemCount:  10000 10000
  // process memory diff
  // rss: 21352448 -> 7871479808
  // heapTotal: 4517888 -> 42405888
  // heapUsed: 2870624 -> 7343536
  // external: 872460 -> 5028033190
  // arrayBuffers: 26495 -> 9898
  
  // Buffer.from('') 10000
  // PS D:\github-project\hbs-cookbook\themes> node memory.js
  // length, itemCount:  10000 10000
  // process memory diff
  // rss: 21360640 -> 8799682560
  // heapTotal: 4517888 -> 24580096
  // heapUsed: 2871016 -> 7195192
  // external: 872460 -> 5027033190
  // arrayBuffers: 26495 -> 9898  
}

testJSBuffer();

function testCPPBuffer() {
  const before = process.memoryUsage();
  const cache = new CPPLRU({ maxSize: maxSize * 5, maxAge: 100000 });
  for (let i = 0; i < maxSize * 2; i++) {
    const obj = Buffer.from('hello'.repeat(100000))
    cache.set(`${i}`, obj);
  }
  for (let i = 0; i < maxSize; i++) {
    cache.get(`${i}`);
  }
  console.log("size: ", cache.size());
  const after = process.memoryUsage();
  console.log("process memory diff");
  const keys = Object.keys(before);
  for (const key of keys) {
    console.log(`${key}: ${before[key]} -> ${after[key]}`);
  }
  // size:  20000
  // process memory diff
  // rss: 21139456 -> 9765634048
  // heapTotal: 4517888 -> 9428992
  // heapUsed: 2861144 -> 7759080
  // external: 872460 -> 10001033190
  // arrayBuffers: 26495 -> 9898
}

// testCPPBuffer();
