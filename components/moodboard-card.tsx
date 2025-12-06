"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lock, Globe, Clock, LayoutGrid } from "lucide-react"
import type { Board } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

interface MoodboardCardProps {
  moodboard: Board
  showVisibility?: boolean
}

export function MoodboardCard({ moodboard, showVisibility = true }: MoodboardCardProps) {
  const coverImage = moodboard.tiles && moodboard.tiles.length > 0 
    ? moodboard.tiles[0].imageUrl 
    : "/placeholder.svg"
  
  return (
    <Link href={`/board/${moodboard.id}`}>
      <Card className="group overflow-hidden border-0 glass-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {coverImage !== "/placeholder.svg" ? (
            <Image
              src={coverImage}
              alt={moodboard.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <LayoutGrid className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {showVisibility && (
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="glass text-xs gap-1 backdrop-blur-md">
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
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
            {moodboard.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{moodboard.description || ""}</p>
          <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Updated {formatDistanceToNow(new Date(moodboard.updatedAt), { addSuffix: true })}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
