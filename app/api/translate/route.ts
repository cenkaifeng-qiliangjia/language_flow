import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { zhText } = await req.json();

    if (!zhText) {
      return NextResponse.json({ error: '请输入中文内容' }, { status: 400 });
    }

    const response = await fetch('https://api-ai.qiliangjia.org/v1/workflows/run', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DIFY_TRANSLATE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: { zh_text: zhText },
        response_mode: 'blocking',
        user: 'demo-user',
      }),
    });

    if (!response.ok) {
      throw new Error('Dify API response was not ok');
    }

    const data = await response.json();
    console.log('Dify response data:', JSON.stringify(data));
    
    // Dify Workflow 阻塞模式通常返回 { data: { outputs: { ... } } }
    // 根据用户反馈，现在不再使用 outputs 字段，而是直接从 data 或 data.data 中获取 format_* 字段
    const resultContainer = data?.data || data;
    
    if (resultContainer?.format_result) {
      return NextResponse.json({
        format_result: resultContainer.format_result,
        format_helper: resultContainer.format_helper || '',
        format_pron: resultContainer.format_pron || '',
        // 兼容旧字段
        english_text: resultContainer.format_result,
        mnemonics: resultContainer.format_helper || '',
        ipa: resultContainer.format_pron || ''
      });
    }

    // 如果没有直接获取到 format_result，尝试检查是否还在 outputs 内部（防御性编程）
    const outputs = resultContainer?.outputs;
    if (outputs?.format_result) {
      return NextResponse.json({
        format_result: outputs.format_result,
        format_helper: outputs.format_helper || '',
        format_pron: outputs.format_pron || '',
        english_text: outputs.format_result,
        mnemonics: outputs.format_helper || '',
        ipa: outputs.format_pron || ''
      });
    }

    // 如果仍然没有，报错
    const errorMsg = data?.error || data?.message || '未获取到 format_result 字段';
    console.error('Dify API Error:', data);
    throw new Error(errorMsg);
  } catch (error) {
    console.error('Translation Error:', error);
    return NextResponse.json({ error: '翻译请求失败，请检查网络或 API Key' }, { status: 500 });
  }
}
