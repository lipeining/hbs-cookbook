// const handlebars = require("./handlebars");
const handlebars = require("./egg-handlebars");

const files = require("./expect/files.json");
const assets = require("./expect/assets.json");
const locale = require("./expect/locale.json");
// const context = require("./expect/data.json");
const config = require("./config");
const { IRender } = config;

function loadTemplate(file) {
  return handlebars.compile(file);
}

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

function cachePrecompileFiles(cache) {
  console.time("cachePrecompileFiles");
  const paths = Object.keys(files);

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const p = handlebars.precompile(files[path]);
    cache.set(path, Buffer.from(p));
  }
  console.timeEnd("cachePrecompileFiles");
}

function loadPreTemplates(cache) {
  const context = require("./expect/data.json");
  console.time("loadPreTemplates");
  const paths = Object.keys(files);

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const precompiled = cache.get(path) || "";
    context[IRender.FILES(path)] = handlebars.template(
      safeEval(precompiled?.toString())
    );
  }
  console.timeEnd("loadPreTemplates");
  context[IRender.ASSETS] = assets;
  return context;
}

function renderPreTemplate(cache) {
  const context = loadPreTemplates(cache);
  return renderTemplate(context);
}

function cacheShareTemplates(cache) {
  console.time("cacheShareTemplates");
  const paths = Object.keys(files);

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const p = handlebars.precompile(files[path]);
    cache[`_file_${path}`] = p;
  }
  console.timeEnd("cacheShareTemplates");
}

function loadShareTemplates(cache) {
  const context = require("./expect/data.json");
  console.time("loadShareTemplates");
  const paths = Object.keys(files);

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const precompiled = cache[`_file_${path}`] || "";
    context[IRender.FILES(path)] = handlebars.template(
      safeEval(precompiled?.toString())
    );
  }
  console.timeEnd("loadShareTemplates");
  context[IRender.ASSETS] = assets;
  return context;
}

function loadTemplates(files) {
  const context = require("./expect/data.json");
  console.time("loadTemplates");
  const paths = Object.keys(files);

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const file = files[path];
    context[IRender.FILES(path)] = loadTemplate(file);
  }
  context[IRender.ASSETS] = assets;
  console.timeEnd("loadTemplates");
  return context;
}

function renderTemplate(context) {
  console.time("renderTemplate");
  const path = "templates/products/detail.html";
  // const path = "snippets/product/detail/product-preview.html";
  // context
  const templateRender = context[IRender.FILES(path)];
  const html = templateRender(context);
  console.log("html", html.length);
  console.timeEnd("renderTemplate");
  return html;
}

async function render(ctx) {
  if (ctx?.query?.precompile === "true") {
    return renderPreTemplate(ctx.app.cache);
  }
  const context = loadTemplates(files);
  if (ctx?.query?.profile === "true") {
    return await handlebars.profiler.run({}, () => {
      const span = handlebars.profiler.startSpan("tetsetsts");

      const result = renderTemplate(context);
      span?.end();

      // return result;
      return handlebars.profiler.getData() || {};
    });
  }
  return renderTemplate(context);
}

module.exports = {
  render,
  loadTemplates,
  renderTemplate,
  cachePrecompileFiles,
  loadPreTemplates,
  cacheShareTemplates,
  loadShareTemplates,
};
