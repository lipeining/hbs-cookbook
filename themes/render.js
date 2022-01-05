require("dotenv").config();
const handlebars = require("./handlbars");

const files = require("./expect/files.json");
const assets = require("./expect/assets.json");
const locale = require("./expect/locale.json");
// const context = require("./expect/data.json");
const config = require("./config");
const { IRender } = config;

function loadTemplate(file) {
  return handlebars.compile(file);
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

async function render(files, ctx) {
  const context = loadTemplates(files);
  if (ctx.query.profile === "true") {
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

const Koa = require("koa");
const app = new Koa();

// 当 loadTemplates 在这里加载时，除了第一个之外，其余的整体的时间会很快
// 到 20-50 ms 之间，不过具体函数耗时时不确定的，
// 猜测为内存缓存的原因。应该不具备参考价值。
// loadTemplates(files);

// response
app.use(async (ctx) => {
  if (ctx.path !== "/") {
    return;
  }
  ctx.status = 200;
  ctx.body = await render(files, ctx);
});

app.listen(3000);





// 需要拿之前的各种语言的性能跑分代码，检查一下。

// https://youjingyu.github.io/clinic-doc-zh/flame/first_analysis.html
// clinic flame --on-port 'autocannon localhost:$PORT' -- node render.js
// clinic flame --autocannon [ -m GET / ] -- node render.js
// clinic flame -- node render.js
// clinic flame --autocannon /  -- node render.js
// 可以看到第一个耗时较大，其余耗时逐步减少。
// lipeining@lipeiningdeMacBook-Pro themes % clinic flame --autocannon /  -- node render.js
// handlebars helpers length: 320
// Running 10s test @ http://localhost:3000/
// 10 connections

// running [                    ] 0%loadTemplates: 0.746ms
// isPreviewProduct ==== undefined
// isPreviewProduct ==== false
// html 124192
// renderTemplate: 495.867ms
// loadTemplates: 0.192ms
// isPreviewProduct ==== undefined
// isPreviewProduct ==== false
// html 124192
// renderTemplate: 285.484ms
// loadTemplates: 0.221ms
// isPreviewProduct ==== undefined
// isPreviewProduct ==== false
// html 124192
// renderTemplate: 181.893ms
// loadTemplates: 0.174ms
// running [==                  ] 10%isPreviewProduct ==== undefined
// isPreviewProduct ==== false
// html 124192
// renderTemplate: 154.144ms


// clinic flame --autocannon [ -m GET /?profile=true ] -- node render.js

// 通过 console.time 得到 snippet 耗时时间大头
// 0x -o render.js
// 0x -P 'autocannon localhost:3000' render.js

// *compile D:\github-project\hbs-cookbook\node_modules\handlebars\dist\cjs\handlebars\compiler\javascript-compiler.js:73:28
// Top of Stack: 1% (6 of 620 samples)
// On Stack: 9.2% (57 of 620 samples)
// compile: function compile

// *parse D:\github-project\hbs-cookbook\node_modules\handlebars\dist\cjs\handlebars\compiler\parser.js:269:30
// Top of Stack: 1.8% (11 of 620 samples)
// On Stack: 9.2% (57 of 620 samples)
// parse: function parse(input)

// ~unput D:\github-project\hbs-cookbook\node_modules\handlebars\dist\cjs\handlebars\compiler\parser.js:429:34
// Top of Stack: 1.6% (10 of 620 samples)
// On Stack: 1.6% (10 of 620 samples)
// next: function next()

// *wrap D:\github-project\hbs-cookbook\node_modules\handlebars\dist\cjs\handlebars\compiler\code-gen.js:101:22
// Top of Stack: 0.4% (23 of 5435 samples)
// On Stack: 0.5% (26 of 5435 samples)

/**
 * templates/products/detail.html
 */
// snippet 的解构复制耗时
// snippet:product/detail/product-preview: 0.104ms
// isPreviewProduct ==== false
// snippet:product/detail/product-swiper: 0.379ms
// html 124192
// renderTemplate: 332.511ms
// loadTemplates: 0.171ms
// isPreviewProduct ==== undefined
// snippet:product/detail/product-preview: 0.045ms
// isPreviewProduct ==== false
// snippet:product/detail/product-swiper: 0.289ms

// snippet not block 的耗时
// snippet:product/detail/product-swiper: 35.141ms
// snippet:product/detail/product-preview: 141.559ms
// snippet:product/detail/product-swiper: 15.925ms
// snippet:product/detail/product-preview: 58.775ms

// mustance + blocks
// handlebars helpers length: 321
// loadTemplates: 0.424ms
// isPreviewProduct ==== undefined
// isPreviewProduct ==== false
// snippet:product/detail/product-swiper: 35.684ms
// snippet:product/detail/product-info: 36.44ms
// snippet:product/detail/payment-security: 5.546ms
// snippet:product/commons/base-collapse: 3.583ms
// snippet:product/detail/product-preview: 137.431ms
// snippet:product/commons/base-modal: 2.836ms
// snippet:product/commons/base-modal: 3.817ms

// store 的耗时
// snippet:product/detail/product-swiper: 38.227ms
// logTime:snippet:product/detail/product-swiper: 0.015ms
// snippet:product/detail/product-info: 35.735ms
// logTime:snippet:product/detail/product-info: 0.029ms
// snippet:product/detail/payment-security: 5.358ms
// logTime:snippet:product/detail/payment-security: 0.009ms
// snippet:product/commons/base-collapse: 3.647ms
// snippet:product/detail/product-preview: 140.524ms
// logTime:snippet:product/detail/product-preview: 0.026ms
// logTime:snippet:product/detail/product-preview: 0.015ms
// snippet:product/commons/base-modal: 2.874ms
// snippet:product/commons/base-modal: 4.112ms

/**
 * product/commons/sku-trade/flatten
 */

// store 里面的计算 node 节点耗时
//  node(): 0.009ms
//  node(): 0.01ms
//  node(): 0.009ms
//  node(): 0.013ms

// handlebars 生成 template 实例耗时。
// console.timeEnd("start template");
// start template: 0.443ms
// start template: 0.516ms
// start template: 0.751ms
// start template: 0.662ms
// start template: 0.553ms
// start template: 0.519ms
// start template: 0.942ms
// start template: 0.441ms
// start template: 0.342ms

// ret 函数执行时的耗时。
// start ret: 0.515ms
// start ret: 0.667ms
// start ret: 0.683ms
// start ret: 0.669ms
// start ret: 0.683ms
// start ret: 1.082ms
// start ret: 0.875ms
// start ret: 0.82ms
// start ret: 0.78ms
