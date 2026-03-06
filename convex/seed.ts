import { mutation } from "./_generated/server";

/**
 * Seed mutation to populate database with all Doorvana segment data
 * Run this from Convex dashboard or via script to populate the database
 *
 * Usage in Convex dashboard:
 * 1. Go to Functions tab
 * 2. Find 'seed:seedAll'
 * 3. Click Run
 */

export const seedAll = mutation({
  handler: async (ctx) => {
    console.log("🌱 Starting database seed...");

    // Clear existing data first (optional - comment out if you want to keep existing data)
    await clearAllData(ctx);

    // Seed all 5 segments
    await seedBuilders(ctx);
    await seedRetail(ctx);
    await seedDealers(ctx);
    await seedCommercial(ctx);
    await seedService(ctx);

    console.log("✅ Database seed complete!");
    return { success: true, message: "All 5 segments seeded successfully" };
  },
});

// Helper function to clear all existing data
async function clearAllData(ctx: any) {
  console.log("🗑️ Clearing existing data...");

  // Delete all data in reverse order (to handle relations)
  const allSteps = await ctx.db.query("steps").collect();
  for (const step of allSteps) {
    await ctx.db.delete(step._id);
  }

  const allFlowItems = await ctx.db.query("flowDiagramItems").collect();
  for (const item of allFlowItems) {
    await ctx.db.delete(item._id);
  }

  const allDecisions = await ctx.db.query("openDecisions").collect();
  for (const decision of allDecisions) {
    await ctx.db.delete(decision._id);
  }

  const allRequirements = await ctx.db.query("requirements").collect();
  for (const req of allRequirements) {
    await ctx.db.delete(req._id);
  }

  const allPhases = await ctx.db.query("phases").collect();
  for (const phase of allPhases) {
    await ctx.db.delete(phase._id);
  }

  const allSegments = await ctx.db.query("segments").collect();
  for (const segment of allSegments) {
    await ctx.db.delete(segment._id);
  }

  console.log("✅ Existing data cleared");
}

// SEGMENT 1: Custom Home Builders
async function seedBuilders(ctx: any) {
  console.log("📦 Seeding Custom Home Builders...");

  const segment = await ctx.db.insert("segments", {
    key: "builders",
    label: "Custom Home Builders",
    icon: "🏗️",
    displayOrder: 1,
  });

  // Phase 1: Prospecting
  const prospecting = await ctx.db.insert("phases", {
    segmentId: segment,
    key: "prospecting",
    label: "Prospecting Sequence",
    duration: "7 Days",
    color: "#1a5276",
    accent: "#2980b9",
    displayOrder: 0,
  });

  const prospectingSteps = [
    { day: "Day 0", action: "Identify Company & Contacts", detail: "Find builder → locate contacts → enrich email → add to sequence within 30 min", tool: "Apollo", icon: "🔍" },
    { day: "Day 0", action: "Email #1 — Initial Outreach", detail: "First cold email fires on sequence enrollment", tool: "Apollo Sequence", icon: "✉️" },
    { day: "Day 1", action: "Phone Call", detail: "24 hrs after Email #1 — direct call", tool: "Apollo / Dialer", icon: "📞" },
    { day: "Day 3", action: "Email #2 — Follow-Up", detail: "Reply-thread to Email #1", tool: "Apollo Sequence", icon: "✉️" },
    { day: "Day 4", action: "LinkedIn Connection", detail: "Personalized connection request", tool: "Apollo / LinkedIn", icon: "🔗" },
    { day: "Day 5", action: "Email #3", detail: "Value-add or social proof angle", tool: "Apollo Sequence", icon: "✉️" },
    { day: "Day 6", action: "Email #4 — Final", detail: "Breakup / last-chance email", tool: "Apollo Sequence", icon: "✉️" },
  ];

  for (let i = 0; i < prospectingSteps.length; i++) {
    await ctx.db.insert("steps", {
      phaseId: prospecting,
      ...prospectingSteps[i],
      displayOrder: i,
      isFuture: false,
    });
  }

  // Phase 2: Nurture
  const nurture = await ctx.db.insert("phases", {
    segmentId: segment,
    key: "nurture",
    label: "No Reply → Nurture",
    duration: "Ongoing",
    color: "#7d3c98",
    accent: "#a569bd",
    displayOrder: 1,
  });

  const nurtureSteps = [
    { day: "Month 1–12", action: "Monthly Nurture Emails", detail: "Project spotlights, case studies, seasonal promos", tool: "SF Flow Builder", icon: "📬" },
    { day: "Month 13+", action: "Quarterly Nurture Emails", detail: "Quarterly indefinitely — ongoing brand presence", tool: "SF Flow Builder", icon: "📬" },
  ];

  for (let i = 0; i < nurtureSteps.length; i++) {
    await ctx.db.insert("steps", {
      phaseId: nurture,
      ...nurtureSteps[i],
      displayOrder: i,
      isFuture: false,
    });
  }

  // Phase 3: Opportunity
  const opportunity = await ctx.db.insert("phases", {
    segmentId: segment,
    key: "opportunity",
    label: "Positive Reply → Opportunity",
    duration: "Variable",
    color: "#1e8449",
    accent: "#27ae60",
    displayOrder: 2,
  });

  const opportunitySteps = [
    { day: "Trigger", action: "Plan Set Received", detail: "Builder sends plan set — handoff to sales", tool: "Manual / Email", icon: "📐" },
    { day: "Conversion", action: "Lead → Opportunity", detail: "Convert in SF → creates Account + Contact", tool: "Salesforce", icon: "⚡" },
    { day: "Analysis", action: "Needs Analysis & Bid", detail: "Quote via Amarr, Clopay, or Doorvana wood", tool: "Quoting Tools", icon: "📋" },
    { day: "Sent", action: "Bid Delivered", detail: "Log timestamp, stage → 'Working'", tool: "Salesforce", icon: "📤" },
    { day: "Follow-Up", action: "Bid Follow-Up Cadence", detail: "Automated reminders to push deal forward", tool: "SF Flow / TBD", icon: "🔄" },
    { day: "Close", action: "Deposit Paid → Work Order", detail: "Deposit triggers work order generation", tool: "Salesforce", icon: "✅" },
  ];

  for (let i = 0; i < opportunitySteps.length; i++) {
    await ctx.db.insert("steps", {
      phaseId: opportunity,
      ...opportunitySteps[i],
      displayOrder: i,
      isFuture: false,
    });
  }

  // Requirements
  await ctx.db.insert("requirements", {
    segmentId: segment,
    area: "Nurture Flow",
    items: ["Flow Builder: monthly × 12, then quarterly indefinitely", "Trigger: Apollo sequence complete, no positive reply", "Doorvana owns content; implementer owns automation", "Unsubscribe / opt-out handling"],
    displayOrder: 0,
  });

  await ctx.db.insert("requirements", {
    segmentId: segment,
    area: "Lead Conversion",
    items: ["Lead → Opp + Account + Contact on plan set receipt", "Stages: New → Working → Deposit Paid → WO Generated", "Bid sent timestamp field", "File storage for plan sets and bids"],
    displayOrder: 1,
  });

  await ctx.db.insert("requirements", {
    segmentId: segment,
    area: "Bid Follow-Up",
    items: ["Auto thank-you on bid delivery", "Reminder cadence (recommend Day 3, 7, 14)", "Decision: SF Flow vs. external tool", "Log touchpoints to Opp timeline"],
    displayOrder: 2,
  });

  await ctx.db.insert("requirements", {
    segmentId: segment,
    area: "Work Order",
    items: ["Trigger: Deposit Paid = true", "Auto-generate WO linked to Opp", "Define fields with ops team"],
    displayOrder: 3,
  });

  // Open Decisions
  const buildersDecisions = [
    "Bid follow-up — SF Flow or external tool?",
    "Nurture sending — SF Email, Marketing Cloud, or third-party?",
    "Work Order — custom object or standard SF WO?",
  ];

  for (let i = 0; i < buildersDecisions.length; i++) {
    await ctx.db.insert("openDecisions", {
      segmentId: segment,
      decision: buildersDecisions[i],
      displayOrder: i,
      isResolved: false,
    });
  }

  // Flow Diagram
  const buildersFlow = [
    { text: "Apollo (7 days)", bg: "#1a5276", fg: "#fff", isSmall: false },
    { text: "Reply?", bg: "#e9ecef", fg: "#495057", isSmall: false },
    { text: "No → Nurture", bg: "#7d3c98", fg: "#fff", isSmall: true },
    { text: "Yes → Plan Set → Opp", bg: "#1e8449", fg: "#fff", isSmall: true },
    { text: "Bid → Deposit → WO", bg: "#212529", fg: "#fff", isSmall: false },
  ];

  for (let i = 0; i < buildersFlow.length; i++) {
    await ctx.db.insert("flowDiagramItems", {
      segmentId: segment,
      ...buildersFlow[i],
      displayOrder: i,
    });
  }

  console.log("✅ Custom Home Builders seeded");
}

