# Yogui

[![Build Status](https://img.shields.io/travis/kcmr/yogui/master.svg)](https://travis-ci.org/kcmr/yogui) 
[![codecov](https://codecov.io/gh/kcmr/yogui/branch/master/graph/badge.svg)](https://codecov.io/gh/kcmr/yogui)

> A generator for user scaffolds. Think of it as a ridiculously simple Yeoman.

![CLI screenshot](https://raw.githubusercontent.com/kcmr/yogui/master/docs/yogui.gif)

**Yogui** allows you to create new projects from your own templates with your own set of questions for the CLI. 

The only requirements to start using it are a `.yoguirc` file where you specify the path to each template and the scaffold templates where you can use the [Nunjucks](https://mozilla.github.io/nunjucks/) templating engine to set the value of your variables.

## Configuration

### Installation

For global usage:

```sh
npm install -g yogui
```

As a project dependency:

```sh
npm install --save-dev yogui
```

### Config file `.yoguirc`

Create a file called `.yoguirc` in the directory you want to use it. It can be a project directory or your home directory (`~/`). The configuration file sets the config for that directory and all of its subdirectories. If Yogui doesn't find a config file in the directory where it is executed, it will look for a config file in parent directories.

The file should be a **valid JSON**.

**Example**

```json
{
  "polymer-3-component": {
    "templates": "/Users/username/my-templates/polymer-3-component/",
    "fileNameReplacement": ["component", "name"],
    "questions": [
      {
        "type": "input",
        "name": "scope",
        "message": "Your package scope (@your-scope)",
        "default": "@my-scope"
      },
      {
        "type": "input",
        "name": "name",
        "message": "Component name without extension (.js by default)"
      }
    ]
  },
  "node-project": {
    "templates": "/Users/username/my-templates/node-project/"
  }
}
```

#### Params

- **Generator name** (`String`) **required**   
The key at the first level is the name of each generator. If the config file only contains one generator, the prompt for the generator type will be skipped.

- **`templates`** (`String`) **required**   
Path to the scaffold template for a generator. It can be an absolut or relative path.

- **`fileNameReplacement`** (`Array`)    
String in the scaffold file names that will be replaced by the specified variable in the files of the generated project. For example, a file named `component_test.html` in the scaffold templates will be renamed to `my-component_test.html` in the generated project if the user responds to the first question with `my-component`. If not provided, the generated files will keep the names used in the templates.

- **`questions`** (`Array`) **required**   
List of questions for each generator. They should have the expected format by [inquirer](https://github.com/SBoudrias/Inquirer.js). Each question has a `name` key that will be available as a variable in your scaffold templates and for the `fileNameReplacement`.


### Scaffold templates

Templates use the [Nunjucks](https://mozilla.github.io/nunjucks/) templating engine. 

Inside your templates you can use any of the variables obtained from the questions for a generator (`name` keys) and three utility functions for common string conversions (`camelCase`, `capitalize` and `titleCase`).

**Examples**

`package.json`:

```json
{
  "name": "{{scope}}/{{name}}",
  "version": "0.0.0",
  "description": "",
  "main": "dist/{{name}}.js",
  "keywords": [],
  "dependencies": {
    "@polymer/polymer": "^3.0.5"
  }
}
```

`component.js`:

```js
/**
 * `<{{name}}>` description.
 * @polymer
 * @customElement
 * @extends {PolymerElement}
 */
class {{titleCase(name)}} extends PolymerElement {
  static get template() {
    return html``;
  }

  static get properties() {
    return {};
  }
}

customElements.define('{{name}}', {{titleCase(name)}});
```

### Used as a project dependency

Install Yogui in your project as a `devDependency`.

Create a `.yoguirc` file in the project's root with a relative path to the scaffold templates.

**Example**:

```json
{
  "app-element": {
    "templates": "tasks/templates/",
    "fileNameReplacement": ["app-element", "name"],
    "questions": [
      {
        "type": "input",
        "name": "name",
        "message": "Element name"
      }
    ]
  }
}
```

If you also have Yogui installed globally, you can simply run `yogui` inside the project folder to launch the prompt, otherwise you'll need to run the Yogui binary inside `node_modules/`. Typically you do so by adding a new entry in the `scripts` field of your project's `package.json` with the `yogui` command.

`package.json`:

```json
{
  "scripts": {
    "create-element": "yogui"
  }
}
```

Create a new element inside the project:

```sh
npm run create-element
```

## More examples

The `examples` folder in this repository contains a sample config file and a scaffold template.


