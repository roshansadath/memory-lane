This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

# 📸 Memory Lane

A simple React + Next.js + TypeScript application for creating and sharing *memory lanes* — chronological collections of memories with images, grouped by dynamic tags (like Netflix genres).  

---

## ✨ Functional Requirements

- *Home Page*
  - Netflix-style layout with tag-based carousels of memory lanes.
  - Each lane shows cover image, title, description, memory count.
  - Clicking opens the lane detail page.

- *Memory Lane Page*
  - Chronological timeline of memories.
  - Each memory has a title, description, timestamp, and ≥1 image.
  - User is allowed to click on the options to add/edit/delete memories.
  - The user is prompted to login with their credentials to add/edit/delete memories.
  - Only the user's with userId matching with the userId of the memorylane are allowed to make changes to those memories.

- *Authentication*
  - Simple password login.
  - Only authenticated users can create/edit/delete.
  - Public visitors always have read-only access.

- *Images*
  - Upload via Supabase Storage.
  - Reorder images, add alt text, choose cover image.

---

## 🛠 Tech Stack

- *Frontend*: React 18, Next.js 14 (App Router), TypeScript  
- *Styling*: Tailwind CSS, shadcn/ui  
- *Forms & State*: react-hook-form, zod, TanStack Query  
- *Backend*: Next.js API routes (BFF pattern)  
- *Database*: Supabase PostgreSQL + Prisma ORM  
- *Storage*: Supabase Storage (S3-like buckets)  
- *Auth*: Single password, bcrypt-hashed, JWT in HTTP-only cookie  
- *Deployment*: Vercel (frontend + backend), Supabase (DB + Storage)  

---

## 🏗 Architecture

```mermaid
flowchart TD
    A[Visitor/Editor Browser] -->|GET/POST| B[Next.js App Router (UI + API Routes)]
    B -->|CRUD Lanes/Memories| C[(Supabase PostgreSQL)]
    B -->|Presigned Upload| D[(Supabase Storage)]
    B -->|Login/Logout| E[JWT Cookie Auth]


🎯 Non-Functional Requirements
- Performance: Fast page loads, lazy-loaded images, cached GETs.
- Reliability: Graceful error handling, retry for uploads.
- Security: bcrypt password, JWT cookie, presigned uploads.
- Usability: Clean UI, empty states, clear editor mode.
- Maintainability: One repo, Prisma migrations, typed contracts.
- Cost: Free-tier friendly with Vercel + Supabase.

🎨 UI Specs
- Home: Netflix-style, lanes grouped by tags in carousels.
- Lane Page: Vertical timeline of memories by year.
- Memory Card: Text + image carousel.
- Forms: Modals for lane/memory creation & editing.
- Auth: Simple login form, Editor Mode banner.


model MemoryLane {
  id            String       @id @default(uuid())
  slug          String       @unique
  title         String
  description   String?
  coverImageUrl String?
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  memories      Memory[]
  tags          LaneTag[]
}

model Memory {
  id          String        @id @default(uuid())
  laneId      String
  title       String
  description String?
  occurredAt  DateTime
  sortIndex   Int           @default(0)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  lane        MemoryLane    @relation(fields: [laneId], references: [id], onDelete: Cascade)
  images      MemoryImage[]
}

model MemoryImage {
  id        String   @id @default(uuid())
  memoryId  String
  url       String
  alt       String?
  sortIndex Int      @default(0)

  memory    Memory   @relation(fields: [memoryId], references: [id], onDelete: Cascade)
}

model Tag {
  id    String    @id @default(uuid())
  name  String    @unique
  lanes LaneTag[]
}

model LaneTag {
  laneId String
  tagId  String

  lane   MemoryLane @relation(fields: [laneId], references: [id], onDelete: Cascade)
  tag    Tag        @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([laneId, tagId])
}