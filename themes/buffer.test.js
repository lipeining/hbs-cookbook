const LRU = require("lru-cache");
const maxSize = 10000;
const files = require("./expect/files.json");
const {
  render,
  renderTemplate,
  loadTemplates,
  cachePrecompileFiles,
  loadPreTemplates,
} = require("./render");

const cache = new LRU({ max: maxSize * 5 });

function setCache() {
  cachePrecompileFiles(cache);
  console.log("after set cache size", cache.length, cache.itemCount);
}

function getCache() {
  return loadPreTemplates(cache);
}

function test() {
  setCache();
  const ctx = getCache();
  console.log("after get cache size", cache.length, cache.itemCount);
  const result = renderTemplate(ctx);
  return result;
// cachePrecompileFiles: 359.919ms
// after set cache size 120 120
// loadPreTemplates: 28.372ms
// after get cache size 120 120
// html 124192
// renderTemplate: 68.911ms
}

test();
