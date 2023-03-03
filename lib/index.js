/**
 * @typedef {import('mdast').Root} MdastRoot
 * @typedef {import('mdast').HTML} HTMLContent
 * @typedef {import('./class-option').Options} Options
 */

import { visit } from 'unist-util-visit'

/**
 * 
 * @param {string} contents 
 * @param {boolean} includeLoading
 * @returns {HTMLContent}
 */
function createMermaidDiv(contents, includeLoading) {
  return {
    type: 'html',
    value: `<div class="mermaid${includeLoading ? ' loading' : ''}">
    ${contents}
  </div>`,
  }
}

/**
 * 
 * @param {MdastRoot} ast 
 * @param {boolean} includeLoading
 * @returns 
 */
function visitCodeBlock(ast, includeLoading) {
  return visit(
    ast,
    'code',
    (node, index, parent) => {
    const { lang, value } = node
    if (lang !== 'mermaid')
      return

    const newNode = createMermaidDiv(value, includeLoading)
    parent && index !== null && parent.children.splice(index, 1, newNode)
  })
}

/** @type {import('unified').Plugin<[Options?] | void[], MdastRoot>} */
export function remarkMermaid(options = {}) {
  const { includeLoading = false } = options
  return function transformer(ast, vFile, next) {
    visitCodeBlock(ast, includeLoading)
    if (typeof next === 'function')
      return next(null, ast, vFile)
    return ast
  }
}
