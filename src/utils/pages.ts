/**
 * Helpers to normalise a document into "page" nodes (each rendered as its own
 * white page, MS Word style). Works on TipTap JSON, which TipTap's setContent
 * can apply safely.
 */

interface JsonNode {
  type: string;
  content?: JsonNode[];
  [k: string]: any;
}

/**
 * Wrap raw blocks / legacy page-breaks into page nodes.
 * - Existing page nodes are preserved.
 * - Legacy pageBreak nodes become page boundaries.
 * - Stray blocks get wrapped into pages.
 * Returns a new document JSON whose top-level content is only `page` nodes.
 */
export function wrapIntoPages(doc: JsonNode): JsonNode {
  const top = doc.content || [];
  const groups: JsonNode[][] = [];
  let current: JsonNode[] = [];

  const flush = () => {
    if (current.length) {
      groups.push(current);
      current = [];
    }
  };

  for (const child of top) {
    if (child.type === "page") {
      flush();
      groups.push([child]);
    } else if (child.type === "pageBreak") {
      flush();
    } else {
      current.push(child);
    }
  }
  flush();

  if (!groups.length) groups.push([]);

  const pages = groups.map((blocks) => ({
    type: "page",
    content: blocks.length ? blocks : [{ type: "paragraph" }],
  }));

  return { ...doc, content: pages };
}

/** Count the number of page nodes in a document JSON. */
export function countPages(doc: JsonNode): number {
  let n = 0;
  const walk = (node: JsonNode) => {
    if (node.type === "page") n++;
    (node.content || []).forEach(walk);
  };
  walk(doc);
  return n;
}
