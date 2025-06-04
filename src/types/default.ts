import fs from "fs";

export type __ProjectResourcePathProps = {
  sourcePath: string;
  desPath: string;
};

export type __DockerResourcesProps = {
  templates: fs.Dirent<string>[];
  dockerfiles: fs.Dirent<string>[];
};

export type __FrameworkProps = {
  name: string;
  templateName: string;
  origin: string;
};

export type __FullStackFrameworkProps = {
  name: string;
  templateName: string;
  detail: {
    backend: {
      name: string;
      templateName: string;
      origin: string;
    };
    frontend: {
      name: string;
      templateName: string;
      origin: string;
    };
  };
};

export type __DefaultFrameworkProps = {
  uid: string;
  frameworks: __FrameworkProps[];
  rootPath: string;
  type: string;
};

export type __DefaultFullStackFrameworkProps = {
  uid: string;
  frameworks: __FullStackFrameworkProps[];
  rootPath: string;
  type: string;
};
