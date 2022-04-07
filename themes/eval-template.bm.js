"use strict";

const Benchmark = require("benchmark");
const benchmarks = require("beautify-benchmark");
const suite = new Benchmark.Suite();
const handlebars = require("./egg-handlebars");
const files = require("./expect/files.json");
const prec = handlebars.precompile(
  files["snippets/product/detail/product-preview.html"]
);
const templtec = safeEval(prec);

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

suite.add("eval time", () => {
  safeEval(prec);
});

suite.add("template time", () => {
  handlebars.template(templtec);
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
  console.log("file length", files["snippets/product/detail/product-preview.html"].length);
  console.log("precompiled length", prec.length);
}

main();
