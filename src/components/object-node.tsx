import React, { memo, useRef, useEffect, useState } from "react"
import { Handle, Position, NodeProps } from "@xyflow/react"
import { NodeOrientation, NodeType } from "@/src/components/store/node-type"

interface CustomNodeProps extends NodeProps {
  data: NodeType
}

const ObjectNode: React.FC<CustomNodeProps> = ({ data, id }) => {
  return (
    <div className="bg-gray-800 border border-gray-600 rounded-lg py-3 px-5">
      {data.hasParent && (
        <Handle
          type="target"
          position={
            data.orientation === NodeOrientation.horizontal
              ? Position.Left
              : Position.Top
          }
        />
      )}

      <div className="space-y-2">
        {data.content?.map((prop: any, index: number) => (
          <div key={index} className="text-xs">
            <span className="text-blue-300">{prop}</span>
          </div>
        ))}
      </div>
      {data.hasChildren && (
        <Handle
          type="source"
          position={
            data.orientation === NodeOrientation.horizontal
              ? Position.Right
              : Position.Bottom
          }
        />
      )}
    </div>
  )
}
export default memo(ObjectNode)
