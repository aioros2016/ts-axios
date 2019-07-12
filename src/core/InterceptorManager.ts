/**
 * @Title: 拦截器管理器模块
 * @Author: Lizhigang
 * @Date: 2019-07-04
 * @Last Modified by: Lizhigang
 * @Last Modified time: 2019-07-04
 */

import {ResolvedFn, RejectedFn} from '../types'

interface Interceptor<T> {
  resolved: ResolvedFn<T>
  rejected?: RejectedFn
}

// 拦截器管理类
export default class InterceptorManager<T> {

  // 拦截器存储数组，存储所有创建的拦截器
  private interceptors: Array<Interceptor<T> | null>
  constructor() {

    // 初始化时将拦截器存储数组置空
    this.interceptors = [];
  }

  /**
   * 创建拦截器，用于创建拦截器并将其存入截器存储数组
   * @param resolved 拦截器中的成功回调，用于处理发送请求前的逻辑
   * @param rejected 拦截器中的失败回调，用于处理一些请求错误
   */
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
    this.interceptors.push({
      resolved,
      rejected
    })
    return this.interceptors.length - 1;
  }

  /**
   * 删除某个拦截器
   * @param id 拦截器的id，对应use方法返回的number类型。
   */
  eject(id: number): void {
    if(this.interceptors[id]) {
      this.interceptors[id] = null;
    }
  }

  /**
   * 遍历拦截器数组，并且将拦截器数组中的每个不为null的拦截器，传入外部的回调。
   * @param fn 外部传入的回调
   */
  forEach(fn: (interceptor: Interceptor<T>) => void): void {
    this.interceptors.forEach(interceptor => {
      if (interceptor !== null) {
        fn(interceptor);
      }
    })
  }
}
