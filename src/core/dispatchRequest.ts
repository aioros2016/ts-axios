/**
 * @Title: Axios程序主模块
 * @Author: Lizhigang
 * @Date: 2019-06-27
 * @Last Modified by: Lizhigang
 * @Last Modified time: 2019-06-28
 */

import {AxiosRequestConfig, AxiosPromise, AxiosResponse} from '../types'
import xhr from './xhr'
import {buildURL} from '../helps/url'
import {transformRequest, transformResponse} from '../helps/data'
import {processHeaders} from '../helps/headers'

/**
 * axios发起请求前的最后一步，序列号参数，然后发起请求。
 * @param {AxiosRequestConfig} config 请求参数的类型接口
 * @returns {AxiosPromise} 实例化方法返回promise的类型接口
 */
export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config);
  return xhr(config).then(res => {
    return transformResponseData(res);
  });
}

/**
 * 发起请求前对传入的参数做序列化处理
 * @param {AxiosRequestConfig} config 请求参数的类型接口
 */
function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config);
  config.headers = transformHeaders(config);
  config.data = transformRequestData(config);
}

/**
 * 对传入的参数url进行处理
 * @param {AxiosRequestConfig} config 请求参数的类型接口
 * @returns {string}
 */
function transformURL(config: AxiosRequestConfig): string {
  const {url, params} = config;
  return buildURL(url!, params);
}

/**
 * 对传入的参数data进行处理
 * @param {AxiosRequestConfig} config 请求参数的类型接口
 * @returns {any}
 */
function transformRequestData(config: AxiosRequestConfig): any {
  return transformRequest(config.data);
}

/**
 * 对传入的参数headers进行处理
 * @param {AxiosRequestConfig} config 请求参数的类型接口
 * @returns {any}
 */
function transformHeaders(config: AxiosRequestConfig): any {
  const {headers = {}, data} = config;
  return processHeaders(headers, data);
}

/**
 * 对返回的响应做相应处理
 * @param {AxiosResponse} res 返回响应的类型接口
 * @returns {AxiosResponse}
 */
function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transformResponse(res.data);
  return res;
}
