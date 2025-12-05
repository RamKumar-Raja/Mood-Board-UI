export interface User {
  id: string
  name: string
  email: string
  avatar: string
  bio?: string
}

export interface Tile {
  id: string
  imageUrl: string
  caption: string
  tags: string[]
}

export interface Moodboard {
  id: string
  title: string
  description: string
  coverImage: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
  userId: string
  tiles: Tile[]
}

export interface ActivityLogItem {
  id: string
  action: string
  timestamp: string
  details?: string
}

export const currentUser: User = {
  id: "user-1",
  name: "Alex Morgan",
  email: "alex@moodboard.com",
  avatar: "/professional-portrait.png",
  bio: "Creative director & visual storyteller. Collecting inspiration from around the world.",
}

export const dummyUsers: User[] = [
  currentUser,
  {
    id: "user-2",
    name: "Jordan Lee",
    email: "jordan@example.com",
    avatar: "/designer-portrait.png",
    bio: "UX Designer passionate about minimalism",
  },
  {
    id: "user-3",
    name: "Sam Taylor",
    email: "sam@example.com",
    avatar: "/artist-portrait.png",
    bio: "Photographer & Visual Artist",
  },
]

export const dummyMoodboards: Moodboard[] = [
  {
    id: "board-1",
    title: "Minimalist Architecture",
    description: "Clean lines and modern spaces that inspire calm and focus.",
    coverImage: "/minimalist-architecture.jpg",
    isPublic: true,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-20T14:22:00Z",
    userId: "user-1",
    tiles: [
      {
        id: "tile-1",
        imageUrl: "/images/examples/specialized-sustainability-analyzer-original.png",
        caption: "Tokyo Museum of Art",
        tags: ["architecture", "japan", "modern"],
      },
      {
        id: "tile-2",
        imageUrl: "/concrete-interior.jpg",
        caption: "Brutalist Interior",
        tags: ["brutalism", "concrete", "interior"],
      },
      {
        id: "tile-3",
        imageUrl: "/glass-building.jpg",
        caption: "Glass Pavilion",
        tags: ["glass", "transparency", "modern"],
      },
      {
        id: "tile-4",
        imageUrl: "/white-minimalist-room.jpg",
        caption: "White Space",
        tags: ["minimal", "white", "clean"],
      },
      {
        id: "tile-5",
        imageUrl: "/geometric-facade.jpg",
        caption: "Geometric Facade",
        tags: ["geometric", "pattern", "facade"],
      },
      {
        id: "tile-6",
        imageUrl: "/scandinavian-interior.png",
        caption: "Nordic Living",
        tags: ["scandinavian", "cozy", "wood"],
      },
    ],
  },
  {
    id: "board-2",
    title: "Color Palettes 2024",
    description: "Trending color combinations for the new year.",
    coverImage: "/abstract-color-palette.jpg",
    isPublic: true,
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-18T11:45:00Z",
    userId: "user-1",
    tiles: [
      {
        id: "tile-7",
        imageUrl: "/earthy-tones.jpg",
        caption: "Earth Tones",
        tags: ["earth", "warm", "natural"],
      },
      {
        id: "tile-8",
        imageUrl: "/pastel-gradient.png",
        caption: "Soft Pastels",
        tags: ["pastel", "soft", "gradient"],
      },
      {
        id: "tile-9",
        imageUrl: "/bold-colors.jpg",
        caption: "Bold Statement",
        tags: ["bold", "vibrant", "contrast"],
      },
    ],
  },
  {
    id: "board-3",
    title: "Typography Inspiration",
    description: "Beautiful type specimens and lettering work.",
    coverImage: "/typography-design.png",
    isPublic: false,
    createdAt: "2024-01-05T16:20:00Z",
    updatedAt: "2024-01-19T09:30:00Z",
    userId: "user-1",
    tiles: [
      {
        id: "tile-10",
        imageUrl: "/serif-typography.jpg",
        caption: "Elegant Serifs",
        tags: ["serif", "elegant", "classic"],
      },
      {
        id: "tile-11",
        imageUrl: "/hand-lettering.jpg",
        caption: "Hand Lettering",
        tags: ["hand-drawn", "script", "organic"],
      },
    ],
  },
  {
    id: "board-4",
    title: "Nature & Texture",
    description: "Organic patterns and natural materials.",
    coverImage: "/natural-textures.jpg",
    isPublic: true,
    createdAt: "2024-01-08T12:00:00Z",
    updatedAt: "2024-01-17T15:10:00Z",
    userId: "user-2",
    tiles: [
      {
        id: "tile-12",
        imageUrl: "/wood-grain-texture.jpg",
        caption: "Wood Grain",
        tags: ["wood", "natural", "texture"],
      },
      {
        id: "tile-13",
        imageUrl: "/marble-texture.png",
        caption: "Marble Veins",
        tags: ["marble", "stone", "luxury"],
      },
      {
        id: "tile-14",
        imageUrl: "/leaf-pattern.png",
        caption: "Botanical",
        tags: ["botanical", "green", "organic"],
      },
      {
        id: "tile-15",
        imageUrl: "/water-ripple.jpg",
        caption: "Water Ripples",
        tags: ["water", "fluid", "calm"],
      },
    ],
  },
  {
    id: "board-5",
    title: "UI Design Patterns",
    description: "Interface design inspiration for modern apps.",
    coverImage: "/ui-design-dark.jpg",
    isPublic: true,
    createdAt: "2024-01-12T09:45:00Z",
    updatedAt: "2024-01-21T10:00:00Z",
    userId: "user-3",
    tiles: [
      {
        id: "tile-16",
        imageUrl: "/dashboard-ui-dark.jpg",
        caption: "Dark Dashboard",
        tags: ["dashboard", "dark-mode", "analytics"],
      },
      {
        id: "tile-17",
        imageUrl: "/mobile-app-ui.png",
        caption: "Mobile First",
        tags: ["mobile", "app", "ios"],
      },
      {
        id: "tile-18",
        imageUrl: "/card-components.jpg",
        caption: "Card Components",
        tags: ["cards", "components", "modular"],
      },
    ],
  },
]

export const dummyActivityLog: ActivityLogItem[] = [
  { id: "log-1", action: "Added new tile", timestamp: "2 minutes ago", details: "Tokyo Museum of Art" },
  { id: "log-2", action: "Updated caption", timestamp: "15 minutes ago", details: "Brutalist Interior" },
  { id: "log-3", action: "Changed visibility", timestamp: "1 hour ago", details: "Set to Public" },
  { id: "log-4", action: "Removed tile", timestamp: "2 hours ago", details: "Old reference image" },
  { id: "log-5", action: "Added tags", timestamp: "3 hours ago", details: "architecture, modern" },
  { id: "log-6", action: "Board created", timestamp: "1 day ago" },
]

export const getPublicMoodboards = () => dummyMoodboards.filter((b) => b.isPublic)
export const getUserMoodboards = (userId: string) => dummyMoodboards.filter((b) => b.userId === userId)
export const getMoodboardById = (id: string) => dummyMoodboards.find((b) => b.id === id)
export const getUserById = (id: string) => dummyUsers.find((u) => u.id === id)
