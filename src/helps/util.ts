/**
 * @Title: 工具方法单元测试
 * @Author: Lizhigang
 * @Date: 2019-08-21
 * @Last Modified by: Lizhigang
 * @Last Modified time: 2019-08-21
 */

const toString = Object.prototype.toString

/**
 * 判断数据类型是否为Date对象
 * @param val 传入的数据
 * @returns {val is Date}
 */
export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
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
  return toString.call(val) === '[object Object]'
}

/**
 * 判断数据类型是否为FormData对象
 * @param val 传入的数据
 */
export function isFormData(val: any): val is FormData {
  return typeof val !== 'undefined' && val instanceof FormData
}

/**
 * 判断数据类型是否为URLSearchParams对象
 * @param val 传入的数据
 */
export function isURLSearchParams(val: any): val is URLSearchParams {
  return typeof val !== 'undefined' && val instanceof URLSearchParams
}

/**
 * 对象拷贝，将被拷贝的对象中的属性拷贝至目标对象。
 * @param to 目标对象
 * @param from 被拷贝对象
 */
export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}

/**
 * 深拷贝
 * @param objs 传入的参数
 */
export function deepMerge(...objs: any[]): any {
  const result = Object.create(null)

  objs.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        const val = obj[key]
        if (isPlainObject(val)) {
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], val)
          } else {
            result[key] = deepMerge(val)
          }
        } else {
          result[key] = val
        }
      })
    }
  })

  return result
}
