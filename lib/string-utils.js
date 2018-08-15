'use strict';

/**
 * Transforms to camelCase strings with words separated by - or _.
 * @param {String} string string to transform.
 * @returns {String} string in camelCase.
 */
function camelCase(string) {
  return string.replace(/[-_]./g, match => match.charAt(1).toUpperCase());
}

/**
 * Transforms to uppercase the first letter of a string.
 * @param {String} string string to transform.
 * @returns {String} capitalized string.
 */
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Transforms a string with words separated by - or _ to camelcase with the first character in uppercase.
 * @param {String} string string to transform.
 * @returns {String} titleCase string.
 */
function titleCase(string) {
  return capitalize(camelCase(string));
}

module.exports = {
  camelCase,
  capitalize,
  titleCase
};
