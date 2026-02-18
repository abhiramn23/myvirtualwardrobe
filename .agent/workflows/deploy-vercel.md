---
description: How to deploy the Virtual Wardrobe application to Vercel
---

Follow these steps to deploy your application:

### 1. Preparation
Ensure all your latest changes are pushed to GitHub (this was completed in the previous step).

### 2. Vercel Project Setup
1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account.
2. Click the **"Add New..."** button and select **"Project"**.
3. Locate your `myvirtualwardrobe` repository in the list and click **"Import"**.

### 3. Configure Environment Variables
Before clicking "Deploy", you must add your Supabase credentials:
1. Expand the **Environment Variables** section.
2. Open your local `.env.local` file.
3. Add the following keys and values:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **"Add"** for each one.

### 4. Build and Deploy
1. Keep the default Build and Output settings (Vercel automatically detects Next.js).
2. Click **"Deploy"**.
3. Wait for the build to complete (usually 1-3 minutes).

### 5. Finalize Supabase Authentication
To ensure login/logout redirects work on your live site:
1. Go to your [Supabase Dashboard](https://app.supabase.com/).
2. Select your project.
3. Go to **Authentication** > **URL Configuration**.
4. In the **Redirect URLs** section, click **"Add URL"**.
5. Paste your new Vercel production URL (e.g., `https://your-app-name.vercel.app/`).
6. Click **"Save"**.

// turbo
### 6. Health Check (Optional)
If you encounter build errors, you can run this command locally to debug before pushing again:
```bash
npm run build
```
