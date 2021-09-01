import { initGlobalAPI } from './global-api/index'
import { initMixin } from './init'
import { lifecyleMixin } from './lifecycle'
import { renderMixin } from './render'
function Vue(options) {
  this._init(options)
}
initMixin(Vue)
lifecyleMixin(Vue)
renderMixin(Vue)
initGlobalAPI(Vue)

export default Vue