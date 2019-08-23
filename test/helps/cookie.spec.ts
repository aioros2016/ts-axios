/**
 * @Title: cookie模块单元测试
 * @Author: Lizhigang
 * @Date: 2019-08-23
 * @Last Modified by: Lizhigang
 * @Last Modified time: 2019-08-23
 */
import cookie from '../../src/helps/cookie'

describe('helps:cookie', () => {
  test('should read cookies', () => {
    document.cookie = 'foo=baz'
    expect(cookie.read('foo')).toBe('baz')
  })

  test('should return null if cookie name is not exist', () => {
    document.cookie = 'foo=baz'
    expect(cookie.read('bar')).toBeNull()
  })
})
