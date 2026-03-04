# 🌿 Leafy PWA
**by Sematech Developers**

A secure, beautiful real-time messaging Progressive Web App built with Supabase.

---

## 🚀 Deploy to Vercel in 5 Minutes

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Leafy PWA v4.0"
git remote add origin https://github.com/YOUR_USERNAME/leafy-app.git
git push -u origin main
```

### Step 2 — Connect to Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repository
3. Framework: **Other** (static site — no build needed)
4. Click **Deploy**

### Step 3 — Add Supabase Environment Variables

In your Vercel project → **Settings → Environment Variables**, add:

| Name | Value |
|------|-------|
| `LEAFY_SUPABASE_URL` | `https://YOUR_PROJECT_ID.supabase.co` |
| `LEAFY_SUPABASE_ANON_KEY` | `your_anon_key_here` |

Then in `index.html`, uncomment and update the config block:

```html
<script>
  window.LEAFY_SUPABASE_URL      = 'https://YOUR_PROJECT_ID.supabase.co'
  window.LEAFY_SUPABASE_ANON_KEY = 'your_anon_key_here'
</script>
```

> **Security note:** The `anon` key is safe to expose — Supabase Row Level Security (RLS) policies protect your data. Never expose your `service_role` key.

### Step 4 — Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste the contents of `leafy_schema.sql` → Run
3. In **Authentication → Settings**, set your Site URL to your Vercel domain (e.g. `https://leafy-app.vercel.app`)
4. In **Authentication → Settings**, enable **Email Confirmations** (recommended)
5. In **Database → Replication**, enable realtime for: `messages`, `message_reactions`, `conversation_members`, `notifications`, `profiles`

### Step 5 — Redeploy

After updating the config in `index.html`:

```bash
git add index.html
git commit -m "add supabase config"
git push
```

Vercel will auto-redeploy. Your app is live! 🎉

---

## 📁 File Structure

```
leafy-pwa/
├── index.html          # Single-file PWA (HTML + CSS + JS)
├── js/
│   └── app.js          # Main application logic
├── manifest.json       # PWA manifest
├── sw.js               # Service Worker (offline support)
├── vercel.json         # Vercel routing config
├── icons/
│   ├── icon.svg        # Source icon
│   ├── icon-192.png    # PWA icon (192×192)
│   └── icon-512.png    # PWA icon (512×512)
└── README.md           # This file
```

---

## ✅ Features

| Feature | Status | Powered by |
|---------|--------|------------|
| Email auth (sign up/in/out) | ✅ Live | Supabase Auth |
| Password reset via email | ✅ Live | Supabase Auth |
| Session persistence | ✅ Live | Supabase Auth |
| Real-time messaging | ✅ Live | Supabase Realtime |
| User profiles | ✅ Live | Supabase DB |
| Profile photo upload | ✅ Live | Supabase Storage |
| File attachments | ✅ Live | Supabase Storage |
| Voice notes | ✅ Live | Web Audio + Storage |
| Polls with voting | ✅ Live | Supabase DB |
| Message reactions | ✅ Live | Supabase Realtime |
| Self-destructing messages | ✅ Live | Supabase DB + client timer |
| Read receipts | ✅ Live | Supabase DB |
| Online presence | ✅ Live | Supabase DB |
| Starred messages | ✅ Live | Supabase DB |
| Notifications | ✅ Live | Supabase Realtime |
| Status/Stories | ✅ Live | Supabase DB |
| Group chats | ✅ Live | Supabase DB |
| DM conversations | ✅ Live | Supabase DB |
| Swipe to reply | ✅ Live | Touch Events |
| Dark/light theme | ✅ Live | CSS variables |
| 9 accent colors | ✅ Live | CSS variables |
| Animated backgrounds | ✅ Live | CSS animations |
| 7 chat moods | ✅ Live | CSS variables |
| 4 bubble styles | ✅ Live | CSS |
| PWA install prompt | ✅ Live | Web App Manifest |
| Offline support | ✅ Live | Service Worker |
| Voice calls | 🔜 Next | WebRTC (Phase 2) |

---

## 🗄️ Database

Run `leafy_schema.sql` in your Supabase SQL Editor to create:
- 15 tables with full RLS policies
- Auto-triggers for profile creation and settings
- 4 storage buckets
- Cleanup function for expired messages

---

## 🔧 Customisation

### Change the accent color
Edit the `:root` CSS block in `index.html`:
```css
--accent: #22c55e;  /* Change to any color */
```

### Change the app name
Search and replace `LEAFY` / `Leafy` in `index.html` and update `manifest.json`.

### Add your own domain
In Vercel: **Settings → Domains** → Add your custom domain.
Then update the Supabase **Site URL** to match.

---

## 🛡️ Security

- All database access goes through Supabase's Row Level Security — users can only read/write their own data
- The anon key is safe to expose in client code
- File uploads are scoped to conversation members
- Self-destruct messages are deleted server-side via a pg_cron job

---

*Leafy v4.0 — Built by Sematech Developers*
