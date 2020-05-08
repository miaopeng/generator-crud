"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");

module.exports = class extends Generator {
  prompting() {
    this.log(`${chalk.blue("安装需要 graphql/apollo/react 相关的依赖")}`);
  }

  writing() {
    this.fs.copy(this.templatePath("utils/*"), this.destinationPath("utils"));
  }

  install() {
    this.yarnInstall([
      "react",
      "react-feather",
      "antd",
      "apollo-client",
      "apollo-cache-inmemory",
      "apollo-link-http",
      "apollo-link-error",
      "apollo-link",
      "clsmates",
      "graphql@^14.6.0",
      "graphql-tag"
    ]);
  }
};
