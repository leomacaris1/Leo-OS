import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/chat
 * Server-side proxy to Google Gemini API.
 * Keeps the API key safe on the server. Falls back to a simulated response
 * when GEMINI_API_KEY is not set.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, agentName, systemPrompt, model } = body as {
      messages: { role: string; content: string }[];
      agentName: string;
      systemPrompt: string;
      model: string;
    };

    const apiKey = process.env.GEMINI_API_KEY;

    // ── Fallback: No API key configured ─────────────────────────
    if (!apiKey) {
      return NextResponse.json({
        content: `[Modo Simulado] No se ha configurado GEMINI_API_KEY en .env.local. Soy "${agentName}" y mi directiva es: "${systemPrompt}". Cuando conectes una API key real, responderé con inteligencia artificial de verdad.`,
        mode: 'simulated',
      });
    }

    // ── Build Gemini request payload ────────────────────────────
    // Use the model the agent has configured, default to gemini-2.0-flash
    const geminiModel = model?.includes('gemini') ? model : 'gemini-2.0-flash';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;

    // Convert chat history to Gemini "contents" format
    const contents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const geminiPayload = {
      system_instruction: {
        parts: [{ text: `Tu nombre es "${agentName}". ${systemPrompt}` }],
      },
      contents,
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 2048,
      },
    };

    const geminiRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiPayload),
    });

    if (!geminiRes.ok) {
      const errorText = await geminiRes.text();
      console.error('Gemini API error:', geminiRes.status, errorText);
      return NextResponse.json(
        {
          content: `[Error API] Gemini respondió con status ${geminiRes.status}. Verifica tu GEMINI_API_KEY o el modelo "${geminiModel}".`,
          mode: 'error',
        },
        { status: 502 }
      );
    }

    const geminiData = await geminiRes.json();
    const responseText =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ??
      '[Sin respuesta del modelo]';

    return NextResponse.json({
      content: responseText,
      mode: 'live',
    });
  } catch (error) {
    console.error('Chat API route error:', error);
    return NextResponse.json(
      { content: '[Error interno del servidor al procesar el chat.]', mode: 'error' },
      { status: 500 }
    );
  }
}
