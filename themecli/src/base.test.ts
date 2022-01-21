import * as path from "path";
import { ThemeBench } from "./bench";
import { runProject } from "./index";
import { readfiles } from "./file";

// describe("themecli", () => {
// it("benchmark ThemeBench", async () => {
//   await ThemeBench({
//     name: "expect",
//     dir: path.join(__dirname, "../../expect-source"),
//   });
// });
// it("runProject", async () => {
//   await runProject();
// });
// });

describe("file", () => {
  it("readfiles", async () => {
    const files = await readfiles(path.join(__dirname, "../../expect-source"));
    console.log(files.length);
  });
});
