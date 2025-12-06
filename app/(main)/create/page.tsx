"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Globe, Lock, Loader2, Sparkles } from "lucide-react"
import Link from "next/link"
import { toast } from "react-hot-toast"
import { boardService } from "@/lib/api-services"

export default function CreateMoodboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isPublic, setIsPublic] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error("Please enter a board title")
      return
    }

    setIsLoading(true)
    try {
      const board = await boardService.create({
        title: title.trim(),
        description: description.trim() || undefined,
        isPublic,
      })
      toast.success("Board created successfully!")
      router.push(`/board/${board.id}/edit`)
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to create board")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <Card className="glass-card border-0">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Create New Moodboard</CardTitle>
              <CardDescription>Start collecting your visual inspiration</CardDescription>
            </div>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Board Title</Label>
              <Input
                id="title"
                placeholder="e.g., Summer Vibes, Brand Identity, Dream Home"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="What's this board about? Add a brief description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                {isPublic ? (
                  <Globe className="h-5 w-5 text-emerald-500" />
                ) : (
                  <Lock className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium text-sm">{isPublic ? "Public Board" : "Private Board"}</p>
                  <p className="text-xs text-muted-foreground">
                    {isPublic ? "Anyone can view this board" : "Only you can see this board"}
                  </p>
                </div>
              </div>
              <Switch checked={isPublic} onCheckedChange={setIsPublic} />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading || !title}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Board
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}
