import { isSameVnode } from "./index"

export function patch(oldVnode, vnode) {
  if (!oldVnode) {
    return createElm(vnode) // 根据虚拟节点创建元素
  }
  const isRealElement = oldVnode.nodeType
  if (isRealElement) {
    // 初次渲染
    const oldElm = oldVnode
    const parentElm = oldElm.parentNode
    let el = createElm(vnode) // 根据虚拟节点创建真实节点
    parentElm.insertBefore(el, oldElm.nextSibling)
    parentElm.removeChild(oldElm)
    return el
  } else {
    //diff算法
    if (oldVnode.tag !== vnode.tag) {
      return oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el)
    }
    if (!oldVnode.tag) {
      if (oldVnode.text !== vnode.text) {
        return oldVnode.el.textContent = vnode.text
      }
    }
    let el = vnode.el = oldVnode.el 
    updateProperties(vnode, oldVnode.data)

    let oldChildren = oldVnode.children || []
    let newChildren = vnode.children || []
    if (oldChildren.length > 0 && newChildren.length>0) {
      updateChildren(el, oldChildren, newChildren)
    } else if (oldChildren.length > 0) {
      el.innerHTML = ''
    }else if (newChildren.length > 0){
      newChildren.forEach(child => el.appendChild(createElm(child)))
    }
  }
}

function updateChildren (parent,oldChildren, newChildren) {
  let oldStartIndex = 0
  let oldEndIndex = oldChildren.length - 1
  let oldStartVnode = oldChildren[0]
  let oldEndVnode = oldChildren[oldEndIndex]

  let newStartIndex = 0
  let newEndIndex = newChildren.length - 1
  let newStartVnode = newChildren[0]
  let newEndVnode = newChildren[newEndIndex]
  while(oldStartIndex <= oldEndIndex && newStartIndex<=newEndIndex) {
    if (isSameVnode(oldStartVnode, newStartVnode)) {
      patch(oldStartVnode, newStartVnode)
      oldStartVnode = oldChildren[++oldStartIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      patch(oldEndVnode, newEndVnode)
      oldEndVnode = oldChildren[--oldEndIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      patch(oldStartVnode, newEndVnode)
      parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling)
      oldStartVnode = oldChildren[++oldStartIndex]
      newEndVnode = newChildren[--newEndIndex]
    }
  }
  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i<=newEndIndex; i++) {
      let nextEle = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex+1].el
      parent.insertBefore(createElm(newChildren[i]), nextEle)
      // parent.appendChild(createElm(newChildren[i]))
    }
  }
}
function updateProperties(vnode, oldProps={}) {
  let newProps = vnode.data || {} // 属性
  let el = vnode.el // dom元素
  for (let key in oldProps) {
    if (!newProps[key]) {
      el.removeAttribute(key)
    }
  }
  let newStyle = newProps.style || {}
  let oldStyle = oldProps.style || {}
  for (let key in oldStyle) {
    if (!newStyle[key]) {
      el.style[key] = ''
    }
  }
  for (let key in newProps) {
    if (key == 'style') {
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName]
      }
    } else if (key === 'class') {
      el.className = newProps.class
    } else {
      el.setAttribute(key, newProps[key])
    }
  }
}

function createComponent (vnode) {
  let i = vnode.data
  if ((i = i.hook) && (i = i.init)) {
    i(vnode)
  }
  if (vnode.componentInstance) {
    return true
  }
  return false
}
export function createElm(vnode) {
  let { tag, children, key, data, text, vm } = vnode
  if (typeof tag === 'string') {
    if (createComponent(vnode)) {
      return vnode.componentInstance.$el
    }



    vnode.el = document.createElement(tag)
    updateProperties(vnode)
    children.forEach((child) => {
      vnode.el.appendChild(createElm(child))
    })
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}
