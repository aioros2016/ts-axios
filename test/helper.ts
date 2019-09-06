/**
 * @Title: 单元测试辅助方法
 * @Author: Lizhigang
 * @Date: 2019-09-05
 * @Last Modified by: Lizhigang
 * @Last Modified time: 2019-09-05
 */

export function getAjaxRequest(): Promise<JasmineAjaxRequest> {
  return new Promise(function(resolve) {
    setTimeout(() => {
      return resolve(jasmine.Ajax.requests.mostRecent())
    })
  })
}
