import { NextRequest, NextResponse } from 'next/server';

const TRELLO_BASE = 'https://api.trello.com/1';

async function trelloPost(path: string, body: Record<string, string>) {
  const key = process.env.TRELLO_API_KEY;
  const token = process.env.TRELLO_TOKEN;

  const url = new URL(`${TRELLO_BASE}${path}`);
  url.searchParams.set('key', key!);
  url.searchParams.set('token', token!);

  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Trello API error ${res.status}: ${text}`);
  }

  return res.json();
}

export async function POST(req: NextRequest) {
  const key = process.env.TRELLO_API_KEY;
  const token = process.env.TRELLO_TOKEN;
  const boardId = process.env.TRELLO_BOARD_ID;

  if (!key || !token || !boardId) {
    return NextResponse.json(
      { error: 'Trello credentials not configured. Set TRELLO_API_KEY, TRELLO_TOKEN, and TRELLO_BOARD_ID in .env.local.' },
      { status: 500 }
    );
  }

  const { label, requirements, decisions } = await req.json();

  if (!label) {
    return NextResponse.json({ error: 'Missing segment data' }, { status: 400 });
  }

  let cardsCreated = 0;

  // --- SF Requirements list ---
  const reqList = await trelloPost('/lists', {
    name: `${label} — SF Requirements`,
    idBoard: boardId,
    pos: 'bottom',
  });

  for (const req of requirements ?? []) {
    const desc = (req.items ?? []).map((item: string) => `- ${item}`).join('\n');
    await trelloPost('/cards', {
      name: req.area,
      desc,
      idList: reqList.id,
      pos: 'bottom',
    });
    cardsCreated++;
  }

  // --- Open Decisions list (unresolved only) ---
  const unresolvedDecisions = (decisions ?? []).filter(
    (d: { isResolved: boolean }) => !d.isResolved
  );

  const decList = await trelloPost('/lists', {
    name: `${label} — Open Decisions`,
    idBoard: boardId,
    pos: 'bottom',
  });

  for (const d of unresolvedDecisions) {
    await trelloPost('/cards', {
      name: d.decision,
      desc: '',
      idList: decList.id,
      pos: 'bottom',
    });
    cardsCreated++;
  }

  return NextResponse.json({
    success: true,
    cardsCreated,
    requirementsCards: requirements?.length ?? 0,
    decisionsCards: unresolvedDecisions.length,
  });
}
