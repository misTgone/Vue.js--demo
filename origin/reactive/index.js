import { track } from './track.js'
import { trigger } from './trigger.js'
export const bucket = new WeakMap()
function proxyData(data) {
  const obj = new Proxy(data, {
    // 拦截读取操作
    get(target, key) {
      // 将副作用函数 activeEffect 添加到存储副作用函数的桶中
      track(target, key)
      // 返回属性值
      return target[key]
    },
    // 拦截设置操作
    set(target, key, newVal) {
      // 设置属性值
      target[key] = newVal
      // 把副作用函数从桶里取出并执行
      trigger(target, key)
      return true
    }
  })
  return obj
}

export function ref(data) {
  return proxyData(data)
}