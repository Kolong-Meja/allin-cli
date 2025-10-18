import type { CachedEntry } from '@/interfaces/global.js';
import type { OptionValues } from 'commander';
import type { Ora } from 'ora';
import fse from 'fs-extra';

export type Mixed =
  | string
  | number
  | bigint
  | object
  | boolean
  | symbol
  | undefined
  | null
  | any
  | unknown;

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
  actualName: string;
  templateName: string;
  language: string;
  path: string;
};

export type __DefaultFrameworkProps = {
  frameworks: __FrameworkProps[];
};

export type __LicenseProps = {
  name: string;
  actualName: string;
  templateName: string;
  path: string;
};

export type __DefaultLicenseProps = {
  licenses: __LicenseProps[];
};

export type __PackagesProps = {
  name: string;
  originName: string;
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

export type __GenerateProjectParams = __BaseParams & {
  projectNameArg: Mixed;
  optionValues: OptionValues;
  templatesFiles: fse.Dirent<string>[];
  projectName: string;
  projectType: string;
  projectDir: string;
  isUsingCacheProject: boolean;
  cachedEntries: CachedEntry[];
};

export type __SetupProjectParams = __BaseParams & {
  projectName: string;
  projectType: string;
  selectedFramework: string;
  sourcePath: string;
  desPath: string;
  optionValues: OptionValues;
};

export type __SetupDockerParams = __BaseParams & {
  isAddingDocker: boolean;
  isAddingBake: boolean;
  selectedPackageManager: string;
  desPath: string;
};

export type __SetupInstallationParams = __BaseParams & {
  selectedDependencies: string[];
  selectedPackageManager: string;
  projectName: string;
  desPath: string;
};

export type __SetupOthersParams = __BaseParams & {
  optionValues: OptionValues;
  projectType: string;
  projectName: string;
  selectedFramework: string;
  desPath: string;
};

export type __UseTypescriptParams = __BaseParams & {
  projectType: string;
  projectName: string;
  selectedframework: string;
  selectedPackageManager: string;
  desPath: string;
};

export type __InstallDependenciesParams = __BaseParams & {
  selectedDependencies: string[];
  selectedPackageManager: string;
  desPath: string;
};

export type __UpdateDependenciesParams = __BaseParams & {
  selectedPackageManager: string;
  projectName: string;
  desPath: string;
};

export type __UpdatePackageMetadataParams = __BaseParams & {
  optionValues: OptionValues;
  projectName: string;
  desPath: string;
};

export type __InstallTypescriptParams = __BaseParams & {
  projectType: string;
  selectedFramework: string;
  selectedPackageManager: string;
  desPath: string;
};

export type __AddLicenseParams = __BaseParams & {
  optionValues: OptionValues;
  projectName: string;
  desPath: string;
};

export type __AddReadmeParams = __BaseParams & {
  optionValues: OptionValues;
  projectName: string;
  projectType: string;
  desPath: string;
};

export type __AddEnvParams = __BaseParams & {
  optionValues: OptionValues;
  projectName: string;
  projectType: string;
  desPath: string;
};

export type __SwitchPackageManagerParams = __BaseParams & {
  selectedPackageManager: string;
  projectName: string;
  desPath: string;
};

export type __AddDockerParams = __BaseParams & {
  desPath: string;
  selectedPackageManager: string;
};

export type __AddDockerBakeParams = __AddDockerParams;

export type __FrameworkCategory = 'frontend' | 'backend';

export type __CreateProjectParams = {
  projectName: Mixed;
  projectDir: Mixed;
  projectType: Mixed;
  options: OptionValues;
};
