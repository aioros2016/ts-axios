/**
 * @Title: TS接口定义文件
 * @Author: Lizhigang
 * @Date: 2019-06-27
 * @Last Modified by: Lizhigang
 * @Last Modified time: 2019-07-02
 */

// 进一步约束Method属性传入的字符内容
import InterceptorManager from '../core/InterceptorManager'

export type Method = 'get' | 'GET'
| 'options' | 'OPTIONS'
| 'post' | 'POST'
| 'delete' | 'DELETE'
| 'put' | 'PUT'
| 'patch' | 'PATCH'
| 'head' | 'HEAD'

// 约束请求中传入参数类型的接口
export interface AxiosRequestConfig {
  url?: string
  method?: Method
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
  timeout?: number
  [propName: string]: any
}

// 约束响应中获取数据类型的接口
export interface AxiosResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: any
}

// 定义接口AxiosPromise继承自TS库中的Promise接口，定义泛型AxiosResponse以约束Promise中返回的数据类型
export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {
}

// 定义接口AxiosError继承自TS库中的Error接口
export interface AxiosError extends Error {
  isAxiosError: boolean
  config: AxiosRequestConfig
  code?: string | null
  request?: any
  response?: AxiosResponse
}

// 定义接口Axios以约束Axios类中的成员属性
export interface Axios {
  defaults: AxiosRequestConfig
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>,
    response: AxiosInterceptorManager<AxiosResponse>
  }
  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
}

// 定义接口AxiosInstance继承自接口Axios，并对2种传参的可能做了重载。
export interface AxiosInstance extends Axios {
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

// 定义接口AxiosInterceptorManager以约束拦截器中的use方法中传入的成功回调与失败回调的类型,以及eject方法的类型。(删除某个拦截器时用)
export interface AxiosInterceptorManager<T> {
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number
  eject(id: number): void
}

// 定义接口ResolvedFn以约束拦截器中成功回调(发送请求前与收到响应后的逻辑)的参数类型与返回类型。
export interface ResolvedFn<T> {
  (val: T): T | Promise<T>
}
// 定义接口RejectedFn以约束拦截器中的失败回调(处理一些请求错误)的参数类型与返回类型。
export interface RejectedFn {
  (error: any): any
}
