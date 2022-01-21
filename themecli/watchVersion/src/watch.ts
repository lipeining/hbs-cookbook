import * as chokidar from "chokidar";
import * as path from "path";

export async function createWatcher({ baseDir, paths, updateLocalFn, name }) {
  return new Promise((resolve) => {
    const watchJS = (process.env.watchJS || ".min.js,.modern.js").split(
      ","
    );
    const watcher = chokidar.watch(paths, {
      ignored: [
        (str) =>
          str.endsWith(".js") && !watchJS.some((ext) => str.endsWith(ext)),
        "**/*.scss",
        /(^|[/\\])\../,
        /node_modules/,
      ],
    });

    let size = 0;
    let processing = 0;
    ["add", "change"].forEach((type) => {
      watcher.on(type, async (fullPath) => {
        processing++;
        // const filePath = fullPath.split(baseDir)[1].replace(/^[/\\]/, "");
        // console.info(`[themecli] ${Type[type]}: ${fullPath}`);
        const parts = fullPath.split(path.resolve(baseDir));
        const filePath = parts[1].split(path.win32.sep).filter(Boolean).join(path.posix.sep);
        await updateLocalFn(filePath, fullPath);
        size++;
        processing--;

        if (processing === 0) {
          console.info(`[themecli] ${type} ${name}数量: ${size}`);
          size = 0;
          resolve(true);
        }
      });
    });
  });
}
