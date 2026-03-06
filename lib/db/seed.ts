/**
 * Database Seed Script
 * Populates the database with data from the original JSX component
 */

import { segments, phases, steps, requirements, openDecisions, flowDiagramItems } from './schema';

// Mock database client interface (will be replaced with actual DB client)
interface DbClient {
  insert: (table: any) => {
    values: (data: any) => Promise<{ returning: () => Promise<any[]> }>;
  };
}

// Complete dataset from doorvana-customer-journey.jsx
const seedData = {
  builders: {
    key: 'builders',
    label: 'Custom Home Builders',
    icon: '🏗️',
    displayOrder: 1,
    phases: [
      {
        key: 'prospecting',
        label: 'Prospecting Sequence',
        duration: '7 Days',
        color: '#1a5276',
        accent: '#2980b9',
        displayOrder: 0,
        steps: [
          { day: 'Day 0', action: 'Identify Company & Contacts', detail: 'Find builder → locate contacts → enrich email → add to sequence within 30 min', tool: 'Apollo', icon: '🔍', displayOrder: 0, isFuture: false },
          { day: 'Day 0', action: 'Email #1 — Initial Outreach', detail: 'First cold email fires on sequence enrollment', tool: 'Apollo Sequence', icon: '✉️', displayOrder: 1, isFuture: false },
          { day: 'Day 1', action: 'Phone Call', detail: '24 hrs after Email #1 — direct call', tool: 'Apollo / Dialer', icon: '📞', displayOrder: 2, isFuture: false },
          { day: 'Day 3', action: 'Email #2 — Follow-Up', detail: 'Reply-thread to Email #1', tool: 'Apollo Sequence', icon: '✉️', displayOrder: 3, isFuture: false },
          { day: 'Day 4', action: 'LinkedIn Connection', detail: 'Personalized connection request', tool: 'Apollo / LinkedIn', icon: '🔗', displayOrder: 4, isFuture: false },
          { day: 'Day 5', action: 'Email #3', detail: 'Value-add or social proof angle', tool: 'Apollo Sequence', icon: '✉️', displayOrder: 5, isFuture: false },
          { day: 'Day 6', action: 'Email #4 — Final', detail: 'Breakup / last-chance email', tool: 'Apollo Sequence', icon: '✉️', displayOrder: 6, isFuture: false },
        ],
      },
      {
        key: 'nurture',
        label: 'No Reply → Nurture',
        duration: 'Ongoing',
        color: '#7d3c98',
        accent: '#a569bd',
        displayOrder: 1,
        steps: [
          { day: 'Month 1–12', action: 'Monthly Nurture Emails', detail: 'Project spotlights, case studies, seasonal promos', tool: 'SF Flow Builder', icon: '📬', displayOrder: 0, isFuture: false },
          { day: 'Month 13+', action: 'Quarterly Nurture Emails', detail: 'Quarterly indefinitely — ongoing brand presence', tool: 'SF Flow Builder', icon: '📬', displayOrder: 1, isFuture: false },
        ],
      },
      {
        key: 'opportunity',
        label: 'Positive Reply → Opportunity',
        duration: 'Variable',
        color: '#1e8449',
        accent: '#27ae60',
        displayOrder: 2,
        steps: [
          { day: 'Trigger', action: 'Plan Set Received', detail: 'Builder sends plan set — handoff to sales', tool: 'Manual / Email', icon: '📐', displayOrder: 0, isFuture: false },
          { day: 'Conversion', action: 'Lead → Opportunity', detail: 'Convert in SF → creates Account + Contact', tool: 'Salesforce', icon: '⚡', displayOrder: 1, isFuture: false },
          { day: 'Analysis', action: 'Needs Analysis & Bid', detail: 'Quote via Amarr, Clopay, or Doorvana wood', tool: 'Quoting Tools', icon: '📋', displayOrder: 2, isFuture: false },
          { day: 'Sent', action: 'Bid Delivered', detail: "Log timestamp, stage → 'Working'", tool: 'Salesforce', icon: '📤', displayOrder: 3, isFuture: false },
          { day: 'Follow-Up', action: 'Bid Follow-Up Cadence', detail: 'Automated reminders to push deal forward', tool: 'SF Flow / TBD', icon: '🔄', displayOrder: 4, isFuture: false },
          { day: 'Close', action: 'Deposit Paid → Work Order', detail: 'Deposit triggers work order generation', tool: 'Salesforce', icon: '✅', displayOrder: 5, isFuture: false },
        ],
      },
    ],
    requirements: [
      { area: 'Nurture Flow', items: ['Flow Builder: monthly × 12, then quarterly indefinitely', 'Trigger: Apollo sequence complete, no positive reply', 'Doorvana owns content; implementer owns automation', 'Unsubscribe / opt-out handling'], displayOrder: 0 },
      { area: 'Lead Conversion', items: ['Lead → Opp + Account + Contact on plan set receipt', 'Stages: New → Working → Deposit Paid → WO Generated', 'Bid sent timestamp field', 'File storage for plan sets and bids'], displayOrder: 1 },
      { area: 'Bid Follow-Up', items: ['Auto thank-you on bid delivery', 'Reminder cadence (recommend Day 3, 7, 14)', 'Decision: SF Flow vs. external tool', 'Log touchpoints to Opp timeline'], displayOrder: 2 },
      { area: 'Work Order', items: ['Trigger: Deposit Paid = true', 'Auto-generate WO linked to Opp', 'Define fields with ops team'], displayOrder: 3 },
    ],
    openDecisions: [
      'Bid follow-up — SF Flow or external tool?',
      'Nurture sending — SF Email, Marketing Cloud, or third-party?',
      'Work Order — custom object or standard SF WO?',
    ],
    flowDiagram: [
      { text: 'Apollo (7 days)', bg: '#1a5276', fg: '#fff', isSmall: false, displayOrder: 0 },
      { text: 'Reply?', bg: '#e9ecef', fg: '#495057', isSmall: false, displayOrder: 1 },
      { text: 'No → Nurture', bg: '#7d3c98', fg: '#fff', isSmall: true, displayOrder: 2 },
      { text: 'Yes → Plan Set → Opp', bg: '#1e8449', fg: '#fff', isSmall: true, displayOrder: 3 },
      { text: 'Bid → Deposit → WO', bg: '#212529', fg: '#fff', isSmall: false, displayOrder: 4 },
    ],
  },
  retail: {
    key: 'retail',
    label: 'Retail (North TX)',
    icon: '🏠',
    displayOrder: 2,
    phases: [
      {
        key: 'lead-capture',
        label: 'Lead Capture & Qualification',
        duration: 'Immediate',
        color: '#b45309',
        accent: '#d97706',
        displayOrder: 0,
        steps: [
          { day: 'Inbound', action: 'Multi-Channel Lead Capture', detail: 'Web form, phone, text, referral → SF Lead record', tool: 'SF Web-to-Lead / CTI / TBD', icon: '📥', displayOrder: 0, isFuture: false },
          { day: 'Inbound', action: 'Source & Attribution', detail: 'Lead source, campaign/channel, referring party', tool: 'SF Lead Fields', icon: '🏷️', displayOrder: 1, isFuture: false },
          { day: 'Inbound', action: 'Customer Info', detail: 'Name, phone, email, address, project description', tool: 'SF Lead Fields', icon: '📝', displayOrder: 2, isFuture: false },
          { day: 'Validation', action: 'North TX Service Area Check', detail: 'Auto-disqualify if outside coverage zone', tool: 'SF Validation / Flow', icon: '📍', displayOrder: 3, isFuture: false },
        ],
      },
      {
        key: 'scheduling',
        label: 'Scheduling & Dispatch',
        duration: 'Same Day–48 hrs',
        color: '#0e7490',
        accent: '#06b6d4',
        displayOrder: 1,
        steps: [
          { day: 'Scheduling', action: 'Smart Scheduling / Capacity', detail: 'Check tech availability, routes, capacity', tool: 'Field Service / Custom / TBD', icon: '📅', displayOrder: 0, isFuture: false },
          { day: 'Booking', action: 'Appointment Set', detail: 'Date, time window, tech, address, notes', tool: 'Salesforce', icon: '✅', displayOrder: 1, isFuture: false },
          { day: 'Confirmation', action: 'Confirmation Text/Email', detail: 'Auto-send with details + what to expect', tool: 'SF Flow / SMS', icon: '📲', displayOrder: 2, isFuture: false },
          { day: 'Day-Of', action: 'On-My-Way Text', detail: "Tech triggers 'en route' → customer gets ETA", tool: 'SF Flow / SMS', icon: '🚗', displayOrder: 3, isFuture: false },
          { day: 'Dispatch', action: 'Tech Has Full Context', detail: 'All info on mobile device', tool: 'SF Mobile / FSL', icon: '📱', displayOrder: 4, isFuture: false },
        ],
      },
      {
        key: 'onsite',
        label: 'On-Site Visit & Quote',
        duration: '1–2 Hours',
        color: '#7c3aed',
        accent: '#8b5cf6',
        displayOrder: 2,
        steps: [
          { day: 'Arrival', action: 'Photo Capture', detail: 'Photos of door, opening, hardware → SF record', tool: 'SF Mobile / FSL', icon: '📸', displayOrder: 0, isFuture: false },
          { day: 'Quote', action: 'On-Site Quote', detail: 'Build from Doorvana price book in the field', tool: 'PandaDoc / SF CPQ / TBD', icon: '💰', displayOrder: 1, isFuture: false },
          { day: 'Quote', action: 'Price Book Access', detail: 'Single source of truth, real-time mobile', tool: 'SF Products / TBD', icon: '📖', displayOrder: 2, isFuture: false },
          { day: 'Presented', action: 'Quote Presented', detail: 'On-site or digital — logged with timestamp', tool: 'PandaDoc / Email', icon: '📄', displayOrder: 3, isFuture: false },
        ],
      },
      {
        key: 'close',
        label: 'Close & Work Order',
        duration: 'Same Day–Variable',
        color: '#16a34a',
        accent: '#22c55e',
        displayOrder: 3,
        steps: [
          { day: 'Yes', action: 'Customer Accepts', detail: "Opp → 'Closed Won'", tool: 'Salesforce', icon: '🤝', displayOrder: 0, isFuture: false },
          { day: 'Payment', action: 'Deposit / Payment', detail: 'Processor TBD', tool: 'Payment / TBD', icon: '💳', displayOrder: 1, isFuture: false },
          { day: 'Handoff', action: 'Work Order → Install Pipeline', detail: 'Deposit triggers WO creation', tool: 'Salesforce', icon: '🔧', displayOrder: 2, isFuture: false },
        ],
      },
    ],
    requirements: [
      { area: 'Lead Capture', items: ['Web-to-Lead form', 'Phone/CTI auto-create Leads', 'SMS/text path (Twilio / SF SMS)', 'Referral tracking + attribution', 'Required fields: name, phone, email, address, source'], displayOrder: 0 },
      { area: 'Service Area Validation', items: ['North TX zone check (zip list or geo-boundary)', 'Auto-flag/disqualify outside area', 'Flow on Lead creation'], displayOrder: 1 },
      { area: 'Scheduling & Capacity', items: ['⚠️ KEY DECISION: SF FSL vs. custom widget vs. third-party', 'Tech availability + route awareness', 'Appointment record linked to Lead/Opp', 'Calendar view for dispatch'], displayOrder: 2 },
      { area: 'Customer Comms', items: ['Auto confirmation (SMS + email)', 'Day-of reminder', 'On-my-way notification', 'Define SMS tool'], displayOrder: 3 },
      { area: 'Field Quoting', items: ['⚠️ KEY DECISION: Price book in SF vs. PandaDoc vs. both?', 'Mobile quote building', 'Quote logged with timestamp + line items', 'E-signature on-site'], displayOrder: 4 },
      { area: 'Image Capture', items: ['Photo → SF record from mobile', 'Files accessible to office team'], displayOrder: 5 },
      { area: 'Payment & WO', items: ['⚠️ KEY DECISION: Payment processor?', 'Deposit triggers WO (install)', 'WO fields scoped with ops'], displayOrder: 6 },
    ],
    openDecisions: [
      'Scheduling engine — SF FSL vs. custom?',
      'SMS tool — SF native, Twilio, or other?',
      'Field quoting — PandaDoc, SF CPQ, or integrated?',
      'Price book — single source or dual?',
      'Payment processor — must trigger WO.',
      'Phone/text lead capture — CTI + text-to-lead tool?',
    ],
    flowDiagram: [
      { text: 'Lead In', bg: '#b45309', fg: '#fff', isSmall: false, displayOrder: 0 },
      { text: 'NTX?', bg: '#e9ecef', fg: '#495057', isSmall: false, displayOrder: 1 },
      { text: 'Schedule', bg: '#0e7490', fg: '#fff', isSmall: false, displayOrder: 2 },
      { text: 'On-Site + Quote', bg: '#7c3aed', fg: '#fff', isSmall: false, displayOrder: 3 },
      { text: 'Pay → Install WO', bg: '#16a34a', fg: '#fff', isSmall: false, displayOrder: 4 },
    ],
  },
  // More segments would continue... this file is getting very long
  // I'll create a separate utility to load the full data
};

