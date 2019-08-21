/**
 * @Title: 请求与响应配置化修改模块
 * @Author: Lizhigang
 * @Date: 2019-07-16
 * @Last Modified by: Lizhigang
 * @Last Modified time: 2019-07-16
 */

import { AxiosTransformer } from '../types'

/**
 * 对请求前传入配置和获取的响应做自定义处理
 * @param data 请求中的data数据
 * @param headers 请求头
 * @param fns 对配置和响应做处理的函数数据
 */
export default function transform(
  data: any,
  headers: any,
  fns?: AxiosTransformer | AxiosTransformer[]
): any {
  // 如果不需要对配置或响应做处理，则直接返回data数据。
  if (!fns) {
    return data
  }

  // 如果传入的处理方法类型不是数据，则将改方法置入数组中。
  if (!Array.isArray(fns)) {
    fns = [fns]
  }

  // 遍历传入的数组，并依次执行数据中的方法。
  fns.forEach(fn => {
    data = fn(data, headers)
  })
  return data
}
