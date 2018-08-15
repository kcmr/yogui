'use strict';

const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const findup = require('find-up');
const {camelCase, capitalize, titleCase} = require('./string-utils');
const {scaffold} = require('nunjucks-scaffold-generator');

module.exports = class Generator {
  constructor({
    configFileName = '.yoguirc'
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
    return path.basename(process.cwd());
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

    const generator = await this._getCurrentGenerator();
    this._setGenerator(generator);

    return this._askQuestionsForGenerator()
      .then(answers => this._generate(answers));
  }

  async _getCurrentGenerator() {
    return (this._isSingleGenerator)
      ? {type: this._generators[0]}
      : inquirer.prompt(this._promptForTypes);
  }

  _setGenerator(generator) {
    this.generator = this.userConfig[generator.type];
    this.generator.name = generator.type;
  }

  _askQuestionsForGenerator() {
    const questions = this.generator.questions.concat(
      this._promptForDestiny
    );

    return inquirer.prompt(questions);
  }

  _generate(params) {
    const scaffoldParams = this._getScaffoldParams(params);
    scaffold(scaffoldParams);

    return {
      generator: this.generator.name,
      dest: path.basename(scaffoldParams.dest)
    };
  }

  _getScaffoldParams(params) {
    const destinyPath = this._getDestinyPath(params);
    const templateParams = this._getTemplateParamsWithStringUtils(params);
    const fileReplacement = this._getFileReplacement(params);

    return {
      src: path.resolve(process.cwd(), this.generator.templates),
      dest: destinyPath,
      params: templateParams,
      replacement: fileReplacement
    };
  }

  _getDestinyPath(params) {
    return (path.basename(params.dest) === this._currentDirectoryName)
      ? path.resolve(process.cwd(), '.')
      : path.resolve(process.cwd(), params.dest);
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
