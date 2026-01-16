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
    // 但也有可能直接返回 { outputs: { ... } } 或其他结构
    let outputs = data?.data?.outputs || data?.outputs;
    
    if (!outputs) {
      // 检查是否有直接的 error 信息
      const errorMsg = data?.error || data?.message || 'Invalid response structure from Dify';
      console.error('Dify API Error:', data);
      throw new Error(errorMsg);
    }

    // 如果 outputs 是字符串，或者是包含 outputs 字段的对象且该字段是字符串
    // 这里的逻辑需要根据 Dify Workflow 的实际输出变量名来调整
    // 如果你在 Dify 中定义了一个名为 'text' 的输出变量，那么这里应该是 outputs.text
    
    // 尝试获取结果字符串
    let resultString = '';
    if (typeof outputs === 'string') {
      resultString = outputs;
    } else if (typeof outputs === 'object' && outputs !== null) {
      if (outputs.text) {
        resultString = outputs.text;
      } else if (outputs.outputs) {
        resultString = outputs.outputs;
      } else if (outputs.english_text) {
        // 如果已经包含了预期的字段，直接返回
        return NextResponse.json(outputs);
      } else {
        // 如果是一个对象但没有识别出的字段，将其序列化
        resultString = JSON.stringify(outputs);
      }
    }

    // 尝试解析 resultString 是否为 JSON
    try {
      const parsed = JSON.parse(resultString);
      
      // 如果解析出来还是个对象，且没有 english_text，但有 outputs 或 text
      if (parsed && typeof parsed === 'object' && !parsed.english_text) {
        const nestedText = parsed.outputs || parsed.text;
        if (nestedText) {
          return NextResponse.json({
            english_text: typeof nestedText === 'string' ? nestedText : JSON.stringify(nestedText),
            mnemonics: parsed.mnemonics || '',
            ipa: parsed.ipa || '',
            segments: parsed.segments || []
          });
        }
      }
      
      return NextResponse.json(parsed);
    } catch (e) {
      // 如果不是 JSON，或者是解析出的 JSON 不是预期格式
      // 将其包装成 TranslationData 结构返回，以便前端渲染
      return NextResponse.json({
        english_text: resultString,
        mnemonics: '',
        ipa: '',
        segments: []
      });
    }
  } catch (error) {
    console.error('Translation Error:', error);
    return NextResponse.json({ error: '翻译请求失败，请检查网络或 API Key' }, { status: 500 });
  }
}
