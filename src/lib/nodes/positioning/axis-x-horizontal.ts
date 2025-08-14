import { NodeType } from "@/components/store/node-type"
import { Node } from "@xyflow/react"

export function onSetXAxisHorizontal({
  originalNodes,
  newNodesChanged,
}: {
  originalNodes: Node<NodeType>[]
  newNodesChanged: Node<NodeType>[]
}) {
  newNodesChanged.forEach((newNodeChanged) => {
    const parentId = newNodeChanged.data!.parentId
    const oldNode = originalNodes.find((node) => node.id === newNodeChanged.id)

    if (parentId !== null) {
      const parentNode = newNodesChanged.find((n) => n.id === parentId)

      if (parentNode) {
        newNodeChanged.position.x =
          parentNode.position.x +
          (parentNode.measured?.width || 0) +
          newNodeChanged.data.randomizedPosition.x
      }
    } else if (oldNode) {
      newNodeChanged.position.x = oldNode.position.x
    }
  })
}