// SEGMENT 2: Retail (North TX)
async function seedRetail(ctx: any) {
  console.log("📦 Seeding Retail (North TX)...");

  const segment = await ctx.db.insert("segments", {
    key: "retail",
    label: "Retail (North TX)",
    icon: "🏠",
    displayOrder: 2,
  });

  // Phase 1: Lead Capture
  const leadCapture = await ctx.db.insert("phases", {
    segmentId: segment,
    key: "lead-capture",
    label: "Lead Capture & Qualification",
    duration: "Immediate",
    color: "#b45309",
    accent: "#d97706",
    displayOrder: 0,
  });

  const leadCaptureSteps = [
    { day: "Inbound", action: "Multi-Channel Lead Capture", detail: "Web form, phone, text, referral → SF Lead record", tool: "SF Web-to-Lead / CTI / TBD", icon: "📥" },
    { day: "Inbound", action: "Source & Attribution", detail: "Lead source, campaign/channel, referring party", tool: "SF Lead Fields", icon: "🏷️" },
    { day: "Inbound", action: "Customer Info", detail: "Name, phone, email, address, project description", tool: "SF Lead Fields", icon: "📝" },
    { day: "Validation", action: "North TX Service Area Check", detail: "Auto-disqualify if outside coverage zone", tool: "SF Validation / Flow", icon: "📍" },
  ];

  for (let i = 0; i < leadCaptureSteps.length; i++) {
    await ctx.db.insert("steps", {
      phaseId: leadCapture,
      ...leadCaptureSteps[i],
      displayOrder: i,
      isFuture: false,
    });
  }

  // Phase 2: Scheduling
  const scheduling = await ctx.db.insert("phases", {
    segmentId: segment,
    key: "scheduling",
    label: "Scheduling & Dispatch",
    duration: "Same Day–48 hrs",
    color: "#0e7490",
    accent: "#06b6d4",
    displayOrder: 1,
  });

  const schedulingSteps = [
    { day: "Scheduling", action: "Smart Scheduling / Capacity", detail: "Check tech availability, routes, capacity", tool: "Field Service / Custom / TBD", icon: "📅" },
    { day: "Booking", action: "Appointment Set", detail: "Date, time window, tech, address, notes", tool: "Salesforce", icon: "✅" },
    { day: "Confirmation", action: "Confirmation Text/Email", detail: "Auto-send with details + what to expect", tool: "SF Flow / SMS", icon: "📲" },
    { day: "Day-Of", action: "On-My-Way Text", detail: "Tech triggers 'en route' → customer gets ETA", tool: "SF Flow / SMS", icon: "🚗" },
    { day: "Dispatch", action: "Tech Has Full Context", detail: "All info on mobile device", tool: "SF Mobile / FSL", icon: "📱" },
  ];

  for (let i = 0; i < schedulingSteps.length; i++) {
    await ctx.db.insert("steps", {
      phaseId: scheduling,
      ...schedulingSteps[i],
      displayOrder: i,
      isFuture: false,
    });
  }

  // Phase 3: On-Site
  const onsite = await ctx.db.insert("phases", {
    segmentId: segment,
    key: "onsite",
    label: "On-Site Visit & Quote",
    duration: "1–2 Hours",
    color: "#7c3aed",
    accent: "#8b5cf6",
    displayOrder: 2,
  });

  const onsiteSteps = [
    { day: "Arrival", action: "Photo Capture", detail: "Photos of door, opening, hardware → SF record", tool: "SF Mobile / FSL", icon: "📸" },
    { day: "Quote", action: "On-Site Quote", detail: "Build from Doorvana price book in the field", tool: "PandaDoc / SF CPQ / TBD", icon: "💰" },
    { day: "Quote", action: "Price Book Access", detail: "Single source of truth, real-time mobile", tool: "SF Products / TBD", icon: "📖" },
    { day: "Presented", action: "Quote Presented", detail: "On-site or digital — logged with timestamp", tool: "PandaDoc / Email", icon: "📄" },
  ];

  for (let i = 0; i < onsiteSteps.length; i++) {
    await ctx.db.insert("steps", {
      phaseId: onsite,
      ...onsiteSteps[i],
      displayOrder: i,
      isFuture: false,
    });
  }

  // Phase 4: Close
  const close = await ctx.db.insert("phases", {
    segmentId: segment,
    key: "close",
    label: "Close & Work Order",
    duration: "Same Day–Variable",
    color: "#16a34a",
    accent: "#22c55e",
    displayOrder: 3,
  });

  const closeSteps = [
    { day: "Yes", action: "Customer Accepts", detail: "Opp → 'Closed Won'", tool: "Salesforce", icon: "🤝" },
    { day: "Payment", action: "Deposit / Payment", detail: "Processor TBD", tool: "Payment / TBD", icon: "💳" },
    { day: "Handoff", action: "Work Order → Install Pipeline", detail: "Deposit triggers WO creation", tool: "Salesforce", icon: "🔧" },
  ];

  for (let i = 0; i < closeSteps.length; i++) {
    await ctx.db.insert("steps", {
      phaseId: close,
      ...closeSteps[i],
      displayOrder: i,
      isFuture: false,
    });
  }

  // Requirements
  await ctx.db.insert("requirements", {
    segmentId: segment,
    area: "Lead Capture",
    items: ["Web-to-Lead form", "Phone/CTI auto-create Leads", "SMS/text path (Twilio / SF SMS)", "Referral tracking + attribution", "Required fields: name, phone, email, address, source"],
    displayOrder: 0,
  });

  await ctx.db.insert("requirements", {
    segmentId: segment,
    area: "Service Area Validation",
    items: ["North TX zone check (zip list or geo-boundary)", "Auto-flag/disqualify outside area", "Flow on Lead creation"],
    displayOrder: 1,
  });

  await ctx.db.insert("requirements", {
    segmentId: segment,
    area: "Scheduling & Capacity",
    items: ["⚠️ KEY DECISION: SF FSL vs. custom widget vs. third-party", "Tech availability + route awareness", "Appointment record linked to Lead/Opp", "Calendar view for dispatch"],
    displayOrder: 2,
  });

  await ctx.db.insert("requirements", {
    segmentId: segment,
    area: "Customer Comms",
    items: ["Auto confirmation (SMS + email)", "Day-of reminder", "On-my-way notification", "Define SMS tool"],
    displayOrder: 3,
  });

  await ctx.db.insert("requirements", {
    segmentId: segment,
    area: "Field Quoting",
    items: ["⚠️ KEY DECISION: Price book in SF vs. PandaDoc vs. both?", "Mobile quote building", "Quote logged with timestamp + line items", "E-signature on-site"],
    displayOrder: 4,
  });

  await ctx.db.insert("requirements", {
    segmentId: segment,
    area: "Image Capture",
    items: ["Photo → SF record from mobile", "Files accessible to office team"],
    displayOrder: 5,
  });

  await ctx.db.insert("requirements", {
    segmentId: segment,
    area: "Payment & WO",
    items: ["⚠️ KEY DECISION: Payment processor?", "Deposit triggers WO (install)", "WO fields scoped with ops"],
    displayOrder: 6,
  });

  // Open Decisions
  const retailDecisions = [
    "Scheduling engine — SF FSL vs. custom?",
    "SMS tool — SF native, Twilio, or other?",
    "Field quoting — PandaDoc, SF CPQ, or integrated?",
    "Price book — single source or dual?",
    "Payment processor — must trigger WO.",
    "Phone/text lead capture — CTI + text-to-lead tool?",
  ];

  for (let i = 0; i < retailDecisions.length; i++) {
    await ctx.db.insert("openDecisions", {
      segmentId: segment,
      decision: retailDecisions[i],
      displayOrder: i,
      isResolved: false,
    });
  }

  // Flow Diagram
  const retailFlow = [
    { text: "Lead In", bg: "#b45309", fg: "#fff", isSmall: false },
    { text: "NTX?", bg: "#e9ecef", fg: "#495057", isSmall: false },
    { text: "Schedule", bg: "#0e7490", fg: "#fff", isSmall: false },
    { text: "On-Site + Quote", bg: "#7c3aed", fg: "#fff", isSmall: false },
    { text: "Pay → Install WO", bg: "#16a34a", fg: "#fff", isSmall: false },
  ];

  for (let i = 0; i < retailFlow.length; i++) {
    await ctx.db.insert("flowDiagramItems", {
      segmentId: segment,
      ...retailFlow[i],
      displayOrder: i,
    });
  }

  console.log("✅ Retail (North TX) seeded");
}

