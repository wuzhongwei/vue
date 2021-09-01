import { initState } from './state'
import { compileToFunctions } from './compiler/index'
import { callHook, mountComponent } from './lifecycle'
import { mergeOptions, nextTick } from './util'

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    vm.$options = mergeOptions(vm.constructor.options, options)
    console.log(vm.$options)
    callHook(vm, 'beforeCreate')
    initState(vm)
    callHook(vm, 'created')
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
    
  }
  Vue.prototype.$nextTick = nextTick;
  Vue.prototype.$mount = function (el) {
    el = el && document.querySelector(el)
    const vm = this
    const options = vm.$options
    vm.$el = el

    if (!options.render) {
      let template = options.template
      if (!template && el) {
        template = el.outerHTML
      }
      const render = compileToFunctions(template)
      options.render = render
    }
    mountComponent(vm)
  }
}
