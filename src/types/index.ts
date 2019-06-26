export type Method = 'get' | 'GET'
| 'options' | 'OPTIONS'
| 'post' | 'POST'
| 'delete' | 'DELETE'
| 'put' | 'PUT'
| 'patch' | 'PATCH'
| 'head' | 'HEAD'

export interface AxiosRequestConfig {
  url: string
  method?: Method
  data?: any
  params?: any
}
