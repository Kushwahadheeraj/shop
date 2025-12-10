import { NextResponse } from 'next/server';

// OpenAI-based test endpoint (gpt-4o-mini) to validate API connectivity.
export async function GET() {
  try {
    const API_KEY = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
    if (!API_KEY) {
      return NextResponse.json({
        success: false,
        message: 'No OpenAI API key found. Please add OPENAI_API_KEY to your .env.local file.',
        error: 'MISSING_API_KEY',
        setupInstructions: {
          step1: 'Get API key from https://platform.openai.com/api-keys',
          step2: 'Create .env.local file in project root',
          step3: 'Add: OPENAI_API_KEY=your_api_key_here',
          step4: 'Restart development server'
        }
      }, { status: 500 });
    }

    const testBody = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'user', content: 'Reply exactly with: API is working' }
      ],
      max_tokens: 50,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(testBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    let data;
    try {
      data = await resp.json();
    } catch {
      data = null;
    }

    if (!resp.ok) {
      const lastError = data?.error?.message || `HTTP ${resp.status}: ${resp.statusText}`;
      const errType = data?.error?.type;
      let userMessage = `OpenAI API Error: ${lastError}`;
      if (errType === 'insufficient_quota' || /quota/i.test(lastError || '')) {
        userMessage = 'OpenAI quota is 0 or exhausted. Add billing or use a key with quota.';
      } else if (resp.status === 401) {
        userMessage = 'Invalid OpenAI API key. Please check your key.';
      }
      return NextResponse.json({
        success: false,
        message: userMessage,
        error: 'OPENAI_API_ERROR',
        details: {
          lastError,
          openaiError: data?.error,
        },
      }, { status: resp.status });
    }

    const text = data?.choices?.[0]?.message?.content || '';
    return NextResponse.json({
      success: true,
      message: 'OpenAI API is working',
      response: text,
      apiKeyLength: API_KEY.length,
      modelUsed: testBody.model,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Unexpected error occurred',
      error: 'TEST_ERROR',
      details: process.env.NODE_ENV === 'development' ? { stack: error.stack } : undefined,
    }, { status: 500 });
  }
}

