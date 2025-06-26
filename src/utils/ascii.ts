import figlet from 'figlet';
import gradient from 'gradient-string';
import { getBorderCharacters, table } from 'table';
import chalk from 'chalk';
import { __config } from '@/config.js';

export const __gradientColor = gradient(['#3CB371', '#81E7AF', '#FFD63A']);

export const __generateTextAscii = (): void => {
  const __appAscii = `${__gradientColor(figlet.textSync(__config.appName, '3D-ASCII'))}`;
  const __appDesc = `${chalk.bold(chalk.italic(__config.appDesc))}`;
  const __header = `${__appAscii}\n${__appDesc}\n`;
  const __appVersion = `${__gradientColor('Version')}: v${__config.appVersion}`;
  const __creatorName = `${__gradientColor('Creator')}: ${__config.creatorName}`;
  const __appLicense = `${__gradientColor('License')}: ${__config.appLicense}`;
  const __githubLink = `${__gradientColor('Github Link')}: ${__config.githubLink}`;
  const __npmLink = `${__gradientColor('NPM Link')}: ${__config.npmLink}`;

  // METADATA.
  const __data = [
    [__appVersion],
    [__creatorName],
    [__appLicense],
    [__githubLink],
    [__npmLink],
  ];

  const __nodeVersion = `${__gradientColor('Node Version')}: ${__config.nodeJsVersion}`;
  const __currentOsPlatform = `${__gradientColor('Operating System')}: ${__config.osPlatform}`;

  // ENVIRONMENT.
  __data.push([__nodeVersion], [__currentOsPlatform]);

  console.log(
    table(__data, {
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
        content: __header,
      },
    }),
  );
};
