'use strict';

const Benchmark = require('benchmark');
const benchmarks = require('beautify-benchmark');
const suite = new Benchmark.Suite();
const Handlebars = require('handlebars');
const Heplers = require("handlebars-helpers")({ handlebars: Handlebars });

const eqUnknow = Handlebars.compile("{{#eq 1 1}}big{{/eq}}");
const eqKnow = Handlebars.compile("{{#eq 1 1}}big{{/eq}}", { knownHelpers: { eq: true } });


suite
  .add('eqUnknow', function() {
    const output = 'big';
    const result = eqUnknow({});
    if (result !== output) {
      throw new Error(`expect ${result} === ${output}`);
    }
  })
  .add('eqKnow', function() {
    const output = 'big';
    const result = eqKnow({});
    if (result !== output) {
      throw new Error(`expect ${result} === ${output}`);
    }
  })
  .on('cycle', function(event) {
    benchmarks.add(event.target);
  })
  .on('start', function() {
    console.log(
      '\n  arguments to helpers Benchmark\n  node version: %s, date: %s\n  Starting...',
      process.version,
      Date()
    );
  })
  .on('complete', function done() {
    benchmarks.log();
    console.log(Handlebars.precompile("{{#eq 1 1}}big{{/eq}}"));
    console.log(Handlebars.precompile("{{#eq 1 1}}big{{/eq}}", { knownHelpers: { eq: true } }));
  })
  .run({ async: false });
