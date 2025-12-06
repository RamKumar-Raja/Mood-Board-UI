import api from "./api"
import type { Board, Tile, ActivityLog, User } from "./types"

export interface CreateBoardData {
  title: string
  description?: string
  isPublic?: boolean
}

export interface UpdateBoardData {
  title?: string
  description?: string
  isPublic?: boolean
}

export interface CreateTileData {
  imageUrl: string
  caption?: string
  tags?: string[]
  positionX?: number
  positionY?: number
  width?: number
  height?: number
}

export interface UpdateTileData {
  caption?: string
  tags?: string[]
  positionX?: number
  positionY?: number
  width?: number
  height?: number
}

export interface UploadImageResponse {
  url: string
  public_id: string
}

export interface UploadMultipleImagesResponse {
  images: UploadImageResponse[]
}

export interface ActivityLogsResponse {
  logs: ActivityLog[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// Board API
export const boardService = {
  async create(data: CreateBoardData): Promise<Board> {
    const response = await api.post<Board>("/boards", data)
    return response.data
  },

  async getAll(): Promise<Board[]> {
    const response = await api.get<Board[]>("/boards")
    return response.data
  },

  async getById(boardId: string): Promise<Board> {
    const response = await api.get<Board>(`/boards/${boardId}`)
    return response.data
  },

  async getByShareId(shareId: string): Promise<Board & { user: User }> {
    const response = await api.get<Board & { user: User }>(`/boards/share/${shareId}`)
    return response.data
  },

  async getPublicBoards(): Promise<(Board & { user: User })[]> {
    const response = await api.get<(Board & { user: User })[]>("/boards/public")
    return response.data
  },

  async update(boardId: string, data: UpdateBoardData): Promise<Board> {
    const response = await api.put<Board>(`/boards/${boardId}`, data)
    return response.data
  },

  async delete(boardId: string): Promise<void> {
    await api.delete(`/boards/${boardId}`)
  },
}

// Tile API
export const tileService = {
  async create(boardId: string, data: CreateTileData): Promise<Tile> {
    const response = await api.post<Tile>(`/boards/${boardId}/tiles`, data)
    return response.data
  },

  async update(boardId: string, tileId: string, data: UpdateTileData): Promise<Tile> {
    const response = await api.put<Tile>(`/boards/${boardId}/tiles/${tileId}`, data)
    return response.data
  },

  async delete(boardId: string, tileId: string): Promise<void> {
    await api.delete(`/boards/${boardId}/tiles/${tileId}`)
  },
}

// Upload API
export const uploadService = {
  async uploadImage(file: File): Promise<UploadImageResponse> {
    const formData = new FormData()
    formData.append("image", file)
    const response = await api.post<UploadImageResponse>("/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  async uploadMultipleImages(files: File[]): Promise<UploadImageResponse[]> {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append("images", file)
    })
    const response = await api.post<UploadMultipleImagesResponse>("/upload/images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data.images
  },

  async deleteImage(publicId: string): Promise<void> {
    await api.delete(`/upload/image/${publicId}`)
  },
}

// Activity Log API
export const activityLogService = {
  async getLogs(boardId: string, page: number = 1, limit: number = 10): Promise<ActivityLogsResponse> {
    const response = await api.get<ActivityLogsResponse>(`/boards/${boardId}/logs`, {
      params: { page, limit },
    })
    return response.data
  },

  async addLog(boardId: string, action: string): Promise<ActivityLog> {
    const response = await api.post<ActivityLog>(`/boards/${boardId}/logs`, { action })
    return response.data
  },
}

