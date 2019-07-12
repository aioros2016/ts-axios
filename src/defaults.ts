/**
 * @Title: Axios默认配置文件
 * @Author: Lizhigang
 * @Date: 2019-07-12
 * @Last Modified by: Lizhigang
 * @Last Modified time: 2019-07-12
 */
import { AxiosRequestConfig } from './types'

const defaults: AxiosRequestConfig = {
  method: 'get',
  timeout: 0,
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  }
};

const methodsNoData = ['delete', 'get', 'head', 'options'];
methodsNoData.forEach(method => {
  defaults.headers[method] = {};
});

const methodsWithData = ['post', 'put', 'patch'];
methodsWithData.forEach(method => {
  defaults.headers[method] = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };
});

export default defaults;
