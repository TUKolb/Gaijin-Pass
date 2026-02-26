# Gaijin Pass — Frontend Shell

A React + Vite + Supabase starter for the Gaijin Pass platform.

## Project Structure

```
src/
├── lib/
│   ├── supabase.js        # Supabase client (add your keys to .env.local)
│   └── AuthContext.jsx    # Auth state provider — implement signIn/signUp/signOut here
├── components/
│   └── Layout.jsx         # Navbar + Footer wrapper
├── pages/
│   ├── LandingPage.jsx    # Home / hero page
│   ├── GuidebookPage.jsx  # Category browser + checklist
│   ├── PostsFeedPage.jsx  # Community posts feed
│   ├── PostDetailPage.jsx # Individual post + comments
│   ├── PostCreatePage.jsx # New post form
│   ├── ProfilePage.jsx    # User profile
│   ├── LoginPage.jsx      # Login form
│   ├── RegisterPage.jsx   # Registration form
│   └── AdminPage.jsx      # Admin moderation panel
└── index.css              # Global styles / design tokens
```

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure Supabase**
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
   ```

3. **Run dev server**
   ```bash
   npm run dev
   ```

## What Needs To Be Implemented

Every place that needs real logic is marked with a `// TODO:` comment. The main areas:

### 1. Authentication (`src/lib/AuthContext.jsx`)
- `signIn` — call `supabase.auth.signInWithPassword()`
- `signUp` — call `supabase.auth.signUp()` then insert a row into your `users` table
- `signOut` — call `supabase.auth.signOut()`

### 2. Posts Feed (`src/pages/PostsFeedPage.jsx`)
- `useEffect` to fetch posts from `experience_posts` table, with sort/filter

### 3. Post Detail (`src/pages/PostDetailPage.jsx`)
- Fetch single post by `id` param
- `handleLike` — upsert/delete from a `likes` table
- `handleAddComment` — insert into `comments` table
- `handleDeleteComment` — delete from `comments` table

### 4. Post Creation (`src/pages/PostCreatePage.jsx`)
- Upload image to Supabase Storage if provided
- Insert post into `experience_posts` table

### 5. Guidebook (`src/pages/GuidebookPage.jsx`)
- Fetch categories from `guidebook_categories`
- Fetch checklist items from `guidebook_articles` or a dedicated checklist table
- Persist checked state per user

### 6. Admin (`src/pages/AdminPage.jsx`)
- Fetch reports from `reports` table
- Implement dismiss / remove actions
- List and edit `guidebook_articles`

### 7. Profile (`src/pages/ProfilePage.jsx`)
- Fetch user's posts from `experience_posts`
- Implement avatar upload to Supabase Storage

## Deploying to Vercel

```bash
npm run build
# Push to GitHub and connect the repo in Vercel
# Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY as environment variables in Vercel
```
# Gaijin-Pass
