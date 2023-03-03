import { describe, it, expect } from 'vitest'
import { removePosition } from 'unist-util-remove-position'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { remarkMermaid } from '../lib'

const md = `
Here is a graph

\`\`\`mermaid
graph TD
  A[A] --> B[B]
\`\`\`
`

describe('remark', () => {
  it('should generate ast', () => {
    expect(removePosition(
      unified()
        .use(remarkParse)
        // .use(remarkMermaid, { includeLoading: true })
        .parse(md)
    )).toMatchInlineSnapshot(`
      {
        "children": [
          {
            "children": [
              {
                "position": undefined,
                "type": "text",
                "value": "Here is a graph",
              },
            ],
            "position": undefined,
            "type": "paragraph",
          },
          {
            "lang": "mermaid",
            "meta": null,
            "position": undefined,
            "type": "code",
            "value": "graph TD
        A[A] --> B[B]",
          },
        ],
        "position": undefined,
        "type": "root",
      }
    `)
  })

  it('should generate code', () => {
    const toHtml = unified()
      .use(remarkParse)
      .use(remarkMermaid, { includeLoading: true })
      .use(remarkRehype)
      .use(rehypeStringify)

    expect(toHtml.processSync(md).toString()).toMatchInlineSnapshot('"<p>Here is a graph</p>"')
  })
})