"use strict";

const Benchmark = require("benchmark");
const benchmarks = require("beautify-benchmark");
const suite = new Benchmark.Suite();
const Handlebars = require("handlebars");
const Heplers = require("handlebars-helpers")({ handlebars: Handlebars });
const vm = require("vm");

function safeEval(templateSpec) {
  /* eslint-disable no-eval, no-console */
  try {
    return eval("(" + templateSpec + ")");
  } catch (err) {
    console.error(templateSpec);
    throw err;
  }
  /* eslint-enable no-eval, no-console */
}

function looseJsonParse(obj) {
  return Function("return (" + obj + ")")();
  //   return Function('"use strict";return (' + obj + ")")();
}

function vmParse(code) {
  const context = {};
  vm.createContext(context);
  vm.runInContext("var ret = (" + code + ");", context);
  return context.ret;
}

const eqExp = "{{#eq 1 1}}big{{/eq}}";
const list = [];
for (let i = 1; i <= 10000; i *= 10) {
  const exp = eqExp.repeat(i);
  const tem = Handlebars.precompile(exp);
  list.push({ exp, i, tem });
}

for (const { i, tem } of list) {
  suite.add(`safeEval-${i}`, function () {
    safeEval(tem);
  });
  suite.add(`looseJsonParse-${i}`, function () {
    looseJsonParse(tem);
  });
  suite.add(`vmParse-${i}`, function () {
    vmParse(tem);
  });
}

suite
  .on("cycle", function (event) {
    benchmarks.add(event.target);
  })
  .on("start", function () {
    console.log(
      "\n  arguments to helpers Benchmark\n  node version: %s, date: %s\n  Starting...",
      process.version,
      Date()
    );
  })
  .on("complete", function done() {
    benchmarks.log();
    // console.log(Handlebars.precompile("{{#eq 1 1}}big{{/eq}}"));
    // console.log(Handlebars.precompile("{{#eq 1 1}}big{{/eq}}", { knownHelpers: { eq: true } }));
  })
  .run({ async: false });
