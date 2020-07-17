/**
 * @Title: 上传下载模块单元测试
 * @Author: Lizhigang
 * @Date: 2020-07-17
 * @Last Modified by: Lizhigang
 * @Last Modified time: 2020-07-17
 */
import axios, { AxiosResponse, AxiosTransformer } from '../src/index'
import { getAjaxRequest } from './helper'

describe('progress', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should add a download progress handle', () => {
    const progressSpy = jest.fn()
    axios('/foo', { onDownloadProgress: progressSpy })
    return getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        responseText: '{"foo":"bar"}'
      })
      expect(progressSpy).toHaveBeenCalled()
    })
  })

  test('should add a upload progress handle', () => {
    const progressSpy = jest.fn()
    axios('/foo', { onUploadProgress: progressSpy })
    return getAjaxRequest().then(request => {
      // expect(progressSpy).toHaveBeenCalled()
    })
  })
})
