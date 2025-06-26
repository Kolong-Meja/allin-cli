export type Mixed =
  | string
  | number
  | bigint
  | object
  | boolean
  | symbol
  | undefined
  | null
  | any;

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
};

export type __ProjectResourcePathProps = {
  sourcePath: string;
  desPath: string;
};

export type __FrameworkProps = {
  name: string;
  templateName: string;
  language: string;
  path: string;
};

export type __DefaultFrameworkProps = {
  frameworks: __FrameworkProps[];
};

export type __LicenseProps = {
  name: string;
  templateName: string;
  path: string;
};

export type __DefaultLicenseProps = {
  licenses: __LicenseProps[];
};

export type __PackagesProps = {
  name: string;
  originName: string;
  summary: string;
};

export type __BackendPackagesProps = {
  packages: __PackagesProps[];
};

export type __FrontendPackagesProps = {
  packages: __PackagesProps[];
};
