export type __PrintAsciiProps = {
  name: string;
  desc: string;
};

export type __QuestionPrompsProps = {
  projectName: string;
  projectType: string;
  chooseBackendFramework: string;
  chooseFrontendFramework: string;
  chooseFullStackFramework: string;
  addDocker: boolean;
  addDockerBake: boolean;
  dirPath: string;
};

export type __ProjectResourcePathProps = {
  sourcePath: string;
  desPath: string;
};

export type __FrameworkProps = {
  name: string;
  templateName: string;
  origin: string;
};

export type __DefaultFrameworkProps = {
  uid: string;
  frameworks: __FrameworkProps[];
  rootPath: string;
  type: string;
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

export type __DefaultFullStackFrameworkProps = {
  uid: string;
  frameworks: __FullStackFrameworkProps[];
  rootPath: string;
  type: string;
};