// SEGMENT 3: Garage Door Dealers
async function seedDealers(ctx: any) {
  console.log("📦 Seeding Garage Door Dealers...");

  const segment = await ctx.db.insert("segments", {
    key: "dealers",
    label: "Garage Door Dealers",
    icon: "🚪",
    displayOrder: 3,
  });

  // Phase 1: Pre-Sale
  const presale = await ctx.db.insert("phases", {
    segmentId: segment,
    key: "presale",
    label: "Pre-Sale Outbound",
    duration: "7 Days",
    color: "#92400e",
    accent: "#b45309",
    displayOrder: 0,
  });

  const presaleSteps = [
    { day: "Pre-Work", action: "Dealer List Scraped & Enriched", detail: "All TX dealers scraped → Waterfall enrichment → Apollo", tool: "Scraper + Waterfall + Apollo", icon: "🗄️" },
    { day: "Day 0–6", action: "7-Day Outbound Sequence", detail: "Pain points: lost margin, limited selection, long lead times", tool: "Apollo Sequence", icon: "📧" },
    { day: "Day 6", action: "Deliverable: Pricing + Visual Aid", detail: "Dealer pricing for wood doors + visual configurator", tool: "Apollo Sequence", icon: "📎" },
  ];

  for (let i = 0; i < presaleSteps.length; i++) {
    await ctx.db.insert("steps", {
      phaseId: presale,
      ...presaleSteps[i],
      displayOrder: i,
      isFuture: false,
    });
  }

  // Phase 2: Nurture Dealer
  const nurtureDealer = await ctx.db.insert("phases", {
    segmentId: segment,
    key: "nurture-dealer",
    label: "No Reply → Nurture",
    duration: "Ongoing",
    color: "#7d3c98",
    accent: "#a569bd",
    displayOrder: 1,
  });

  const nurtureDealerSteps = [
    { day: "Month 1–12", action: "Monthly Nurture", detail: "Dealer-specific content monthly", tool: "SF Flow Builder", icon: "📬" },
    { day: "Month 13+", action: "Quarterly Nurture", detail: "Quarterly indefinitely", tool: "SF Flow Builder", icon: "📬" },
  ];

  for (let i = 0; i < nurtureDealerSteps.length; i++) {
    await ctx.db.insert("steps", {
      phaseId: nurtureDealer,
      ...nurtureDealerSteps[i],
      displayOrder: i,
      isFuture: false,
    });
  }

  // Phase 3: Activation
  const activation = await ctx.db.insert("phases", {
    segmentId: segment,
    key: "activation",
    label: "Yes → Dealer Activated",
    duration: "Variable",
    color: "#0369a1",
    accent: "#0ea5e9",
    displayOrder: 2,
  });

  const activationSteps = [
    { day: "Yes", action: "Account Created", detail: "Lead → Account + Contact. May not order immediately", tool: "Salesforce", icon: "⚡" },
    { day: "Ongoing", action: "Opp Type: Dealer / Wholesale", detail: "No bid, no deposit. Open-ended timeline", tool: "Salesforce", icon: "🏷️" },
    { day: "Ongoing", action: "Pricing Established", detail: "Dealer has pricing from sequence", tool: "N/A", icon: "💲" },
  ];

  for (let i = 0; i < activationSteps.length; i++) {
    await ctx.db.insert("steps", {
      phaseId: activation,
      ...activationSteps[i],
      displayOrder: i,
      isFuture: false,
    });
  }

  // Phase 4: Ordering
  const ordering = await ctx.db.insert("phases", {
    segmentId: segment,
    key: "ordering",
    label: "Order & Manufacturing",
    duration: "Per Order",
    color: "#15803d",
    accent: "#22c55e",
    displayOrder: 3,
  });

  const orderingSteps = [
    { day: "V1 — Now", action: "Phone/Email Orders", detail: "Test run (200 dealers): manual order creation in SF", tool: "Phone / Email → SF", icon: "📞" },
    { day: "V2 — Future", action: "Dealer Portal", detail: "Future state: self-service portal for orders + tracking", tool: "SF Experience Cloud / TBD", icon: "🌐" },
    { day: "Order", action: "Design Specs Submitted", detail: "Size, wood type, style, finish, hardware", tool: "SF / Portal", icon: "📐" },
    { day: "Order", action: "Manufacturing WO Created", detail: "Manufacturing only (not install) → production pipeline", tool: "Salesforce", icon: "🏭" },
  ];

  for (let i = 0; i < orderingSteps.length; i++) {
    await ctx.db.insert("steps", {
      phaseId: ordering,
      ...orderingSteps[i],
      displayOrder: i,
      isFuture: false,
    });
  }

  // Requirements
  await ctx.db.insert("requirements", {
    segmentId: segment,
    area: "Lead & Account",
    items: ["Bulk Lead import (200 test batch)", "Lead → Dealer Account type + Contact", "Account record type: 'Dealer / Wholesale'"],
    displayOrder: 0,
  });

  await ctx.db.insert("requirements", {
    segmentId: segment,
    area: "Opportunity Record Type",
    items: ["⚠️ NEW: 'Dealer / Wholesale' Opp type", "No bid. Stages: Activated → Ordered → Mfg → Fulfilled", "Open-ended timeline", "Each order = child record, not new Opp"],
    displayOrder: 1,
  });

  await ctx.db.insert("requirements", {
    segmentId: segment,
    area: "Order Intake (V1)",
    items: ["Manual Order records from phone/email", "Specs, quantity, pricing, delivery", "Mfg WO auto-generated from Order"],
    displayOrder: 2,
  });

  await ctx.db.insert("requirements", {
    segmentId: segment,
    area: "Dealer Portal (V2)",
    items: ["⚠️ FUTURE — discuss architecture now, build later", "SF Experience Cloud", "Past orders, status, invoices, self-service ordering"],
    displayOrder: 3,
  });

  await ctx.db.insert("requirements", {
    segmentId: segment,
    area: "Manufacturing WO",
    items: ["⚠️ DIFFERENT: manufacturing only, no install", "Type: 'Manufacturing'", "Status: Submitted → Production → QC → Ready → Fulfilled"],
    displayOrder: 4,
  });

  await ctx.db.insert("requirements", {
    segmentId: segment,
    area: "Nurture (Dealers)",
    items: ["Separate Flow from builders", "Monthly × 12, quarterly indefinitely", "Dealer-specific content"],
    displayOrder: 5,
  });

  // Open Decisions
  const dealersDecisions = [
    "Portal timing — Experience Cloud after 50 dealers? 100?",
    "Order vs. Opp model — Opp per order or Account with child Orders?",
    "Mfg WO fields — coordinate with production team.",
    "Dealer pricing tiers — flat or volume-based?",
    "Fulfillment tracking — in SF or external?",
  ];

  for (let i = 0; i < dealersDecisions.length; i++) {
    await ctx.db.insert("openDecisions", {
      segmentId: segment,
      decision: dealersDecisions[i],
      displayOrder: i,
      isResolved: false,
    });
  }

  // Flow Diagram
  const dealersFlow = [
    { text: "Scrape + Enrich", bg: "#92400e", fg: "#fff", isSmall: false },
    { text: "7-Day Seq", bg: "#b45309", fg: "#fff", isSmall: false },
    { text: "Reply?", bg: "#e9ecef", fg: "#495057", isSmall: false },
    { text: "No → Nurture", bg: "#7d3c98", fg: "#fff", isSmall: true },
    { text: "Yes → Activate", bg: "#0369a1", fg: "#fff", isSmall: true },
    { text: "Order → Mfg WO", bg: "#15803d", fg: "#fff", isSmall: false },
  ];

  for (let i = 0; i < dealersFlow.length; i++) {
    await ctx.db.insert("flowDiagramItems", {
      segmentId: segment,
      ...dealersFlow[i],
      displayOrder: i,
    });
  }

  console.log("✅ Garage Door Dealers seeded");
}

