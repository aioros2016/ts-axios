/**
 * @Title: 定义Axios类及其成员属性
 * @Author: Lizhigang
 * @Date: 2019-06-27
 * @Last Modified by: Lizhigang
 * @Last Modified time: 2019-07-15
 */

import {
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
  ResolvedFn,
  RejectedFn
} from '../types'
import dispatchRequest from './dispatchRequest'
import InterceptorManager from './InterceptorManager'
import mergeConfig from './mergeConfig'

// 定义接口Interceptors以约束拦截器对象的属性数据类型
interface Interceptors {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
}

// 定义接口PromiseChain以约束promise链中的每个拦截器的数据类型
interface PromiseChain<T> {
  resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise)
  rejected?: RejectedFn
}

export default class Axios {
  // 定义默认配置成员属性
  defaults: AxiosRequestConfig

  // 定义拦截器成员属性
  interceptors: Interceptors

  constructor(initConfig: AxiosRequestConfig) {
    // 初始化默认配置
    this.defaults = initConfig

    // 初始化拦截器对象
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>()
    }
  }

  /**
   * 发起请求主方法，无论什么类型的请求，最终都将调用此方法。
   * @param url 请求地址或包含请求地址的参数对象
   * @param config 请求参数对象或undefined
   */
  request(url: any, config?: any): AxiosPromise {
    if (typeof url === 'string') {
      // 如果传入的url是字符串类型，并且没有传入config。定义config为空对象，并且设置url属性为传入的url。
      if (!config) {
        config = {}
      }
      config.url = url
    } else {
      // 传入的url不是字符串类型，直接将url赋值给config
      config = url
    }

    // 将默认配置与传入的自定义配置项合并
    config = mergeConfig(this.defaults, config)

    // 定义Promise链
    const chain: PromiseChain<any>[] = [
      {
        resolved: dispatchRequest,
        rejected: undefined
      }
    ]

    // 调用request的forEach方法，并将每个拦截器添加到Promise链的最前端
    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor)
    })

    // 调用response的forEach方法，并将每个拦截器添加到Promise链的最后端
    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor)
    })

    // 定义变量，执行Promise.resolve方法，并将config传入。
    let promise = Promise.resolve(config)

    // 遍历Promise链，获取每个拦截器中的成功与失败回调，并将其传入到promise变量的then方法中。
    while (chain.length) {
      const { resolved, rejected } = chain.shift()!
      promise = promise.then(resolved, rejected)
    }
    return promise
  }

  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('get', url, config)
  }

  delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('delete', url, config)
  }

  head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('head', url, config)
  }

  options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('options', url, config)
  }

  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('post', url, data, config)
  }

  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('put', url, data, config)
  }

  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('patch', url, data, config)
  }

  _requestMethodWithoutData(
    method: Method,
    url: string,
    config?: AxiosRequestConfig
  ): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        method: method,
        url
      })
    )
  }

  _requestMethodWithData(
    method: Method,
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        method: method,
        url,
        data
      })
    )
  }
}
