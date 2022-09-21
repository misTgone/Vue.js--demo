import { effect } from './effect.js'
import { ref } from './reactive.js'

const obj = { name: 'zcj', age: 24, bol: true }
const proxyObj = ref(obj)
// debugger


const schedulerHandler = (cb) => {
  const arr = []
  let doing = false
  return {
    add(cb) {
      arr.push(cb)

      if(arr.length === 2) {
        this.do()
      }
    },
    do() {
      if(doing) {
        return
      }
      doing = true
      return Promise.resolve(() => {
        arr.forEach(cb => cb())
        arr.length = 0
      }).then(() => doing = false)
    }
  }
}

const handler = schedulerHandler()

effect(() => {
  const div = document.getElementById('app')
  div.innerHTML = proxyObj.age
  console.log('1')
  effect(() => {
    console.log(proxyObj.name)
  })
  console.log('proxyObj.bol', proxyObj.bol)
}, {
  scheduler(effectCb) {
    console.log('effectCb', effectCb)
    handler.add(effectCb)
  }
})

proxyObj.bol = false
// proxyObj.name = 'xxx'
// proxyObj.age = 18
// console.log('proxyObj.name', proxyObj.name)

// 建立响应式
// 条件判断 在某个情况下，之前建立的关系被修改 比如 div.innerHTML = proxyObj.bol ? proxyObj.name : 'xx
// proxyObj.age++ 的情况
// effect嵌套（场景： Vue的组件最后都会在effect里调用，组件常发生父组件嵌套子组件的情况，那么就会发生effect嵌套）
// 自调用函数 scheduler effect(fn) 让fn异步执行


// 条件判断
// 每次effect调用前，先断开之前建立的关系（要记录effectFn和keySet之间的关系），然后重新调用（会再次建立target和effectFn之间的关系）

// effect嵌套
// 当前有啥问题？ 