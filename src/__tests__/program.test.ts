/**
 * __tests__/program.test.ts
 */
import type { Mixed } from '@/types/general.js';
import { jest } from '@jest/globals';

const mockProgram = {
  name: jest.fn().mockReturnThis(),
  description: jest.fn().mockReturnThis(),
  option: jest.fn().mockReturnThis(),
  command: jest.fn().mockReturnThis(),
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

    expect(mockProgram.option).toHaveBeenCalledWith(
      '-d, --dir <dir>',
      expect.stringContaining('Path destination directory'),
      process.cwd(),
    );
    expect(mockProgram.option).toHaveBeenCalledWith(
      '-g, --git',
      'Initialize git repo automatically.',
      false,
    );
    expect(mockProgram.option).toHaveBeenCalledWith(
      '-l, --li',
      'Add a LICENSE file.',
      false,
    );
    expect(mockProgram.option).toHaveBeenCalledWith(
      '-t, --ts',
      'Initialize project with TypeScript configuration.',
      false,
    );

    const pmCall = mockProgram.option.mock.calls.find(
      ([flag]) => flag === '-m, --pm <pm>',
    )!;
    expect(pmCall[1]).toBe('Choose package manager (npm | pnpm).');
    expect(pmCall[2]).toBe('npm');

    const createHelpCall = mockProgram.helpOption.mock.calls.find(
      ([flag, text]) => flag === '-h, --help' && /create/.test(text as string),
    );
    expect(createHelpCall).toBeDefined();

    expect(mockProgram.summary).toHaveBeenCalledWith(
      'Action to create new project.',
    );
    expect(mockProgram.description).toHaveBeenCalledWith(
      'Create new project on your own.',
    );

    const actionCall = mockProgram.action.mock.calls.find(
      (call) => typeof call[0] === 'function',
    );
    expect(actionCall).toBeDefined();

    const createCb = actionCall![0] as (opts: Mixed) => Promise<void>;
    await createCb({ foo: 'bar' });
    expect(mockCreateCommand).toHaveBeenCalledWith({ foo: 'bar' });
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
