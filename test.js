function fn() {
  console.log('xxx')
}
const p2 = new Proxy(fn, {
  // 使用 apply 拦截函数调用
  apply(target, thisArg, argArray) {
    console.log(target, thisArg, argArray)
    target.call(thisArg, ...argArray)
  }
})

p2('hcy') // 输出：'我是：hcy'


console.log(
  JSON.stringify({ a: 123, b: { c: () => { } } }, null, 2)
)