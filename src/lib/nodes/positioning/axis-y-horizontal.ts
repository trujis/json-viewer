import { NodeType } from "@/components/store/node-type"
import { Node } from "@xyflow/react"

export function onSetYAxisHorizontal({
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
      .sort((a, b) => a.position.y - b.position.y)
    let lastBottom = 0

    // console.log(`Level ${level}`, {nodesLevel})
    if (idx > 0) {
      nodesLevel.forEach((nodeLevel) => {
        // console.log(nodeLevel.id, lastBottom, `H: ${nodeLevel.measured?.height}`)
        if (nodeLevel.measured?.height) {
          const oldNode = originalNodes.find((node) => node.id === nodeLevel.id)
          const children = newNodesChanged
            .filter((node) => node.data!.parentId === nodeLevel.id)
            .sort((a, b) => a.position.y - b.position.y)

          if (children.length > 0) {
            const top = children[0].position.y
            const bottom =
              children[children.length - 1].position.y +
              (children[children.length - 1].measured?.height || 0)

            const newPosition =
              top +
              (bottom - top) / 2 -
              (nodeLevel.measured?.height > 0
                ? nodeLevel.measured!.height! / 2
                : 0)
            // const newPosition = (bottom-top) - nodeLevel.measured?.height > 0 ? nodeLevel.measured!.height!/2 : 0

            // console.log(`   ID: ${nodeLevel.id}, ChildTop: ${top}, ChildBottom: ${bottom}. OriginalY: ${nodeLevel.position.y} NewPOS: ${newPosition}.`, {top, bottom, h: nodeLevel.measured?.height})
            nodeLevel.position.y = newPosition
            lastBottom = Math.max(lastBottom, bottom)
          } else {
            nodeLevel.position.y = lastBottom + 20
            lastBottom = Math.max(
              lastBottom,
              nodeLevel.position.y + nodeLevel.measured.height
            )
          }
        }
      })
    } else if (nodesLevel.length > 0) {
      nodesLevel.forEach((nodeLevel) => {
        const oldNode = originalNodes.find((node) => node.id === nodeLevel.id)

        nodeLevel.position.y = lastBottom + nodeLevel.data.randomizedPosition.y

        lastBottom = nodeLevel.position.y + (nodeLevel.measured?.height || 0)

        // console.log(`ID ${nodeLevel.id}. ${oldNode.position.y} -> ${nodeLevel.position.y}. LastBottom ${lastBottom}`)
      })
    }
  })

  levels.forEach((level) => {
    const nodesLevel = newNodesChanged
      .filter((node) => node.data!.level === level)
      .sort((a, b) => a.position.y - b.position.y)
    let minY = 0

    nodesLevel.forEach((nodeLevel) => {
      if (minY > nodeLevel.position.y) {
        const yAdded =
          minY + nodeLevel.data.randomizedPosition.y - nodeLevel.position.y
        nodeLevel.position.y += yAdded
        addYPositionOnChildren(nodeLevel, newNodesChanged, yAdded)
      }

      minY = nodeLevel.position.y + (nodeLevel.measured?.height || 0)
    })
  })
}

function addYPositionOnChildren(
  node: Node<NodeType>,
  allNodes: Node<NodeType>[],
  yAdded: number
) {
  if (node.data.hasChildren) {
    const children = allNodes.filter((n) => n.data!.parentId === node.id)

    if (children && children.length > 0) {
      children.forEach((cNode) => {
        cNode.position.y += yAdded
        addYPositionOnChildren(cNode, allNodes, yAdded)
      })
    }
  }
}
