const fs = require("fs");
const path = require("path");
const Handlebars = require("@yy/sl-egg-handlebars/lib/handlebars");
const { Profiler } = require("@yy/sl-egg-handlebars/lib/handlebars/profiler");
const currencyUtils = require("@yy/sl-egg-handlebars/lib/utils/currency");
const metafieldsUtils = require("@yy/sl-egg-handlebars/lib/utils/metafields");

const config = require("./config");

Handlebars.initOptions(
  { logger: { info: () => {}, error: () => {} } },
  config.options,
  config.IRender
);

require("handlebars-helpers")({ handlebars: Handlebars });

require("@yy/sl-egg-handlebars/lib/helpers")({
  handlebars: Handlebars,
  config,
});

Object.defineProperties(Handlebars.Utils, {
  currency: {
    value: {
      format: Handlebars.helpers.currency,
      utils: currencyUtils,
    },
  },
  currency_convert: {
    value: {
      format: Handlebars.helpers.currency_convert,
    },
  },
  metafields: {
    value: metafieldsUtils,
  },
});

const CUSTOM_HELPERS_PATH =
  process.env.SHARED_HELPERS || path.join(process.env.PWD, "bin", "helpers");
const customHelpers = fs.readdirSync(CUSTOM_HELPERS_PATH);
customHelpers.forEach((fileName) => {
  const helperName = path.parse(fileName).name;
  Handlebars.registerHelper(
    helperName,
    require(`${CUSTOM_HELPERS_PATH}/${fileName}`)(
      config.IRender,
      Handlebars.Utils
    )
  );
});

console.log(
  "handlebars helpers length:",
  Object.keys(Handlebars.helpers).length
);

Handlebars.profiler = new Profiler();

module.exports = Handlebars;
