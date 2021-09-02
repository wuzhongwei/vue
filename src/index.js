import { compileToFunctions } from './compiler/index'
import { initGlobalAPI } from './global-api/index'
import { initMixin } from './init'
import { lifecyleMixin } from './lifecycle'
import { renderMixin } from './render'
import { createElm, patch } from './vdom/patch'
function Vue(options) {
  this._init(options)
}
initMixin(Vue)
lifecyleMixin(Vue)
renderMixin(Vue)
initGlobalAPI(Vue)

let vm1 = new Vue({
  data() {
    return {name: 'zf'}
  }
})

let render1 = compileToFunctions(`<div>
  <li key="A">A</li>
  <li key="B">B</li>
  <li key="C">C</li>
  <li key="D">D</li>
</div>`)
let oldVnode = render1.call(vm1)
let el = createElm(oldVnode)
document.body.appendChild(el)

let vm2= new Vue({
  data() {
    return {name: 'jw'}
  }
})

let render2 = compileToFunctions(`<div>
    <li key="E">E</li>
    <li key="A">A</li>
    <li key="B">B</li>
    <li key="C">C</li>
    <li key="D">D</li>
    
</div>`)
let newVnode = render2.call(vm1)

setTimeout(() => {
  patch(oldVnode, newVnode)
}, 2000)
export default Vue
