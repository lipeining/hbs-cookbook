import * as Benchmark from "benchmark";
import * as benchmarks from "beautify-benchmark";
import * as path from "path";
import { LoadWebProject } from "./web";
import { LoadData } from "./data";
import { loadTemplates, renderTemplate } from "./render";
import ITemplate from "./lib/constants/template";

interface themeInfo {
  name: string;
  dir: string;
}
type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

export async function ThemeBench(info: themeInfo) {
  const suite = new Benchmark.Suite();
  const context = {};

  const dir = path.resolve(info.dir);
  const project = await LoadWebProject(dir);
  const data = await LoadData(path.join(dir, "mock"));
  loadTemplates(context, project.webFiles);
  
  for (const template of Object.values(ITemplate)) {
    if (!project.webFiles[template]) {
      console.warn(`${template} is not exist`);
      continue;
    }

    suite.add(template, () => {
      const ctx = Object.assign(
        {},
        context,
        data[template.replace("templates/", "")]
      );
      renderTemplate(ctx, template);
    });
  }

  return new Promise((resolve) => {
    suite
      .on("cycle", function (event: Benchmark.Event) {
        benchmarks.add(event.target);
      })
      .on("start", async function () {
        console.log(`start ${info.name} on ${info.dir}:`);
        console.log(
          `node version: ${process.version}, date: ${Date()}\n  Starting...`
        );
      })
      .on("complete", function done() {
        benchmarks.log();
        resolve(true);
      });

    suite.run({ async: false });
  });
}
