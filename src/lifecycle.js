import Watcher from './observe/watcher'

import { patch } from './vdom/patch'
export function lifecyleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this
    vm.$el = patch(vm.$el, vnode)
  }
}
export function callHook (vm,hook) {
  const handlers = vm.$options[hook]
  if (handlers) {
    handlers.forEach(handler => handler.call(vm))
  }
}
export function mountComponent(vm) {
  let updateComonent = () => {
    vm._update(vm._render())
  }
  new Watcher(vm, updateComonent, () => {}, true)
}