// SEGMENT 4: Commercial Bidding
async function seedCommercial(ctx: any) {
  console.log("📦 Seeding Commercial Bidding...");

  const segment = await ctx.db.insert("segments", {
    key: "commercial",
    label: "Commercial Bidding",
    icon: "🏢",
    displayOrder: 4,
  });

  // Phase 1: Intake
  const intake = await ctx.db.insert("phases", {
    segmentId: segment,
    key: "intake",
    label: "Bid Intake — Plans Received",
    duration: "Day 0",
    color: "#4338ca",
    accent: "#6366f1",
    displayOrder: 0,
  });

  const intakeSteps = [
    { day: "Intake", action: "Invitation to Bid Received", detail: "GC sends plan set via Construct Connect, email, or bid platform — no cold outreach", tool: "Construct Connect / Email", icon: "📨" },
    { day: "Intake", action: "Opportunity Created (No Lead)", detail: "Skips Lead — straight to Opp. Record type: 'Commercial Bid'", tool: "Salesforce", icon: "⚡" },
    { day: "Intake", action: "Plan Set Attached", detail: "Upload to Opp record with project details and bid deadline", tool: "SF Files", icon: "📐" },
    { day: "Intake", action: "Account & Contact Linked", detail: "GC or owner Account + Contact (create or link existing)", tool: "Salesforce", icon: "👤" },
  ];

  for (let i = 0; i < intakeSteps.length; i++) {
    await ctx.db.insert("steps", {
      phaseId: intake,
      ...intakeSteps[i],
      displayOrder: i,
      isFuture: false,
    });
  }

  // Phase 2: Quote
  const quote = await ctx.db.insert("phases", {
    segmentId: segment,
    key: "quote",
    label: "Quote & Bid Submit",
    duration: "1–5 Days",
    color: "#0f766e",
    accent: "#14b8a6",
    displayOrder: 1,
  });

  const quoteSteps = [
    { day: "Analysis", action: "Plan Set Review & Takeoff", detail: "Review plans, identify specs, quantities, special requirements", tool: "Manual / Quoting", icon: "🔍" },
    { day: "Build", action: "Quote Created", detail: "Build commercial quote — Amarr, Clopay, or wood", tool: "Quoting Tools / SF", icon: "📋" },
    { day: "Submit", action: "Bid Submitted to GC", detail: "Logged with timestamp. Stage → 'Bid Submitted'", tool: "Email / Bid Platform", icon: "📤" },
  ];

  for (let i = 0; i < quoteSteps.length; i++) {
    await ctx.db.insert("steps", {
      phaseId: quote,
      ...quoteSteps[i],
      displayOrder: i,
      isFuture: false,
    });
  }

  // Phase 3: Waiting
  const waiting = await ctx.db.insert("phases", {
    segmentId: segment,
    key: "waiting",
    label: "Waiting Period (30–60+ Days)",
    duration: "30–60+ Days",
    color: "#a16207",
    accent: "#eab308",
    displayOrder: 2,
  });

  const waitingSteps = [
    { day: "Day 30", action: "First Follow-Up", detail: "'Has the project been awarded?' Log response in SF", tool: "SF Flow / Manual", icon: "📞" },
    { day: "Day 60", action: "Second Follow-Up", detail: "If still pending, follow up again. If awarded, determine outcome", tool: "SF Flow / Manual", icon: "📞" },
    { day: "Outcome", action: "Log Bid Result", detail: "Three paths: GC didn't win / GC won, picked competitor / GC won, picked Doorvana", tool: "Salesforce", icon: "📊" },
  ];

  for (let i = 0; i < waitingSteps.length; i++) {
    await ctx.db.insert("steps", {
      phaseId: waiting,
      ...waitingSteps[i],
      displayOrder: i,
      isFuture: false,
    });
  }

  // Phase 4: Outcome
  const outcome = await ctx.db.insert("phases", {
    segmentId: segment,
    key: "outcome",
    label: "Bid Outcome Paths",
    duration: "Variable",
    color: "#15803d",
    accent: "#22c55e",
    displayOrder: 3,
  });

  const outcomeSteps = [
    { day: "No Award", action: "GC Didn't Win Project", detail: "Not a Doorvana loss. Stage → 'Closed Lost — No Award'. Maintain relationship", tool: "Salesforce", icon: "🔄" },
    { day: "Competitor", action: "GC Won, Chose Another Vendor", detail: "Log competitor name + loss reason for reporting", tool: "Salesforce", icon: "❌" },
    { day: "Won", action: "GC Won + Picked Doorvana → WO", detail: "Stage → 'Closed Won'. Triggers commercial install Work Order", tool: "Salesforce", icon: "✅" },
  ];

  for (let i = 0; i < outcomeSteps.length; i++) {
    await ctx.db.insert("steps", {
      phaseId: outcome,
      ...outcomeSteps[i],
      displayOrder: i,
      isFuture: false,
    });
  }

  // Requirements
  await ctx.db.insert("requirements", {
    segmentId: segment,
    area: "Opp Record Type & Model",
    items: ["⚠️ NEW: 'Commercial Bid' — starts as Opp, no Lead stage", "Direct Opp creation workflow", "Fields: project name, GC, bid deadline, plan set, address, value", "Link to Account + Contact"],
    displayOrder: 0,
  });

  await ctx.db.insert("requirements", {
    segmentId: segment,
    area: "Commercial Stages",
    items: ["⚠️ UNIQUE: Bid Received → Submitted → Awaiting Award → Won/Lost", "Closed Lost sub-types: 'No Award' vs. 'Lost to Competitor'", "Lost fields: competitor name, loss reason (picklist + text)", "Bid Submitted auto-timestamps"],
    displayOrder: 1,
  });

  await ctx.db.insert("requirements", {
    segmentId: segment,
    area: "Plan Set Management",
    items: ["Easy upload on Opp creation", "Support large files (50–200MB)", "Version control for plan revisions"],
    displayOrder: 2,
  });

  await ctx.db.insert("requirements", {
    segmentId: segment,
    area: "30/60-Day Follow-Up",
    items: ["Automated reminders at Day 30 and 60 post-submission", "Capture response: awarded? To whom? Doorvana selected?", "Escalate if no response at Day 60"],
    displayOrder: 3,
  });

  await ctx.db.insert("requirements", {
    segmentId: segment,
    area: "Competitive Intelligence",
    items: ["On 'Lost to Competitor': capture competitor (picklist + Other)", "Loss reason: price, relationship, product, lead time, other", "Reporting: win/loss by GC, competitor, reason"],
    displayOrder: 4,
  });

  await ctx.db.insert("requirements", {
    segmentId: segment,
    area: "Commercial Install WO",
    items: ["Trigger: Opp → Closed Won", "Type: 'Commercial Installation' (distinct from Retail + Mfg)", "Fields: address, scope, GC contact, timeline, permits", "May need sub-tasks or phases"],
    displayOrder: 5,
  });

  // Open Decisions
  const commercialDecisions = [
    "Follow-up — fully automated email or semi-auto task for rep to call?",
    "Construct Connect — API feed or always manual intake?",
    "Closed Lost granularity — just two sub-types or more?",
    "Competitive reporting — Jeff builds dashboards or external BI?",
    "Commercial WO complexity — sub-tasks or milestones needed?",
  ];

  for (let i = 0; i < commercialDecisions.length; i++) {
    await ctx.db.insert("openDecisions", {
      segmentId: segment,
      decision: commercialDecisions[i],
      displayOrder: i,
      isResolved: false,
    });
  }

  // Flow Diagram
  const commercialFlow = [
    { text: "Plans Received (ITB)", bg: "#4338ca", fg: "#fff", isSmall: false },
    { text: "Opp (No Lead)", bg: "#6366f1", fg: "#fff", isSmall: false },
    { text: "Bid Submitted", bg: "#0f766e", fg: "#fff", isSmall: false },
    { text: "Wait 30–60d", bg: "#a16207", fg: "#fff", isSmall: false },
    { text: "Result?", bg: "#e9ecef", fg: "#495057", isSmall: false },
    { text: "Won → WO", bg: "#15803d", fg: "#fff", isSmall: true },
    { text: "Lost → Log", bg: "#dc2626", fg: "#fff", isSmall: true },
  ];

  for (let i = 0; i < commercialFlow.length; i++) {
    await ctx.db.insert("flowDiagramItems", {
      segmentId: segment,
      ...commercialFlow[i],
      displayOrder: i,
    });
  }

  console.log("✅ Commercial Bidding seeded");
}

