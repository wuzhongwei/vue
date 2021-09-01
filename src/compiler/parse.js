const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const startTagClose = /^\s*(\/?)>/


export function parseHTML(html) {
  function createASTElement(tag, attrs) {
    return {
      tag,
      type: 1,
      children: [],
      attrs,
      parent: null,
    }
  }
  let root = null
  let currentParent
  let stack = []
  function start(tagName, attrs) {
    let element = createASTElement(tagName, attrs)
    if (!root) {
      root = element
    }
    currentParent = element
    stack.push(element)
  }
  function end(tagName) {
    let element = stack.pop()
    currentParent = stack[stack.length - 1]

    if (currentParent) {
      element.parent = currentParent
      currentParent.children.push(element)
    }
  }
  function chars(text) {
    text = text.replace(/\s/g, '')
    if (text) {
      currentParent.children.push({
        type: 3,
        text,
      })
    }
  }
  function advance(n) {
    html = html.substring(n)
  }
  function parseStartTag() {
    const start = html.match(startTagOpen)
    if (start) {
      let match = {
        tagName: start[1], // 获取元素
        attrs: [],
      }
      advance(start[0].length)
      // 查找原型
      let end, attr
      // 不是开头标签结尾就一直解析
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        advance(attr[0].length)
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5] || true,
        })
      }
      if (end) {
        advance(end[0].length)
        return match
      }
    }
  }
  while (html) {
    let textEnd = html.indexOf('<')
    if (textEnd === 0) {
      let startTagMatch = parseStartTag()
      if (startTagMatch) {
        // 开始标签
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }
      // 结束标签
      let endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
        continue
      }
    }
    let text
    if (textEnd > 0) {
      // 开始解析文本
      text = html.substring(0, textEnd)
    }
    if (text) {
      advance(text.length)
      chars(text)
    }
  }
  return root
}
