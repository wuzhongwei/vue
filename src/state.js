import { observe } from './observe/index'
export function initState(vm) {
  const opts = vm.$options
  if (opts.data) {
    initData(vm)
  }
}
function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(newVal) {
      vm[source][key] = newVal
    },
  })
}
function initData(vm) {
  // 数据劫持
  let data = vm.$options.data
  data = vm._data = typeof data === 'function' ? data.call(vm) : data
  for (let key in data) {
    proxy(vm, '_data', key)
  }
  observe(data)
}
