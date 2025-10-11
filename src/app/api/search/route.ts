import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json(
        { success: false, message: 'Topic is required' },
        { status: 400 }
      );
    }

    // Replace this with your n8n webhook URL
    // You can also set this in your .env file as N8N_WEBHOOK_URL
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'http://localhost:2005/webhook-test/skillzup-search';

    console.log('Sending request to n8n for topic:', topic);

    const n8nRes = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic }),
    });

    if (!n8nRes.ok) {
      console.error('n8n request failed:', n8nRes.status, n8nRes.statusText);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch from n8n' },
        { status: 500 }
      );
    }

    const data = await n8nRes.json();

    console.log('Successfully received data from n8n');

    return NextResponse.json(data);
  } catch (err) {
    console.error('Error in search API route:', err);
    return NextResponse.json(
      { success: false, message: 'Server Error' },
      { status: 500 }
    );
  }
}