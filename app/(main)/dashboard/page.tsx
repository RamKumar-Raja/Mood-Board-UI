"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MoodboardCard } from "@/components/moodboard-card"
import { getUserMoodboards, currentUser } from "@/lib/dummy-data"
import { Plus, Search, LayoutGrid, List } from "lucide-react"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const moodboards = getUserMoodboards(currentUser.id)

  const filteredMoodboards = moodboards.filter(
    (board) =>
      board.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      board.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Moodboards</h1>
            <p className="text-muted-foreground mt-1">
              {moodboards.length} board{moodboards.length !== 1 ? "s" : ""} in your collection
            </p>
          </div>
          <Link href="/create">
            <Button className="gap-2 w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              Create New Board
            </Button>
          </Link>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your boards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              className={cn("h-8 px-3", viewMode === "grid" && "bg-background shadow-sm")}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn("h-8 px-3", viewMode === "list" && "bg-background shadow-sm")}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Moodboards Grid */}
        {filteredMoodboards.length > 0 ? (
          <div
            className={cn(
              "grid gap-6",
              viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1",
            )}
          >
            {filteredMoodboards.map((moodboard) => (
              <MoodboardCard key={moodboard.id} moodboard={moodboard} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <LayoutGrid className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No moodboards found</h3>
            <p className="text-muted-foreground mt-1 max-w-sm">
              {searchQuery
                ? "Try adjusting your search query"
                : "Create your first moodboard to start collecting inspiration"}
            </p>
            {!searchQuery && (
              <Link href="/create" className="mt-4">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Board
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
