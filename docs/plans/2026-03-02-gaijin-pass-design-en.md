# Gaijin Pass — Full-Stack Design Document

**Date:** 2026-03-02
**Project:** Gaijin Pass
**Tagline:** Your passport into a new life!
**Contributors:** Terry Feng, Yijie Xiao, Kolby Hart

---

## 1. Project Overview

Gaijin Pass is a web-based information platform for foreigners living in Japan, addressing the following core problems:
- Life procedure information is scattered, outdated, and mostly only available in Japanese
- No single platform provides clear, step-by-step guides for essential tasks
- Target users include people who are still learning Japanese

The platform provides two core pillars: a structured Guidebook and community Experience Posts, supported by comments, likes, reporting, and admin moderation.

---

## 2. Tech Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| Frontend Framework | React 18 + Vite | Fast startup, HMR development experience |
| Routing | React Router v6 | Standard SPA routing |
| Styling | Tailwind CSS | Utility-first, rapid development |
| State Management | React Context + Supabase SDK | Context for auth state, keeps things simple |
| Backend / Database | Supabase (PostgreSQL + Auth + Storage + RLS) | Fully managed, no custom server needed |
| Deployment | Vercel (frontend) + Supabase Cloud (backend) | Free tier, auto-deploy on push |
| Package Manager | npm | Default tooling |

**Excluded (YAGNI):** Redux/Zustand, TypeScript, third-party UI component libraries

---

## 3. Database Schema (PostgreSQL via Supabase)

### `profiles` (user info, linked to Supabase Auth)

| Field | Type | Description |
|-------|------|-------------|
| id | uuid (PK) | Matches auth.users.id |
| username | text | Display name |
| avatar_url | text | Avatar image URL |
| role | text | `'user'` or `'admin'`, default `'user'` |
| created_at | timestamptz | Registration time |

### `categories` (shared by guidebook and posts)

| Field | Type | Description |
|-------|------|-------------|
| id | serial (PK) | |
| name | text | e.g. "Ward Office", "Banking" |
| created_at | timestamptz | |

### `guidebook_articles` (admin-managed guide content)

| Field | Type | Description |
|-------|------|-------------|
| id | serial (PK) | |
| category_id | int (FK → categories) | |
| title | text | Article title |
| content | text | Body text |
| checklist_items | jsonb | e.g. `["Bring passport", "Fill out form"]` |
| order | int | Sort order within category |
| created_at | timestamptz | |

### `posts` (user experience posts)

| Field | Type | Description |
|-------|------|-------------|
| id | serial (PK) | |
| user_id | uuid (FK → profiles) | Author |
| category_id | int (FK → categories) | |
| title | text | |
| content | text | |
| image_url | text | Supabase Storage URL (nullable) |
| likes_count | int | Denormalized like count for performance |
| created_at | timestamptz | |

### `comments`

| Field | Type | Description |
|-------|------|-------------|
| id | serial (PK) | |
| post_id | int (FK → posts) | |
| user_id | uuid (FK → profiles) | |
| content | text | |
| created_at | timestamptz | |

### `likes`

| Field | Type | Description |
|-------|------|-------------|
| id | serial (PK) | |
| post_id | int (FK → posts) | |
| user_id | uuid (FK → profiles) | |
| created_at | timestamptz | |

> `(post_id, user_id)` has a UNIQUE constraint to prevent duplicate likes

### `reports`

| Field | Type | Description |
|-------|------|-------------|
| id | serial (PK) | |
| reporter_id | uuid (FK → profiles) | Who filed the report |
| post_id | int (FK → posts, nullable) | Reported post |
| comment_id | int (FK → comments, nullable) | Reported comment |
| reason | text | Reason for report |
| status | text | `'pending'` / `'resolved'` |
| created_at | timestamptz | |

### Row Level Security (RLS) Policies

| Table | Read | Write / Edit / Delete |
|-------|------|-----------------------|
| guidebook_articles, categories | Everyone | Admin only |
| posts, comments | Everyone | Authenticated users can create; owner or admin can edit/delete |
| likes | Authenticated users | Own records only |
| reports | Admin only | Authenticated users can create |

---

## 4. Frontend Page Structure & Routing

| Route | Page | Access |
|-------|------|--------|
| `/` | Landing Page | Everyone |
| `/guidebook` | Guidebook Category List | Everyone |
| `/guidebook/:categoryId` | Guidebook Article Detail + Checklist | Everyone |
| `/posts` | Experience Posts Feed | Everyone |
| `/posts/:postId` | Post Detail + Comments + Likes | Everyone |
| `/posts/new` | Create Post Form | Authenticated users |
| `/login` | Login Page | Unauthenticated |
| `/register` | Register Page | Unauthenticated |
| `/profile` | User Profile | Authenticated users |
| `/admin` | Admin Dashboard | Admin only |

