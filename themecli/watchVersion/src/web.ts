import * as fs from "fs";
// eslint-disable-next-line node/no-unsupported-features/node-builtins
const fsPromises = fs.promises;
import * as path from "path";
import TFile from "./lib/constants/file";
import * as _ from "lodash";
// import * as matter from "gray-matter";
import * as handlebars from "./egg-handlebars";
import matter from "gray-matter";
import * as HandlebarsConfig from "./config";
const { IRender } = HandlebarsConfig;
import { createWatcher } from "./watch";

import { config as importConfig } from "dotenv";
importConfig();

interface IObject {
  [k: string]: any;
}

const webFiles: IObject & any = {};
const precompiled: IObject & any = {};
const files: IObject[] = [];
const metadatas: IObject = {};
const config: IObject = {
  settingData: undefined,
  settingSchema: [],
};

export async function LoadWebProject(CLI_WEB_PATH: string) {
  // 监听模板文件变动
  const templateWatcher = await createWatcher({
    baseDir: CLI_WEB_PATH,
    paths: [
      "layout",
      "templates",
      "sections",
      "snippets",
      "config",
      "assets",
      "locales",
    ].map((dir) => path.join(CLI_WEB_PATH, dir)),
    updateLocalFn: (filePath: string, fullPath: string) =>
      updateWebFileLocal(filePath, fullPath),
    name: "模板",
  });

  const loadtemplates = {
    webFiles,
    files,
    precompiled,
    config,
    metadatas,
  };

  return loadtemplates;
}

async function updateWebFileLocal(filePath: string, fullPath: string) {
  const fileContent = await fsPromises.readFile(fullPath, "utf8");
  const filename = filePath;

  // 保存具体的 assets 链接，用于 assets_url helper 渲染
  if (!webFiles[IRender.ASSETS]) webFiles[IRender.ASSETS] = {};
  if (filename.startsWith(IRender.FILE_TYPE.ASSETS)) {
    webFiles[IRender.ASSETS][filename] = "/" + filename;
  }

  if (filename === TFile.CONFIG_SETTINGS_DATA) {
    const content = _.attempt(JSON.parse, fileContent);
    config.settingData = _.isError(content) ? {} : content;
  }
  if (filename === TFile.CONFIG_SETTINGS_SCHEMA) {
    const content = _.attempt(JSON.parse, fileContent);
    config.settingSchema = _.isError(content) ? [] : content;
  }

  webFiles[filename] = fileContent;
  if (filename.endsWith(IRender.TEMPLATE_EXTNAME)) {
    precompiled[filename] = handlebars.precompile(fileContent);
  }

  const metadataFilePrefix = [
    IRender.FILE_TYPE.SECTIONS,
    IRender.FILE_TYPE.TEMPLATES,
  ];
  if (metadataFilePrefix.some((prefix) => filename.startsWith(prefix))) {
    const { data, content } = matter(fileContent, {
      engines: {
        yaml: {
          parse: (input: string): any => input,
        },
      },
    });
    // data 可能为 {}(源文件中没有拓展配置) 或者 string(源文件有拓展配置)
    metadatas[filename] = data;
    webFiles[filename] = content;
    precompiled[filename] = handlebars.precompile(content);
  }

  updateFiles(filename, fileContent);
}

async function updateFiles(fileName: string, fileContent: string) {
  const fileIdex = _.findIndex(files, (file) => file.fileName === fileName);
  if (fileIdex === -1) files.push({ fileName, fileContent });
  else {
    files[fileIdex].fileContent = fileContent;
  }
}
