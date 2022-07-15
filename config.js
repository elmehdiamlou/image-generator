import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);

export const projectPath = path.dirname(__filename);

const inputPath = path.join(projectPath, "/input");

let types = [];

const getParts = (path) => {
  return fs.readdirSync(path).map((part, index) => {
    return {
      id: index + 1,
      name: part,
    };
  });
};

const options = (type) => {
  return {
    position: { x: 0, y: 0 },
    size: { width: 1000, height: 1000 },
    path: `${inputPath}/${type}/`,
    parts: getParts(`${inputPath}/${type}/`),
  };
};

const getTypes = () => {
  return fs.readdirSync(inputPath).forEach((folder) => {
    types.push(folder);
  });
};
getTypes();

export const inputParts = () => {
  return types.map((type) => options(type));
};
