"use strict";

const Benchmark = require("benchmark");
const benchmarks = require("beautify-benchmark");
const suite = new Benchmark.Suite();
const Handlebars = require("handlebars");
// const Heplers = require("handlebars-helpers")({ handlebars: Handlebars });
const fs = require("fs");
const path = require("path");
const ExpectDir = path.join(__dirname, "expect");
const IndexHtml = fs.readFileSync(path.join(ExpectDir, "index.html"), {
  encoding: "utf-8",
});
const IndexCSS = fs.readFileSync(path.join(ExpectDir, "index.css"), {
  encoding: "utf-8",
});
const PreloadHtml = fs.readFileSync(path.join(ExpectDir, "preload.html"), {
  encoding: "utf-8",
});

Handlebars.registerHelper("helperMissing", function (/* dynamic arguments */) {
  var options = arguments[arguments.length - 1];
  return new Handlebars.SafeString("Missing: " + options.name);
});

suite.add(`index + index.min.css(as variable)`, function () {
  Handlebars.compile(IndexHtml)({ IndexCSS });
});

suite.add(`preload`, function () {
  Handlebars.compile(PreloadHtml)({});
});

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
    console.log("index---css---preload");
    console.log(IndexHtml.length, IndexCSS.length, PreloadHtml.length);

    console.time('index+variable');
    const result1 = Handlebars.compile(IndexHtml)({ IndexCSS });
    console.log("result1.length", result1.length);
    console.timeEnd('index+variable');

    console.time('preload');
    const result2 = Handlebars.compile(PreloadHtml)({});
    console.log("result2.length", result2.length);
    console.timeEnd('preload');
  })
  .run({ async: false });
