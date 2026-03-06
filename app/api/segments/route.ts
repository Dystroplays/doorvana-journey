import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { segments } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

// GET /api/segments - List all segments with all relations
export async function GET() {
  try {
    const allSegments = await db.query.segments.findMany({
      with: {
        phases: {
          with: {
            steps: {
              orderBy: (steps, { asc }) => [asc(steps.displayOrder)],
            },
          },
          orderBy: (phases, { asc }) => [asc(phases.displayOrder)],
        },
        requirements: {
          orderBy: (requirements, { asc }) => [asc(requirements.displayOrder)],
        },
        decisions: {
          orderBy: (decisions, { asc }) => [asc(decisions.displayOrder)],
        },
        flowDiagramItems: {
          orderBy: (items, { asc }) => [asc(items.displayOrder)],
        },
      },
      orderBy: (segments, { asc }) => [asc(segments.displayOrder)],
    });

    return NextResponse.json(allSegments);
  } catch (error) {
    console.error('Error fetching segments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch segments' },
      { status: 500 }
    );
  }
}

// POST /api/segments - Create a new segment
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newSegment = await db
      .insert(segments)
      .values({
        key: body.key,
        label: body.label,
        icon: body.icon,
        displayOrder: body.displayOrder || 0,
      })
      .returning();

    return NextResponse.json(newSegment[0], { status: 201 });
  } catch (error) {
    console.error('Error creating segment:', error);
    return NextResponse.json(
      { error: 'Failed to create segment' },
      { status: 500 }
    );
  }
}
