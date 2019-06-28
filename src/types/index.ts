/**
 * @Title: TS接口定义文件
 * @Author: Lizhigang
 * @Date: 2019-06-27
 * @Last Modified by: Lizhigang
 * @Last Modified time: 2019-06-28
 **/

// 进一步约束Method属性传入的字符内容
export type Method = 'get' | 'GET'
| 'options' | 'OPTIONS'
| 'post' | 'POST'
| 'delete' | 'DELETE'
| 'put' | 'PUT'
| 'patch' | 'PATCH'
| 'head' | 'HEAD'

// 约束请求中传入参数类型的接口
export interface AxiosRequestConfig {
  url: string
  method?: Method
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
  timeout?: number
}

// 约束响应中获取数据类型的接口
export interface AxiosResponse {
  data: any
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: any
}

// 定义接口AxiosPromise继承自TS库中的Promise接口，定义泛型AxiosResponse以Promise中返回的数据类型
export interface AxiosPromise extends Promise<AxiosResponse> {
}

// 定义接口AxiosError继承自TS库中的Error接口
export interface AxiosError extends Error {
  isAxiosError: boolean
  config: AxiosRequestConfig
  code?: string | null
  request?: any
  response?: AxiosResponse
}