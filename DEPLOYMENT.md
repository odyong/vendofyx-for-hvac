# Deployment Guide 🚀

Vendofyx is optimized for deployment on the **Netlify Free Tier**.

## 🏗️ Netlify Configuration

### 1. Manual Deploy (Simple)
If you are deploying this project manually:
1.  Ensure all files (`index.html`, `index.tsx`, etc.) are in the root directory.
2.  The `index.html` uses an **Import Map**, so no complex bundling (Webpack/Vite) is strictly required for this specific architecture.

### 2. Build Settings (For CI/CD)
If using a Git-based workflow:
*   **Build Command**: `npm run build` (or leave empty if using vanilla JS/TS).
*   **Publish Directory**: `.` (root).

### 3. Environment Variables
Although the MVP uses mock data, the `VendofyxService` is architected to switch to Supabase. When moving to production, add these to the Netlify UI:
*   `SUPABASE_URL`: Your project URL.
*   `SUPABASE_ANON_KEY`: Your project anonymous key.

## 🔒 Security Notes
*   **HTTPS**: Netlify provides SSL by default. Ensure it is enabled to protect user session data.
*   **API Keys**: Never hardcode keys in `api.ts`. Always use `process.env`.

## 📦 Netlify Functions
For the future **Paddle Integration**, use Netlify Functions to handle webhooks securely without a full backend server.