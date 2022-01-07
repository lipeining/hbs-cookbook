const CPPLRU = require("cpp-lru-cache");
const maxSize = 10000;

const files = require("./expect/files.json");
const { render, renderTemplate, loadTemplates } = require("./render");

const cache = new CPPLRU({ maxSize: maxSize * 5 });

function setCache() {
  const origin = loadTemplates(files);
  cache.set("context", origin);
  console.log('after set cache size', cache.size());
}

function getCache() {
  return cache.get("context");
}

function testCPP() {
  setCache();
  const ctx = getCache();
  console.log('after get cache size', cache.size());
  const result = renderTemplate(ctx);
  return result;
//   html 124192
// renderTemplate: 325.68ms
// [2022-01-05 16:37:49] logINFO : [cache] is deleted
}

testCPP();
