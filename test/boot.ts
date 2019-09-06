/**
 * @Title: 单元测试启动文件
 * @Author: Lizhigang
 * @Date: 2019-08-21
 * @Last Modified by: Lizhigang
 * @Last Modified time: 2019-09-05
 */

const jasmineCore = require('jasmine-core')

// @ts-ignore
global.getJasmineRequireObj = function() {
  return jasmineCore
}
require('jasmine-ajax')
