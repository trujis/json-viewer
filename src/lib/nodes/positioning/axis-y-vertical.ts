import { NodeType } from "@/components/store/node-type"
import { Node } from "@xyflow/react"

export function onSetYAxisVertical({
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
        newNodeChanged.position.y =
          parentNode.position.y +
          (parentNode.measured?.height || 0) +
          newNodeChanged.data.randomizedPosition.y
      }
    } else if (oldNode) {
      newNodeChanged.position.y = oldNode.position.y
    }
  })
}
