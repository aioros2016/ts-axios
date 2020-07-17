/**
 * @Title: 静态方法模块单元测试
 * @Author: Lizhigang
 * @Date: 2020-07-17
 * @Last Modified by: Lizhigang
 * @Last Modified time: 2020-07-17
 */
import axios, { AxiosResponse, AxiosTransformer } from '../src/index'
import { getAjaxRequest } from './helper'

describe('static', () => {
  test('should support all', done => {
    let fulfilled = false
    axios.all([true, false]).then(arg => {
      fulfilled = arg[0]
    })
    setTimeout(() => {
      expect(fulfilled).toBeTruthy()
      done()
    }, 100)
  })

  test('should support spread', done => {
    let sum = 0
    let fulfilled = false
    let result: any
    axios
      .all([123, 456])
      .then(
        axios.spread((a, b) => {
          sum = a + b
          fulfilled = true
          return 'hello world'
        })
      )
      .then(res => {
        result = res
      })
    setTimeout(() => {
      expect(sum).toBe(123 + 456)
      expect(fulfilled).toBeTruthy()
      expect(result).toBe('hello world')
      done()
    }, 100)
  })
})
