const plugin = require('@yy/sl-egg-handlebars/app');
const fs = require('fs');
const path = require('path');
require("dotenv").config();
const config = require("./config");

let hbsFactory;

const app = {
    logger: {
      info: ()=>{},
      error: ()=>{},
      warn: ()=>{},
    },
    coreLogger: console,
    config: {
        handlebars: config,
    },
    addSingleton: (name, fn) => {
        hbsFactory = fn;
    }
}
plugin(app);
const handlebars = hbsFactory(config, app);

const CUSTOM_HELPERS_PATH =
  process.env.SHARED_HELPERS || path.join(process.env.PWD, "bin", "helpers");
const customHelpers = fs.readdirSync(CUSTOM_HELPERS_PATH);
customHelpers.forEach((fileName) => {
  const helperName = path.parse(fileName).name;
  handlebars.registerHelper(
    helperName,
    require(`${CUSTOM_HELPERS_PATH}/${fileName}`)(
      config.IRender,
      handlebars.Utils
    )
  );
});

console.log(
  "handlebars helpers length:",
  Object.keys(handlebars.helpers).length
);

module.exports = handlebars;