#!/usr/bin/env node
import { generateProgram } from '@/core/program.js';
import {
  __checkForUpdate,
  __getCurrentPackageInfo,
  __printUpdateNotice,
} from '@/utils/notifier.js';

function main(): void {
  const currentPackage = __getCurrentPackageInfo();
  __checkForUpdate(currentPackage)
    .then((result) => {
      if (result?.updateAvailable) {
        process.once('exit', () => __printUpdateNotice(currentPackage, result));
      }
    })
    .catch(() => {
      // Update check nggak boleh pernah mempengaruhi jalannya CLI.
    });
  generateProgram();
}

main();
