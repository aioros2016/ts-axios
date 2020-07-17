/**
 * @Title: HTTP授权模块单元测试
 * @Author: Lizhigang
 * @Date: 2020-07-17
 * @Last Modified by: Lizhigang
 * @Last Modified time: 2020-07-17
 */
import axios, { AxiosResponse, AxiosTransformer } from '../src/index'
import { getAjaxRequest } from './helper'

describe('auth', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should accept HTTP Basic auth with username/password', () => {
    axios('/foo', {
      auth: {
        username: 'Aioros',
        password: '110110'
      }
    })
    return getAjaxRequest().then(request => {
      expect(request.requestHeaders['Authorization']).toBe('Basic QWlvcm9zOjExMDExMA==')
    })
  })

  test('should fail to encode HTTP Basic auth credentials with non-latin1 characters', () => {
    axios('/foo', {
      auth: {
        username: 'Aiorأخبار',
        password: '110110'
      }
    })
      .then(() => {
        throw new Error(
          'Should not succeed to make a HTTP Basic auth request with non-latin1 chars in credentials'
        )
      })
      .catch(err => {
        expect(/character/i.test(err.message)).toBeTruthy()
      })
  })
})
