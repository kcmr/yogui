#! /usr/bin/env node

'use strict';

const Generator = require('../lib/generator');
const log = require('fancy-log');

const cli = new Generator();

cli.init()
  .then((result) => log(`${result.generator} successfully generated in ${result.dest}`))
  .catch(error => log.error(error.message));
