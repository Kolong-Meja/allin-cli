import {
  CACHE_BASE_PATH,
  UPDATE_CHECK_INTERVAL_MS,
  UPDATE_CHECK_TIMEOUT_MS,
  __packageJsonFile,
} from '@/config.js';
import type { PackageInfo, UpdateCheckResult } from '@/interfaces/global.js';
import type { Mixed } from '@/types/global.js';
import { infoBox } from '@/utils/info-box.js';
import chalk from 'chalk';
import fse from 'fs-extra';
import path from 'path';
import semver from 'semver';

const UPDATE_CACHE_FILE = path.join(CACHE_BASE_PATH, 'update-check.json');

export function __getCurrentPackageInfo(): PackageInfo {
  return {
    name: __packageJsonFile.name,
    version: __packageJsonFile.version,
  };
}

async function __readCache(): Promise<UpdateCheckResult | null> {
  try {
    const exists = await fse.pathExists(UPDATE_CACHE_FILE);
    if (!exists) return null;

    return await fse.readJSON(UPDATE_CACHE_FILE);
  } catch (error: Mixed) {
    return null;
  }
}

async function __writeCache(result: UpdateCheckResult): Promise<void> {
  try {
    await fse.ensureDir(CACHE_BASE_PATH);
    await fse.writeJSON(UPDATE_CACHE_FILE, result, { spaces: 2 });
  } catch (error: Mixed) {
    // Best-effort saja — gagal nulis cache nggak boleh bikin apa pun rusak.
  }
}

async function __fetchLatestVersion(
  packageName: string,
): Promise<string | null> {
  try {
    const response = await fetch(
      `https://registry.npmjs.org/${packageName}/latest`,
      { signal: AbortSignal.timeout(UPDATE_CHECK_TIMEOUT_MS) },
    );

    if (!response.ok) return null;

    const data = (await response.json()) as { version?: string };
    return data.version ?? null;
  } catch (error: Mixed) {
    return null;
  }
}

export async function __checkForUpdate(
  current: PackageInfo,
): Promise<UpdateCheckResult | null> {
  const cached = await __readCache();
  const isCacheFresh =
    cached !== null && Date.now() - cached.checkedAt < UPDATE_CHECK_INTERVAL_MS;

  if (isCacheFresh) {
    return cached;
  }

  const latest = await __fetchLatestVersion(current.name);

  if (!latest) {
    return cached;
  }

  const result: UpdateCheckResult = {
    updateAvailable: semver.gt(latest, current.version),
    current: current.version,
    latest,
    checkedAt: Date.now(),
  };

  await __writeCache(result);

  return result;
}

export function __printUpdateNotice(
  packageInfo: PackageInfo,
  result: UpdateCheckResult,
): void {
  if (!result.updateAvailable || !result.latest) return;

  infoBox(
    'Update Available',
    `A new version of ${chalk.bold(packageInfo.name)} is available: ${chalk.dim(
      result.current,
    )} → ${chalk.green(result.latest)}\n\nRun ${chalk.bold(
      `npm install -g ${packageInfo.name}@latest`,
    )} to update.`,
  );
}
