/**
 * @Title: 处理请求参数url的模块
 * @Author: Lizhigang
 * @Date: 2019-06-27
 * @Last Modified by: Lizhigang
 * @Last Modified time: 2019-08-23
 */

import { isDate, isPlainObject, isURLSearchParams } from './util'

interface URLOrigin {
  protocol: string
  host: string
}

/**
 * 对传入的参数做编码encode处理，将指定的特殊编码替换为符号本身。
 * @param {string} val
 * @returns {string}
 */
function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

/**
 * 构建传入的参数url的主程序
 * @param {string} url 传入的参数url
 * @param params 请求url结尾拼接的参数
 * @returns {string}
 */
export function buildURL(
  url: string,
  params?: any,
  paramsSerializer?: (params: any) => string
): string {
  if (!params) return url
  let serializedParams
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
    const parts: string[] = []

    /* 遍历拼接的参数，排入null和undefined的情况，有以下几种数据类型：
     * 1: 数组类型     拼接的参数中，key结尾会以[]来表示
     * 2: Date类型     会被转换成符合ISO标准格式的时间与日期字符串
     * 3: 简单对象类型  会被转换成JSON字符串
     * 最后查询url中是否有hash，如果有就删除，最终将以上数据类型拼接到url后，并且返回。
     * */
    Object.keys(params).forEach(key => {
      const val = params[key]

      // 参数为null或undefined，程序终止。
      if (val === null || typeof val === 'undefined') {
        return
      }
      let values = []

      // 无论传入的参数是否数组类型，都将其value统一处理为数组类型。如果传入的参数是数组类型，key结尾会添加[]。
      if (Array.isArray(val)) {
        values = val
        key += '[]'
      } else {
        values = [val]
      }
      values.forEach(val => {
        if (isDate(val)) {
          // 遍历所有参数的值，如果是日期对象，则转换成符合ISO标准格式的时间与日期字符串。
          val = val.toISOString()
        } else if (isPlainObject(val)) {
          // 遍历所有参数的值，如果是简单对象类型，则被转换成JSON字符串。
          val = JSON.stringify(val)
        }

        // 将处理完成的参数键值对，放入零时数组中
        parts.push(`${encode(key)}=${encode(val)}`)
      })
    })

    // 将零时数组中的参数键值对，处理成完整的序列化参数字符串。
    serializedParams = parts.join('&')
  }
  if (serializedParams) {
    // 查询传入的url中是否带有hash值，如果存在就删除。
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      console.log(url)
      url = url.slice(0, markIndex)
    }

    // 最终将完整的序列化参数字符串拼接到url末尾，并做了是否已有参数的兼容处理。
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }
  return url
}

/**
 * 判断请求是否符合同源策略
 * @param requestURL 请求链接
 */
export function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resoveURL(requestURL)
  return (
    parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host
  )
}

/**
 * 判断传入的链接是否为一个绝对链接
 * @param url 传入的链接
 */
export function isAbsoluteURL(url: string): boolean {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

/**
 * 拼接绝对链接与相对链接成为新的链接
 * @param baseURL 绝对链接
 * @param relativeURL 相对链接
 */
export function combineURL(baseURL: string, relativeURL?: string): string {
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}

// 创建一个a标签
const urlParsingNode = document.createElement('a')

// 获取当前会话web主机的域名与协议
const currentOrigin = resoveURL(window.location.href)

/**
 * 获取传入链接的域名与协议
 * @param url 请求链接
 */
function resoveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)
  const { protocol, host } = urlParsingNode
  return {
    protocol,
    host
  }
}
