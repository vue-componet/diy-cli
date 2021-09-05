const { readFileSync, writeFileSync, rmdirSync } = require('fs')
const inquirer = require('inquirer')
const handlebars = require('handlebars')
const { tryAwait, log, filterDirs, hasDir } = require('./utils')
const { TEMPLATE } = require('../config')

// 选择模板
async function selectTemplate () {
  const [template, templateErr] = await tryAwait(inquirer.prompt([
    {
      type: 'list',
      name: 'template',
      message: '请选择模板',
      choices: TEMPLATE
    }
  ]))

  if (templateErr) {
    log('error', '读取模板失败')
    return
  }

  return template.template
}

// 初始化模板
async function initTemplate (project) {
  const [answers, err] = await tryAwait(inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: '请输入项目名称',
      default: project
    }
  ]))

  if (err) {
    log('error', '配置模板项目文件失败')
    return
  }

  const packsgeContent = readFileSync(`${project}/package.json`, 'utf8')
  const packageResult = handlebars.compile(packsgeContent)(answers)
  writeFileSync(`${project}/package.json`, packageResult)
  log('success', '模板项目文件准备成功')
}

// 初始化文件夹
async function initDir (dirName) {
  const dirs = filterDirs('./')
  if (hasDir(dirName, dirs)) {
    const [answers, err] = await tryAwait(inquirer.prompt([
      {
        type: 'confirm',
        name: 'isEmpty',
        message: `当前目录下已存在${dirName}, 是否清空该文件夹，并初始化`,
        default: true
      }
    ]))

    if (err) return true

    if (answers.isEmpty) {
      rmdirSync(`./${dirName}`, {
        recursive: true
      })
      return false
    } else {
      return true
    }
  }
}

module.exports = {
  selectTemplate,
  initTemplate,
  initDir
}
