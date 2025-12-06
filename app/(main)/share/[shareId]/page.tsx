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
import { ArrowLeft, Globe, Calendar, Loader2 } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { toast } from "react-hot-toast"

export default function ShareBoardPage({ params }: { params: Promise<{ shareId: string }> }) {
  const { shareId } = use(params)
  const router = useRouter()
  const [moodboard, setMoodboard] = useState<(Board & { user: User }) | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        setIsLoading(true)
        const board = await boardService.getByShareId(shareId)
        setMoodboard(board)
      } catch (error: any) {
        toast.error(error?.response?.data?.error || "Board not found or is private")
        router.push("/explore")
      } finally {
        setIsLoading(false)
      }
    }
    fetchBoard()
  }, [shareId, router])

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
          <p className="text-muted-foreground mb-4">This board doesn't exist or is private.</p>
          <Link href="/explore">
            <Button>Explore Public Boards</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/explore"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Explore
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{moodboard.title}</h1>
            <Badge variant="secondary" className="gap-1">
              <Globe className="h-3 w-3" />
              Public
            </Badge>
          </div>
          <p className="text-muted-foreground max-w-2xl">{moodboard.description || ""}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {moodboard.user && (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback>{moodboard.user.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <span>{moodboard.user.name || "Anonymous"}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Created {format(new Date(moodboard.createdAt), "MMM d, yyyy")}</span>
            </div>
            <span>Updated {formatDistanceToNow(new Date(moodboard.updatedAt), { addSuffix: true })}</span>
          </div>
        </div>
      </div>

      {/* Tiles Grid */}
      {moodboard.tiles && moodboard.tiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {moodboard.tiles.map((tile) => (
            <TileCard key={tile.id} tile={tile} editable={false} />
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

