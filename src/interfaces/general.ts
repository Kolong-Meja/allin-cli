import type {
  __PackagesProps,
  __SetupDockerParams,
  __SetupInstallationParams,
  __SetupOthersParams,
  __SetupProjectParams,
} from '@/types/general.js';

export interface FrameworkConfig {
  name: string;
  actualName: string;
  packages: __PackagesProps[];
  promptKey: string;
  templateSource: string;
  templateDest: string;
}

export interface MicroGeneratorBuilder {
  setupProject(params: __SetupProjectParams): Promise<void>;
  setupDocker(params: __SetupDockerParams): Promise<void>;
  setupOthers(params: __SetupOthersParams): Promise<void>;
  setupInstallation(params: __SetupInstallationParams): Promise<void>;
}
