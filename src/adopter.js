import Base from './Base.js'
import * as elements from './elements.js'
import {capitalize} from './helpers.js'
import HtmlNode from './HtmlNode.js'

export function makeInstance (element) {
  if (element instanceof Base) return element

  if (typeof element === 'object') {
    return adopt(element)
  }

  if (element == null) {
    return new Doc()
  }

  if (typeof element === 'string' && element.charAt(0) !== '<') {
    return adopt(document.querySelector(element))
  }

  var node = makeNode('svg')
  node.innerHTML = element

  element = adopt(node.firstElementChild)

  return element
}

// Adopt existing svg elements
export function adopt (node) {
  // check for presence of node
  if (!node) return null

  // make sure a node isn't already adopted
  if (node.instance instanceof Element) return node.instance

  if (!(node instanceof window.SVGElement)) {
    return new HtmlNode(node)
  }

  // initialize variables
  var element

  // adopt with element-specific settings
  if (node.nodeName === 'svg') {
    element = new elements.Doc(node)
  } else if (node.nodeName === 'linearGradient' || node.nodeName === 'radialGradient') {
    element = new elements.Gradient(node)
  } else if (elements[capitalize(node.nodeName)]) {
    element = new elements[capitalize(node.nodeName)](node)
  } else {
    element = new elements.Bare(node)
  }

  return element
}
