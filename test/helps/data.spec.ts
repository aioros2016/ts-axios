/**
 * @Title: data模块单元测试
 * @Author: Lizhigang
 * @Date: 2019-08-23
 * @Last Modified by: Lizhigang
 * @Last Modified time: 2019-08-23
 */

import { transformRequest, transformResponse } from '../../src/helps/data'

describe('helps:data', () => {
  describe('transformRequest', () => {
    test('should transform request data to string if data is a plainObject', () => {
      const a = { b: 1 }
      expect(transformRequest(a)).toBe('{"b":1}')
    })

    test('should do noting if data is not a plainObject', () => {
      const a = new URLSearchParams('a=b')
      expect(transformRequest(a)).toBe(a)
    })
  })

  describe('transformResponse', () => {
    test('should transform response data is a string but not a JSON string', () => {
      const a = '{"b":1}'
      expect(transformResponse(a)).toEqual({ b: 1 })
    })

    test('should do noting if data is a string but not a JSON string', () => {
      const a = '{b:1}'
      expect(transformResponse(a)).toBe('{b:1}')
    })

    test('should do noting if data is not a string', () => {
      const a = { b: 1 }
      expect(transformResponse(a)).toBe(a)
    })
  })
})
