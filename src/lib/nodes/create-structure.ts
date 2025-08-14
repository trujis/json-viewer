import { NodeOrientation, NodeType } from "@/src/components/store/node-type"
import { Edge, Node } from "@xyflow/react"

let lastNodeId = 0
export type CreateStructureProps = {
  obj: any
  parentId?: string
  level: number
  key?: string | number
  orientation: NodeOrientation
  nodes: Node<NodeType>[]
  edges: Edge[]
}

export function createStructure({
  obj,
  parentId,
  level,
  key,
  orientation,
  nodes,
  edges,
}: CreateStructureProps) {
  //   console.log(`ParentId: ${parentId}`, { key, parentId, lastNodeId })
  if (obj) {
    let hasChildren = false
    const isHorizontal = orientation === NodeOrientation.horizontal
    lastNodeId += 1
    const currentNodeId = `node-${lastNodeId}`
    const keys = Object.keys(obj)
    const content: string[] = []

    // content.push(`ID: ${currentNodeId}`)
    for (const key of keys) {
      const label = formatKeyValue(key, obj[key])
      content.push(label)
      hasChildren =
        Array.isArray(obj[key]) ||
        (typeof obj[key] === "object" && obj[key] !== null)
    }

    const randomizedXPositionFixed = isHorizontal ? 100 : 20
    const randomizedYPositionFixed = isHorizontal ? 20 : 80

    // Create node
    const node: Node<NodeType> = {
      id: currentNodeId,
      type: "objectNode",
      data: {
        content,
        orientation,
        hasParent: parentId !== undefined,
        hasChildren,
        level,
        parentId,
        randomizedPosition: {
          x: Math.floor(Math.random() * 20) + randomizedXPositionFixed,
          y: Math.floor(Math.random() * 20) + randomizedYPositionFixed,
        },
      },
      position: { x: 0, y: 0 },
    }

    // set({ nodes: [...get().nodes, node] })
    nodes.push(node)

    // Create edge from parent if exists
    if (parentId) {
      const edge: Edge = {
        id: `edge-${parentId}-${currentNodeId}`,
        source: parentId,
        target: currentNodeId,
        data: {
          label: key,
        },
        type: "customEdge",
        animated: false,
      }
      edges.push(edge)
    }

    keys.forEach((key, index) => {
      const isArrayOfObjects =
        Array.isArray(obj[key]) &&
        obj[key].every((item) => typeof item === "object")

      if (isArrayOfObjects) {
        obj[key].forEach((arrObj: any, idx: number) => {
          createStructure({
            obj: arrObj,
            parentId: currentNodeId,
            level: level + 1,
            key,
            orientation,
            nodes,
            edges,
          })
        })
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        createStructure({
          obj: obj[key],
          parentId: currentNodeId,
          level: level + 1,
          key,
          orientation,
          nodes,
          edges,
        })
      }
    })
  }
}

const formatKeyValue = (key: string, obj: any) => {
  const label = formatValue(obj)

  if (Number(key) >= 0 && label) return label
  if (label) return `${key}: ${label}`

  return `${key}`
}

const formatValue = (value: any): string => {
  if (value === null) return "null"
  if (value === undefined) return "undefined"
  if (typeof value === "string") return `${value}`
  if (typeof value === "boolean") return value.toString()
  if (typeof value === "number") return value.toString()
  if (Array.isArray(value)) return `[${value.length} items]`
  if (typeof value === "object") return `{${Object.keys(value).length} keys}`
  return String(value)
}
