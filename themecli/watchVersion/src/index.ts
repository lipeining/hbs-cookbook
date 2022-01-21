import { registrySSRPlugins } from "./plugin";
import { LoadWebProject } from "./web";
import { LoadData } from "./data";
import { loadTemplates, loadPreTemplates, renderTemplate } from "./render";
import ITemplate from "./lib/constants/template";
import * as HandlebarsConfig from "./config";
const { IRender } = HandlebarsConfig;

import { config as importConfig } from "dotenv";
importConfig();

const { CLI_WEB_PATH, SSR_PLUGIN_PATH, CLI_API_MOCK_PATH } = process.env;

export async function runProject() {
  const project = await LoadWebProject(CLI_WEB_PATH as string);
  const data: any = await LoadData(CLI_API_MOCK_PATH as string);
  {
    const context: any = {
      [IRender.ASSETS]: project.webFiles[IRender.ASSETS],
    };
    loadTemplates(context, project.webFiles);

    for (const template of Object.values(ITemplate)) {
      if (!project.webFiles[template]) {
        // console.warn(`${template} is not exist`);
        continue;
      }

      const ctx = Object.assign(
        {},
        context,
        data[template.replace("templates/", "").replace(".html", ".json")]
      );
      console.time("compile:   " + template);
      const html = renderTemplate(ctx, template);
      console.log("length", template, html.length);
      console.timeEnd("compile:   " + template);
    }
  }
  {
    const context: any = {
      [IRender.ASSETS]: project.webFiles[IRender.ASSETS],
    };
    loadPreTemplates(context, project.precompiled);

    for (const template of Object.values(ITemplate)) {
      if (!project.precompiled[template]) {
        // console.warn(`${template} is not exist`);
        continue;
      }

      const ctx = Object.assign(
        {},
        context,
        data[template.replace("templates/", "").replace(".html", ".json")]
      );
      console.time("precompile:  " + template);
      const html = renderTemplate(ctx, template);
      console.log("length", template, html.length);
      console.timeEnd("precompile:  " + template);
    }
  }
}

runProject();
