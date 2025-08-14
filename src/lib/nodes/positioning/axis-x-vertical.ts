import { NodeType } from "@/components/store/node-type"
import { Node } from "@xyflow/react"

export function onSetXAxisVertical({
  originalNodes,
  newNodesChanged,
}: {
  originalNodes: Node<NodeType>[]
  newNodesChanged: Node<NodeType>[]
}) {
  const uniqueLevels = [
    ...new Set(newNodesChanged.map((node) => node.data!.level!)),
  ]
  const levels = uniqueLevels.sort((a, b) => a - b)
  const levelsReversed = uniqueLevels.sort((a, b) => b - a)

  levelsReversed.forEach((level, idx) => {
    const nodesLevel = newNodesChanged
      .filter((node) => node.data!.level === level)
      .sort((a, b) => a.position.x - b.position.x)
    let lastRight = 0

    // console.log(`Level ${level}`, {nodesLevel})
    if (idx > 0) {
      nodesLevel.forEach((nodeLevel) => {
        // console.log(nodeLevel.id, lastBottom, `H: ${nodeLevel.measured?.height}`)
        if (nodeLevel.measured?.height) {
          const oldNode = originalNodes.find((node) => node.id === nodeLevel.id)
          const children = newNodesChanged
            .filter((node) => node.data!.parentId === nodeLevel.id)
            .sort((a, b) => a.position.x - b.position.x)

          if (children.length > 0) {
            const childrenLeft = children[0].position.x
            const childrenRight =
              children[children.length - 1].position.x +
              (children[children.length - 1].measured?.width || 0)

            let newPosition =
              childrenLeft +
              (childrenRight - childrenLeft) / 2 -
              ((nodeLevel.measured.width || 0) > 0
                ? nodeLevel.measured!.width! / 2
                : 0)
            // console.log(`ID ${nodeLevel.id} ${childrenLeft} ${childrenRight} - ${newPosition} ${newPosition+(nodeLevel.measured?.width || 0)}`)

            nodeLevel.position.x = newPosition
            lastRight = Math.max(lastRight, childrenRight)
          } else {
            nodeLevel.position.x = lastRight + 20
            lastRight = Math.max(
              lastRight,
              nodeLevel.position.x + (nodeLevel.measured.width || 0)
            )
          }
        }
      })
    } else if (nodesLevel.length > 0) {
      nodesLevel.forEach((nodeLevel) => {
        const oldNode = originalNodes.find((node) => node.id === nodeLevel.id)

        nodeLevel.position.x = lastRight + nodeLevel.data.randomizedPosition.x

        lastRight = nodeLevel.position.x + (nodeLevel.measured?.width || 0)

        // console.log(`ID ${nodeLevel.id}. ${oldNode.position.y} -> ${nodeLevel.position.y}. LastBottom ${lastBottom}`)
      })
    }
  })

  levels.forEach((level) => {
    const nodesLevel = newNodesChanged
      .filter((node) => node.data!.level === level)
      .sort((a, b) => a.position.x - b.position.x)
    let minX = 0

    nodesLevel.forEach((nodeLevel) => {
      if (minX > nodeLevel.position.x) {
        const xAdded =
          minX + nodeLevel.data.randomizedPosition.x - nodeLevel.position.x
        nodeLevel.position.x += xAdded
        addXPositionOnChildren(nodeLevel, newNodesChanged, xAdded)
      }

      minX = nodeLevel.position.x + (nodeLevel.measured?.width || 0)
    })
  })
}

function addXPositionOnChildren(
  node: Node<NodeType>,
  allNodes: Node<NodeType>[],
  xAdded: number
) {
  if (node.data.hasChildren) {
    const children = allNodes.filter((n) => n.data!.parentId === node.id)

    if (children && children.length > 0) {
      children.forEach((cNode) => {
        cNode.position.x += xAdded
        addXPositionOnChildren(cNode, allNodes, xAdded)
      })
    }
  }
}
