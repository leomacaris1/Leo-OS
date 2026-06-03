import { NextResponse } from 'next/server';
import { dbService } from '../../../../lib/supabase';

// Webhook endpoint to receive alerts from AI Agents, GitHub Actions, or Vercel
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate basic payload
    if (!body.title || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields: title, message' },
        { status: 400 }
      );
    }

    // Insert into Supabase (or fallback local store if this was running client-side, but API is server-side)
    // Actually, dbService requires a configured Supabase client to work on server-side
    // For this to work perfectly on the server-side, it will use the initialized supabase client in lib/supabase.ts
    const newNotif = await dbService.createNotification({
      title: body.title,
      message: body.message,
      type: body.type || 'info', // 'info', 'success', 'warning', 'error'
      source: body.source || 'webhook',
    });

    if (newNotif) {
      return NextResponse.json({ success: true, notification: newNotif }, { status: 201 });
    } else {
      return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
    }

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
