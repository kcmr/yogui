'use strict';

function camelCase(string) {
  return string.replace(/[-_]./g, match => match.charAt(1).toUpperCase());
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function titleCase(string) {
  return capitalize(camelCase(string));
}

module.exports = {
  camelCase,
  capitalize,
  titleCase
};
