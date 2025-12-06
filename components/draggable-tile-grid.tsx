"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { TileCard } from "./tile-card"
import type { Tile } from "@/lib/types"

interface DraggableTileProps {
  tile: Tile
  onDelete?: (id: string) => void
  onUpdate?: (tile: Tile) => void
}

export function DraggableTile({ tile, onDelete, onUpdate }: DraggableTileProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tile.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <TileCard
        tile={tile}
        editable
        onDelete={onDelete}
        onUpdate={onUpdate}
        className={isDragging ? "ring-2 ring-primary" : ""}
      >
        <div
          {...listeners}
          className="absolute top-2 left-2 z-20 cursor-grab active:cursor-grabbing p-2 rounded-md bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </TileCard>
    </div>
  )
}

