/**
 * @Title: 请求中异常处理的模块
 * @Author: Lizhigang
 * @Date: 2019-06-27
 * @Last Modified by: Lizhigang
 * @Last Modified time: 2019-06-28
 */

import { AxiosRequestConfig, AxiosResponse } from '../types'

// 创建类AxiosError继承于TS库中的Error类
export class AxiosError extends Error {
  isAxiosError: boolean
  config: AxiosRequestConfig
  code?: string | null
  request?: any
  response?: AxiosResponse

  /**
   * 在构造函数中初始化实例属性
   * @param {string} message 报错信息
   * @param {AxiosRequestConfig} config 请求参数的类型接口
   * @param {string | null} code 错误代码
   * @param request XMLHttpRequest对象
   * @param {AxiosResponse} response 返回响应的类型接口
   */
  /* istanbul ignore next */
  constructor(
    message: string,
    config: AxiosRequestConfig,
    code?: string | null,
    request?: any,
    response?: AxiosResponse
  ) {
    super(message)
    this.config = config
    this.code = code
    this.request = request
    this.response = response
    this.isAxiosError = true

    // 这里是为了解决TS中class的一个坑。如果不调用以下方法，类实例化后，外部将无法调用类的成员方法。instanceof也将无法被正确的监测。
    Object.setPrototypeOf(this, AxiosError.prototype)
  }
}

/**
 * 工厂模式
 * @param {string} message 报错信息
 * @param {AxiosRequestConfig} config 请求参数的类型接口
 * @param {string | null} code 错误代码
 * @param request XMLHttpRequest对象
 * @param {AxiosResponse} response 返回响应的类型接口
 * @returns {AxiosError}
 */
export function createError(
  message: string,
  config: AxiosRequestConfig,
  code?: string | null,
  request?: any,
  response?: AxiosResponse
) {
  // 实例化AxiosError类，并且传入自定义参数，最后返回该对象。
  const error = new AxiosError(message, config, code, request, response)
  return error
}
