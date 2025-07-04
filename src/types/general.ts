import type { OptionValues } from 'commander';
import type { Ora } from 'ora';
import fs from 'fs';

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

export type __BackendProjectTypeParams = {
  spinner: Ora;
  optionValues: OptionValues;
  templatesFiles: fs.Dirent<string>[];
  projectName: string;
  projectType: string;
};

export type __FrontendProjectTypeParams = {
  spinner: Ora;
  optionValues: OptionValues;
  templatesFiles: fs.Dirent<string>[];
  projectName: string;
  projectType: string;
};

export type __SetupUserProjectParams = {
  spinner: Ora;
  projectName: string;
  selectedFramework: string;
  sourcePath: string;
  desPath: string;
};

export type __SetupDockerParams = {
  spinner: Ora;
  isAddingDocker: boolean;
  isAddingBake: boolean;
  desPath: string;
};

export type __RunSystemUpdateParams = {
  spinner: Ora;
  selectedDependencies: string[];
  projectName: string;
  desPath: string;
};

export type __RunOtherOptionsParams = {
  spinner: Ora;
  optionValues: OptionValues;
  projectType: string;
  projectName: string;
  selectedFramework: string;
  desPath: string;
};

export type __RunAddTsParams = {
  spinner: Ora;
  projectType: string;
  projectName: string;
  selectedframework: string;
  desPath: string;
};

export type __RunInstallTsParams = {
  spinner: Ora;
  projectType: string;
  selectedFramework: string;
  desPath: string;
};

export type __RunSwitchPackageManagerParams = {
  spinner: Ora;
  selectedPackageManager: string;
  projectName: string;
  desPath: string;
};
