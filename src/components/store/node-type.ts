export enum NodeOrientation {
  horizontal,
  vertical,
}

export type Position = {
  x: number
  y: number
}

export type NodeType = {
  content: string[]
  orientation: NodeOrientation
  hasParent: boolean
  hasChildren: boolean
  level: number
  parentId?: string
  randomizedPosition: Position
}
