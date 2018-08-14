'use strict';

const Generator = require('../lib/generator');
const inquirer = require('inquirer');
const fs = require('fs-extra');

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
    beforeEach(() => {
      process.chdir('test/fixtures');
    });

    it('skips questions for generator type if there is only one generator in config', () => {
      const instance = new Generator({
        configFileName: 'single-generator.json'
      });

      const inquirerMockResponse = {
        name: 'any',
        dest: 'output'
      };

      inquirer.prompt.mockResolvedValue(inquirerMockResponse);

      return instance.init()
        .then(() => {
          expect(inquirer.prompt.mock.calls.length).toBe(1);
        })
        .then(() => fs.remove('output'));
    });
  });
});
