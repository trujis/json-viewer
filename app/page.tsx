"use client"

import { useEffect, useState } from "react"
import {
  Background,
  BackgroundVariant,
  Controls,
  type EdgeTypes,
  type NodeTypes,
  ReactFlow,
} from "@xyflow/react"

import "@xyflow/react/dist/style.css"
import ObjectNode from "@/src/components/object-node"
import CustomEdge from "@/src/components/custom-edge"
import { useNodeStore } from "@/src/components/store/node-store"
import ErrorAlert from "@/src/components/error-alert"
import LoadingOverlay from "@/src/components/loading-overlay"

const nodeTypes: NodeTypes = {
  objectNode: ObjectNode,
}
const edgeTypes: EdgeTypes = {
  customEdge: CustomEdge,
}

export default function JsonFlowRenderer() {
  const [error, setError] = useState("")
  const {
    isLoading,
    setIsLoading,
    orientation,
    switchOrientation,
    setReactFlowInstance,
    updateJson,
    onNodesChange,
    onEdgesChange,
    nodes,
    edges,
  } = useNodeStore()

  useEffect(() => {
    const loadJsonData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/data/sample-cv.json`)
        const jsonData = await response.json()
        updateJson(jsonData)
      } catch (error: any) {
        setError("Failed to load JSON data: " + error?.message)
        setIsLoading(false)
      }
    }

    loadJsonData()
  }, [])

  console.log({ isLoading, error })
  return (
    <div className="w-full h-screen flex items-center justify-center bg-white">
      {error && (
        <ErrorAlert
          message={error}
          onClose={() => setError("")}
          onRetry={() => window.location.reload()}
        />
      )}

      {!error && isLoading && <LoadingOverlay />}

      {/* {!error && !isLoading && (
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <button
            onClick={switchOrientation}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg border border-blue-500 transition-colors duration-200"
          >
            Switch to{" "}
            {orientation === NodeOrientation.horizontal
              ? "Vertical"
              : "Horizontal"}
          </button>
        </div>
      )} */}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={setReactFlowInstance}
        fitView
        fitViewOptions={{ padding: 0.1 }}
        minZoom={0.1}
        maxZoom={2}
        onNodeDrag={() => {}}
        style={{
          visibility: isLoading ? "hidden" : "visible",
          backgroundColor: "white",
        }}
      >
        <Controls showInteractive={false} showZoom={false} />
      </ReactFlow>
    </div>
  )
}
