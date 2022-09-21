export let activeEffect = null
let effectStack = []
export function effect(fn, options) {
  const effectFn = () => {
    cleanDep(effectFn)
    fn()
  }
  effectFn.deps = []
  effectFn.options = options
  activeEffect = effectFn
  effectStack.push(effectFn)
  effectFn()
  effectStack.pop()
  activeEffect = effectStack[effectStack.length - 1]
}

function cleanDep(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    const dep = effectFn.deps[i]
     dep.delete(effectFn)
  }
  effectFn.deps.length = 0
}