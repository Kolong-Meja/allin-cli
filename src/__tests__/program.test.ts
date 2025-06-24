/**
 * __tests__/program.test.ts
 */
import { jest } from '@jest/globals';

const mockProgram = {
  name: jest.fn().mockReturnThis(),
  description: jest.fn().mockReturnThis(),
  option: jest.fn().mockReturnThis(),
  summary: jest.fn().mockReturnThis(),
  command: jest.fn().mockReturnThis(),
  helpOption: jest.fn().mockReturnThis(),
  helpCommand: jest.fn().mockReturnThis(),
  action: jest.fn().mockReturnThis(),
  parse: jest.fn(),
};

const exitSpy = jest
  .spyOn(process, 'exit')
  .mockImplementation((() => {}) as any);

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
    expect(mockProgram.description).toHaveBeenCalled();
  });

  it('registers the version option and invokes _printAscii + exit', async () => {
    await generateProgram();

    const versionCall = mockProgram.option.mock.calls.find(
      ([flag]) => flag === '-v, --version',
    ) as unknown[];

    expect(versionCall).toBeDefined();

    const versionFlag: string = versionCall[0] as string;
    const versionDesc: string = versionCall[1] as string;
    const versionCallback: Function = versionCall[2] as Function;

    expect(versionFlag).not.toBeNull();
    expect(versionFlag).toEqual('-v, --version');

    expect(versionDesc).not.toBeNull();
    expect(versionDesc).toContain('Allin CLI');

    expect(versionCallback).toBeInstanceOf(Function);

    await versionCallback();
    expect(mockAppAscii).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  it('sets up the create subcommand with correct options and action', async () => {
    await generateProgram();

    expect(mockProgram.command).toHaveBeenCalledWith('create');
    expect(mockProgram.option).toHaveBeenCalledWith(
      '-d, --dir <dir>',
      "Path destination directory to save the project template that you've created.",
      process.cwd(),
    );
    expect(mockProgram.option).toHaveBeenCalledWith(
      '-g, --git',
      'Initialize git repo automatically (default: false).',
      false,
    );
    expect(mockProgram.option).toHaveBeenCalledWith(
      '-l, --license',
      'Add a LICENSE file (default: false).',
      false,
    );
    expect(mockProgram.option).toHaveBeenCalledWith(
      '--ts',
      'Initialize project with TypeScript configuration (default: false).',
      false,
    );
    expect(mockProgram.helpOption).toHaveBeenCalledWith(
      '-h, --help',
      expect.stringContaining('Action to get more information'),
    );
    expect(mockProgram.summary).toHaveBeenCalledWith(
      'Action to create new project.',
    );
    expect(mockProgram.description).toHaveBeenCalledWith(
      'Create new project on your own.',
    );

    const actionCall = mockProgram.action.mock.calls.find(
      ([fn]) => typeof fn === 'function',
    ) as unknown[];
    expect(actionCall).toBeDefined();

    const actionFn: Function = actionCall[0] as Function;

    await actionFn({ foo: 'bar' });
    expect(mockCreateCommand).toHaveBeenCalledWith({ foo: 'bar' });
  });

  it('configures global helpOption, helpCommand and invokes parse()', async () => {
    await generateProgram();
    expect(mockProgram.helpOption).toHaveBeenCalledWith(
      '-h, --help',
      expect.stringContaining('Action to get more information'),
    );
    expect(mockProgram.helpCommand).toHaveBeenCalledWith(
      'help [command]',
      expect.stringContaining('commands'),
    );
    expect(mockProgram.parse).toHaveBeenCalled();
  });
});
