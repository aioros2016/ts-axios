/**
 * @Title: 工具方法模块
 * @Author: Lizhigang
 * @Date: 2019-06-27
 * @Last Modified by: Lizhigang
 * @Last Modified time: 2019-06-28
 **/

const toString = Object.prototype.toString;

/**
 * 判断数据类型是否为Date对象
 * @param val 传入的数据
 * @returns {val is Date}
 */
export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]';
}

// export function isObject(val: any): val is Object {
//   return val !== null && typeof val === 'object'
// }

/**
 * 判断数据类型是否为简单对象
 * @param val 传入的数据
 * @returns {val is Object}
 */
export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]';
}
