"use strict";
const fs = require("fs");
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const prettier = require("gulp-prettier");
const { gql } = require("../../utils/utils");

module.exports = class extends Generator {
  async prompting() {
    this.log(`${chalk.green("Welcome to the graphql crud generator!")}`);
    this.log(`
${chalk.green("本工具将会使用当前目录下的一个 graphql 文件来生成 crud 代码")}
您的 graphql 文件需要包含若干个 operation, 我们用几个后缀来识别您的 operation:

list: 列表操作 e.g. FilmList
read: 详情操作 e.g. FilmRead
create: 新增操作 e.g. FilmCreate
update: 更新操作 e.g. FilmUpdate
delete: 删除操作 e.g. FilmDelete
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

    let sourceFile = sourceFiles[0];

    if (sourceFiles.length > 1) {
      const prompts = [
        {
          type: "list",
          name: "file",
          choices: sourceFiles,
          message: "使用哪个文件作为源文件？"
        }
      ];
      const answers = await this.prompt(prompts);
      sourceFile = answers.file;
    }

    this.log("sourceFile: ", sourceFile);

    const operations = gql.getOpertionsFromFile(sourceFile);

    if (!operations || !Object.keys(operations).length) {
      this.log(`${chalk.red(`在 ${sourceFile} 文件中找不到 operation!`)}`);
      process.exit(1);
    }

    this.props = {
      sourceFile,
      pageName: sourceFile.replace(".graphql", ""),
      operations
    };
  }

  writing() {
    const { sourceFile, pageName, operations } = this.props;

    const data = {
      sourceFile,
      gql: {
        ...gql.getTypes(pageName),
        ...operations
      }
    };

    this.log(JSON.stringify(data, null, 2));

    this.registerTransformStream(prettier());

    this.fs.copyTpl(
      this.templatePath("react/page/@(index|service).js"),
      this.destinationPath(),
      data
    );

    if (operations.create || operations.update) {
      this.fs.copyTpl(
        this.templatePath("react/page/form.js"),
        this.destinationPath("form.js"),
        data
      );
    }
  }
};
