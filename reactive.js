import { activeEffect } from './effect.js'
export let targetEffect = new WeakMap()
export function ref(obj) {
  const proxyObj = new Proxy(obj, {
    get(target, key) {
      // 当前是在某个effect里面引用值
      if (activeEffect) {
        let targetMap
        let keySet
        if (!targetEffect.has(target)) {
          targetEffect.set(target, targetMap = new Map())
        } else {
          targetMap = targetEffect.get(target)
        }
        if (!targetMap.has(key)) {
          targetMap.set(key, keySet = new Set())
        } else {
          keySet = targetMap.get(key)
        }
        keySet.add(activeEffect)
        activeEffect.deps.push(keySet)
      }
      return target[key]
    },
    set(target, key, value) {
      target[key] = value

      // 本意试图避免无限递归循环，但如果这么写，就使得过滤了所有effects
      // if (activeEffect) {
      //   return true
      // }

      let targetMap
      let keySet
      if (targetEffect.has(target)) {
        targetMap = targetEffect.get(target)
        if (targetMap.has(key)) {
          keySet = targetMap.get(key)
          const effectsToRun = new Set()

          keySet.forEach(effect => {
            if(effect !== activeEffect) {
              effectsToRun.add(effect)
            }
          })

          effectsToRun && effectsToRun.forEach(fn => {
            if(fn.options.scheduler) {
              fn.options.scheduler(fn)
            } else {
              fn()
            }
          })
        }
      }
      return true
    }
  })
  return proxyObj
}