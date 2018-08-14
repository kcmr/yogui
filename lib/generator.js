'use strict';

const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const findup = require('find-up');
const {camelCase, capitalize, titleCase} = require('./string-utils');
const {scaffold} = require('nunjucks-scaffold-generator');

module.exports = class Generator {
  constructor({
    configFileName = '.gnrtrrc'
  } = {}) {
    this.config = {configFileName};
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
      throw new Error(`No config found in a ${this.config.configFileName} file`);
    }

    return this._getCurrentGenerator()
      .then(generator => this._askQuestionsForGenerator(generator))
      .then(answers => this._generate(answers));
  }

  async _getCurrentGenerator() {
    return (this._isSingleGenerator) ?
      {type: this._generators[0]} :
      this._prompt(this._promptForTypes);
  }

  async _prompt(questions) {
    return inquirer.prompt(questions);
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
};
