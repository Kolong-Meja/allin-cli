/**
 * __tests__/runner.test.ts
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
  __userrealname: 'Faisal',
  _appName: 'allin',
  _appDesc: 'desc',
  _appCreator: 'faisal',
  _appVersion: '1.0.0',
  _appLicense: 'MIT',
  _appGithubLink: 'https://github.com/…',
  __nodeJsVersion: 'v22.16.0',
  _os: 'linux x64',
  _basePath: '/mocked/base',
  _program: mockProgram,
}));

const mockPrintAscii = jest.fn();
jest.unstable_mockModule('../../src/utils/ascii.js', () => ({
  _allinGradient: jest.fn((str: string) => str),
  _printAscii: mockPrintAscii,
}));

const mockNewCreateCommand = jest.fn();
jest.unstable_mockModule('../../src/core/commands/create.js', () => ({
  _newCreateCommand: mockNewCreateCommand,
}));

const { runner } = await import('../../src/core/runner.js');

describe('runner()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register name and description on the program', async () => {
    await runner();

    expect(mockProgram.name).toHaveBeenCalledWith('allin');
    expect(mockProgram.description).toHaveBeenCalled();
  });

  it('registers the version option and invokes _printAscii + exit', async () => {
    await runner();

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
    expect(mockPrintAscii).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  it('sets up the create subcommand with correct options and action', async () => {
    await runner();

    expect(mockProgram.command).toHaveBeenCalledWith('create');
    expect(mockProgram.option).toHaveBeenCalledWith(
      '-d, --dir <dir>',
      "Path destination directory to save the project template that you've created.",
      process.cwd(),
    );
    expect(mockProgram.option).toHaveBeenCalledWith(
      '-g, --git',
      'Initialize git repo automatically.',
      false,
    );
    expect(mockProgram.option).toHaveBeenCalledWith(
      '-l, --license',
      'Add a LICENSE file.',
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
    expect(mockNewCreateCommand).toHaveBeenCalledWith({ foo: 'bar' });
  });

  it('configures global helpOption, helpCommand and invokes parse()', async () => {
    await runner();
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
