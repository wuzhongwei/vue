import { parseHTML } from './parse'
import { generate } from './generate'
export function compileToFunctions(template) {
  let ast = parseHTML(template)
  let code = generate(ast)
  let render = `with(this){return ${code}}`
  
  let fn = new Function(render)
  return fn
}
