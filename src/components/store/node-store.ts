import { create } from "zustand"
import {
  applyEdgeChanges,
  applyNodeChanges,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  ReactFlowInstance,
} from "@xyflow/react"
import { NodeOrientation, NodeType } from "@/src/components/store/node-type"
import { onSetXAxisHorizontal } from "@/src/lib/nodes/positioning/axis-x-horizontal"
import { onSetYAxisVertical } from "@/src/lib/nodes/positioning/axis-y-vertical"
import { onSetYAxisHorizontal } from "@/src/lib/nodes/positioning/axis-y-horizontal"
import { onSetXAxisVertical } from "@/src/lib/nodes/positioning/axis-x-vertical"
import { createStructure } from "@/src/lib/nodes/create-structure"

type NodeStoreProps = {
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  originalData?: any
  nodes: Node<NodeType>[]
  edges: Edge[]
  orientation: NodeOrientation
  switchOrientation: () => void
  onNodesChange: (edges: NodeChange<Node<NodeType>>[]) => void
  onEdgesChange: (edges: EdgeChange<Edge>[]) => void
  updateJson: (jsonData: any) => void
  loadNodes: () => void
  fitView: () => void
  setReactFlowInstance: (
    reactFlowInstance: ReactFlowInstance<Node<NodeType>>
  ) => void
  reactFlowInstance?: ReactFlowInstance<Node<NodeType>>
}

export const useNodeStore = create<NodeStoreProps>((set, get) => ({
  isLoading: true,
  originalData: undefined,
  reactFlowInstance: undefined,
  nodes: [],
  edges: [],
  orientation: NodeOrientation.horizontal,
  setIsLoading: (isLoading: boolean) => {
    set({ isLoading })
  },
  updateJson: (json: any) => {
    set({ originalData: json })
    get().loadNodes()
    get().fitView()
  },
  switchOrientation: (): void => {
    const old = get().orientation

    set({
      orientation:
        old === NodeOrientation.horizontal
          ? NodeOrientation.vertical
          : NodeOrientation.horizontal,
    })
    get().loadNodes()
  },
  setReactFlowInstance: (
    reactFlowInstance: ReactFlowInstance<Node<NodeType>>
  ) => {
    set({
      reactFlowInstance,
    })
  },
  fitView: () => {
    setTimeout(() => {
      get().reactFlowInstance?.fitView()
    }, 100)
  },
  onNodesChange: (changes) => {
    const originalNodes = get().nodes
    const orientation = get().orientation
    const newNodesChanged = applyNodeChanges<Node<NodeType>>(
      changes,
      originalNodes
    )

    if (orientation === NodeOrientation.horizontal) {
      onSetXAxisHorizontal({ originalNodes, newNodesChanged })
      onSetYAxisHorizontal({ originalNodes, newNodesChanged })
    } else {
      onSetYAxisVertical({ originalNodes, newNodesChanged })
      onSetXAxisVertical({ originalNodes, newNodesChanged })
    }

    set({ nodes: newNodesChanged })
    get().reactFlowInstance?.fitView()
    set({ isLoading: false })
  },
  onEdgesChange: (changes) => {
    const newEdges = applyEdgeChanges(changes, get().edges)
    console.log({ newEdges })
    set({ edges: newEdges })
  },
  loadNodes: () => {
    const obj = get().originalData
    const orientation = get().orientation
    const nodes: Node<NodeType>[] = []
    const edges: Edge[] = []

    createStructure({
      obj,
      level: 0,
      orientation,
      nodes,
      edges,
    })

    set({ nodes, edges })
  },
}))
