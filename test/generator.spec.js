'use strict';

const Generator = require('../lib/generator');

require('chai').expect();

describe('Generator', () => {
  describe('init()', () => {
    it('throws an error when the config file is not found', () => {
      const instance = new Generator({
        configFileName: 'config'
      });

      (() => {instance.init()})
        .should.Throw('No config found in a config file');
    });
  });
});