// SEGMENT 5: Commercial Service
async function seedService(ctx: any) {
  console.log("📦 Seeding Commercial Service...");

  const segment = await ctx.db.insert("segments", {
    key: "service",
    label: "Commercial Service",
    icon: "🔧",
    displayOrder: 5,
  });

  // Phase 1: Signal
  const signal = await ctx.db.insert("phases", {
    segmentId: segment,
    key: "signal",
    label: "Signal Detection & Outreach",
    duration: "Immediate",
    color: "#991b1b",
    accent: "#dc2626",
    displayOrder: 0,
  });

  const signalSteps = [
    { day: "Signal", action: "Intent Signal Detected", detail: "Sales Intel flags a company searching for overhead door repair or commercial service needs — time-sensitive signal", tool: "Sales Intel", icon: "📡" },
    { day: "Outbound", action: "Rapid Outbound Campaign", detail: "This is urgent — they need it fixed now. Call-first approach, supplemented with email", tool: "Apollo / Dialer", icon: "📞" },
    { day: "Outbound", action: "Speed to Lead Is Critical", detail: "These are active service needs — first vendor to respond often wins. Target: contact within hours, not days", tool: "Sales Rep", icon: "⚡" },
  ];

  for (let i = 0; i < signalSteps.length; i++) {
    await ctx.db.insert("steps", {
      phaseId: signal,
      ...signalSteps[i],
      displayOrder: i,
      isFuture: false,
    });
  }

  // Phase 2: MSA
  const msa = await ctx.db.insert("phases", {
    segmentId: segment,
    key: "msa",
    label: "MSA & Customer Onboarding",
    duration: "1–2 Weeks",
    color: "#7c2d12",
    accent: "#ea580c",
    displayOrder: 1,
  });

  const msaSteps = [
    { day: "Interest", action: "Customer Says Yes — Send MSA", detail: "Master Service Agreement sent with per-door pricing, service scope, and terms", tool: "PandaDoc / DocuSign / TBD", icon: "📝" },
    { day: "Signed", action: "MSA Signed — Customer Onboarded", detail: "MSA executed → full customer record built in Salesforce: Account, Contact, service terms, pricing, agreed scope", tool: "Salesforce", icon: "✅" },
    { day: "Record", action: "MSA Terms Logged in Salesforce", detail: "What's included, what's excluded, any special terms, per-door pricing, and most importantly: service dates and intervals", tool: "Salesforce", icon: "📋" },
  ];

  for (let i = 0; i < msaSteps.length; i++) {
    await ctx.db.insert("steps", {
      phaseId: msa,
      ...msaSteps[i],
      displayOrder: i,
      isFuture: false,
    });
  }

  // Phase 3: First Service
  const firstService = await ctx.db.insert("phases", {
    segmentId: segment,
    key: "first-service",
    label: "First Service Visit",
    duration: "ASAP",
    color: "#0369a1",
    accent: "#0ea5e9",
    displayOrder: 2,
  });

  const firstServiceSteps = [
    { day: "Schedule", action: "Schedule First Service", detail: "Capacity is fluctuating — need real-time scheduling that accounts for commercial service demand alongside retail/install work", tool: "SF FSL / Scheduling / TBD", icon: "📅" },
    { day: "Dispatch", action: "Tech Dispatched with Full Context", detail: "Tech has: MSA terms, door inventory, service history, facility details, contact info on mobile", tool: "SF Mobile / FSL", icon: "📱" },
    { day: "Service", action: "Service Performed & Logged", detail: "Service completed — log work performed, parts used, photos, any issues or follow-up needed", tool: "Salesforce", icon: "🔧" },
    { day: "Complete", action: "Service Record Created", detail: "Timestamped service record linked to Account with full details of what was done", tool: "Salesforce", icon: "📄" },
  ];

  for (let i = 0; i < firstServiceSteps.length; i++) {
    await ctx.db.insert("steps", {
      phaseId: firstService,
      ...firstServiceSteps[i],
      displayOrder: i,
      isFuture: false,
    });
  }

  // Phase 4: Recurring
  const recurring = await ctx.db.insert("phases", {
    segmentId: segment,
    key: "recurring",
    label: "Recurring Service & Predictive Follow-Up",
    duration: "Ongoing",
    color: "#15803d",
    accent: "#22c55e",
    displayOrder: 3,
  });

  const recurringSteps = [
    { day: "Auto", action: "Next Service Date Calculated", detail: "Based on MSA terms and service interval (e.g., every 6 months), system calculates next due date automatically", tool: "Salesforce / Predictive", icon: "🔮" },
    { day: "Proactive", action: "Proactive Outreach — 2 Months Before Due", detail: "Automated reminder or task at T-minus 2 months: 'Reach out to schedule next service before it's due'", tool: "SF Flow / Predictive", icon: "📬" },
    { day: "Schedule", action: "Next Service Scheduled", detail: "Rep contacts customer, books next appointment. Cycle repeats indefinitely", tool: "SF / Scheduling", icon: "📅" },
    { day: "Renewal", action: "MSA Renewal Tracking", detail: "If MSA has an expiration, flag for renewal well in advance. Track renewal rate as a KPI", tool: "Salesforce", icon: "🔄" },
  ];

  for (let i = 0; i < recurringSteps.length; i++) {
    await ctx.db.insert("steps", {
      phaseId: recurring,
      ...recurringSteps[i],
      displayOrder: i,
      isFuture: false,
    });
  }

  // Requirements
  await ctx.db.insert("requirements", {
    segmentId: segment,
    area: "Sales Intel Integration",
    items: ["⚠️ KEY DECISION: How does Sales Intel data get into Salesforce? API push, manual import, or Zapier/middleware?", "Signal data should create or update a Lead/Account with intent context: what they searched, when, urgency level", "Must support rapid handoff — rep needs to see the signal and act within hours", "Lead source = 'Sales Intel — Intent Signal' for attribution tracking"],
    displayOrder: 0,
  });

  await ctx.db.insert("requirements", {
    segmentId: segment,
    area: "Speed-to-Lead Workflow",
    items: ["High-priority Lead routing — Sales Intel signals should surface at the top of the queue", "Real-time notification to assigned rep (push notification, Slack alert, or SF notification)", "SLA tracking: time from signal to first contact. Target: same day", "If no contact within X hours, auto-escalate or reassign"],
    displayOrder: 1,
  });

  await ctx.db.insert("requirements", {
    segmentId: segment,
    area: "MSA Management",
    items: ["MSA record (custom object or document) linked to Account", "Fields: effective date, expiration date, per-door pricing, included services, excluded services, special terms", "Service interval field: frequency of recurring service (e.g., every 6 months)", "Agreed service dates or next-due-date calculation", "MSA document attached (signed PDF via PandaDoc/DocuSign)", "Renewal date tracking with advance alerts"],
    displayOrder: 2,
  });

  await ctx.db.insert("requirements", {
    segmentId: segment,
    area: "Scheduling & Capacity (Shared with Retail)",
    items: ["⚠️ CRITICAL: Commercial service demand must be scheduled alongside retail installs — shared capacity pool", "Fluctuating demand — need flexible scheduling that can absorb spikes", "Emergency/urgent service flag for high-priority commercial requests", "Same scheduling engine as retail (FSL or custom) — but with commercial priority weighting"],
    displayOrder: 3,
  });

  await ctx.db.insert("requirements", {
    segmentId: segment,
    area: "Predictive Service Follow-Up",
    items: ["⚠️ KEY DISCUSSION WITH JEFF: Predictive/proactive service date tracking", "Option A: Simple — Flow calculates next service date from last service + interval, creates Task at T-minus 2 months", "Option B: Advanced — Einstein or custom logic factors in door age, usage patterns, last service findings to recommend timing", "Minimum viable: auto-calculated next-due date + automated Task/reminder for rep to reach out", "Must surface in rep's task list and/or dashboard: 'Upcoming service renewals'"],
    displayOrder: 4,
  });

  await ctx.db.insert("requirements", {
    segmentId: segment,
    area: "Service Record & History",
    items: ["Service Visit object (or Work Order line items) linked to Account", "Fields: date, tech, work performed, parts used, photos, issues found, follow-up needed", "Full service history visible on Account record — chronological log", "Door inventory per facility: how many doors, types, ages, last serviced"],
    displayOrder: 5,
  });

  await ctx.db.insert("requirements", {
    segmentId: segment,
    area: "Reporting & KPIs",
    items: ["Speed-to-lead: signal → first contact time", "MSA conversion rate: signals → signed MSAs", "Service retention: renewal rate, churn tracking", "Revenue per account: recurring service value over time", "Proactive vs. reactive: % of services scheduled proactively vs. emergency calls"],
    displayOrder: 6,
  });

  // Open Decisions
  const serviceDecisions = [
    "Sales Intel → SF integration method — API, Zapier, or manual? Impacts speed-to-lead significantly.",
    "Predictive service — simple date math (Flow) or advanced predictive model (Einstein)? Start simple, upgrade later?",
    "Scheduling capacity — commercial service shares the same tech pool as retail installs. How to prioritize and balance?",
    "MSA storage — custom object, SF Contracts, or document-based? Need structured fields for terms, pricing, and service intervals.",
    "Door inventory tracking — do we need a 'Door' or 'Asset' object per facility to track individual doors and their service history?",
    "Emergency service handling — is there a fast-track path for urgent commercial requests that bypasses the normal scheduling queue?",
  ];

  for (let i = 0; i < serviceDecisions.length; i++) {
    await ctx.db.insert("openDecisions", {
      segmentId: segment,
      decision: serviceDecisions[i],
      displayOrder: i,
      isResolved: false,
    });
  }

  // Flow Diagram
  const serviceFlow = [
    { text: "Sales Intel Signal", bg: "#991b1b", fg: "#fff", isSmall: false },
    { text: "Rapid Outreach", bg: "#dc2626", fg: "#fff", isSmall: false },
    { text: "Yes → MSA Sent", bg: "#7c2d12", fg: "#fff", isSmall: false },
    { text: "Signed → Onboard", bg: "#ea580c", fg: "#fff", isSmall: false },
    { text: "Service → Log", bg: "#0369a1", fg: "#fff", isSmall: false },
    { text: "Predict Next → Repeat", bg: "#15803d", fg: "#fff", isSmall: false },
  ];

  for (let i = 0; i < serviceFlow.length; i++) {
    await ctx.db.insert("flowDiagramItems", {
      segmentId: segment,
      ...serviceFlow[i],
      displayOrder: i,
    });
  }

  console.log("✅ Commercial Service seeded");
}
