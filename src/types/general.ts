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

type __BaseParams = {
  spinner: Ora;
};

export type __BackendProjectTypeParams = __BaseParams & {
  optionValues: OptionValues;
  templatesFiles: fs.Dirent<string>[];
  projectName: string;
  projectType: string;
};

export type __FrontendProjectTypeParams = __BaseParams & {
  optionValues: OptionValues;
  templatesFiles: fs.Dirent<string>[];
  projectName: string;
  projectType: string;
};

export type __SetupUserProjectParams = __BaseParams & {
  projectName: string;
  selectedFramework: string;
  sourcePath: string;
  desPath: string;
};

export type __SetupDockerParams = __BaseParams & {
  isAddingDocker: boolean;
  isAddingBake: boolean;
  selectedPackageManager: string;
  desPath: string;
};

export type __RunSystemUpdateParams = __BaseParams & {
  selectedDependencies: string[];
  selectedPackageManager: string;
  projectName: string;
  desPath: string;
};

export type __RunOtherOptionsParams = __BaseParams & {
  optionValues: OptionValues;
  projectType: string;
  projectName: string;
  selectedFramework: string;
  desPath: string;
};

export type __RunAddTsParams = __BaseParams & {
  projectType: string;
  projectName: string;
  selectedframework: string;
  selectedPackageManager: string;
  desPath: string;
};

export type __RunInstallParams = __BaseParams & {
  selectedDependencies: string[];
  selectedPackageManager: string;
  desPath: string;
};

export type __RunUpdateParams = __BaseParams & {
  selectedPackageManager: string;
  projectName: string;
  desPath: string;
};

export type __RunInstallTsParams = __BaseParams & {
  projectType: string;
  selectedFramework: string;
  selectedPackageManager: string;
  desPath: string;
};

export type __RunSwitchPackageManagerParams = __BaseParams & {
  selectedPackageManager: string;
  projectName: string;
  desPath: string;
};

export type __RunAddDockerParams = __BaseParams & {
  desPath: string;
  selectedPackageManager: string;
};

export type __RunAddBakeParams = __BaseParams & {
  desPath: string;
  selectedPackageManager: string;
};
