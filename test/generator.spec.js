'use strict';

const Generator = require('../lib/generator');
const inquirer = require('inquirer');

jest.mock('inquirer');

describe('Generator', () => {
  describe('calling init() without config file', () => {
    it('throws an error', async () => {
      const instance = new Generator({
        configFileName: 'config'
      });

      await expect(instance.init()).rejects.toThrow('No config found in a config file');
    });
  });

  describe('calling init() with config file', () => {
    it('skips questions for generator type if there is only one generator in config', () => {
      const instance = new Generator();

      const inquirerMockResponse = {
        scope: 'any',
        name: 'any',
        dest: 'any'
      };

      inquirer.prompt.mockResolvedValue(inquirerMockResponse);

      return instance.init().then(() => {
        expect(inquirer.prompt.mock.calls.length).toBe(1);
      });
    });
  });
});
