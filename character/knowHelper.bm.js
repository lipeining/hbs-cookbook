'use strict';

const Benchmark = require('benchmark');
const benchmarks = require('beautify-benchmark');
const suite = new Benchmark.Suite();
const Handlebars = require('handlebars');
const Heplers = require("handlebars-helpers")({ handlebars: Handlebars });

const eqExp = "{{#eq 1 1}}big{{/eq}}";
const knownHelpers = { eq: true };
const list = [];
for (let i = 1; i <= 10000; i *= 10) {
  const exp = eqExp.repeat(i);
  const unkonwLen = Handlebars.precompile(exp).length;
  const konwLen = Handlebars.precompile(exp, { knownHelpers }).length;
  console.log("unkonw", unkonwLen);
  console.log("konw", konwLen);
  list.push({ exp, i });
}

// unkonw 804
// konw 730
// unkonw 3563
// konw 3015
// unkonw 31028
// konw 25890
// unkonw 307475
// konw 256437
// unkonw 3089952
// konw 2579914
// 执行时间没有大的差距
// eqUnknow-1     x  9,804 ops/sec ±17.15% (68 runs sampled)
// eqKnow-1       x 13,840 ops/sec ±2.11% (78 runs sampled)
// eqUnknow-10    x 10,613 ops/sec ±4.50% (72 runs sampled)
// eqKnow-10      x 12,074 ops/sec ±1.80% (81 runs sampled)
// eqUnknow-100   x  4,951 ops/sec ±4.37% (75 runs sampled)
// eqKnow-100     x  5,167 ops/sec ±3.79% (75 runs sampled)
// eqUnknow-1000  x    498 ops/sec ±1.41% (79 runs sampled)
// eqKnow-1000    x    504 ops/sec ±1.44% (80 runs sampled)
// eqUnknow-10000 x  48.36 ops/sec ±8.47% (61 runs sampled)
// eqKnow-10000   x  44.68 ops/sec ±6.16% (55 runs sampled)
// 编译时间加执行时间
// eqUnknow-1     x   916 ops/sec ±5.92% (64 runs sampled)
// eqKnow-1       x   847 ops/sec ±6.29% (59 runs sampled)
// eqUnknow-10    x   405 ops/sec ±5.30% (61 runs sampled)
// eqKnow-10      x   432 ops/sec ±6.67% (63 runs sampled)
// eqUnknow-100   x 55.14 ops/sec ±9.79% (45 runs sampled)
// eqKnow-100     x 81.88 ops/sec ±4.06% (64 runs sampled)
// eqUnknow-1000  x  4.18 ops/sec ±11.96% (15 runs sampled)
// eqKnow-1000    x  6.50 ops/sec ±8.64% (22 runs sampled)
// eqUnknow-10000 x  0.41 ops/sec ±31.30% (5 runs sampled)
// eqKnow-10000   x  0.74 ops/sec ±8.15% (6 runs sampled)
for (const { exp, i } of list) {
  suite.add(`eqUnknow-${i}`, function () {
    const eqUnknow = Handlebars.compile(exp);
    eqUnknow({});
  });
  suite.add(`eqKnow-${i}`, function () {
    const eqKnow = Handlebars.compile(exp, { knownHelpers });
    eqKnow({});
  });
}


suite
  .on('cycle', function (event) {
    benchmarks.add(event.target);
  })
  .on('start', function () {
    console.log(
      '\n  arguments to helpers Benchmark\n  node version: %s, date: %s\n  Starting...',
      process.version,
      Date()
    );
  })
  .on('complete', function done() {
    benchmarks.log();
    // console.log(Handlebars.precompile("{{#eq 1 1}}big{{/eq}}"));
    // console.log(Handlebars.precompile("{{#eq 1 1}}big{{/eq}}", { knownHelpers: { eq: true } }));
  })
  .run({ async: false });
