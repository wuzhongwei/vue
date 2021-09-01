let callbacks = []
let waiting = false
function flushcallbacks () {
  for (let i = 0; i < callbacks.length; i++) {
    let callback = callbacks[i]
    callback()
  }
  waiting = false
  callbacks = []
}

export function nextTick (cb) {
  callbacks.push(cb)
  if (!waiting) {
    waiting = true
    Promise.resolve().then(flushcallbacks)
  }
}
export const isObject = (val) => {
  return typeof val === 'object' && val !== null
}
const strats = {}
const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted'
]
function mergeHook (parentVal, childVal) {
  if (childVal) {
    if (parentVal) {
      return parentVal.concat(childVal)
    } else {
      return [childVal]
    }
  } else {
    return parentVal
  }
}
LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})
strats.components = function (parentVal,childVal) {
  const res = Object.create(parentVal)
  if (childVal) {
    for (let key in childVal) {
      res[key] = childVal[key]
    }
  }
  return res
}
export function mergeOptions (parent, child) {
  const options = {}
  for(let key in parent) {
    mergeField(key)
  }
  for(let key in child) {
    if (!parent.hasOwnProperty(key)) {
      mergeField(key)
    }
  }
  function mergeField (key) {
    if (strats[key]) {
      return options[key] = strats[key](parent[key], child[key])
    }
    if (isObject(parent[key]) && isObject(child[key])) {
      options[key] = {...parent[key], ...child[key]}
    } else {
      if (child[key]) {
        options[key] = child[key]
      } else {
        options[key] = parent[key]
      }
    }
  }
  return options
}

function makeUp (str) {
  const map = {}
  str.split(',').forEach(tagName => {
    map[tagName] = true
  })
  return (tag) => map[tag] || false
}
export const isReservedTag = makeUp('a,p,div,ul,li,span,input,button')
