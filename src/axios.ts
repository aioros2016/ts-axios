/**
 * @Title: 创建Axios实例
 * @Author: Lizhigang
 * @Date: 2019-07-03
 * @Last Modified by: Lizhigang
 * @Last Modified time: 2019-07-03
 */

import { AxiosInstance, AxiosRequestConfig } from './types'
import Axios from './core/Axios'
import {extend} from './helps/util'
import defaults from './defaults'

/**
 * 创建Axios实例
 */
function createInstance(config: AxiosRequestConfig): AxiosInstance {

  // 创建Axios实例
  const context = new Axios(config);

  // 定义instance变量，并赋值Axios原型链上的request方法，最后将其this指向创建的Axios实例。
  const instance = Axios.prototype.request.bind(context);

  // 将Axios实例中所有的实例属性都copy至instance对象中，并且返回instance对象。
  extend(instance, context);
  return instance as AxiosInstance;
}

const axios = createInstance(defaults);

export default axios;
