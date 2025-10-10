// src/app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ success: false, message: 'Topic is required' }, { status: 400 });
    }

    // Replace this with your n8n webhook URL
    const n8nWebhookUrl = 'http://localhost:2005/webhook-test/skillzup-search';

    const n8nRes = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic }),
    });

    if (!n8nRes.ok) {
      return NextResponse.json({ success: false, message: 'Failed to fetch from n8n' }, { status: 500 });
    }

    const data = await n8nRes.json();

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