### Directory Structure (Feature-based)

```
src/
├── lib/
│   └── supabaseClient.js
├── context/
│   └── AuthContext.jsx
├── components/
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx
│   ├── AdminRoute.jsx
│   └── ImageUpload.jsx
├── features/
│   ├── auth/
│   │   ├── LoginForm.jsx
│   │   └── RegisterForm.jsx
│   ├── guidebook/
│   │   ├── CategoryList.jsx
│   │   ├── ArticleDetail.jsx
│   │   └── ChecklistItem.jsx
│   ├── posts/
│   │   ├── PostCard.jsx
│   │   ├── PostList.jsx
│   │   ├── PostDetail.jsx
│   │   ├── PostForm.jsx
│   │   └── LikeButton.jsx
│   ├── comments/
│   │   ├── CommentList.jsx
│   │   └── CommentForm.jsx
│   └── admin/
│       ├── AdminDashboard.jsx
│       ├── GuidebookManager.jsx
│       └── ReportQueue.jsx
└── pages/
    ├── LandingPage.jsx
    ├── GuidebookPage.jsx
    ├── GuidebookDetailPage.jsx
    ├── PostsPage.jsx
    ├── PostDetailPage.jsx
    ├── NewPostPage.jsx
    ├── LoginPage.jsx
    ├── RegisterPage.jsx
    ├── ProfilePage.jsx
    └── AdminPage.jsx
```

---

## 5. Key Implementation Flows

### 1. Supabase Initialization

```js
// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

Credentials stored in `.env`, excluded from git via `.gitignore`.

### 2. Auth State Management (AuthContext)

- Restore session on app load via `supabase.auth.getSession()`
- Listen for changes via `supabase.auth.onAuthStateChange`
- Fetch `profiles.role` to determine admin status
- Expose `user`, `profile`, `loading`, `logout()`

### 3. Image Upload Flow

```
User selects image
  → supabase.storage.from('post-images').upload(path, file)
  → Get public URL
  → Store URL in posts.image_url
```

Storage bucket: `post-images` (public bucket)

### 4. Like / Unlike Logic

- Like: insert into `likes` + increment `posts.likes_count`
- Unlike: delete from `likes` + decrement `posts.likes_count`
- UNIQUE constraint prevents duplicate likes

### 5. Setting Admin Role

In Supabase Dashboard → Table Editor → `profiles` table: manually set the target user's `role` field to `'admin'`. One-time operation, no code required.

### 6. Vercel Deployment

- Connect GitHub repo to Vercel
- Push to `main` branch triggers automatic deployment
- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel environment variables

---

## 6. Development Phases (MVP-First)

### Phase 1: Project Setup + Authentication
- Initialize Vite + React project
- Configure Tailwind CSS + React Router
- Create Supabase project, set up `profiles` table + RLS
- Implement AuthContext
- Build Login and Register pages

### Phase 2: Guidebook Module
- Create `categories` + `guidebook_articles` tables + RLS
- Guidebook category list page + article detail page
- Admin dashboard: CRUD for guidebook articles

### Phase 3: Posts Core Module
- Create `posts` + `comments` + `likes` tables + RLS
- Post list, post detail, create post (with image upload)
- Comments feature + likes feature

### Phase 4: Reports + Polish
- Create `reports` table + RLS
- Report button + admin review queue
- User profile page
- Deploy to Vercel
- Overall UI polish

---

## 7. User Role Permissions

| Feature | Visitor | Authenticated User | Admin |
|---------|---------|-------------------|-------|
| Browse Guidebook | ✓ | ✓ | ✓ |
| Browse Posts | ✓ | ✓ | ✓ |
| Create posts / comments / likes | ✗ | ✓ | ✓ |
| Edit / delete own content | ✗ | ✓ | ✓ |
| Report content | ✗ | ✓ | ✓ |
| Manage Guidebook | ✗ | ✗ | ✓ |
| Review reports | ✗ | ✗ | ✓ |
| Delete any content | ✗ | ✗ | ✓ |

---

## 8. Non-Functional Requirements

- **Performance:** Primary pages load within 2 seconds for 95% of requests under normal network conditions
- **Scalability:** Supports at least 500 concurrent users without significant degradation
- **Availability:** 99% uptime excluding scheduled maintenance
- **Security:** All data encrypted in transit and at rest; RLS enforces access control server-side
- **Accessibility:** Responsive on desktop and mobile modern browsers, no installation required
- **Error Handling:** Clear user-facing messages for all failed operations

---

## 9. Scope Boundaries

**In MVP:** Registration/login, Guidebook, Experience Posts, Comments, Likes, Reports, Admin moderation

**Out of scope (future iterations):**
- Multi-language support (Japanese, etc.)
- Content bookmarking
- Real-time chat
- Location-based services
- Recommendation algorithms
- Native mobile application
