"use client"

import type React from "react"

import { ScrollArea } from "@/components/ui/scroll-area"
import type { ActivityLogItem } from "@/lib/dummy-data"
import { Activity, ImagePlus, Edit, Eye, Trash2, Tag, FolderPlus } from "lucide-react"

const actionIcons: Record<string, React.ReactNode> = {
  "Added new tile": <ImagePlus className="h-4 w-4 text-emerald-500" />,
  "Updated caption": <Edit className="h-4 w-4 text-blue-500" />,
  "Changed visibility": <Eye className="h-4 w-4 text-amber-500" />,
  "Removed tile": <Trash2 className="h-4 w-4 text-red-500" />,
  "Added tags": <Tag className="h-4 w-4 text-indigo-500" />,
  "Board created": <FolderPlus className="h-4 w-4 text-emerald-500" />,
}

interface ActivityLogProps {
  items: ActivityLogItem[]
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
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="shrink-0 mt-0.5">
                {actionIcons[item.action] || <Activity className="h-4 w-4 text-muted-foreground" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{item.action}</p>
                {item.details && <p className="text-xs text-muted-foreground truncate">{item.details}</p>}
                <p className="text-xs text-muted-foreground mt-1">{item.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
