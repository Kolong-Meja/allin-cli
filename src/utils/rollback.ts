import fse from 'fs-extra';

let __activeBackupPath: string | null = null;
let __activeOriginalPath: string | null = null;

export async function __backupIfExists(targetPath: string): Promise<boolean> {
  const exists = await fse.pathExists(targetPath);

  if (!exists) {
    return false;
  }

  const backupPath = `${targetPath}.allin-backup-${Date.now()}`;
  await fse.move(targetPath, backupPath, { overwrite: true });

  __activeBackupPath = backupPath;
  __activeOriginalPath = targetPath;

  return true;
}

export async function __commitRollback(): Promise<void> {
  if (!__activeBackupPath) {
    return;
  }

  await fse.remove(__activeBackupPath).catch(() => {
    // Best-effort: a lingering backup folder is not worth surfacing
    // as a fatal error once the actual project was created successfully.
  });

  __activeBackupPath = null;
  __activeOriginalPath = null;
}

export async function __rollback(freshPath?: string): Promise<boolean> {
  if (freshPath) {
    await fse.remove(freshPath).catch(() => {});
  }

  const hadBackup =
    __activeBackupPath !== null && __activeOriginalPath !== null;

  if (hadBackup) {
    await fse.move(
      __activeBackupPath as string,
      __activeOriginalPath as string,
      { overwrite: true },
    );
  }

  __activeBackupPath = null;
  __activeOriginalPath = null;

  return hadBackup;
}
