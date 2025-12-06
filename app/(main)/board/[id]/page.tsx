"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TileCard } from "@/components/tile-card"
import { boardService } from "@/lib/api-services"
import type { Board, User } from "@/lib/types"
import { ArrowLeft, Globe, Lock, Calendar, Edit, Share2, Loader2, Check, Copy } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { toast } from "react-hot-toast"

export default function PublicMoodboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [moodboard, setMoodboard] = useState<Board | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        setIsLoading(true)
        const board = await boardService.getById(id)
        setMoodboard(board)
        // User info would come from the board if we include it in the response
      } catch (error: any) {
        toast.error(error?.response?.data?.error || "Failed to load board")
        if (error?.response?.status === 401) {
          router.push("/login")
        }
      } finally {
        setIsLoading(false)
      }
    }
    fetchBoard()
  }, [id, router])

  const handleCopyLink = () => {
    if (moodboard) {
      const shareUrl = `${window.location.origin}/share/${moodboard.shareId}`
      navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success("Share link copied!")
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!moodboard) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-2">Board not found</h2>
          <p className="text-muted-foreground mb-4">The board you're looking for doesn't exist or is private.</p>
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{moodboard.title}</h1>
            <Badge variant="secondary" className="gap-1">
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
          </div>
          <p className="text-muted-foreground max-w-2xl">{moodboard.description}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Created {format(new Date(moodboard.createdAt), "MMM d, yyyy")}</span>
            </div>
            <span>Updated {formatDistanceToNow(new Date(moodboard.updatedAt), { addSuffix: true })}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={handleCopyLink}>
            {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
            Share
          </Button>
          <Link href={`/board/${id}/edit`}>
            <Button size="sm" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Board
            </Button>
          </Link>
        </div>
      </div>

      {/* Tiles Canvas */}
      {moodboard.tiles && moodboard.tiles.length > 0 ? (
        <div 
          className="relative w-full min-h-[600px] bg-muted/20 rounded-lg border-2 border-dashed border-border"
          style={{ 
            position: 'relative',
            minHeight: '600px',
          }}
        >
          {moodboard.tiles.map((tile) => (
            <div
              key={tile.id}
              style={{
                position: 'absolute',
                left: `${tile.positionX || 0}px`,
                top: `${tile.positionY || 0}px`,
                width: `${tile.width || 200}px`,
              }}
            >
              <TileCard tile={tile} editable={false} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-muted-foreground">This board doesn&apos;t have any tiles yet</p>
        </div>
      )}
    </div>
  )
}
