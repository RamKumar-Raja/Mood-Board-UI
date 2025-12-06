"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X, GripVertical, Edit2, Check } from "lucide-react"
import type { Tile } from "@/lib/types"
import { cn } from "@/lib/utils"

interface TileCardProps {
  tile: Tile
  onDelete?: (id: string) => void
  onUpdate?: (tile: Tile) => void
  editable?: boolean
  className?: string
}

export function TileCard({ tile, onDelete, onUpdate, editable = false, className }: TileCardProps) {
  const [isEditingCaption, setIsEditingCaption] = useState(false)
  const [caption, setCaption] = useState(tile.caption || "")
  const [tagInput, setTagInput] = useState("")
  const tags = Array.isArray(tile.tags) ? tile.tags : []

  const handleSaveCaption = () => {
    onUpdate?.({ ...tile, caption })
    setIsEditingCaption(false)
  }

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      const newTags = [...tags, tagInput.trim().toLowerCase()]
      onUpdate?.({ ...tile, tags: newTags })
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove)
    onUpdate?.({ ...tile, tags: newTags })
  }

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-0 glass-card transition-all duration-300 hover:shadow-lg",
        editable && "cursor-grab active:cursor-grabbing",
        className,
      )}
    >
      {editable && (
        <div className="absolute top-2 left-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="p-1.5 rounded-md glass bg-background/80 backdrop-blur-sm border border-border/50">
            <GripVertical className="h-4 w-4 text-foreground/70" />
          </div>
        </div>
      )}

      {editable && onDelete && (
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 z-20 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(tile.id)
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      <div className="relative aspect-square overflow-hidden">
        <Image
          src={tile.imageUrl || "/placeholder.svg"}
          alt={tile.caption || "Moodboard tile"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-3 space-y-2">
        {editable ? (
          <div className="flex items-center gap-2">
            {isEditingCaption ? (
              <>
                <Input 
                  value={caption} 
                  onChange={(e) => setCaption(e.target.value)} 
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSaveCaption()
                    } else if (e.key === "Escape") {
                      setCaption(tile.caption || "")
                      setIsEditingCaption(false)
                    }
                  }}
                  onBlur={handleSaveCaption}
                  className="h-8 text-sm" 
                  autoFocus 
                />
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8 shrink-0 pointer-events-auto" 
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSaveCaption()
                  }}
                >
                  <Check className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm font-medium truncate flex-1">{tile.caption || "Add caption"}</p>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsEditingCaption(true)
                  }}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        ) : (
          <p className="text-sm font-medium">{tile.caption}</p>
        )}

        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className={cn(
                "text-xs",
                editable && "pr-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground",
              )}
              onClick={editable ? () => handleRemoveTag(tag) : undefined}
            >
              {tag}
              {editable && <X className="h-3 w-3 ml-1" />}
            </Badge>
          ))}
        </div>

        {editable && (
          <Input
            placeholder="Add tag..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            className="h-7 text-xs mt-2"
          />
        )}
      </div>
    </Card>
  )
}
