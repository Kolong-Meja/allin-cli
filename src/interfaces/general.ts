import type { __PackagesProps } from '@/types/general.js';

export interface FrameworkConfig {
  name: string;
  packages: __PackagesProps[];
  promptKey: string;
  templateSource: string;
  templateDest: string;
}