var Generator = require('yeoman-generator');
var shell = require('shelljs');

module.exports = class extends Generator {
  constructor(args, opts){
    super(args,opts);
    // this.option('babel')
    this.answers = {};
  }
  
  
  initializing () {
    // this.log('在当前工作目录种下.yo-rc.json文件')
    this.config.save();
  }
  
  prompting () {
    return this.prompt([{
      type: 'input',
      name: 'name',
      message: 'Your project name',
      default: this.appname
    },{
      type: 'input',
      name: 'author',
      message: 'Author',
      default: ''
    },{
      type: 'input',
      name: 'git',
      message: 'Your git repositories',
      default: ''
    },{
      type: 'confirm',
      name: 'commitizen',
      message: 'Would you like to use commitizen for your project?',
      default: false
    },{
      type: 'confirm',
      name: 'readme',
      message: 'Would you like touch readme for your project?',
      default: true
    },{
      type: 'confirm',
      name: 'php',
      message: 'Would you like to use thinkphp for your php?',
      default: true
    },{
      type: 'list',
      name: 'font',
      message: 'Which freamwork would you like to your font?',
      choices: [{
        name: 'none',
        value: 'native'
      }, {
        name: 'vue',
        value: 'vue'
      }],
    }]).then((answers) => {
      this.answers.name = answers.name
      this.answers.author = answers.author
      this.answers.git = answers.git
      this.answers.commitizen = answers.commitizen
      this.answers.readme = answers.readme
      this.answers.php = answers.php
      this.answers.font = answers.font
    })
  }
  
  writing () {
    this.fs.copyTpl(
      this.templatePath('package.json.ejs'),
      this.destinationPath('package.json'),
      {
        name: this.answers.name,
        author: this.answers.author,
        git: this.answers.git
      }
    )
    
    if (this.answers.git !== '') {
      if (shell.exec('git init') ===0 ){
        shell.echo('-> git ')
      }
  
      if (shell.exec(`git remote add ${shell.ShellString(this.answers.author)} ${shell.ShellString(this.answers.git)}`).code !== 0) {
        shell.echo('Error: Git remote error');
        shell.exit(1);
      }
    }
    
    if (this.answers.commitizen) {
      if (shell.exec('sudo npm install -g commitizen') === 0) {
        if (shell.exec('commitizen init cz-conventional-changelog --save --save-exact') !== 0) {
          shell.echo('error --> commitizen')
          shell.exit(1);
        }
        
      } else {
        shell.echo('error --> npm')
        shell.exit(1);
      }
    }
    
    if (this.answers.readme) {
      this.fs.copyTpl(
        this.templatePath('README.md'),
        this.destinationPath('README.md'),
      )
    }
    
    if (this.answers.php) {
      this.fs.copy (
        this.templatePath('php/**/*'),
        this.destinationPath('php'),
      )
    }
    
    // vue or native
    if (this.answers.font === 'native'){
      this.fs.copy (
        this.templatePath('font/native/**/*'),
        this.destinationPath('font'),
      )
    } else if (this.answers.font === 'vue'){
      this.fs.copy (
        this.templatePath('font/vue/**/*'),
        this.destinationPath('font'),
      )
    }
    
  }
  
  // installCommitizen() {
  //   this.npmInstall(['commitizen'], { 'save-dev': true });
  // }
  // npm install -g commitizen
  // commitizen init cz-conventional-changelog --save --save-exact
  
};


