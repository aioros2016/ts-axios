/**
 * @Title: 请求与响应中的data数据处理主模块
 * @Author: Lizhigang
 * @Date: 2019-06-27
 * @Last Modified by: Lizhigang
 * @Last Modified time: 2019-06-28
 */

import {isPlainObject} from './util'

/**
 * 对请求中传入的data参数做格式转换
 * @param data 传入的data参数
 * @returns {any}
 */
export function transformRequest(data: any): any {

  // 如果data是简单对象类型，则转化为JSON字符串并返回，否则直接返回data。
  if (isPlainObject(data)) {
    return JSON.stringify(data);
  }
  return data;
}

/**
 * 对响应中获取的data数据做格式转换
 * @param data
 * @returns {any}
 */
export function transformResponse(data: any): any {

  // 如果在响应中获取到的data数据类型为JSON字符串，就将其转为JSON格式并返回。
  if(typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (e) {
      // do nothing
    }
  }
  return data;
}
