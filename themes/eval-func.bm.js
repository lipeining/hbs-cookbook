"use strict";

const Benchmark = require("benchmark");
const benchmarks = require("beautify-benchmark");
const suite = new Benchmark.Suite();
const handlebars = require("./egg-handlebars");
const files = require("./expect/files.json");
const prec = handlebars.precompile(
  files["snippets/product/detail/product-preview.html"]
);

function safeEvalAssign(templateSpec) {
  try {
    var ret;
    eval("ret = " + templateSpec);
    return ret;
  } catch (err) {
    console.error(templateSpec);
    throw err;
  }
}

function safeEvalFunc(templateSpec) {
  /* eslint-disable no-eval, no-console */
  try {
    return eval("(" + templateSpec + ")");
  } catch (err) {
    console.error(templateSpec);
    throw err;
  }
  /* eslint-enable no-eval, no-console */
}

function funcJsonParse(obj) {
  return Function("return (" + obj + ")")();
  //   return Function('"use strict";return (' + obj + ")")();
}

function vmParse(code) {
  const context = {};
  vm.createContext(context);
  vm.runInContext("var ret = (" + code + ");", context);
  return context.ret;
}

suite.add("eval assign = time", () => {
  safeEvalAssign(prec);
});
suite.add("eval func () time", () => {
  safeEvalFunc(prec);
});
suite.add("function return time", () => {
  funcJsonParse(prec);
});
// suite.add("vm parse time", () => {
//   vmParse(prec);
// });

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
  console.log(
    "file length",
    files["snippets/product/detail/product-preview.html"].length
  );
  console.log("precompiled length", prec.length);
}

main();
