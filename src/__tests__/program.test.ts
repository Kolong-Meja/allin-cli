/**
 * __tests__/program.test.ts
 */
import type { Mixed } from '@/types/general.js';
import { jest } from '@jest/globals';

const mockCommand = {
  argument: jest.fn().mockReturnThis(),
  option: jest.fn().mockReturnThis(),
  helpOption: jest.fn().mockReturnThis(),
  summary: jest.fn().mockReturnThis(),
  description: jest.fn().mockReturnThis(),
  action: jest.fn().mockReturnThis(),
};

const mockProgram = {
  name: jest.fn().mockReturnThis(),
  description: jest.fn().mockReturnThis(),
  option: jest.fn().mockReturnThis(),
  command: jest.fn().mockReturnValue(mockCommand),
  helpOption: jest.fn().mockReturnThis(),
  helpCommand: jest.fn().mockReturnThis(),
  summary: jest.fn().mockReturnThis(),
  action: jest.fn().mockReturnThis(),
  parse: jest.fn(),
};

const exitSpy = jest
  .spyOn(process, 'exit')
  .mockImplementation((() => {}) as Mixed);

jest.unstable_mockModule('../../src/config.js', () => ({
  program: mockProgram,
  __config: {
    appName: 'allin',
    appDesc: 'This is a test description',
    creatorName: 'Test Author',
    appVersion: '9.9.9',
    appLicense: 'MIT',
    githubLnk: 'https://github.com/example/allin-cli',
    npmLink: 'https://www.npmjs.com/package/@example/allin-cli',
    nodeJSVersion: '22.16.0',
    osPlatform: 'Linux Ubuntu',
  },
}));

const mockAppAscii = jest.fn();
jest.unstable_mockModule('../../src/utils/ascii.js', () => ({
  __gradientColor: jest.fn((str: string) => str),
  __generateTextAscii: mockAppAscii,
}));

const mockCreateCommand = jest.fn();
jest.unstable_mockModule('../../src/core/commands/create.js', () => ({
  CreateCommand: {
    instance: {
      create: mockCreateCommand,
    },
  },
}));

const { generateProgram } = await import('../../src/core/program.js');

describe('generateProgram()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register name and description on the program', async () => {
    await generateProgram();

    expect(mockProgram.name).toHaveBeenCalledWith('allin');
    expect(mockProgram.description).toHaveBeenCalledWith(
      'This is a test description',
    );
  });

  it('registers the version option and invokes _printAscii + exit', async () => {
    await generateProgram();

    const versionCall = mockProgram.option.mock.calls.find(
      ([flag]) => flag === '-v, --version',
    );
    expect(versionCall).toBeDefined();

    const [, versionDesc, versionCb] = versionCall!;
    expect(versionDesc).toMatch(
      /Action to get information about the current version of Allin CLI tool/,
    );
    expect(typeof versionCb).toBe('function');

    (versionCb as () => void)();
    expect(mockAppAscii).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  it('sets up the create subcommand with correct options, help, summary, description and action', async () => {
    await generateProgram();

    expect(mockProgram.command).toHaveBeenCalledWith('create');

    expect(mockCommand.option).toHaveBeenCalledWith(
      '-n, --name <name>',
      expect.stringContaining(
        'Specify the project name to use for the initial setup.',
      ),
    );

    expect(mockCommand.option).toHaveBeenCalledWith(
      '-d, --dir <dir>',
      expect.stringContaining(
        'Destination folder where the generated project will be created. Defaults to the current working directory.',
      ),
    );

    expect(mockCommand.option).toHaveBeenCalledWith(
      '-f, --force',
      expect.stringContaining(
        'Overwrite the target directory if it already exists.',
      ),
      false,
    );

    expect(mockCommand.option).toHaveBeenCalledWith(
      '--au, --author <author>',
      expect.stringContaining(
        'Set the author name to include in the project metadata.',
      ),
    );

    expect(mockCommand.option).toHaveBeenCalledWith(
      '--desc, --description <desc>',
      expect.stringContaining('Provide a short description for the project.'),
    );

    expect(mockCommand.option).toHaveBeenCalledWith(
      '--ver, --version <version>',
      expect.stringContaining('Set the version of the project.'),
    );

    expect(mockCommand.option).toHaveBeenCalledWith(
      '--template <template>',
      'Select the template to use for the project.',
    );

    const pmCall = mockCommand.option.mock.calls.find(
      ([flag]) => flag === '--pm, --package-manager <pm>',
    )!;
    expect(pmCall[1]).toBe(
      'Choose the package manager for dependency installation.',
    );
    expect(pmCall[2]).toBe('npm');

    expect(mockCommand.option).toHaveBeenCalledWith(
      '--li, --license <license>',
      'Add a LICENSE file to the project.',
    );

    expect(mockCommand.option).toHaveBeenCalledWith(
      '--ts, --typescript',
      'Initialize the project with TypeScript configuration and typings.',
      false,
    );

    expect(mockCommand.option).toHaveBeenCalledWith(
      '--dk, --docker',
      'Include Docker configuration files for containerized setup.',
      false,
    );

    expect(mockCommand.option).toHaveBeenCalledWith(
      '--env',
      'Generate .env file for project configuration.',
      false,
    );

    expect(mockCommand.option).toHaveBeenCalledWith(
      '--git',
      'Automatically initialize a Git repository and make the first commit.',
      false,
    );

    const createHelpCall = mockCommand.helpOption.mock.calls.find(
      ([flag, text]) => flag === '-h, --help' && /create/.test(text as string),
    );
    expect(createHelpCall).toBeDefined();

    expect(mockCommand.summary).toHaveBeenCalledWith(
      'Action to create new project.',
    );
    expect(mockCommand.description).toHaveBeenCalledWith('Create new project.');

    const actionCall = mockCommand.action.mock.calls.find(
      (call) => typeof call[0] === 'function',
    );
    expect(actionCall).toBeDefined();

    const createCb = actionCall![0] as (
      name: string,
      dir: string,
      type: string,
      opts: Mixed,
    ) => Promise<void>;

    await createCb('myapp', './dir', 'backend', { foo: 'bar' });

    expect(mockCreateCommand).toHaveBeenCalledWith(
      'myapp',
      './dir',
      'backend',
      { foo: 'bar' },
    );
  });

  it('configures global helpOption, helpCommand and invokes parse()', async () => {
    await generateProgram();

    const globalHelpCall = mockProgram.helpOption.mock.calls.find(
      ([flag, text]) =>
        flag === '-h, --help' &&
        /Action to get more information about Allin CLI/.test(text as string),
    );
    expect(globalHelpCall).toBeDefined();

    expect(mockProgram.helpCommand).toHaveBeenCalledWith(
      'help [command]',
      expect.stringContaining('commands'),
    );

    expect(mockProgram.parse).toHaveBeenCalled();
  });
});
