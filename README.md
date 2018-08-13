# gnrtr (WIP)

> A generator for user scaffolds. Think of it as a ridiculously simple (and limited) Yeoman.


**gnrtr** allows you to create new projects from your own templates with your own set of questions for the CLI and variables for your scaffold templates.

![CLI screenshot](gnrtr.png)

## Configuration

The path to your scaffold templates and questions should be specified in a `.gnrtr` file inside your home directory or any other directory where you want to use it.

### Sample config file

```json
{
  "polymer-3-component": {
    "templates": "/Users/username/gnrtr-templates/polymer-3-component/",
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
  "polymer-3-app": {
    "templates": "/Users/username/gnrtr-templates/polymer-3-app/",
    ...
  }
}
```

Each of the keys at the first level is a generator. `templates` and `questions` are mandatory fields. `fileNameReplacement` is optional and allows you to specify the file name used in your scaffold templates that will be replaced by one of the params of your questions.

In the example above, any file that contains the name "component" in the scaffold will be replaced by the param `name` obtained from the answers given by the user to the `questions`. In this case it will be the component name.

Questions should have the expected format by [inquirer](https://github.com/SBoudrias/Inquirer.js).

### Scaffold templates

Templates use the [Nunjucks](https://mozilla.github.io/nunjucks/) templating engine. 

Inside your templates you can use any of the variables obtained from your set of questions and three functions for string conversion (`camelCase`, `capitalize` and `titleCase`).

In the example above you could use vars `scope` and `name` inside your template files.

**Example**

package.json:

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

component_test.html ("component" will be replaced by the component name (`name` param)):

```html
<test-fixture id="default">
  <template>
    <{{name}}></{{name}}>
  </template>
</test-fixture>

<script>
  suite('<{{name}}>', () => {
    let el;

    setup(() => {
      el = fixture('default');
    });

    test('is Ok', () => {
      assert.isOk(el);
    });
  });
</script>
```

## Examples

The `examples` folder in this repository contains a sample config file and a scaffold template.



