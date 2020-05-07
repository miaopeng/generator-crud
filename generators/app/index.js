"use strict";
const fs = require("fs");
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const { gql } = require("../../utils/utils");

module.exports = class extends Generator {
  initializing() {
    // This.sourceRoot(path.resolve(this.templatePath(), "../app/templates"));
  }

  async prompting() {
    this.log(`${chalk.green("Welcome to the graphql crud generator!")}`);
    this.log(`
${chalk.green("本工具将会使用当前目录下的一个 graphql 文件来生成 crud 代码")}
您的 graphql 文件需要包含若干个 operation, 我们用几个前缀来识别您的 operation:

list: 列表操作 e.g. listFilms
read: 详情操作 e.g. readFilm
create: 新增操作 e.g. createFilm
update: 更新操作 e.g. updateFilm
`);

    const hello = await this.prompt({
      name: "continue",
      message: "继续吗？",
      type: "confirm"
    });

    if (!hello.continue) {
      this.log(`${chalk.green("Bye")}`);
      process.exit(1);
      return;
    }

    const files = fs.readdirSync(this.destinationPath());
    const sourceFiles = [];
    for (var i = 0; i < files.length; i++) {
      var filename = files[i];
      var stat = fs.lstatSync(filename);
      if (!stat.isDirectory() && /\.graphql$/.test(filename)) {
        sourceFiles.push(filename);
      }
    }

    if (!sourceFiles.length) {
      this.log(`${chalk.red("没有找到目录下的 .graphql 文件")}`);
      return;
    }

    if (sourceFiles.length === 1) {
      this.props = {
        sourceFile: sourceFiles[0],
        pageName: sourceFiles[0].replace(".graphql", "")
      };
    } else {
      const prompts = [
        {
          type: "list",
          name: "file",
          choices: sourceFiles,
          message: "使用哪个文件作为源文件？"
        }
      ];
      return this.prompt(prompts).then(props => {
        const { file } = props;

        const operations = gql.getOpertionsFromFile(file);

        this.log("ops count", Object.keys(operations).length);

        if (!Object.keys(operations).length) {
          this.log(`${chalk.red(`在 ${file} 文件中找不到 operation!`)}`);
          process.exit(1);
        }

        this.props = {
          sourceFile: file,
          pageName: file.replace(".graphql", ""),
          operations
        };
      });
    }
  }

  writing() {
    const { sourceFile, pageName, operations } = this.props;
    // This.log("tpl", this.templatePath());

    if (operations) {
      const data = {
        sourceFile,
        gql: {
          ...gql.getTypes(pageName),
          ...operations
        }
      };
      this.log(data);

      this.fs.copyTpl(
        this.templatePath("react/page/*"),
        this.destinationPath(),
        data
      );
    } else {
      this.log(`${chalk.red("在 graphql 文件中找不到 operation!")}`);
    }
    // This.log("this.props", JSON.stringify(this.props, null, 2));
    // this.fs.copyTpl(
    //   this.templatePath("react/page/*"),
    //   this.destinationPath(this.props.pageName),
    //   this.props
    // );
    // this.fs.copy(
    //   this.templatePath("react/utils/*"),
    //   this.destinationPath("utils")
    // );
  }
};
