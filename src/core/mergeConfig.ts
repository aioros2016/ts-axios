/**
 * @Title: 合并配置项模块
 * @Author: Lizhigang
 * @Date: 2019-07-12
 * @Last Modified by: Lizhigang
 * @Last Modified time: 2019-07-15
 */
import { AxiosRequestConfig } from '../types'
import { isPlainObject, deepMerge } from '../helps/util'

// 创建一个纯净的空对象，不继承原型链上的其他属性
const strats = Object.create(null)

/**
 * 优先选择自定义配置策略
 * @param val1 默认配置
 * @param val2 自定义配置
 */
function defaultsStrat(val1: any, val2: any): any {
  return typeof val2 !== 'undefined' ? val2 : val1
}

/**
 * 只选择自定义配置策略
 * @param val1 默认配置
 * @param val2 自定义配置
 */
function fromVal2Strat(val1: any, val2: any): any {
  if (val2 !== 'undefined') {
    return val2
  }
}

/**
 * 深拷贝策略
 * @param val1 默认配置
 * @param val2 自定义配置
 */
function deepMergeStrat(val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    // 如果自定义配置是个对象，返回合并后默认配置和自定义配置。
    return deepMerge(val1, val2)
  } else if (typeof val2 !== 'undefined') {
    // 如果自定义配置有值，并且不是个对象，返回自定义配置。
    return val2
  } else if (isPlainObject(val1)) {
    // 如果自定义配置没有值，并且默认配置是个对象，返回深拷贝后的默认配置。
    return deepMerge(val1)
  } else if (typeof val1 !== 'undefined') {
    // 如果自定义配置没有值，并且默认配置不是个对象，返回默认配置。
    return val1
  }
}

// 将stratKeysFromVal2数组中的字段指向只选择自定义配置策略
const stratKeysFromVal2 = ['url', 'params', 'data']
stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2Strat
})

// 将headers字段指向深拷贝策略
const stratKeysDeepMerge = ['headers']
stratKeysDeepMerge.forEach(key => {
  strats[key] = deepMergeStrat
})

/**
 * 合并配置项
 * @param config1 默认配置项
 * @param config2 传入的自定义配置
 */
export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
  // 如果未传入自定义配置，将自定义配置设为空对象
  if (!config2) {
    config2 = {}
  }

  // 创建一个纯净的空对象，不继承原型链上的其他属性
  const config = Object.create(null)

  // 遍历自定义配置，将字段传入合并方法。
  for (let key in config2) {
    mergeField(key)
  }

  // 遍历默认配置，如果该字段在自定义配置中未传入，将字段传入合并方法。
  for (let key in config1) {
    if (!config2[key]) {
      mergeField(key)
    }
  }

  /**
   * 合并方法
   * @param key 传入的请求中的字段
   */
  function mergeField(key: string): void {
    // 合并策略函数
    const strat = strats[key] || defaultsStrat

    // 执行合并策略，得到最终合并后的配置。
    config[key] = strat(config1[key], config2![key])
  }
  return config
}
