"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MoodboardCard } from "@/components/moodboard-card"
import { boardService } from "@/lib/api-services"
import type { Board, User } from "@/lib/types"
import { Edit2, Calendar, Globe, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { toast } from "react-hot-toast"

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [publicMoodboards, setPublicMoodboards] = useState<Board[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const userStr = localStorage.getItem("user")
        if (userStr) {
          const userData = JSON.parse(userStr)
          setUser(userData)
        }
        
        const boards = await boardService.getAll()
        const publicBoards = boards.filter((b) => b.isPublic)
        setPublicMoodboards(publicBoards)
      } catch (error: any) {
        toast.error(error?.response?.data?.error || "Failed to load profile data")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Card className="glass-card border-0">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">Please login to view your profile</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const userName = user.name || "User"
  const userInitial = userName.charAt(0).toUpperCase()
  const joinedDate = user.createdAt ? new Date(user.createdAt) : new Date()

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Profile Header */}
      <Card className="glass-card border-0 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
        <CardContent className="relative pt-0 pb-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <Avatar className="h-24 w-24 border-4 border-background -mt-12 shadow-xl">
              <AvatarFallback className="text-2xl">{userInitial}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold">{userName}</h1>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
                <Button variant="outline" size="sm" className="gap-2 w-fit bg-transparent">
                  <Edit2 className="h-4 w-4" />
                  Edit Profile
                </Button>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <span>{publicMoodboards.length} public boards</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {format(joinedDate, "MMMM yyyy")}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Public Boards */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Public Moodboards</h2>
        {publicMoodboards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicMoodboards.map((moodboard) => (
              <MoodboardCard key={moodboard.id} moodboard={moodboard} showVisibility={false} />
            ))}
          </div>
        ) : (
          <Card className="glass-card border-0">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Globe className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No public moodboards yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
