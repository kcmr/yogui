'use strict';

const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const findup = require('find-up');
const log = require('fancy-log');
const { camelCase, capitalize, titleCase } = require('./string-utils');
const { scaffold } = require('nunjucks-scaffold-generator');

module.exports = class Generator {
  constructor({ 
    configFileName = '.gnrtr' 
  } = {}) {
    this.config = { configFileName };
    this.userConfig = this._getUserConfig();
  }

  get _generators() {
    return Object.keys(this.userConfig);
  }

  get _isSingleGenerator() {
    return this._generators.length === 1;
  }

  get _currentDirectoryName() {
    return process.cwd().split(path.sep).pop();
  }

  get _promptForDestiny() {
    return {
      type: 'input',
      name: 'dest',
      message: 'Destiny',
      default: this._currentDirectoryName
    };
  }

  get _promptForTypes() {
    return [{
      type: 'list',
      message: 'What do you want to create?',
      name: 'type',
      choices: this._generators
    }];
  }

  _getUserConfig() {
    const configFile = findup.sync(this.config.configFileName);

    if (configFile) {
      return JSON.parse(fs.readFileSync(configFile));
    }
  }

  async init() {
    if (!this.userConfig) {
      return log.error(`Error: no config found in a ${this.config.configFileName} file`);
    }

    this._getCurrentGenerator()
      .then((generator) => this._askQuestionsForGenerator(generator))
      .then((answers) => this._generate(answers))
      .then(() => log('Generated!'))
      .catch((error) => log.error(error));
  }

  async _getCurrentGenerator() {
    if (this._isSingleGenerator) {
      return {
        type: this._generators[0]
      }
    }

    return await this._prompt(
      this._promptForTypes
    );
  }

  async _prompt(questions) {
    return await inquirer.prompt(questions);
  }

  _askQuestionsForGenerator(generator) {
    this.generator = this.userConfig[generator.type];
    const questions = this.generator.questions.concat(
      this._promptForDestiny
    );

    return this._prompt(questions);
  }

  _generate(params) {
    const scaffoldParams = this._getScaffoldParams(params);
    scaffold(scaffoldParams);
  }

  _getScaffoldParams(params) {
    const templateParams = this._getTemplateParamsWithStringUtils(params);
    const fileReplacement = this._getFileReplacement(params);

    return {
      src: path.resolve(__dirname, this.generator.templates),
      dest: path.resolve(process.cwd(), params.dest), 
      params: templateParams,
      replacement: fileReplacement
    };
  }

  _getTemplateParamsWithStringUtils(params) {
    return Object.assign({}, {
      camelCase, capitalize, titleCase
    }, params);
  }

  _getFileReplacement(params) {
    const {fileNameReplacement} = this.generator;

    if (fileNameReplacement) {
      const [scaffoldFileName, variable] = fileNameReplacement;
  
      return [
        scaffoldFileName, params[variable]
      ];
    }
  }
}