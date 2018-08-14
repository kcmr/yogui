'use strict';

const Generator = require('../lib/generator');

describe('Generator', () => {
  describe('init()', () => {
    it('throws an error if the config file is not found', async () => {
      const instance = new Generator({
        configFileName: 'config'
      });

      await expect(instance.init()).rejects.toThrow('No config found in a config file');
    });
  });
});
