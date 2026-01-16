import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { audio, targetText } = await req.json();

    if (!audio || !targetText) {
      return NextResponse.json({ error: '缺失录音数据或目标文本' }, { status: 400 });
    }

    const response = await fetch('https://api-ai.qiliangjia.org/v1/workflows/run', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DIFY_SCORE_API_KEY}`,
        // app-xwo2qVdjCThr2utbQqIDI4Qc
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: { 
          audio: audio, // 假设 Dify 接受 base64
          target_text: targetText 
        },
        response_mode: 'blocking',
        user: 'demo-user',
      }),
    });

    if (!response.ok) {
      throw new Error('Dify API response was not ok');
    }

    const data = await response.json();
    const outputs = data?.data?.outputs;

    if (!outputs) {
      throw new Error('Invalid response structure from Dify');
    }

    return NextResponse.json(outputs);
  } catch (error) {
    console.error('Score Error:', error);
    return NextResponse.json({ error: '评分请求失败' }, { status: 500 });
  }
}
