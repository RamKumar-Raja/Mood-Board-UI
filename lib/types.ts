export interface User {
  id: string
  email: string
  name: string | null
  createdAt: string
}

export interface Board {
  id: string
  userId: string
  title: string
  description?: string | null
  shareId: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
  tiles?: Tile[]
  activityLogs?: ActivityLog[]
}

export interface Tile {
  id: string
  boardId: string
  imageUrl: string
  caption?: string | null
  tags: string[] | null
  positionX: number
  positionY: number
  width: number
  height: number
  createdAt: string
  updatedAt: string
}

export interface ActivityLog {
  id: string
  boardId: string
  userId: string
  action: string
  createdAt: string
  user?: User
}

export interface AuthResponse {
  user: User
}
