# My Virtual Wardrobe — Features

A comprehensive list of everything a user can see and do inside the application as of now.

---

## Phase 2: User Profiles & Advanced Analytics [COMPLETED]
Implemented user profiles, measurements, rating system, comparison feature, and advanced analytics.

---

## 1. Landing Page

- **Animated Hero Section** — Gradient backgrounds, smooth fade-in animations (Framer Motion), and a prominent call-to-action to sign up or sign in.
- **Feature Highlights** — Four feature cards showcasing: Organize Your Closet, Wishlist & Owned, Build Outfits, and Track Spending.
- **CTA Section** — A styled gradient banner prompting users to create a free account.
- **Footer** — Branding and copyright.

---

## 2. Authentication

### Sign Up
- Create a new account with email and password.
- Animated split-screen layout with a decorative panel and form panel.
- Inline error display for invalid credentials.
- Loading spinner on submit.
- Auto-redirect to dashboard after successful sign-up.

### Sign In
- Sign in with email and password.
- Show/hide password toggle (eye icon).
- Inline error messages.
- Loading state with spinner.
- Auto-redirect to dashboard on success.

### Route Protection
- Middleware-based auth guard on `/dashboard`, `/outfits`, and `/analytics` — unauthenticated users are redirected to `/login`.
- Logged-in users visiting `/login` or `/signup` are automatically redirected to `/dashboard`.

### Sign Out
- One-click sign out from the navbar (both desktop and mobile menu).

---

## 3. Dashboard (My Wardrobe)

### Adding Items
- **"Add Item" button** opens a modal to add a new wardrobe item.
- Fields:
  - **Title** (required)
  - **Image** — two modes:
    - **URL** — paste an image link
    - **Upload** — upload an image file from device (stored in Supabase Storage `item-images` bucket); includes drag-and-drop area and image preview
  - **Price** (required)
  - **Brand** (optional)
  - **Category** — select from: Shirts, Pants, Shoes, Accessories
  - **Status** — select: Wishlist or Owned
  - **Product Link** (optional) — link to the store page
  - **Purchase Date** — shown only when status is "Owned"
- Animated modal with backdrop blur and smooth open/close transitions.

### Viewing Items
- Items displayed in a responsive grid of cards.
- Each **Item Card** shows:
  - Product image (or a category emoji placeholder if no image).
  - **Status badge** — "Owned" (neutral) or "Wishlist" (rose-colored with heart icon).
  - **Category badge** — with emoji icons (👕 👖 👟 💍).
  - **Title** and **price**.
  - **Brand** (if available).
  - **Cost per wear** — displayed for owned items (price ÷ wear count).
  - **Wear count** — displayed for owned items.
- **Hover overlay actions**:
  - Open product link in new tab (if set).
  - Toggle status between Wishlist ↔ Owned (auto-sets today as purchase date when marking as owned).
  - Delete item.

### Filtering Items
- **Category filter** — pill buttons: All, Shirts, Pants, Shoes, Accessories.
- **Status filter** — toggle tabs: All, Owned, Wishlist.
- **Item count** — shows how many items match the current filters.

### Deleting Items
- Delete any item via the hover overlay trash icon on the card.

### Updating Items
- Toggle item status between Wishlist and Owned directly from the card.

---

## 4. Outfit Builder

### Creating Outfits
- **Drag & Drop interface** (powered by dnd-kit):
  - Left panel shows all owned wardrobe items grouped by category (Shirts, Pants, Shoes, Accessories) with emoji headers.
  - Drag an item from the wardrobe panel and drop it into the "Your Outfit" area.
  - Alternatively, **click** an item to select/unselect it.
- Outfit items show a visual preview with image thumbnail, title, price, and a remove button.
- **Total outfit cost** is calculated and displayed in real time.
- **Name your outfit** with a text input.
- **Save outfit** — persists the outfit and its items to the database; automatically increments the wear count for every item included.
- **Clear selection** to start over.

### Viewing Saved Outfits
- Previously saved outfits are listed below the builder.
- Each outfit card shows:
  - Outfit name.
  - Creation date.
  - Thumbnails of all items in the outfit.
  - Total outfit value.
- **Delete outfit** button on each saved outfit.

### Empty States
- Helpful message if no owned items exist yet.
- Helpful message if no outfits have been saved yet.

---

## 5. Analytics

### Summary Stat Cards (6 cards)
| Stat | Description |
|------|-------------|
| Total Wardrobe Value | Combined price of all items (owned + wishlist) |
| Owned Value | Total price of owned items only |
| Wishlist Value | Total price of wishlist items only |
| Avg. Cost Per Wear | Average of (price ÷ wear count) across all worn items |
| Total Items | Count of all items |
| Owned Items | Count of owned items |

### Most Worn Item
- Highlighted card showing the most-worn item with image/emoji, title, wear count, and cost-per-wear.

### Category Breakdown
- Visual breakdown of each category (Shirts, Pants, Shoes, Accessories):
  - Item count per category.
  - Animated progress bar representing relative count.
  - Total value per category.

### Loading State
- Skeleton/pulse animation while data loads.

---

## 6. Navigation & Layout

### Responsive Navbar
- Fixed top navigation bar with glassmorphism effect.
- Logo links to dashboard.
- Desktop links: **Wardrobe**, **Outfits**, **Analytics** with active indicator animation (spring motion underline).
- **Sign Out** button on desktop.
- **Mobile hamburger menu** — slide-down drawer with the same nav links and sign out.

### Responsive Design
- All pages and components are fully responsive (mobile → desktop).
- Grid layouts adapt from 1 column on mobile to 2–4 columns on desktop.

---

## 7. Design & UX

- **Framer Motion animations** — fade-in, scale, slide transitions throughout the app.
- **Glassmorphism** — translucent navbar with backdrop blur.
- **Custom color palette** — cream, blush, rose, champagne, lavender, sage tones.
- **Custom typography** — display font for headings, clean sans-serif for body.
- **Hover effects** — card lift on hover, overlay actions, smooth transitions.
- **Loading spinners** — on form submissions and data fetching.
- **Category color badges** — distinct visual styling per category.

---

## 8. Backend & Data

- **Supabase Authentication** — email/password sign-up and sign-in.
- **Supabase PostgreSQL Database** with three tables:
  - `items` — wardrobe items with title, image, price, brand, category, status, product link, purchase date, wear count.
  - `outfits` — named outfit collections.
  - `outfit_items` — junction table linking outfits to items.
- **Row Level Security (RLS)** — every user can only read, insert, update, and delete their own data.
- **Database Indexes** — optimized queries on user_id, category, status, and junction keys.
- **Supabase Storage** — `item-images` bucket for user-uploaded product images, with public read access and user-scoped write/delete policies.
- **Next.js Middleware** — server-side auth checks and route protection.

---

## 9. Chrome Extension (Template — Future Phase)

A basic Chrome extension template is included for future development:
- **Manifest V3** configuration.
- **Popup UI** — styled popup for saving fashion products from any webpage.
- **Content Script** — injects into all pages to extract product data (title, image, price, URL).
- **Permissions** — `activeTab` and `storage`.

> **Note:** This is a starter template and is not yet wired to the live Supabase backend.

---

## 10. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS 4 |
| Animations | Framer Motion |
| Drag & Drop | dnd-kit |
| Icons | Lucide React |
| Backend / Auth | Supabase (Auth, PostgreSQL, Storage) |
| Auth SSR | @supabase/ssr |
| Deployment-ready | Vercel |
