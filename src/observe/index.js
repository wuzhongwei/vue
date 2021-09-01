import { arrayMethods } from './array'
import Dep from './dep'
class Observe {
  constructor(value) {
    // value.__ob__ = this
    this.dep = new Dep()
    Object.defineProperty(value, '__ob__', {
      value: this,
      enumerable: false, // 不可枚举
      configurable: false, // 不能被删除
    })
    if (Array.isArray(value)) {
      // 数组
      value.__proto__ = arrayMethods
      this.observeArray(value)
    } else {
      // 对象
      this.walk(value)
    }
  }
  observeArray(arr) {
    for (let i = 0; i < arr.length; i++) {
      observe(arr[i])
    }
  }
  walk(data) {
    for (let key in data) {
      defineReactive(data, key, data[key])
    }
  }
}
function dependArray (value) {
  for (let i = 0; i < value.length;i++) {
    let current = value[i]
    current.__ob__ && current.__ob__.dep.depend()
    if (Array.isArray(current)) {
      dependArray(current)
    }
  }
}
export function defineReactive(data, key, value) {
  let childOb = observe(value)
  let dep = new Dep()
  Object.defineProperty(data, key, {
    get() {
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set(newVal) {
      if (newVal !== value) {
        observe(value)
        value = newVal
        dep.notify()
      }
    },
  })
}
export function observe(data) {
  if (typeof data !== 'object' || data == null) {
    return
  }
  if (data.__ob__) return // 防止循环引用
  return new Observe(data)
}
