import type {
  __FrameworkCategory,
  __PackagesProps,
  __SetupDockerParams,
  __SetupInstallationParams,
  __SetupOthersParams,
  __SetupProjectParams,
} from '@/types/general.js';

export interface FrameworkMeta {
  name: string;
  actualName: string;
  packages: __PackagesProps[];
  promptKey: string;
  category: __FrameworkCategory;
}

export interface FrameworkConfig extends FrameworkMeta {
  templateSource: string;
  templateDest: string;
}

export interface MicroGeneratorBuilder {
  setupProject(params: __SetupProjectParams): Promise<() => Promise<void>>;
  setupDocker(params: __SetupDockerParams): Promise<void>;
  setupOthers(params: __SetupOthersParams): Promise<void>;
  setupInstallation(params: __SetupInstallationParams): Promise<void>;
}
