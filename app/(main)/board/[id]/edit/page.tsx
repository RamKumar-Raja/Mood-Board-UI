"use client"

import { use, useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TileCard } from "@/components/tile-card"
import { ActivityLog } from "@/components/activity-log"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { useDraggable } from "@dnd-kit/core"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { boardService, tileService, uploadService, activityLogService } from "@/lib/api-services"
import type { Board, Tile, ActivityLog as ActivityLogType } from "@/lib/types"
import {
  ArrowLeft,
  Upload,
  LinkIcon,
  Activity,
  Share2,
  Save,
  Globe,
  Lock,
  Loader2,
  Check,
  Copy,
  ImagePlus,
} from "lucide-react"
import { toast } from "react-hot-toast"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

// Draggable Tile Component for Canvas
function DraggableTileItem({
  tile,
  onDelete,
  onUpdate,
}: {
  tile: Tile
  onDelete?: (id: string) => void
  onUpdate?: (tile: Tile) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: tile.id,
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'absolute',
        left: `${tile.positionX}px`,
        top: `${tile.positionY}px`,
        width: `${tile.width || 200}px`,
        ...style,
        zIndex: isDragging ? 50 : 1,
        opacity: isDragging ? 0.8 : 1,
      }}
      className={cn(
        isDragging && "ring-2 ring-primary ring-offset-2 rounded-lg shadow-2xl",
        "cursor-grab active:cursor-grabbing"
      )}
      {...attributes}
      {...listeners}
    >
      <TileCard
        tile={tile}
        editable
        onDelete={onDelete}
        onUpdate={onUpdate}
      />
    </div>
  )
}

