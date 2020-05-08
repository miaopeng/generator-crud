"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");

module.exports = class extends Generator {
  prompting() {
    this.log(`${chalk.blue("在当前目录下生成一个 graphql 文件例子")}`);

    // Const prompts = [
    //   {
    //     type: "input",
    //     name: "pageName",
    //     message: "Your page name?",
    //     default: "foo"
    //   }
    // ];

    // return this.prompt(prompts).then(props => {
    //   const { pageName } = props;
    //   this.props = { pageName, gql: gql.getNames(pageName) };
    // });
  }

  writing() {
    this.fs.copy(
      this.templatePath("product.graphql"),
      this.destinationPath("product.graphql"),
      this.props
    );
  }
};
