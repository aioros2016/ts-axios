/**
 * @Title: 工具方法模块
 * @Author: Lizhigang
 * @Date: 2019-06-27
 * @Last Modified by: Lizhigang
 * @Last Modified time: 2019-06-28
 */

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

/**
 * 对象拷贝，将被拷贝的对象中的属性拷贝至目标对象。
 * @param to 目标对象
 * @param from 被拷贝对象
 */
export function extend<T, U>(to: T, from: U): T & U {
  for(const key in from) {
    ;(to as T & U)[key] = from[key] as any;
  }
  return to as T & U;
}

export function deepMerge(...objs: any[]): any {
  const result = Object.create(null);
  objs.forEach(obj => {
    Object.keys(obj).forEach(key => {
      const val = obj[key];
      if(isPlainObject(val)) {
        if(isPlainObject(result[key])) {
          result[key] = deepMerge(result[key], val);
        } else {
          result[key] = deepMerge(val);
        }
      } else {
        result[key] = val;
      }
    })
  })
  return result;
}
