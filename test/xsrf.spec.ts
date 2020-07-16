/**
 * @Title: xsrf业务模块单元测试
 * @Author: Lizhigang
 * @Date: 2020-07-16
 * @Last Modified by: Lizhigang
 * @Last Modified time: 2020-07-16
 */
import axios, { AxiosResponse, AxiosTransformer } from '../src/index'
import { getAjaxRequest } from './helper'

describe('xsrf', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
    document.cookie =
      axios.defaults.xsrfCookieName + '=;expires=' + new Date(Date.now() - 86400000).toUTCString()
  })

  test('should not set xsrf header if cookie is null', () => {
    axios('/foo')
    return getAjaxRequest().then(request => {
      expect(request.requestHeaders[axios.defaults.xsrfHeaderName!]).toBeUndefined()
    })
  })

  test('should set xsrf header if cookie is set', () => {
    document.cookie = axios.defaults.xsrfCookieName + '=12345'
    axios('/foo')
    return getAjaxRequest().then(request => {
      expect(request.requestHeaders[axios.defaults.xsrfHeaderName!]).toBe('12345')
    })
  })

  test('should not set xsrf header for cross origin', () => {
    document.cookie = axios.defaults.xsrfCookieName + '=12345'
    axios('http://example.com/')
    return getAjaxRequest().then(request => {
      expect(request.requestHeaders[axios.defaults.xsrfHeaderName!]).toBeUndefined()
    })
  })

  test('should set xsrf header for cross origin when using withCredentials', () => {
    document.cookie = axios.defaults.xsrfCookieName + '=12345'
    axios('http://example.com/', {
      withCredentials: true
    })
    return getAjaxRequest().then(request => {
      expect(request.requestHeaders[axios.defaults.xsrfHeaderName!]).toBe('12345')
    })
  })
})
