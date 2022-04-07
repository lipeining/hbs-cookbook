"use strict";

const Benchmark = require("benchmark");
const benchmarks = require("beautify-benchmark");
const suite = new Benchmark.Suite();
const handlebars = require("./egg-handlebars");
const files = require("./expect/files.json");
const assets = require("./expect/assets.json");
const memoize = require("moize");
const config = require("./config");
const { IRender } = config;

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
const memoizeCompile = memoize(handlebars.compile, { maxSize: 2000 });

const memoContext = require("./expect/data.json");
const lruContext = require("./expect/data.json");
const precompiled = {};
const paths = Object.keys(files);

for (let i = 0; i < paths.length; i++) {
  const path = paths[i];
  const file = files[path];
  memoContext[IRender.FILES(path)] = memoizeCompile(file);
  precompiled[path] = handlebars.precompile(file);
}
memoContext[IRender.ASSETS] = assets;

suite.add("memoize compiled time", () => {
  const path = "templates/products/detail.html";
  const templateRender = memoContext[IRender.FILES(path)];
  templateRender(memoContext);
});

suite.add("lru precompiled time", () => {
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    lruContext[IRender.FILES(path)] = handlebars.template(
      safeEval(precompiled[path])
    );
  }
  const path = "templates/products/detail.html";
  const templateRender = lruContext[IRender.FILES(path)];
  templateRender(lruContext);
});

function startBenchmark() {
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
  startBenchmark();
  const path = "templates/products/detail.html";
  console.log( memoContext[IRender.FILES(path)](memoContext).length);
  console.log(lruContext[IRender.FILES(path)](lruContext).length);
}

main();
