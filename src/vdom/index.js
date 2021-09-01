import { isObject, isReservedTag } from "../util"

export function createElement(vm, tag, data = {}, ...children) {
  if (isReservedTag(tag)) {
    return vnode(vm, tag, data, data.key, children, undefined)
  } else {
    const Ctor = vm.$options.components[tag]
    return createComponent(vm, tag, data, data.key, children, Ctor)
  }
  
}
function createComponent (vm, tag, data, key, children, Ctor) {
  if (isObject(Ctor)) {
    Ctor = vm.$options._base.extend(Ctor)
  }
  data.hook = {
    init (vnode) {
      let child = vnode.componentInstance = new vnode.componentOptions.Ctor({})
      child.$mount()
    }
  }
  return vnode(vm, `vue-component-${Ctor.cid}-${tag}`, data, key, undefined, undefined, {Ctor})
}
export function createTextVnode(vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text)
}
function vnode(vm, tag, data, key, children, text,componentOptions) {
  return {
    vm,
    tag,
    data,
    key,
    children,
    text,
    componentOptions
  }
}
