export function insertAfter(newNode: Node, referenceNode: Node) {
  referenceNode?.parentNode?.insertBefore(newNode, referenceNode.nextSibling);
}
