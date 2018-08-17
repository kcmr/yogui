'use strict';

const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const findup = require('find-up');
const {camelCase, capitalize, titleCase} = require('./string-utils');
const {scaffold} = require('nunjucks-scaffold-generator');

/** Class Generator */
module.exports = class Generator {
  /**
   * Creates a Generator.
   * @param {String} options.configFileName File name of the config file.
   */
  constructor({
    configFileName = '.yoguirc'
  } = {}) {
    this.config = {configFileName};
    this.userConfig = this._getUserConfig();
  }

  /**
   * Returns the list of user generators from the user config file.
   * @return {Object} user generators.
   */
  get _generators() {
    return Object.keys(this.userConfig);
  }

  /**
   * Returns if the user has only one generator.
   * @returns {Boolean} user has only one generator.
   */
  get _isSingleGenerator() {
    return this._generators.length === 1;
  }

  /**
   * Returns the current working directory name.
   * @return {String} cwd name.
   */
  get _currentDirectoryName() {
    return path.basename(process.cwd());
  }

  /**
   * Returns the prompt for the destiny question.
   * @returns {Object} prompt object.
   */
  get _promptForDestiny() {
    return {
      type: 'input',
      name: 'dest',
      message: 'Destiny',
      default: this._currentDirectoryName
    };
  }

  /**
   * Returns the prompt for the type of generator.
   * @returns {Object} prompt object.
   */
  get _promptForTypes() {
    return [{
      type: 'list',
      message: 'What do you want to create?',
      name: 'type',
      choices: this._generators
    }];
  }

  set generator(generator) {
    this._generator = this.userConfig[generator.type];
    this._generator.name = generator.type;
  }

  get generator() {
    return this._generator;
  }

  /**
   * Returns the user config as an object.
   * @returns {Object | undefined} parsed user config or undefined.
   */
  _getUserConfig() {
    const configFile = findup.sync(this.config.configFileName);

    if (configFile) {
      return JSON.parse(fs.readFileSync(configFile));
    }
  }

  /**
   * Starts the prompt for the generator type and its associated questions
   * and generates the selected element.
   * @async
   * @returns {Promise} resolves with {generator: the selected generator, dest: destiny path}.
   */
  async init() {
    if (!this.userConfig) {
      throw new Error(`No config found in a ${this.config.configFileName} file`);
    }

    this.generator = await this._getCurrentGenerator();

    return this._askQuestionsForGenerator()
      .then(answers => this._generate(answers));
  }

  /**
   * Returns the selected generator.
   * @async
   * @returns {Promise} resolves with {type: <generator-key>}.
   */
  async _getCurrentGenerator() {
    return (this._isSingleGenerator)
      ? {type: this._generators[0]}
      : inquirer.prompt(this._promptForTypes);
  }

  /**
   * Returns the result of prompting for the current generator questions.
   * @returns {Promise} prompt result.
   */
  _askQuestionsForGenerator() {
    const questions = this.generator.questions.concat(
      this._promptForDestiny
    );

    return inquirer.prompt(questions);
  }

  /**
   * Generates an element.
   * @param {Object} params scaffold params.
   * @returns {Object} {generator: <generator-name>, dest: destiny folder}.
   */
  _generate(params) {
    const scaffoldParams = this._getScaffoldParams(params);
    scaffold(scaffoldParams);

    return {
      generator: this.generator.name,
      dest: path.basename(scaffoldParams.dest)
    };
  }

  /**
   * Returns an object with the params required by the scaffold() function.
   * @param {Object} params prompt params.
   * @returns {Object} {src, dest, params, replacemnt}.
   */
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

  /**
   * Returns the full path to the current directory or the specified destiny.
   * @param {Object} params prompt params.
   * @returns {String} path to destiny directory.
   */
  _getDestinyPath(params) {
    return (path.basename(params.dest) === this._currentDirectoryName)
      ? path.resolve(process.cwd(), '.')
      : path.resolve(process.cwd(), params.dest);
  }

  /**
   * Returns an object with the prompt params and three utiliy functions for string manipulation.
   * @param {Object} params prompt params.
   * @returns {Object} template params.
   */
  _getTemplateParamsWithStringUtils(params) {
    return Object.assign({}, {
      camelCase, capitalize, titleCase
    }, params);
  }

  /**
   * Returns an array with the filename replacement for files in the scaffold or
   * undefined if the replacement is not specified in the user config file.
   * @param {Object} params prompt params.
   * @returns {Array | undefined} filename replacement.
   */
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
