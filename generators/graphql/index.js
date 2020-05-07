"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const { gql } = require("../../utils/utils");

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the epic ${chalk.red("generator-crud")} generator!`)
    );

    const prompts = [
      {
        type: "input",
        name: "pageName",
        message: "Your page name?",
        default: "foo"
      }
    ];

    return this.prompt(prompts).then(props => {
      const { pageName } = props;
      this.props = { pageName, gql: gql.getNames(pageName) };
    });
  }

  writing() {
    this.log("this.props", JSON.stringify(this.props, null, 2));

    this.fs.copyTpl(
      this.templatePath("react/page/*"),
      this.destinationPath(this.props.pageName),
      this.props
    );

    this.fs.copy(
      this.templatePath("react/utils/*"),
      this.destinationPath("utils")
    );
  }

  install() {
    // This.yarnInstall([
    //   "@ant-design/icons",
    //   "antd",
    //   "apollo-client",
    //   "apollo-cache-inmemory",
    //   "apollo-link-http",
    //   "apollo-link-error",
    //   "apollo-link",
    //   "clsmates",
    //   "graphql@^14.6.0",
    //   "graphql-tag"
    // ]);
  }
};
