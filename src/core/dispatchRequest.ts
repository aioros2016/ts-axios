/**
 * @Title: Axios程序主模块
 * @Author: Lizhigang
 * @Date: 2019-06-27
 * @Last Modified by: Lizhigang
 * @Last Modified time: 2019-07-15
 */

import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL } from '../helps/url'
import { flattenHeaders } from '../helps/headers'
import transform from './transform'

/**
 * axios发起请求前的最后一步，序列号参数，然后发起请求。
 * @param {AxiosRequestConfig} config 请求参数的类型接口
 * @returns {AxiosPromise} 实例化方法返回promise的类型接口
 */
export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  throwIfCancellationRequested(config)
  processConfig(config)
  return xhr(config).then(res => {
    return transformResponseData(res)
  })
}

/**
 * 发起请求前对传入的参数做序列化处理
 * @param {AxiosRequestConfig} config 请求参数的类型接口
 */
function processConfig(config: AxiosRequestConfig): void {
  console.log(config)
  config.url = transformURL(config)
  config.data = transform(config.data, config.headers, config.transformRequest)
  config.headers = flattenHeaders(config.headers, config.method!)
}

/**
 * 对传入的参数url进行处理
 * @param {AxiosRequestConfig} config 请求参数的类型接口
 * @returns {string}
 */
function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url!, params)
}

/**
 * 对返回的响应做相应处理
 * @param {AxiosResponse} res 返回响应的类型接口
 * @returns {AxiosResponse}
 */
function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

function throwIfCancellationRequested(config: AxiosRequestConfig): void {
  if (config.cancelToken) config.cancelToken.throwIfRequested()
}
