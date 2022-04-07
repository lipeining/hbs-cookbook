// const sizeof = require("object-sizeof");

const handlebars = require("./egg-handlebars");
const files = require("./expect/files.json");
const context = require("./expect/data.json");

function formatByteSize(bytes) {
  if (bytes < 1024) return bytes + " bytes";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(3) + " KiB";
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(3) + " MiB";
  else return (bytes / 1073741824).toFixed(3) + " GiB";
}

function memorySizeOf(obj) {
  var bytes = 0;

  function sizeOf(obj) {
    if (obj !== null && obj !== undefined) {
      switch (typeof obj) {
        case "number":
          bytes += 8;
          break;
        case "string":
          bytes += obj.length * 2;
          break;
        case "boolean":
          bytes += 4;
          break;
        // case "function":
        case "object":
          var objClass = Object.prototype.toString.call(obj).slice(8, -1);
          if (objClass === "Object" || objClass === "Array") {
            for (var key in obj) {
              if (!obj.hasOwnProperty(key)) continue;
              sizeOf(obj[key]);
            }
          } else bytes += obj.toString().length * 2;
          break;
      }
    }
    return bytes;
  }

  return sizeOf(obj);
}

function main() {
  let compiled = 0;
  let precompiled = 0;
  const paths = Object.keys(files);

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const c = handlebars.compile(files[path]);
    compiled += memorySizeOf(c);
    if(path.includes("templates")) {
      c(context);
      console.log(c.toString());
    }

    const p = handlebars.precompile(files[path]);
    precompiled += memorySizeOf(p);
  }

  console.log("compiled:", compiled);
  console.log("precompiled:", precompiled);
}

main();

