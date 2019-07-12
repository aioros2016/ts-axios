/**
 * @Title: 处理请求参数url的模块
 * @Author: Lizhigang
 * @Date: 2019-06-27
 * @Last Modified by: Lizhigang
 * @Last Modified time: 2019-06-28
 */

import {isDate, isPlainObject} from './util'

/**
 * 对传入的参数做编码encode处理，将指定的特殊编码替换为符号本身。
 * @param {string} val
 * @returns {string}
 */
function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/ig, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/ig, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/ig, '[')
    .replace(/%5D/ig, ']')
}

/**
 * 构建传入的参数url的主程序
 * @param {string} url 传入的参数url
 * @param params 请求url结尾拼接的参数
 * @returns {string}
 */
export function buildURL(url: string, params?: any): string {
  if(!params) return url;
  const parts: string[] = [];

  /* 遍历拼接的参数，排入null和undefined的情况，有以下几种数据类型：
   * 1: 数组类型     拼接的参数中，key结尾会以[]来表示
   * 2: Date类型     会被转换成符合ISO标准格式的时间与日期字符串
   * 3: 简单对象类型  会被转换成JSON字符串
   * 最后查询url中是否有hash，如果有就删除，最终将以上数据类型拼接到url后，并且返回。
   * */
  Object.keys(params).forEach(key => {
    const val = params[key];

    // 参数为null或undefined，程序终止。
    if(val === null || typeof val === 'undefined') {
      return;
    }
    let values = [];

    // 无论传入的参数是否数组类型，都将其value统一处理为数组类型。如果传入的参数是数组类型，key结尾会添加[]。
    if(Array.isArray(val)) {
      values = val;
      key += '[]';
    } else {
      values = [val];
    }
    values.forEach(val => {
      if(isDate(val)) {

        // 遍历所有参数的值，如果是日期对象，则转换成符合ISO标准格式的时间与日期字符串。
        val = val.toISOString();
      } else if(isPlainObject(val)) {

        // 遍历所有参数的值，如果是简单对象类型，则被转换成JSON字符串。
        val = JSON.stringify(val);
      }

      // 将处理完成的参数键值对，放入零时数组中
      parts.push(`${encode(key)}=${encode(val)}`);
    })
  })

  // 将零时数组中的参数键值对，处理成完整的序列化参数字符串。
  let serializedParams = parts.join('&');
  if (serializedParams) {

    // 查询传入的url中是否带有hash值，如果存在就删除。
    const markIndex = url.indexOf('#');
    if(markIndex !== -1) {
      console.log(url)
      url = url.slice(0, markIndex);
    }

    // 最终将完整的序列化参数字符串拼接到url末尾，并做了是否已有参数的兼容处理。
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }
  return url;
}
