'use strict';

const Generator = require('../lib/generator');
const inquirer = require('inquirer');
const {scaffold} = require('nunjucks-scaffold-generator');

jest.mock('inquirer');
jest.mock('nunjucks-scaffold-generator');

const answersForGeneratorMock = {
  name: 'any',
  dest: 'output'
};

describe('Generator', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  beforeAll(() => {
    process.chdir('test/fixtures');
  });

  describe('calling init() without config file', () => {
    it('uses .gnrtrrc file as config', () => {
      const instance = new Generator();

      inquirer.prompt.mockResolvedValue(answersForGeneratorMock);
      
      return instance.init()
        .then(() => {
          expect(instance.config.configFileName).toEqual('.gnrtrrc');
        });
    });
  });

  describe('calling init() with config file', () => {
    it('throws an error if the config file is not found', async () => {
      const instance = new Generator({
        configFileName: 'config'
      });

      await expect(instance.init()).rejects.toThrow('No config found in a config file');
    });

    it('skips questions for generator type if there is only one generator in config', () => {
      const instance = new Generator({
        configFileName: 'single-generator.json'
      });

      inquirer.prompt.mockResolvedValue(answersForGeneratorMock);

      return instance.init()
        .then(() => {
          expect(inquirer.prompt).not.toBeCalledWith(instance._promptForTypes);
          expect(inquirer.prompt.mock.calls.length).toBe(1);
        });
    });

    it('prompts for generator type if there are multiple generators in config', () => {
      const instance = new Generator({
        configFileName: 'multiple-generators.json'
      });

      inquirer.prompt
        .mockResolvedValueOnce({type: 'scaffold-1'})
        .mockResolvedValueOnce(answersForGeneratorMock);

      return instance.init()
        .then(() => {
          expect(inquirer.prompt).toBeCalledWith(instance._promptForTypes);
        })
        .then(() => {
          expect(inquirer.prompt.mock.calls.length).toBe(2);
        });
    });

    it('the scaffold file name is not replaced if not provided in config', () => {
      const instance = new Generator({
        configFileName: 'multiple-generators.json'
      });

      inquirer.prompt
        .mockResolvedValueOnce({type: 'scaffold-2'})
        .mockResolvedValueOnce(answersForGeneratorMock);

      return instance.init()
        .then(() => {
          expect(scaffold.mock.calls[0][0].replacement).toBeUndefined();
        });
    });
  });
});
