var generators = require('yeoman-generator');
var pascalCase = require('pascal-case');
var dasherize = require('underscore.string').dasherize;

module.exports = generators.NamedBase.extend();

module.exports = generators.Base.extend({
  prompting: function () {
    var done = this.async();

    this.prompt([{
      type    : 'input',
      name    : 'name',
      message : 'What is your component name ( ex.: "your-component-name" )',
      default : this.appname // Default to current folder name
    },
    {
      type    : 'input',
      name    : 'git_url',
      message : 'What is your component remote git repository url',
      required : true
    }], function (answers) {
      this.git_url = answers.git_url;
      done();
    }.bind(this));
  },
  writing: function () {
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      {
        component_name: this.component_name,
        git_url: this.git_url
      }
    );

    this.fs.copyTpl(
      this.templatePath('_webpack.config.js'),
      this.destinationPath('webpack.config.js'));

    this.fs.copyTpl(
      this.templatePath('test/_test.js'),
      this.destinationPath('test/' + this.component_name + '-test.js'),
      {
        component_name: this.component_name,
        pascal_name: this.pascal_name
      }
    );

    this.fs.copyTpl(
      this.templatePath('src/component/_index.jsx'),
      this.destinationPath('src/' + this.component_name + '/index.jsx'),
      {
        pascal_name: this.pascal_name,
        suit_component_name: this.SUIT_name
      }
    );

    this.fs.copyTpl(
      this.templatePath('src/component/_component.scss'),
      this.destinationPath('src/' + this.component_name + '/_' + this.component_name + '.scss'),
      {
        suit_component_name: this.SUIT_name,
      }
    );

    this.fs.copyTpl(
      this.templatePath('src/_index.jsx'),
      this.destinationPath('src/index.jsx'),
      {
        component_name: this.component_name,
        pascal_name: this.pascal_name
      }
    );

    this.fs.copyTpl(
      this.templatePath('src/_index.scss'),
      this.destinationPath('src/index.scss'),
      { component_name: this.component_name }
    );

    this.fs.copyTpl(
      this.templatePath('docs/_index.html'),
      this.destinationPath('docs/index.html'),
      { pascal_name: this.pascal_name }
    );

    this.fs.copyTpl(
      this.templatePath('docs/_index.jsx'),
      this.destinationPath('docs/index.jsx'),
      {
        component_name: this.component_name,
        pascal_name: this.pascal_name
      }
    );

    this.fs.copyTpl(
      this.templatePath('docs/_style.scss'),
      this.destinationPath('docs/style.scss')
    );

    this.fs.copyTpl(
      this.templatePath('_gitignore'),
      this.destinationPath('.gitignore'));

    this.fs.copyTpl(
      this.templatePath('_babelrc'),
      this.destinationPath('.babelrc'));

    this.fs.copyTpl(
      this.templatePath('_npmignore'),
      this.destinationPath('.npmignore'));

    this.fs.copyTpl(
      this.templatePath('_README.md'),
      this.destinationPath('README.md'),
      {
        component_name: this.component_name,
      }
    );

  },
  installing: function(){
    this.spawnCommand('git', ['init']).on('close', function(){
      this.spawnCommand('git', ['remote', 'add', 'origin', this.git_url]);
    }.bind(this));
    this.npmInstall();
  }
});
