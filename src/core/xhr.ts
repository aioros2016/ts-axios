/**
 * @Title: XMLHttpRequest程序模块，也是整个库的核心部分。
 * @Author: Lizhigang
 * @Date: 2019-06-27
 * @Last Modified by: Lizhigang
 * @Last Modified time: 2019-07-16
 */

import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helps/headers'
import { createError } from '../helps/error'

/**
 * XMLHttpRequest主程序
 * @param {AxiosRequestConfig} config 传入参数的类型接口
 * @returns {AxiosPromise} 返回响应的类型接口
 */
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { url, method = 'get', data = null, headers, responseType, timeout, cancelToken } = config

    // 实例化XMLHttpRequest对象
    const request = new XMLHttpRequest()
    if (responseType) {
      // 如果有传入响应类型，就设置传入的响应类型
      request.responseType = responseType
    }
    if (timeout) {
      // 如果有传入响应超时，就设置传入的响应超时
      request.timeout = timeout
    }

    // 定义请求的类型、url以及是否异步处理请求
    request.open(method.toUpperCase(), url!, true)

    /**
     * 监听readyState变化的回调函数。当readyState不等于4或status等于0的时候，直接终止回调。
     */
    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) return
      if (request.status === 0) return

      // 获取响应头信息，如没有则返回null。
      const responseHeaders = parseHeaders(request.getAllResponseHeaders())

      // 定义返回响应的数据类型
      const responseData = responseType !== 'text' ? request.response : request.responseText
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      handleResponse(response)
    }
    // 当请求失败时执行的回调
    request.onerror = function handleError() {
      reject(createError('Network Error', config, null, request))
    }

    // 当请求超时时执行的回调
    request.ontimeout = function handleTimeout() {
      reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
    }

    // 遍历请求头，如果data为null，删除请求头中的content-type，并且设置请求头。
    Object.keys(headers).forEach(name => {
      if (data === null && name.toLocaleLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })

    if (cancelToken) {
      cancelToken.promise.then(reason => {
        request.abort()
        reject(reason)
      })
    }

    // 向服务器发送请求
    request.send(data)

    /**
     * 处理返回响应的逻辑，如果status在200-299之间，即成功resolve响应，否则抛出相应错误提示。
     * @param {AxiosResponse} response
     */
    function handleResponse(response: AxiosResponse): void {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        reject(
          createError(
            `request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }
  })
}
