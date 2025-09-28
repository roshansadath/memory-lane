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



# HomePage Backend, Auth and API

Perfect! Thank you for providing the SQL schema. I can see it's well-structured and I'll build upon it. Here's my updated plan:

## **Updated Backend Development Plan**

### **Phase 1: Database Schema & Dependencies Setup**

#### **1.1 Create Prisma Schema**
- Convert the provided SQL schema to Prisma format
- Add `userId` foreign key to `MemoryLane` table (missing from SQL)
- Add proper indexes and constraints
- Set up Supabase as the database provider

#### **1.2 Add Required Dependencies**
```json
{
  "prisma": "^5.0.0",
  "@prisma/client": "^5.0.0", 
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "@types/bcryptjs": "^2.4.6",
  "@types/jsonwebtoken": "^9.0.5"
}
```

#### **1.3 Environment Variables**
Add to `.env`:
```
DATABASE_URL="postgresql://..."
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="2h"
```

### **Phase 2: Authentication System**

#### **2.1 Auth Utilities** (`src/lib/auth.ts`)
- Password hashing with bcryptjs
- JWT token generation/verification (2-hour expiration)
- User session management

#### **2.2 Auth API Routes**
- `POST /api/auth/register` - User registration with email/password
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - Clear session
- `GET /api/auth/me` - Get current user info

#### **2.3 Auth Middleware** (`src/lib/middleware.ts`)
- JWT verification for protected routes
- User context injection

### **Phase 3: CRUD API Routes**

#### **3.1 Memory Lanes API**
- `GET /api/lanes` - Get user's memory lanes (with memories count)
- `POST /api/lanes` - Create new memory lane
- `GET /api/lanes/[id]` - Get specific lane with memories
- `PUT /api/lanes/[id]` - Update lane
- `DELETE /api/lanes/[id]` - Delete lane

#### **3.2 Memories API**
- `GET /api/lanes/[id]/memories` - Get memories for a lane
- `POST /api/lanes/[id]/memories` - Create memory
- `PUT /api/memories/[id]` - Update memory
- `DELETE /api/memories/[id]` - Delete memory

#### **3.3 Memory Images API**
- `POST /api/memories/[id]/images` - Upload memory images
- `DELETE /api/images/[id]` - Delete image

#### **3.4 Tags API**
- `GET /api/tags` - Get all tags
- `POST /api/tags` - Create new tag
- `PUT /api/tags/[id]` - Update tag

### **Phase 4: Frontend Integration**

#### **4.1 Update Data Service**
- Replace mock data calls with real API calls
- Add authentication headers to requests

#### **4.2 Add Auth Context**
- User session management
- Login/logout functionality
- Protected route handling

#### **4.3 Update Hooks**
- Modify `useMemoryLanes` to work with authenticated API
- Add loading and error states

### **Key Improvements from SQL Schema:**
1. **Add `userId` to MemoryLane** - Essential for user-scoped data
2. **Add `color` field to Tag** - Great for UI differentiation
3. **Proper timestamps** - Using `createdAt` and `updatedAt` consistently
4. **Foreign key constraints** - Maintain data integrity
5. **Cascade deletes** - When lane is deleted, delete associated memories

### **API Response Format:**
```typescript
// Success response
{
  success: true,
  data: T,
  message?: string
}

// Error response  
{
  success: false,
  error: string,
  message?: string
}
```

### **Security Considerations:**
- Password hashing with bcryptjs
- JWT tokens with 2-hour expiration
- User-scoped data access (users can only access their own data)
- Input validation with Zod schemas
- SQL injection prevention via Prisma

**Would you like me to start with Phase 1 - creating the Prisma schema and setting up dependencies?**