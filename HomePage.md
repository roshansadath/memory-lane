# 🏠 Memory Lane Home Page Implementation Plan

## Current State Analysis

### ✅ What's Ready
- Next.js 15 with App Router setup
- Tailwind CSS v4 configured
- Basic project structure in place
- Dependencies for forms, state management, and UI ready
- TypeScript configured

### ❌ What's Missing
- No UI components built yet (shadcn/ui components missing)
- No data fetching or state management implemented
- No mock data for development

## Home Page Functional Requirements

Based on README.md specifications:

1. **Netflix-style layout** with tag-based carousels of memory lanes
2. **Each lane shows**: cover image, title, description, memory count
3. **Clicking opens** the lane detail page
4. **Authentication state** affects what users can see/do

## Strategic Implementation Plan

### Phase 1: UI Foundation & Components
- [ ] **Set up shadcn/ui components** - Basic UI primitives (Button, Card, Skeleton)
- [ ] **Create layout components** - Header, navigation, main content areas
- [ ] **Build lane card component** - Reusable component for displaying memory lanes
- [ ] **Create carousel component** - For horizontal scrolling through lanes by tag

### Phase 2: Data Structure & Mock Data
- [ ] **Define TypeScript interfaces** - Based on the Prisma schema in README
- [ ] **Create mock data** - For development and testing
- [ ] **Set up data fetching hooks** - Using TanStack Query for state management

### Phase 3: Home Page Layout
- [ ] **Netflix-style header** - Logo, navigation, auth state
- [ ] **Tag-based sections** - Each tag gets its own horizontal carousel
- [ ] **Lane cards** - Display cover image, title, description, memory count
- [ ] **Responsive design** - Mobile-first approach

### Phase 4: Interactive Features
- [ ] **Click handlers** - Navigate to lane detail pages
- [ ] **Hover effects** - Netflix-style hover animations
- [ ] **Loading states** - Skeleton loaders for better UX
- [ ] **Empty states** - When no lanes exist

## Proposed Component Structure

```
src/components/
├── layout/
│   ├── Header.tsx
│   ├── Navigation.tsx
│   └── Layout.tsx
├── ui/
│   ├── button.tsx (shadcn)
│   ├── card.tsx (shadcn)
│   ├── carousel.tsx (custom)
│   └── skeleton.tsx (shadcn)
├── home/
│   ├── LaneCard.tsx
│   ├── LaneCarousel.tsx
│   ├── TagSection.tsx
│   └── HomePage.tsx
└── forms/
    └── LoginForm.tsx (for later)
```

## Key Design Decisions

1. **Netflix-style carousels** - Horizontal scrolling with smooth animations
2. **Tag-based organization** - Group lanes by tags (like "Travel", "Family", "Work")
3. **Card-based design** - Clean, modern cards for each memory lane
4. **Responsive grid** - Adapts to different screen sizes
5. **Dark/light theme support** - Using Tailwind's theme system

## Implementation Steps

### Step 1: Set up shadcn/ui components
**Purpose**: Get foundational UI components for building the interface
**Tasks**:
- Initialize shadcn/ui in the project
- Install essential components (Button, Card, Skeleton)
- Configure components properly with Tailwind CSS v4

### Step 2: Create TypeScript interfaces
**Purpose**: Define data structures based on Prisma schema
**Tasks**:
- Define interfaces for MemoryLane, Memory, MemoryImage, Tag, LaneTag
- Create mock data for development
- Set up type definitions in `/src/types/`

### Step 3: Build the LaneCard component
**Purpose**: Reusable component for displaying memory lanes
**Tasks**:
- Create component with cover image, title, description, memory count
- Add hover effects and click handlers
- Make it responsive and accessible

### Step 4: Create the carousel component
**Purpose**: Horizontal scrolling carousel for lanes
**Tasks**:
- Build smooth horizontal scrolling carousel
- Add navigation arrows and touch support
- Implement responsive breakpoints

### Step 5: Build the main Home page
**Purpose**: Integrate all components into Netflix-style layout
**Tasks**:
- Create tag-based sections
- Integrate carousels and lane cards
- Add loading and empty states
- Implement responsive design
