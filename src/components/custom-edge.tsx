import {
  BaseEdge,
  type Edge,
  EdgeLabelRenderer,
  type EdgeProps,
  getBezierPath,
} from "@xyflow/react"
import { FC, useMemo } from "react"

const CustomEdge: FC<EdgeProps<Edge<{ label: string }>>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  // // Calcular la distancia euclidiana
  // const boundingBox = useMemo(() => {
  //     const minX = Math.min(sourceX, targetX);
  //     const maxX = Math.max(sourceX, targetX);
  //     const minY = Math.min(sourceY, targetY);
  //     const maxY = Math.max(sourceY, targetY);
  //
  //     const width = maxX - minX;
  //     const height = maxY - minY;
  //     const area = width * height;
  //
  //     return { width, height, area, minX, minY, maxX, maxY };
  // }, [sourceX, sourceY, targetX, targetY]);
  //
  // console.log(`Edge ${data?.label} length:`, boundingBox);

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        <div
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
          className="edge-label-renderer__custom-edge nodrag nopan text-xs"
        >
          {data?.label}
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

export default CustomEdge
