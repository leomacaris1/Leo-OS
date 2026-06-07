import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '../../../../lib/supabaseServer';

type NexusLogLevel = 'INFO' | 'ERROR' | 'SUCCESS' | 'WARNING';
type NexusNotificationType = 'info' | 'success' | 'warning' | 'error';

const LOG_LEVELS = new Set<NexusLogLevel>(['INFO', 'ERROR', 'SUCCESS', 'WARNING']);
const NOTIFICATION_TYPES = new Set<NexusNotificationType>(['info', 'success', 'warning', 'error']);

type NexusPayload = {
  event?: string;
  level?: string;
  component?: string;
  message?: string;
  title?: string;
  type?: string;
  source?: string;
  notify?: boolean;
  log?: {
    level?: string;
    component?: string;
    message?: string;
  };
  notification?: {
    title?: string;
    message?: string;
    type?: string;
    source?: string;
  };
};

function hasValidSecret(request: Request): boolean {
  const expectedSecret = process.env.NEXUS_WEBHOOK_SECRET;
  if (!expectedSecret) {
    return process.env.NODE_ENV !== 'production';
  }

  const bearerToken = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim();
  const headerSecret = request.headers.get('x-nexus-secret')?.trim();
  return bearerToken === expectedSecret || headerSecret === expectedSecret;
}

function normalizeLogLevel(value?: string): NexusLogLevel {
  const level = value?.toUpperCase() as NexusLogLevel | undefined;
  return level && LOG_LEVELS.has(level) ? level : 'INFO';
}

function normalizeNotificationType(value?: string): NexusNotificationType {
  const type = value?.toLowerCase() as NexusNotificationType | undefined;
  return type && NOTIFICATION_TYPES.has(type) ? type : 'info';
}

function buildLogPayload(body: NexusPayload) {
  const message = body.log?.message || body.message;
  if (!message || !message.trim()) {
    return null;
  }

  return {
    level: normalizeLogLevel(body.log?.level || body.level),
    component: (body.log?.component || body.component || body.source || 'Nexus').slice(0, 80),
    message: message.trim().slice(0, 4000),
  };
}

function buildNotificationPayload(body: NexusPayload) {
  const notification = body.notification;
  const shouldNotify = body.notify || body.event === 'notification' || Boolean(notification?.title);
  if (!shouldNotify) {
    return null;
  }

  const message = notification?.message || body.message;
  if (!message || !message.trim()) {
    return null;
  }

  return {
    title: (notification?.title || body.title || `${body.component || body.source || 'Nexus'} event`).slice(0, 120),
    message: message.trim().slice(0, 1000),
    type: normalizeNotificationType(notification?.type || body.type),
    source: (notification?.source || body.source || 'nexus-webhook').slice(0, 80),
    read: false,
  };
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: 'nexus-webhook',
    accepts: ['log', 'notification', 'combined'],
  });
}

export async function POST(request: Request) {
  try {
    if (!hasValidSecret(request)) {
      return NextResponse.json(
        { error: 'Invalid or missing Nexus webhook secret' },
        { status: 401 }
      );
    }

    const body = (await request.json()) as NexusPayload;
    const logPayload = buildLogPayload(body);
    const notificationPayload = buildNotificationPayload(body);

    if (!logPayload && !notificationPayload) {
      return NextResponse.json(
        { error: 'Payload must include a non-empty message for a log or notification' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase server client is not configured' },
        { status: 503 }
      );
    }

    const results: Record<string, unknown> = {};

    if (logPayload) {
      const { data, error } = await supabase
        .from('agent_logs')
        .insert([logPayload])
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: 'Failed to insert agent log', details: error.message }, { status: 500 });
      }

      results.log = data;
    }

    if (notificationPayload) {
      const { data, error } = await supabase
        .from('notifications')
        .insert([notificationPayload])
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: 'Failed to insert notification', details: error.message }, { status: 500 });
      }

      results.notification = data;
    }

    return NextResponse.json({ success: true, ...results }, { status: 201 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

