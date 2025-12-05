"use client"

import { use, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TileCard } from "@/components/tile-card"
import { ActivityLog } from "@/components/activity-log"
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
import { getMoodboardById, dummyActivityLog, type Tile } from "@/lib/dummy-data"
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
import { notFound } from "next/navigation"
import { Label } from "@/components/ui/label"

export default function EditMoodboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const moodboard = getMoodboardById(id)

  if (!moodboard) {
    notFound()
  }

  const [tiles, setTiles] = useState<Tile[]>(moodboard.tiles)
  const [isSaving, setIsSaving] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [copied, setCopied] = useState(false)
  const [isUrlDialogOpen, setIsUrlDialogOpen] = useState(false)

  const handleDeleteTile = (tileId: string) => {
    setTiles(tiles.filter((t) => t.id !== tileId))
  }

  const handleUpdateTile = (updatedTile: Tile) => {
    setTiles(tiles.map((t) => (t.id === updatedTile.id ? updatedTile : t)))
  }

  const handleAddByUrl = () => {
    if (imageUrl.trim()) {
      const newTile: Tile = {
        id: `tile-${Date.now()}`,
        imageUrl: imageUrl.trim(),
        caption: "",
        tags: [],
      }
      setTiles([...tiles, newTile])
      setImageUrl("")
      setIsUrlDialogOpen(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/board/${id}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/board/${id}` : ""

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
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Upload className="h-4 w-4" />
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
                    <Button onClick={handleAddByUrl} disabled={!imageUrl.trim()}>
                      <ImagePlus className="h-4 w-4 mr-2" />
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
                  <ActivityLog items={dummyActivityLog} />
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

        {/* Tiles Editor */}
        <div className="flex-1 overflow-auto p-4">
          {tiles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {tiles.map((tile) => (
                <TileCard key={tile.id} tile={tile} editable onDelete={handleDeleteTile} onUpdate={handleUpdateTile} />
              ))}
            </div>
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
        <ActivityLog items={dummyActivityLog} />
      </aside>
    </div>
  )
}
