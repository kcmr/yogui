#! /usr/bin/env node

'use strict';

const Generator = require('../lib/generator');
const log = require('fancy-log');
const chalk = require('chalk');

const cli = new Generator();

const logResult = result => {
  const message = `${result.generator} successfully generated in ${result.dest}`;
  log(chalk.green(message));
};

const logError = error => {
  log.error(chalk.red(error.message));
};

cli.init()
  .then(logResult)
  .catch(logError);
