import { popTarget, pushTarget } from "./dep"
import { queueWatcher } from "./schedular"

let id = 0
class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm
    this.cb = cb
    this.options = options
    this.id = id++
    this.getter = exprOrFn
    this.deps = []
    this.depsId = new Set()
    this.get()
  }
  get () {
    pushTarget(this)
    this.getter()
    popTarget()
  }
  addDep (dep) {
    let id = dep.id
    if (!this.depsId.has(id)) {
      this.depsId.add(id)
      this.deps.push(dep)
      dep.addSub(this)
    }
  }
  run () {
    this.get()
  }
  update () {
    // this.get()
    queueWatcher(this)
  }
}

export default Watcher
