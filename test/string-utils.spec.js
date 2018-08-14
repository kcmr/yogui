'use strict';

const stringUtils = require('../lib/string-utils');

require('chai').should();

describe('String utils', () => {
  describe('camelCase()', () => {
    it('transforms to camelCase strings with words separated by - or _', () => {
      stringUtils.camelCase('some-test_string').should.equal('someTestString');
    });
  
    it('does not transform strings without - or _', () => {
      stringUtils.camelCase('notransform').should.equal('notransform');
    });
  });
  
  describe('capitalize()', () => {
    it('transforms to uppercase the first letter of a string', () => {
      stringUtils.capitalize('some-string').should.equal('Some-string');
    });
  });
  
  describe('titleCase()', () => {
    it('transforms a string with words separated by - or _ to camelcase with the first character in uppercase', () => {
      stringUtils.titleCase('some-test_string').should.equal('SomeTestString');
    });
  });
});
