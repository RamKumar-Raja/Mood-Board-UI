"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { MoodboardCard } from "@/components/moodboard-card"
import { boardService } from "@/lib/api-services"
import type { Board, User } from "@/lib/types"
import { Search, Compass, Loader2 } from "lucide-react"
import { toast } from "react-hot-toast"

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [moodboards, setMoodboards] = useState<(Board & { user: User })[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        setIsLoading(true)
        const boards = await boardService.getPublicBoards()
        setMoodboards(boards)
      } catch (error: any) {
        toast.error(error?.response?.data?.error || "Failed to load public boards")
      } finally {
        setIsLoading(false)
      }
    }
    fetchBoards()
  }, [])

  const filteredMoodboards = moodboards.filter(
    (board) =>
      board.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (board.description || "").toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Compass className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Explore Inspiration</h1>
          <p className="text-muted-foreground mt-2">Discover public moodboards from the creative community</p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search public boards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Moodboards Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredMoodboards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
            {filteredMoodboards.map((moodboard) => (
              <MoodboardCard key={moodboard.id} moodboard={moodboard} showVisibility={false} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-muted-foreground">
              {searchQuery ? "No moodboards found matching your search" : "No public moodboards available yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
