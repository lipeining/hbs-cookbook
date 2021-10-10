'use strict';

const Benchmark = require('benchmark');
const benchmarks = require('beautify-benchmark');
const suite = new Benchmark.Suite();
const Handlebars = require('handlebars');
const Heplers = require("handlebars-helpers")({ handlebars: Handlebars });
function safeEval(templateSpec) {
  try {
    var ret;
    eval('ret = ' + templateSpec);
    return ret;
  } catch (err) {
    console.error(templateSpec);
    throw err;
  }
}

const eqExp = "{{#eq 1 1}}big{{/eq}}";
const preString = Handlebars.precompile(eqExp);
const eq100 = "{{#eq 1 1}}big{{/eq}}".repeat(100);
const pre100 = Handlebars.precompile(eq100);

let result1, result2;
suite.add(`pre-compiled`, function () {
  const ret = safeEval(preString);
  const tem = Handlebars.template(ret);
  result1 = tem({});
});
suite.add(`compile`, function () {
  const tem = Handlebars.compile(eqExp);
  result2 = tem({});
});
suite.add(`pre-compiled-100`, function () {
  const ret = safeEval(pre100);
  const tem = Handlebars.template(ret);
  tem({});
});
suite.add(`compile-100`, function () {
  const tem = Handlebars.compile(eq100);
  tem({});
});



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
    console.log(result1, result2);
  })
  .run({ async: false });
