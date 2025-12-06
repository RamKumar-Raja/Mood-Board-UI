"use client"

import type React from "react"

import { ScrollArea } from "@/components/ui/scroll-area"
import type { ActivityLog as ActivityLogType } from "@/lib/types"
import { Activity, ImagePlus, Edit, Eye, Trash2, Tag, FolderPlus } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

const actionIcons: Record<string, React.ReactNode> = {
  "Tile created": <ImagePlus className="h-4 w-4 text-emerald-500" />,
  "Tile updated": <Edit className="h-4 w-4 text-blue-500" />,
  "Board updated": <Eye className="h-4 w-4 text-amber-500" />,
  "Tile deleted": <Trash2 className="h-4 w-4 text-red-500" />,
  "Board created": <FolderPlus className="h-4 w-4 text-emerald-500" />,
}

interface ActivityLogProps {
  items: ActivityLogType[]
}

export function ActivityLog({ items }: ActivityLogProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 p-4 border-b border-border">
        <Activity className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-semibold">Activity Log</h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No activity yet</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="shrink-0 mt-0.5">
                  {actionIcons[item.action] || <Activity className="h-4 w-4 text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.action}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
