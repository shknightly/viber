import { NextResponse, type NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { streamChatCompletion } from '@viber/agent-core';
import { chatRequestSchema } from '@viber/types';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const parsed = chatRequestSchema.parse(payload);
    const stream = await streamChatCompletion(parsed);

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid request payload.',
          details: error.errors,
        },
        { status: 422 }
      );
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error while contacting Gemini.',
      },
      { status: 500 }
    );
  }
}
