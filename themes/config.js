"use strict";
const LAYOUT = "layout"; // 骨架布局
const SECTIONS = "sections"; // 组件
const ASSETS = "assets"; // 静态资源
const SNIPPETS = "snippets"; // 静态资源
const LOCALES = "locales"; // 语种
const TEMPLATES = "templates"; // 模板
const CONFIG = "config"; // 配置

const config = {
  client: {},
  options: {
    // catch 所有 helper 的运行时错误，默认关闭
    runHelperCatchError: false,
    // 是否开启 profile，默认关闭
    enableProfile: true,
  },
  IRender: {
    PARTIALS: Symbol.for("PARTIALS#"),
    LANGS: Symbol.for("LANGS#"),
    ASSETS: Symbol.for("ASSETS#"),
    LAYOUT: Symbol.for("LAYOUT#"),
    TEMPLATE: "content_for_layout",
    NONE: Symbol.for("NONE#"),
    SLOT_STATE: Symbol.for("SLOT_STATE#"),
    DEFAULT_LAYOUT: `${LAYOUT}/theme.html`,
    TEMPLATE_EXTNAME: ".html",
    LOCALE_EXTNAME: ".json",
    HBS_EXTNAME: ".hbs",
    FILE_TYPE: {
      LAYOUT,
      SECTIONS,
      ASSETS,
      SNIPPETS,
      LOCALES,
      TEMPLATES,
      CONFIG,
    },
    FILES: (filepath) => Symbol.for("FILES#" + filepath),
    SECTIONS_SETTINGS: (filepath) =>
      Symbol.for("SECTIONS#SETTINGS#" + filepath),
    SECTIONS_CLASS: (filepath) => Symbol.for("SECTIONS#CLASS#" + filepath),
    SECTION_ID: "SECTION_ID", // section 的别名，默认使用文件名，有重复才生成新的随机字符串
    PARENT_SECTION: Symbol.for("PARENT_SECTION#"),
    TRACEID: Symbol.for("TRACEID#"),
  },
};

module.exports = config;
