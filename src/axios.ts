/**
 * @Title: 创建Axios实例
 * @Author: Lizhigang
 * @Date: 2019-07-03
 * @Last Modified by: Lizhigang
 * @Last Modified time: 2019-07-15
 */

import { AxiosRequestConfig, AxiosStatic } from './types'
import Axios from './core/Axios'
import { extend } from './helps/util'
import defaults from './defaults'
import mergConfig from './core/mergeConfig'
import CancelToken from './cancel/CancelToken'
import Cancel, { isCancel } from './cancel/Cancel'

/**
 * 创建Axios实例
 */
function createInstance(config: AxiosRequestConfig): AxiosStatic {
  // 创建Axios实例并传入默认配置项
  const context = new Axios(config)

  // 定义instance变量，并赋值Axios原型链上的request方法，最后将其this指向创建的Axios实例。
  const instance = Axios.prototype.request.bind(context)

  // 将Axios实例中所有的实例属性都copy至instance对象中，并且返回instance对象。
  extend(instance, context)
  return instance as AxiosStatic
}

const axios = createInstance(defaults)

axios.create = function(config) {
  return createInstance(mergConfig(defaults, config))
}

axios.cancelToken = CancelToken
axios.cancel = Cancel
axios.isCancel = isCancel
axios.all = function(promises) {
  return Promise.all(promises)
}
axios.spread = function(callback) {
  return function(arr) {
    return callback.apply(null, arr)
  }
}

axios.Axios = Axios

export default axios
