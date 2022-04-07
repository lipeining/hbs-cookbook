const validPathsRegex =
  /^[/\\]?(assets|config|layout|locales|sections|snippets|templates)/;
const validHtmlRegex = /^[/\\]?(layout|sections|snippets|templates)/;
function isValidPath(filePath) {
  if (validHtmlRegex.test(filePath) && !filePath.endsWith(".html")) {
    return false;
  }
  const inDir = validPathsRegex.test(filePath);
  if (!inDir) {
    return false;
  }
  const ignoreExt = [".map", ".js", ".jpg"];
  const matchExt = [".html", ".hbs", ".json"];
  return matchExt.some((ext) => filePath.endsWith(ext));
}
const fastGlob = require("fast-glob");
const path = require("path");
const fs = require("fs");
const handlebars = require("./egg-handlebars");
// 主题名: 主题路径
const themes = require("./themes.json");
const data =  require("./expect/data.json");

function main() {
  for (const themeName of Object.keys(themes)) {
    const src = `${themes[themeName]}/dist`;
    const srcPath = path.resolve(src).replace(/\\/g, "/");
    const files = fastGlob.sync(`${srcPath}/**/*`);
    const tems = Object.assign({}, data);
    const before = process.memoryUsage();
    files.forEach((fullPath) => {
      const filePath = fullPath.split(srcPath)[1];
      if (isValidPath(filePath)) {
        // console.log(`合法文件：${filePath}`);
        tems[filePath] = handlebars.compile(
          fs.readFileSync(fullPath, { encoding: "utf8" })
        );
        // tems[filePath] = handlebars.compile(
        //   fs.readFileSync(fullPath, { encoding: "utf8" })
        // )({});
      }
    });
    const after = process.memoryUsage();
    const keys = Object.keys(before);
    for (const key of keys) {
      console.log(`${key}: ${before[key]} -> ${after[key]}`);
    }
  }
}

main();
