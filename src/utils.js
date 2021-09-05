const { readdirSync } = require('fs')
const logSymbols = require('log-symbols') // 输出符号
const chalk = require('chalk') // 改变输出颜色

const TYPE_COLOEMAP = {
  error: 'red',
  success: 'green'
}

/**
 * @name 执行await函数
 * @param {Function} fn 执行方法
 * @returns
 */
async function tryAwait (fn) {
  try {
    const result = await fn
    return [result, null]
  } catch (e) {
    return [null, e]
  }
}

/**
 * @name 提示
 * @param {String} type 提示类型
 * @param {String} text 提示文本
 */
function log (type, text) {
  console.log(logSymbols[type], chalk[TYPE_COLOEMAP[type]](text))
}

/**
 * @name 查找路径下的文件夹列表
 * @param {String} dirPath 查找路径
 * @returns dirPath路径下的文件夹列表
 */
function filterDirs (dirPath = './') {
  const dirs = readdirSync(dirPath, {
    withFileTypes: true
  })
  return dirs.reduce((arr, dir) => {
    if (dir.isDirectory()) {
      arr.push(dir.name)
    }
    return arr
  }, [])
}

/**
 * @name 判断文件是否在文件列表中
 * @param {String} dirName 文件名
 * @param {String} dirs 文件列表
 * @returns
 */
function hasDir (dirName, dirs = []) {
  return dirs.some(dir => dir === dirName)
}

module.exports = {
  tryAwait,
  log,
  filterDirs,
  hasDir
}