export default function EditMoodboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [moodboard, setMoodboard] = useState<Board | null>(null)
  const [tiles, setTiles] = useState<Tile[]>([])
  const [activityLogs, setActivityLogs] = useState<ActivityLogType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [copied, setCopied] = useState(false)
  const [isUrlDialogOpen, setIsUrlDialogOpen] = useState(false)

  const [activeId, setActiveId] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  // Drag and drop sensors for canvas
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before drag starts
      },
    })
  )

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [board, logs] = await Promise.all([
          boardService.getById(id),
          activityLogService.getLogs(id, 1, 20).catch(() => ({ logs: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 } }))
        ])
        setMoodboard(board)
        // Ensure tiles have positions (default to 0,0 if not set)
        const tilesWithPositions = (board.tiles || []).map((tile) => ({
          ...tile,
          positionX: tile.positionX ?? 0,
          positionY: tile.positionY ?? 0,
          width: tile.width ?? 200,
          height: tile.height ?? 200,
        }))
        setTiles(tilesWithPositions)
        setActivityLogs(logs.logs)
      } catch (error: any) {
        toast.error(error?.response?.data?.error || "Failed to load board")
        if (error?.response?.status === 401) {
          router.push("/login")
        }
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id, router])

  const handleDeleteTile = async (tileId: string) => {
    if (!moodboard) return
    try {
      await tileService.delete(moodboard.id, tileId)
      setTiles(tiles.filter((t) => t.id !== tileId))
      toast.success("Tile deleted")
      // Refresh activity logs
      const logs = await activityLogService.getLogs(id, 1, 20)
      setActivityLogs(logs.logs)
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to delete tile")
    }
  }

  const handleUpdateTile = async (updatedTile: Tile) => {
    if (!moodboard) return
    try {
      const saved = await tileService.update(moodboard.id, updatedTile.id, {
        caption: updatedTile.caption || undefined,
        tags: updatedTile.tags || undefined,
        positionX: updatedTile.positionX,
        positionY: updatedTile.positionY,
        width: updatedTile.width,
        height: updatedTile.height,
      })
      setTiles(tiles.map((t) => (t.id === updatedTile.id ? saved : t)))
      // Refresh activity logs
      const logs = await activityLogService.getLogs(id, 1, 20)
      setActivityLogs(logs.logs)
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to update tile")
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, delta } = event
    setActiveId(null)

    if (!moodboard || !delta) {
      return
    }

    const tile = tiles.find((t) => t.id === active.id)
    if (!tile) return

    // Get canvas container position
    const canvas = canvasRef.current
    if (!canvas) return

    const canvasRect = canvas.getBoundingClientRect()
    
    // Calculate new position based on delta (movement)
    const newPositionX = Math.max(0, tile.positionX + delta.x)
    const newPositionY = Math.max(0, tile.positionY + delta.y)

    // Update local state immediately for smooth UI
    const updatedTile = {
      ...tile,
      positionX: newPositionX,
      positionY: newPositionY,
    }
    
    setTiles(tiles.map((t) => (t.id === tile.id ? updatedTile : t)))

    // Save to backend
    try {
      await tileService.update(moodboard.id, tile.id, {
        positionX: newPositionX,
        positionY: newPositionY,
      })
      toast.success("Tile position updated")
      // Refresh activity logs
      const logs = await activityLogService.getLogs(id, 1, 20)
      setActivityLogs(logs.logs)
    } catch (error: any) {
      // Revert on error
      setTiles(tiles)
      toast.error(error?.response?.data?.error || "Failed to update tile position")
    }
  }

  const handleAddByUrl = async () => {
    if (!moodboard || !imageUrl.trim()) return
    try {
      setIsUploading(true)
      // Calculate initial position (stagger new tiles)
      const newPositionX = (tiles.length % 4) * 220 // Stagger horizontally
      const newPositionY = Math.floor(tiles.length / 4) * 220 // Stagger vertically
      
      const newTile = await tileService.create(moodboard.id, {
        imageUrl: imageUrl.trim(),
        caption: "",
        tags: [],
        positionX: newPositionX,
        positionY: newPositionY,
      })
      setTiles([...tiles, newTile])
      setImageUrl("")
      setIsUrlDialogOpen(false)
      toast.success("Tile added successfully")
      // Refresh activity logs
      const logs = await activityLogService.getLogs(id, 1, 20)
      setActivityLogs(logs.logs)
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to add tile")
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!moodboard || !e.target.files?.[0]) return
    const file = e.target.files[0]
    try {
      setIsUploading(true)
      const { url } = await uploadService.uploadImage(file)
      // Calculate initial position (stagger new tiles)
      const newPositionX = (tiles.length % 4) * 220 // Stagger horizontally
      const newPositionY = Math.floor(tiles.length / 4) * 220 // Stagger vertically
      
      const newTile = await tileService.create(moodboard.id, {
        imageUrl: url,
        caption: "",
        tags: [],
        positionX: newPositionX,
        positionY: newPositionY,
      })
      setTiles([...tiles, newTile])
      toast.success("Image uploaded successfully")
      // Refresh activity logs
      const logs = await activityLogService.getLogs(id, 1, 20)
      setActivityLogs(logs.logs)
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to upload image")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleSave = async () => {
    // All changes are saved automatically, this is just for UI feedback
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsSaving(false)
    toast.success("All changes saved")
  }

  const handleCopyLink = () => {
    if (moodboard) {
      const shareUrl = `${window.location.origin}/share/${moodboard.shareId}`
      navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success("Share link copied!")
    }
  }

  const shareUrl = moodboard ? `${window.location.origin}/share/${moodboard.shareId}` : ""

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!moodboard) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Board not found</h2>
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Editor Header */}
        <div className="border-b border-border p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href={`/board/${id}`}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to view</span>
              </Link>
              <div className="h-6 w-px bg-border hidden sm:block" />
              <div>
                <h1 className="text-xl font-semibold">{moodboard.title}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary" className="gap-1 text-xs">
                    {moodboard.isPublic ? (
                      <>
                        <Globe className="h-3 w-3" />
                        Public
                      </>
                    ) : (
                      <>
                        <Lock className="h-3 w-3" />
                        Private
                      </>
                    )}
                  </Badge>
                  <span>{tiles.length} tiles</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Upload Button */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 bg-transparent"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">Upload</span>
              </Button>

              {/* Add by URL */}
              <Dialog open={isUrlDialogOpen} onOpenChange={setIsUrlDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <LinkIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Add URL</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Image by URL</DialogTitle>
                    <DialogDescription>Paste an image URL to add it to your moodboard</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="image-url">Image URL</Label>
                      <Input
                        id="image-url"
                        placeholder="https://example.com/image.jpg"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsUrlDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddByUrl} disabled={!imageUrl.trim() || isUploading}>
                      {isUploading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <ImagePlus className="h-4 w-4 mr-2" />
                      )}
                      Add Image
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Share Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Share2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Share</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Share Moodboard</DialogTitle>
                    <DialogDescription>Share this board with others using the link below</DialogDescription>
                  </DialogHeader>
                  <div className="flex gap-2 py-4">
                    <Input value={shareUrl} readOnly className="flex-1" />
                    <Button onClick={handleCopyLink} variant="outline">
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Activity Log (Mobile) */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden bg-transparent">
                    <Activity className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0">
                  <ActivityLog items={activityLogs} />
                </SheetContent>
              </Sheet>

              {/* Save Button */}
              <Button size="sm" className="gap-2" onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                <span className="hidden sm:inline">Save</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas Editor */}
        <div className="flex-1 overflow-auto p-4">
          {tiles.length > 0 ? (
            <DndContext
              sensors={sensors}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div
                ref={canvasRef}
                className="relative w-full min-h-[600px] bg-muted/20 rounded-lg border-2 border-dashed border-border"
                style={{ 
                  position: 'relative',
                  minHeight: '600px',
                  height: '100%',
                }}
              >
                {tiles.map((tile) => (
                  <DraggableTileItem
                    key={tile.id}
                    tile={tile}
                    onDelete={handleDeleteTile}
                    onUpdate={handleUpdateTile}
                  />
                ))}
              </div>
              <DragOverlay>
                {activeId ? (
                  <div className="opacity-50">
                    <TileCard
                      tile={tiles.find((t) => t.id === activeId)!}
                      editable
                    />
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <ImagePlus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No tiles yet</h3>
              <p className="text-muted-foreground mt-1 max-w-sm">
                Upload images or add by URL to start building your moodboard
              </p>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Upload className="h-4 w-4" />
                  Upload Image
                </Button>
                <Button onClick={() => setIsUrlDialogOpen(true)} className="gap-2">
                  <LinkIcon className="h-4 w-4" />
                  Add by URL
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Activity Log Sidebar (Desktop) */}
      <aside className="hidden lg:block w-80 border-l border-border bg-card">
        <ActivityLog items={activityLogs} />
      </aside>
    </div>
  )
}
