const { program } = require('commander')
const download = require('download-git-repo')
const ora = require('ora') // 美化输出提示

const { version } = require('./package.json')
const { selectTemplate, initTemplate, initDir } = require('./src/main')

program.version(version)

program
  .command('init <project>')
  .description('初始化模板')
  .action(async (project) => {
    if (await initDir(project)) return
    const template = await selectTemplate()

    const spinner = ora('正在下载模板...').start()

    // 第一个参数是github仓库地址，第二个参数是创建的项目目录名，第三个参数是clone
    download(template, project, { clone: true }, async err => {
      if (err) {
        spinner.fail('下载模板失败！')
      } else {
        spinner.succeed('下载模板成功！')
        await initTemplate(project)
      }
    })
  })

program.parse(process.argv)
