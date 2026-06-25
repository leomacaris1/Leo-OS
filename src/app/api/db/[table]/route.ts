import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '../../../../lib/supabaseServer';

// Tables the client is allowed to mutate through this proxy. Reads still go
// straight from the browser to Supabase using the public anon key/RLS.
const MUTABLE_TABLES = new Set([
  'projects',
  'project_tasks',
  'emails',
  'social_profiles',
  'subscriptions',
  'agents',
  'agent_logs',
  'notifications',
]);

// Only agent_logs supports a "delete everything" operation (Clear Logs button).
const BULK_DELETABLE_TABLES = new Set(['agent_logs']);

type RouteParams = { params: Promise<{ table: string }> };

function getClientOrError(): { client: ReturnType<typeof getSupabaseServerClient> } | { error: NextResponse } {
  const client = getSupabaseServerClient();
  if (!client) {
    return { error: NextResponse.json({ error: 'Supabase server client is not configured' }, { status: 503 }) };
  }
  return { client };
}

export async function POST(request: Request, { params }: RouteParams) {
  const { table } = await params;
  if (!MUTABLE_TABLES.has(table)) {
    return NextResponse.json({ error: 'Unknown table' }, { status: 400 });
  }

  const result = getClientOrError();
  if ('error' in result) return result.error;

  const body = await request.json();
  const { data, error } = await result.client!.from(table).insert([body]).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { table } = await params;
  if (!MUTABLE_TABLES.has(table)) {
    return NextResponse.json({ error: 'Unknown table' }, { status: 400 });
  }

  const result = getClientOrError();
  if ('error' in result) return result.error;

  const body = (await request.json()) as { id?: string; updates?: Record<string, unknown> };
  if (!body.id || !body.updates) {
    return NextResponse.json({ error: 'Request must include "id" and "updates"' }, { status: 400 });
  }

  const { data, error } = await result.client!
    .from(table)
    .update(body.updates)
    .eq('id', body.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { table } = await params;
  if (!MUTABLE_TABLES.has(table)) {
    return NextResponse.json({ error: 'Unknown table' }, { status: 400 });
  }

  const result = getClientOrError();
  if ('error' in result) return result.error;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const deleteAll = searchParams.get('all') === 'true';

  if (deleteAll) {
    if (!BULK_DELETABLE_TABLES.has(table)) {
      return NextResponse.json({ error: 'Bulk delete is not allowed for this table' }, { status: 400 });
    }
    const { error } = await result.client!.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (!id) {
    return NextResponse.json({ error: 'Request must include an "id" query param' }, { status: 400 });
  }

  const { error } = await result.client!.from(table).delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
