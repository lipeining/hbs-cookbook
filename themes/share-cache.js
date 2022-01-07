const LRU = require("node-shared-cache");
const {
  render,
  renderTemplate,
  cacheShareTemplates,
  loadShareTemplates,
} = require("./render");
const Koa = require("koa");
const app = new Koa();

const total_size = 1024 * 1024 * 128; // 128MB
// const cache = new LRU.Cache("templates"+process.env.port, total_size, LRU.SIZE_512);
const cache = new LRU.Cache("templates", total_size, LRU.SIZE_512);

function setCache() {
  cacheShareTemplates(cache);
}

function getCache() {
  return loadShareTemplates(cache);
}

function testCache() {
  setCache();
  const ctx = getCache();
  const result = renderTemplate(ctx);
  return result;
  //   block:snippet:product/commons/base-modal: 34.758ms
  //   html 124192
  //   renderTemplate: 213.6ms
}

// testCache();

app.use(async (ctx) => {
  if (ctx.path !== "/") {
    return;
  }
  ctx.status = 200;
  if (!cache.init) {
    cache.init = true;
    setCache();
    console.log("init cache");
  }
  const context = getCache();
  ctx.body = renderTemplate(context);
});
// node -e "process.env.port=3000" share-cache.js
// node  share-cache.js -e "process.env.port=3000"
app.listen(Number(process.env.port));
