/**
 * @Title: 请求头处理主模块
 * @Author: Lizhigang
 * @Date: 2019-06-27
 * @Last Modified by: Lizhigang
 * @Last Modified time: 2019-07-15
 */

import { deepMerge, isPlainObject } from './util'
import { Method } from '../types'
import mergConfig from '../core/mergeConfig'

/**
 * 强制将传入的请求头中的content-type属性名转换为合规的Content-Type
 * @param headers 请求头
 * @param {string} normalizedName 合规的属性名
 */
function normalizeHeaderName(headers: any, normalizedName: string): void {
  if (!headers) return
  Object.keys(headers).forEach(name => {
    // 遍历请求头，如果有属性名转为大写后与传入的合规属性名一致，那就将其值赋予请求头中的合规属性名，并删除该属性。
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[name]
      delete headers[name]
    }
  })
}

/**
 * 对请求头做初始化处理
 * @param headers 请求头
 * @param data 传入的data
 * @returns {any}
 */
export function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type')

  // 如果data是简单对象类型
  if (isPlainObject(data)) {
    // 如果有请求头但请求头中没有Content-Type属性，则设置请求头中的Content-Type属性默认值为application/json;charset=utf-8
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  return headers
}

/**
 * 将传入的字符串转化为JSON格式
 * @param {string} headers
 * @returns {any}
 */
export function parseHeaders(headers: string): any {
  // 创建一个纯净的空对象，不再默认继承Object原型链上的属性。
  let parsed = Object.create(null)

  // 如果未传入headers，则直接返回该空对象
  if (!headers) return parsed

  // 将传入的headers字符串通过编码换行切割成数组
  headers.split('\r\n').forEach(line => {
    // 遍历该数组，将字符串通过:切割成数组。数组中所有的key去头尾空格并转为小写设置为空对象parsed的属性，所有val去除头尾空格并赋值给key，最后返回该对象。
    let [key, val] = line.split(':')
    key = key.trim().toLowerCase()
    if (!key) return
    if (val) val = val.trim()
    parsed[key] = val
  })
  return parsed
}

/**
 * 请求头参数扁平化并删除不需要的字段
 * @param headers 请求头
 * @param method 请求类型
 */
export function flattenHeaders(headers: any, method: Method): any {
  if (!headers) {
    // 如果未传入请求头，则直接终止程序。
    return headers
  }

  // 对请求头和其中的字段common，method做深拷贝
  headers = deepMerge(headers.common, headers[method], headers)

  // 定义在请求头中需要删除的字段清单
  const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']

  // 在请求头中删除定义的清单中的字段
  methodsToDelete.forEach(method => {
    delete headers[method]
  })
  return headers
}
