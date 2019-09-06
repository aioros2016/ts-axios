/**
 * @Title: XMLHttpRequest程序模块，也是整个库的核心部分。
 * @Author: Lizhigang
 * @Date: 2019-06-27
 * @Last Modified by: Lizhigang
 * @Last Modified time: 2019-08-21
 */

import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helps/headers'
import { createError } from '../helps/error'
import { isURLSameOrigin } from '../helps/url'
import cookie from '../helps/cookie'
import { isFormData } from '../helps/util'

/**
 * XMLHttpRequest主程序
 * @param {AxiosRequestConfig} config 传入参数的类型接口
 * @returns {AxiosPromise} 返回响应的类型接口
 */
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      url,
      method = 'get',
      data = null,
      headers = {},
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
      auth,
      validateStatus
    } = config

    // 实例化XMLHttpRequest对象
    const request = new XMLHttpRequest()

    // 定义请求的类型、url以及是否异步处理请求
    request.open(method.toUpperCase(), url!, true)

    // 配置request对象
    configureRequest()

    // 为request对象添加事件处理函数
    addEvent()

    // 处理request对象中的请求头数据
    processHeaders()

    // 处理request对象中的请求取消逻辑
    processCancel()

    // 向服务器发送请求
    request.send(data)

    /**
     * 配置request对象函数
     */
    function configureRequest(): void {
      if (responseType) {
        // 如果有传入响应类型，就设置传入的响应类型。
        request.responseType = responseType
      }
      if (timeout) {
        // 如果有传入响应超时，就设置传入的响应超时。
        request.timeout = timeout
      }

      if (withCredentials) {
        // 如果允许传入跨域请求下的cookie，withCredentials设置为true。
        request.withCredentials = withCredentials
      }
    }

    /**
     * 为request对象添加事件处理函数
     */
    function addEvent(): void {
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

      if (onDownloadProgress) {
        // 监听请求下载进度
        request.onprogress = onDownloadProgress
      }

      if (onUploadProgress) {
        // 监听附件上传进度
        request.upload.onprogress = onUploadProgress
      }
    }

    /**
     * 处理request对象中的请求头数据函数
     */
    function processHeaders(): void {
      if (isFormData(data)) {
        delete headers['Content-Type']
      }

      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
        // 如果允许传入跨域请求下的cookie或符合同源策略并且设置了需要读取的cookie，将此cookie赋值给响应头中的对应属性。
        const xsrfValue = cookie.read(xsrfCookieName)
        if (xsrfValue && xsrfHeaderName) {
          headers[xsrfHeaderName] = xsrfValue
        }
      }

      if (auth) {
        headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)
      }

      // 遍历请求头，如果data为null，删除请求头中的content-type，并且设置请求头。
      Object.keys(headers).forEach(name => {
        if (data === null && name.toLocaleLowerCase() === 'content-type') {
          delete headers[name]
        } else {
          request.setRequestHeader(name, headers[name])
        }
      })
    }

    /**
     * 处理request对象中的请求取消逻辑函数
     */
    function processCancel(): void {
      if (cancelToken) {
        cancelToken.promise.then(reason => {
          request.abort()
          reject(reason)
        })
      }
    }

    /**
     * 处理返回响应的逻辑，如果status在200-299之间，即成功resolve响应，否则抛出相应错误提示。
     * @param {AxiosResponse} response
     */
    function handleResponse(response: AxiosResponse): void {
      if (!validateStatus || validateStatus(response.status)) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
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
