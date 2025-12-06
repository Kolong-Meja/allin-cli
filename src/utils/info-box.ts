import type { Mixed } from '@/types/global.js';
import boxen from 'boxen';

export function errorBox(error: Mixed) {
  console.error(
    boxen(error.message, {
      title: error.name,
      titleAlignment: 'center',
      padding: 1,
      margin: 1,
      borderColor: 'red',
    }),
  );
}

export function infoBox(
  title: string,
  message: string,
) {
  console.log(
    boxen(message, {
      title: title,
      titleAlignment: 'center',
      padding: 1,
      margin: 1,
      borderColor: 'blue',
    }),
  );
}

export function warnBox(
  title: string,
  message: string,
) {
  console.warn(
    boxen(message, {
      title: title,
      titleAlignment: 'center',
      padding: 1,
      margin: 1,
      borderColor: 'yellow',
    }),
  );
}
