// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();

    if (!topic || topic.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Topic is required' },
        { status: 400 }
      );
    }

    const n8nWebhookUrl =
      process.env.N8N_WEBHOOK_URL || 'http://127.0.0.1:2005/webhook/skillzup-search';

    console.log('Calling n8n webhook:', n8nWebhookUrl);
    console.log('Request body:', JSON.stringify({ topic: topic.trim() }));

    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: topic.trim() }),
    });

    console.log('n8n response status:', response.status);
    const responseText = await response.text();
    console.log('n8n raw response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse n8n response as JSON:', responseText);
      throw new Error('Invalid JSON response from n8n');
    }

    if (!response.ok) {
      console.error('n8n error response:', data);
      return NextResponse.json(
        { success: false, message: 'n8n workflow failed', details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch learning resources',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
