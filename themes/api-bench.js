var apiBenchmark = require("api-benchmark");
const fs = require("fs");

var service = {
  server1: "http://localhost:3000/",
};

var routes = { route1: "/" };

apiBenchmark.measure(
  service,
  routes,
  { debug: true, runMode: "parallel", maxTime: 30, minSamples: 100, maxConcurrentRequests: 5 },
  function (err, results) {
    apiBenchmark.getHtml(results, function (error, html) {
      // console.log(html);
      // now save it yourself to a file and enjoy
      fs.writeFileSync("api-bench.html", html);
    });
  }
);