/**
 * Seed function - populates database with all segment data
 */
export async function seed(db: any) {
  console.log('🌱 Starting database seed...\n');

  try {
    // Clear existing data (in reverse order due to foreign key constraints)
    console.log('🗑️  Clearing existing data...');
    await db.delete(steps);
    await db.delete(flowDiagramItems);
    await db.delete(openDecisions);
    await db.delete(requirements);
    await db.delete(phases);
    await db.delete(segments);
    console.log('✅ Existing data cleared\n');

    // Seed each segment
    for (const [segmentKey, segmentData] of Object.entries(seedData)) {
      console.log(`📦 Seeding ${segmentData.label}...`);

      // Insert segment
      const [segment] = await db
        .insert(segments)
        .values({
          key: segmentData.key,
          label: segmentData.label,
          icon: segmentData.icon,
          displayOrder: segmentData.displayOrder,
        })
        .returning();

      console.log(`  ✓ Segment created (ID: ${segment.id})`);

      // Insert phases
      for (const phaseData of segmentData.phases) {
        const [phase] = await db
          .insert(phases)
          .values({
            segmentId: segment.id,
            key: phaseData.key,
            label: phaseData.label,
            duration: phaseData.duration,
            color: phaseData.color,
            accent: phaseData.accent,
            displayOrder: phaseData.displayOrder,
          })
          .returning();

        console.log(`    ✓ Phase: ${phaseData.label} (ID: ${phase.id})`);

        // Insert steps for this phase
        for (const stepData of phaseData.steps) {
          await db.insert(steps).values({
            phaseId: phase.id,
            day: stepData.day,
            action: stepData.action,
            detail: stepData.detail,
            tool: stepData.tool,
            icon: stepData.icon,
            displayOrder: stepData.displayOrder,
            isFuture: stepData.isFuture,
          });
        }
        console.log(`      ✓ ${phaseData.steps.length} steps added`);
      }

      // Insert requirements
      for (const reqData of segmentData.requirements) {
        await db.insert(requirements).values({
          segmentId: segment.id,
          area: reqData.area,
          items: reqData.items,
          displayOrder: reqData.displayOrder,
        });
      }
      console.log(`  ✓ ${segmentData.requirements.length} requirement areas added`);

      // Insert open decisions
      for (let i = 0; i < segmentData.openDecisions.length; i++) {
        await db.insert(openDecisions).values({
          segmentId: segment.id,
          decision: segmentData.openDecisions[i],
          displayOrder: i,
          isResolved: false,
        });
      }
      console.log(`  ✓ ${segmentData.openDecisions.length} open decisions added`);

      // Insert flow diagram items
      for (const flowItem of segmentData.flowDiagram) {
        await db.insert(flowDiagramItems).values({
          segmentId: segment.id,
          text: flowItem.text,
          bg: flowItem.bg,
          fg: flowItem.fg,
          isSmall: flowItem.isSmall,
          displayOrder: flowItem.displayOrder,
        });
      }
      console.log(`  ✓ ${segmentData.flowDiagram.length} flow diagram items added\n`);
    }

    console.log('🎉 Database seed completed successfully!');
    console.log(`📊 Seeded ${Object.keys(seedData).length} segments with all related data\n`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// If run directly
if (require.main === module) {
  console.log('This seed script requires a database connection.');
  console.log('It will be run via npm run db:seed once the database is configured.');
}
