import * as handlebars from "./egg-handlebars";
import * as HandlebarsConfig from "./config";
const { IRender } = HandlebarsConfig;

function loadTemplate(file: string) {
  return handlebars.compile(file);
}

function safeEval(templateSpec: string) {
  try {
    var ret;
    eval("ret = " + templateSpec);
    return ret;
  } catch (err) {
    console.error(templateSpec);
    throw err;
  }
}

export function loadPreTemplates(context, files) {
  const paths = Object.keys(files);

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const precompiled = files[path];
    context[IRender.FILES(path)] = handlebars.template(
      safeEval(precompiled?.toString())
    );
  }
  return context;
}

export function loadTemplates(context, files) {
  const paths = Object.keys(files);

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const file = files[path];
    context[IRender.FILES(path)] = loadTemplate(file);
  }
  return context;
}

export function renderTemplate(context, template) {
  const templateRender = context[IRender.FILES(template)];
  const html = templateRender(context);
  return html;
}
