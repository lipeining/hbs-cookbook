import * as fs from "fs";
// eslint-disable-next-line node/no-unsupported-features/node-builtins
const fsPromises = fs.promises;
import * as _ from "lodash";
import * as Mock from 'mockjs';
import { readfiles, toPosixRelativePath } from "./file";
const mockDatas = {};

// TODO 需要更新 mock 数据
export async function LoadData(CLI_API_MOCK_PATH: string) {
  const fileList = await readfiles(CLI_API_MOCK_PATH);
  await Promise.all(
    fileList.map(({ fullPath }) => {
      return updateMockLocal(
        toPosixRelativePath(CLI_API_MOCK_PATH, fullPath),
        fullPath
      );
    })
  );

  return mockDatas;
}

async function updateMockLocal(filePath: string, fullPath: string) {
  const fileContent = await fsPromises.readFile(fullPath, "utf8");
  mockDatas[filePath] = Mock.mock(JSON.parse(fileContent));
}
