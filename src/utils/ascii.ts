import { __config } from '@/config.js';
import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';
import { getBorderCharacters, table } from 'table';

export const __gradientColor = gradient(['#3CB371', '#81E7AF', '#FFD63A']);

export const __generateTextAscii = (): void => {
  const ascii = `${__gradientColor(figlet.textSync(__config.appName, { font: '3D-ASCII' }))}`;
  const desc = `${chalk.bold(chalk.italic(__config.appDesc))}`;
  const header = `${ascii}\n${desc}\n`;
  const version = `${__gradientColor('Version')}: v${__config.appVersion}`;
  const creatorName = `${__gradientColor('Creator')}: ${__config.creatorName}`;
  const license = `${__gradientColor('License')}: ${__config.appLicense}`;
  const githubLink = `${__gradientColor('Github Link')}: ${__config.githubLink}`;
  const npmLink = `${__gradientColor('NPM Link')}: ${__config.npmLink}`;
  const nodeVersion = `${__gradientColor('Node Version')}: ${__config.nodeJsVersion}`;
  const currOsPlatform = `${__gradientColor('Operating System')}: ${__config.osPlatform}`;

  // METADATA.
  const __METADATA = [
    [version],
    [creatorName],
    [license],
    [githubLink],
    [npmLink],
    [nodeVersion],
    [currOsPlatform],
  ] as const;

  console.log(
    table(__METADATA, {
      border: getBorderCharacters('norc'),
      columnDefault: {
        width: 80,
      },
      singleLine: true,
      columns: [
        {
          alignment: 'left',
        },
      ],
      header: {
        alignment: 'center',
        content: header,
      },
    }),
  );
};
