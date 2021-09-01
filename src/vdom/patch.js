export function patch(oldVnode, vnode) {
  if (!oldVnode) {
    return createElm(vnode)
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
function createElm(vnode) {
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
function updateProperties(vnode) {
  let newProps = vnode.data || {} // 属性
  let el = vnode.el // dom元素
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
