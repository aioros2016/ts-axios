/**
 * @Title: Axios默认配置文件
 * @Author: Lizhigang
 * @Date: 2019-07-12
 * @Last Modified by: Lizhigang
 * @Last Modified time: 2019-08-19
 */
import { AxiosRequestConfig } from './types'
import { processHeaders } from './helps/headers'
import { transformRequest, transformResponse } from './helps/data'

// 请求默认配置
const defaults: AxiosRequestConfig = {
  method: 'get',
  timeout: 0,
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  },
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  transformRequest: [
    function(data: any, headers: any): any {
      processHeaders(headers, data)
      return transformRequest(data)
    }
  ],
  transformResponse: [
    function(data: any): any {
      return transformResponse(data)
    }
  ]
}

// 不带requestData的请求类型，默认配置的请求头中不做任何设置
const methodsNoData = ['delete', 'get', 'head', 'options']
methodsNoData.forEach(method => {
  defaults.headers[method] = {}
})

// 带有requestData的请求类型，默认配置的请求头中设置Content-Type属性
const methodsWithData = ['post', 'put', 'patch']
methodsWithData.forEach(method => {
  defaults.headers[method] = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export default defaults
