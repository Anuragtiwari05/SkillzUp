// File: src/app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();

    // Validate topic
    if (!topic || topic.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Topic is required' },
        { status: 400 }
      );
    }

    // Call n8n webhook
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/skillzup-search';
    
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic: topic.trim() }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from n8n');
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch learning resources',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}