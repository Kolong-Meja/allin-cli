import fs from "fs";

export type _ProjectResourcePath = {
  sourcePath: string;
  desPath: string;
};

export type _DockerResources = {
  templates: fs.Dirent<string>[];
  dockerfiles: fs.Dirent<string>[];
};
