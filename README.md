# Doorvana Customer Journey Map

Interactive customer journey visualization for Doorvana's Salesforce implementation across 5 business segments.

## 🚀 Features

- **5 Business Segments**: Custom Home Builders, Retail (North TX), Garage Door Dealers, Commercial Bidding, Commercial Service
- **Interactive Journey Maps**: Click through phases to see step-by-step workflows
- **SF Requirements View**: Technical build specifications for Salesforce implementation
- **Export Functionality**: Print or export journey maps as JSON
- **Real-time Updates**: Powered by Convex for instant data synchronization
- **CRUD Admin Panel**: Full ability to create, edit, and delete segments, phases, steps, requirements, and decisions

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: Convex (Backend-as-a-Service)
- **Fonts**: DM Sans (Google Fonts)
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Convex account (free at [convex.dev](https://convex.dev))

## 🏁 Getting Started

### 1. Clone and Install

```bash
cd doorvana-journey
npm install
```

### 2. Set Up Convex

```bash
# Initialize Convex (creates .env.local automatically)
npx convex dev
```

This will:
- Create a new Convex project (or link to existing)
- Generate your `NEXT_PUBLIC_CONVEX_URL` in `.env.local`
- Start the Convex dev server
- Watch for schema and function changes

### 3. Seed the Database

**Automated Seed Script Available!** All 5 segments with complete data can be seeded automatically.

#### Method 1: Via Convex Dashboard (Easiest)
1. Go to your Convex dashboard at https://dashboard.convex.dev
2. Navigate to your project → **Functions** tab
3. Find **`seed:seedAll`** in the list
4. Click **"Run"** button
5. Watch the console output - it will seed all 5 segments!

#### Method 2: Via Terminal (Alternative)
```bash
# While npx convex dev is running in another terminal
npx convex run seed:seedAll
```

**What gets seeded:**
- ✅ **5 Complete Segments**: Builders, Retail, Dealers, Commercial, Service
- ✅ **20+ Phases** across all segments
- ✅ **100+ Workflow Steps** with icons and details
- ✅ **35+ Requirements** areas for Salesforce implementation
- ✅ **25+ Open Decisions** to track
- ✅ **30+ Flow Diagram Items** for visual workflows

**Note:** The seed script clears existing data first, then populates everything fresh. This is safe to run multiple times.

### 4. Run Development Server

```bash
# In one terminal: Run Convex dev server
npx convex dev

# In another terminal: Run Next.js dev server
npm run dev
```

Visit http://localhost:3000

## 📁 Project Structure

```
doorvana-journey/
├── app/
│   ├── layout.tsx              # Root layout with Convex provider
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Tailwind + print styles
│   └── journey/
│       └── page.tsx            # Journey viewer page
├── components/
│   ├── ConvexClientProvider.tsx
│   └── journey/
│       ├── JourneyViewer.tsx   # Main interactive viewer
│       ├── SegmentSelector.tsx # Segment selection buttons
│       ├── PhaseCard.tsx       # Phase cards
│       ├── StepRow.tsx         # Individual step display
│       ├── FlowDiagram.tsx     # Visual flow representation
│       ├── RequirementsView.tsx # SF requirements display
│       └── ExportButton.tsx    # Print/export functionality
├── convex/
│   ├── schema.ts               # Convex database schema
│   ├── segments.ts             # Segment queries & mutations
│   └── tsconfig.json           # Convex TypeScript config
└── lib/
    ├── types.ts                # TypeScript type definitions
    ├── utils.ts                # Utility functions
    └── constants.ts            # Color schemes, constants
```

## 🗄️ Database Schema

### Tables (6 total)

1. **segments** - Business segments (builders, retail, dealers, etc.)
2. **phases** - Workflow phases within each segment
3. **steps** - Individual steps within each phase
4. **requirements** - Salesforce build requirements per segment
5. **openDecisions** - Outstanding questions/decisions
6. **flowDiagramItems** - Visual flow diagram badges

All tables have proper indexes and relationships managed by Convex.

## 📝 Available Scripts

```bash
# Development
npm run dev                 # Start Next.js dev server
npx convex dev             # Start Convex dev server (in separate terminal)

# Build & Deploy
npm run build              # Build Next.js for production
npm start                  # Start production server
npx convex deploy          # Deploy Convex backend

# Utilities
npm run lint               # Run ESLint
```

## 🎨 Customization

### Color Schemes

Colors are defined in `lib/constants.ts` and `app/globals.css`. Each segment has its own color palette.

### Adding New Segments

1. Add data via Convex dashboard or mutation
2. Ensure all related phases, steps, requirements are connected
3. Add flow diagram items for visual representation

## 📤 Export Features

- **Print**: Use the Print button or Ctrl+P (styled for print with proper page breaks)
- **JSON Export**: Download complete segment data as JSON for backup or migration

## 🚢 Deployment

### Deploy to Vercel

```bash
# Build and deploy Convex backend first
npx convex deploy --prod

# Deploy Next.js to Vercel
vercel --prod
```

Make sure to set environment variables in Vercel dashboard:
- `NEXT_PUBLIC_CONVEX_URL` - Your production Convex URL
- `CONVEX_DEPLOYMENT` - Your Convex deployment name

### Environment Variables

See `.env.example` for required environment variables.

## 🐛 Troubleshooting

### "Cannot find module '@/convex/_generated/api'"

Run `npx convex dev` to generate the Convex client files.

### Convex functions not working

1. Ensure `npx convex dev` is running
2. Check that `.env.local` has `NEXT_PUBLIC_CONVEX_URL`
3. Verify Convex dashboard shows your deployment as active

### Styling not working

Ensure Tailwind CSS v4 is properly installed and `app/globals.css` imports `@import "tailwindcss";`

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev)
- [Tailwind CSS v4 Docs](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)

## 👤 Author

Built for Doorvana's Salesforce implementation reference.

## 📄 License

Private - Internal Use Only
