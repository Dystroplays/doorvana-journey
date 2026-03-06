# 🚀 Quick Setup Guide - Doorvana Journey Map

Follow these steps to get your app running in **under 5 minutes**!

## Step 1: Install Dependencies (1 min)

```bash
cd doorvana-journey
npm install
```

## Step 2: Initialize Convex (2 min)

```bash
npx convex dev
```

**What happens:**
- You'll be prompted to log in to Convex (or create free account)
- Convex creates a new project for you
- `.env.local` file is created automatically with your `NEXT_PUBLIC_CONVEX_URL`
- Convex dev server starts and watches for changes

**Keep this terminal open!** The Convex dev server needs to run continuously.

## Step 3: Seed the Database (30 seconds)

Open your Convex dashboard (the link is shown in the terminal):
- Click on **Functions** tab
- Find `seed:seedAll`
- Click **Run**
- Watch it populate all 5 segments! 🎉

## Step 4: Start Next.js (30 seconds)

**Open a NEW terminal** (keep Convex dev running in the first one):

```bash
npm run dev
```

## Step 5: View Your App! 🎊

Open http://localhost:3000

You should see:
- Landing page with segment overview
- Click "View Journey Map" to see the interactive viewer
- All 5 segments loaded with complete data
- Click through phases to explore workflows
- Try the Print and Export buttons

---

## 🎯 Quick Test Checklist

- [ ] Landing page loads at http://localhost:3000
- [ ] Journey map page loads at http://localhost:3000/journey
- [ ] Can see all 5 segment buttons (Builders, Retail, Dealers, Commercial, Service)
- [ ] Clicking segments switches the view
- [ ] Phase cards are clickable
- [ ] Steps display with timeline and icons
- [ ] "SF Requirements" button shows technical requirements
- [ ] Flow diagram displays at top
- [ ] Print button opens print dialog
- [ ] Export JSON downloads data

---

## 🐛 Troubleshooting

### "Cannot find module '@/convex/_generated/api'"
**Solution:** Make sure `npx convex dev` is running. It generates these files automatically.

### No data showing in the app
**Solution:** Run the seed script again:
1. Go to Convex dashboard → Functions
2. Click `seed:seedAll` → Run

### Convex dev server won't start
**Solution:**
1. Check if you're logged in: `npx convex dev`
2. Make sure you have internet connection
3. Try: `npx convex logout` then `npx convex dev`

### Port 3000 already in use
**Solution:**
```bash
# Kill the process on port 3000
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001
```

---

## 📁 What You Have Now

```
✅ Working Next.js 15 app with TypeScript
✅ Convex backend with real-time updates
✅ Complete database with all 5 segments
✅ Interactive journey viewer
✅ Export/print functionality
✅ Ready to deploy to Vercel
```

---

## 🚀 Next Steps

1. **Explore the Data**: Browse through all 5 segments
2. **Customize**: Edit colors in `lib/constants.ts`
3. **Build Admin Panel**: Add CRUD forms for editing data
4. **Deploy to Vercel**: See README.md for deployment instructions

---

## 💡 Tips

- Keep `npx convex dev` running while developing
- Changes to Convex functions auto-deploy
- Next.js has hot reload for instant UI updates
- Use Convex dashboard to view/edit data directly
- All data is real-time - changes sync instantly!

---

**Need help?** Check the main README.md for detailed documentation!
