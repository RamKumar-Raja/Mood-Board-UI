export interface User {
  id: string
  email: string
  name: string
  created_at: string
}

export interface Board {
  id: string
  userId: string
  title: string
  description?: string
  shareId: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
  tiles?: Tile[]
}

export interface Tile {
  id: string
  board_id: string
  image_url: string
  caption?: string
  tags: string[]
  position_x: number
  position_y: number
  width: number
  height: number
  created_at: string
  updated_at: string
}

export interface ActivityLog {
  id: string
  board_id: string
  user_id: string
  action: string
  details?: string
  created_at: string
  user?: User
}

export interface AuthResponse {
  token: string
  user: User
}
