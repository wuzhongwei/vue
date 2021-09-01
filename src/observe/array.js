const oldArrayProtoMethods = Array.prototype
export const arrayMethods = Object.create(oldArrayProtoMethods)
let methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'reverse', 'sort']
methods.forEach((method) => {
  arrayMethods[method] = function (...params) {
    const result = oldArrayProtoMethods[method].call(this, ...params)
    let inserted
    let ob = this.__ob__
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = params
        break
      case 'splice':
        inserted = params.slice(2)
      default:
        break
    }
    if (inserted) {
      ob.observeArray(inserted)
    }
    ob.dep.notify()
    return result
  }
})
