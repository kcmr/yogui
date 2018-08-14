'use strict';

const stringUtils = require('../lib/string-utils');

describe('String utils', () => {
  describe('camelCase()', () => {
    it('transforms to camelCase strings with words separated by - or _', () => {
      expect(stringUtils.camelCase('some-test_string')).toEqual('someTestString');
    });
  
    it('does not transform strings without - or _', () => {
      expect(stringUtils.camelCase('notransform')).toEqual('notransform');
    });
  });
  
  describe('capitalize()', () => {
    it('transforms to uppercase the first letter of a string', () => {
      expect(stringUtils.capitalize('some-string')).toEqual('Some-string');
    });
  });
  
  describe('titleCase()', () => {
    it('transforms a string with words separated by - or _ to camelcase with the first character in uppercase', () => {
      expect(stringUtils.titleCase('some-test_string')).toEqual('SomeTestString');
    });
  });
});
