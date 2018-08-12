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

  _getUserConfig() {
    const configFile = findup.sync(this.config.configFileName);

    if (configFile) {
      return JSON.parse(fs.readFileSync(configFile));
    }
  }

  init() {
    if (!this.userConfig) {
      return log.error(`Error: no config found in a ${this.config.configFileName} file`);
    }

    this._prompt(this._getPromptForUserGeneratorTypes())
      .then((type) => this._getPromptForGenerator(type))
      .then((generatorQuestions) => this._prompt(generatorQuestions))
      .then((answers) => this._generate(answers))
      .then(() => log('Generated!'))
      .catch((error) => log.error(error));
  }

  async _prompt(questions) {
    return await inquirer.prompt(questions);
  }

  _getPromptForUserGeneratorTypes() {
    const generators = Object.keys(this.userConfig);
    const typesPrompt = [{
      type: 'list',
      message: 'What do you want to create?',
      name: 'type',
      choices: generators
    }];

    return typesPrompt;
  }

  _getPromptForGenerator({ type }) {
    this.generatorParams = this.userConfig[type];
    
    const processCwdName = process.cwd().split(path.sep).pop();
    const where = {
      type: 'input',
      name: 'dest',
      message: 'Destiny',
      default: processCwdName
    };

    return this.generatorParams.questions.concat(where);
  }
  
  _generate(params) {
    const scaffoldParams = this._getScaffoldParams(params);
    scaffold(scaffoldParams);
  }

  _getScaffoldParams(params) {
    const templateParams = this._getTemplateParamsWithStringUtils(params);
    const fileReplacement = this._getFileReplacement(params);

    return {
      src: path.resolve(__dirname, this.generatorParams.templates),
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
    const {fileNameReplacement} = this.generatorParams;

    if (fileNameReplacement) {
      const [scaffoldFileName, variable] = fileNameReplacement;
  
      return [
        scaffoldFileName, params[variable]
      ];
    }
  }
}