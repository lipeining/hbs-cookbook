import * as fs from "fs";
import * as path from "path";
import * as _ from "lodash";
import { createWatcher } from "./watch";
// eslint-disable-next-line node/no-unsupported-features/node-builtins
const fsPromises = fs.promises;

const { MOCK_STORE_HOST } = process.env;

const ssrPlugins = { templates: {}, plugins: {}, pluginPaths: {} };

// 注册 ssr 插件
export async function registrySSRPlugins(SSR_PLUGIN_PATH: string) {
  const pluginPaths = _.uniq(SSR_PLUGIN_PATH?.split(",").filter(Boolean));
  for (const pluginPath of pluginPaths) {
    await registrySSRPlugin(pluginPath);
  }
  return ssrPlugins;
}

async function registrySSRPlugin(pluginPath: string) {
  try {
    const configPath = path.join(pluginPath, "plugin.config.json");
    const pluginConfig = require(`${configPath}`);
    const htmlPath = path.join(pluginPath, "dist");
    const pluginName = pluginConfig.name;
    const pluginAppKey = pluginConfig.appKey;
    const pluginPages = pluginConfig.pages;
    if (!pluginName) {
      throw new Error("plugin.config.json 缺少 name 字段");
    }

    if (!pluginAppKey) {
      throw new Error("plugin.config.json 缺少 appKey 字段");
    }

    let appKey = pluginAppKey;
    if (_.isObject(pluginAppKey)) {
      const keyEnv = MOCK_STORE_HOST?.includes("myshoplinedev.com")
        ? "dev"
        : "test";
      appKey = pluginAppKey[keyEnv];
    }

    // const jsSource = fs.readFileSync(`${pluginPath}/dist/assets/index.min.js`, {
    //   encoding: "utf-8",
    // });
    // const cssSource = fs.readFileSync(
    //   `${pluginPath}/dist/assets/index.min.css`,
    //   { encoding: "utf-8" }
    // );

    ssrPlugins.plugins[appKey] = {
      config: pluginConfig,
      script: "",
      css: "",
      html: {},
      locales: {},
      version: `cli-${new Date().toString()}`,
    };

    ssrPlugins.templates[appKey] = pluginPages;

    // 记录 plugin 与 路径 的关系
    ssrPlugins.pluginPaths[appKey] = pluginPath;

    const htmlWatcher = await createWatcher({
      baseDir: htmlPath,
      paths: ["snippets"].map((dir) => path.join(htmlPath, dir)),
      updateLocalFn: (filePath: string, fullPath: string) =>
        updateSSRPluginLocal(appKey, filePath, fullPath),
      name: `SSR 插件【${pluginName}】`,
    });

    console.info(`注册 SSR 插件【${pluginName}】成功`);
  } catch (error) {
    console.warn(`注册 SSR 插件 失败`, error);
  }
}

async function updateSSRPluginLocal(
  appKey: string,
  filePath: string,
  fullPath: string
) {
  const filename = filePath;
  const fileContent = await fsPromises.readFile(fullPath, "utf8");

  ssrPlugins.plugins[appKey].html[filename] = fileContent;

  if (fullPath.endsWith("assets/index.min.js")) {
    ssrPlugins.plugins[appKey].script = fileContent;
  }

  if (fullPath.endsWith("assets/index.min.css")) {
    ssrPlugins.plugins[appKey].css = fileContent;
  }

  if (fullPath.includes("/locales/")) {
    const localeName = fullPath.split("/locales/")[1].split(".json")[0];
    const curLocale = _.attempt(JSON.parse, fileContent);
    ssrPlugins.plugins[appKey].locales[localeName] = _.isError(curLocale)
      ? {}
      : curLocale;
  }
}
