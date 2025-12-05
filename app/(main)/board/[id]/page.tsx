"use client"

import { use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TileCard } from "@/components/tile-card"
import { getMoodboardById, getUserById } from "@/lib/dummy-data"
import { ArrowLeft, Globe, Lock, Calendar, Edit, Share2 } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { notFound } from "next/navigation"

export default function PublicMoodboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const moodboard = getMoodboardById(id)

  if (!moodboard) {
    notFound()
  }

  const user = getUserById(moodboard.userId)

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
            {user && (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{user.name}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Created {format(new Date(moodboard.createdAt), "MMM d, yyyy")}</span>
            </div>
            <span>Updated {formatDistanceToNow(new Date(moodboard.updatedAt), { addSuffix: true })}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Share2 className="h-4 w-4" />
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

      {/* Tiles Grid */}
      {moodboard.tiles.length > 0 ? (
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
