/**
 * @Title: error模块单元测试
 * @Author: Lizhigang
 * @Date: 2019-08-23
 * @Last Modified by: Lizhigang
 * @Last Modified time: 2019-08-23
 */
import { createError } from '../../src/helps/error'
import { AxiosRequestConfig, AxiosResponse } from '../../src/types'
import instantiate = WebAssembly.instantiate

describe('helps:error', () => {
  test('should create an error with message, config, code, request, response and isAxiosError', () => {
    const request = new XMLHttpRequest()
    const config: AxiosRequestConfig = { method: 'post' }
    const response: AxiosResponse = {
      status: 200,
      statusText: 'OK',
      headers: null,
      request,
      config,
      data: { foo: 'bar' }
    }
    const error = createError('Error', config, 'something', request, response)
    expect(error instanceof Error).toBeTruthy()
    expect(error.message).toBe('Error')
    expect(error.config).toBe(config)
    expect(error.code).toBe('something')
    expect(error.request).toBe(request)
    expect(error.response).toBe(response)
    expect(error.isAxiosError).toBeTruthy()
  })
})
