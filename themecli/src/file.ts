import * as fs from "fs";
import anymatch from "anymatch";
import * as path from "path";
import * as _ from 'lodash';
const fsPromises = fs.promises;

export function toPosixRelativePath(dir: string, fullPath: string) {
  const parts = fullPath.split(path.resolve(dir));
  const filePath = parts[1]
    .split(path.win32.sep)
    .filter(Boolean)
    .join(path.posix.sep);
  return filePath;
}

export async function readfiles(
  dirs: string | string[],
  options?: {
    ignored?: any[];
  }
) {
  const ignored = options?.ignored || [
    (str) =>
      str.endsWith(".js") &&
      ![".min.js", ".modern.js"].some((ext) => str.endsWith(ext)),
    "**/*.scss",
    /(^|[/\\])\../,
    /node_modules/,
  ];

  dirs = Array.isArray(dirs) ? dirs : [dirs];
  const fileList: Array<{ fullPath: string }> = [];
  while (dirs.length !== 0) {
    const childDirs: string[] = [];
    for (const dir of dirs) {
      const files = await fsPromises.readdir(dir, { withFileTypes: true });

      for (const file of files) {
        const fullPath = path.join(dir, file.name);

        if (anymatch(ignored, fullPath)) {
          continue;
        }

        if (!file.isDirectory()) {
          fileList.push({ fullPath });
          continue;
        }

        childDirs.push(fullPath);
      }
    }
    dirs = childDirs;
  }

  return _.uniqBy(fileList, 'fullPath');
}
