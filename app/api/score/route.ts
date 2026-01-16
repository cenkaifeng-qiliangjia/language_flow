import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as Blob;
    const targetText = formData.get('targetText') as string;

    if (!audioFile || !targetText) {
      return NextResponse.json({ error: '缺失录音数据或目标文本' }, { status: 400 });
    }

    // 1. 上传音频文件到 Dify 获取 file_id
    const difyFormData = new FormData();
    difyFormData.append('file', audioFile, 'audio.mp3');
    difyFormData.append('user', 'demo-user');

    const uploadResponse = await fetch('https://api-ai.qiliangjia.org/v1/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DIFY_SCORE_API_KEY}`,
      },
      body: difyFormData,
    });

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.text();
      console.error('Dify upload error:', errorData);
      throw new Error('音频文件上传至 Dify 失败');
    }

    const uploadData = await uploadResponse.json();
    const fileId = uploadData.id;
    console.log('Dify uploaded fileId:', fileId);
    console.log('Dify uploaded file:', uploadData);

    // 2. 使用 file_id 运行工作流 (使用 JSON 请求)
    // 根据用户提供的 Dify API 文档，如果变量是文件列表类型，需要使用数组包裹
    const runBody = {
      inputs: {
        audio: 
          {
            transfer_method: 'local_file',
            upload_file_id: fileId,
            type: 'audio'
          },
        targetText: targetText
      },
      response_mode: 'blocking',
      user: 'demo-user'
    };

    const response = await fetch('https://api-ai.qiliangjia.org/v1/workflows/run', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DIFY_SCORE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(runBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Dify run error:', errorText);
      throw new Error('Dify API response was not ok');
    }

    const data = await response.json();
    console.log('Dify score response:', JSON.stringify(data));
    
    // Dify Workflow 阻塞模式返回结构：
    // 根据用户要求，现在输出结构是 data: { score, judge, proposal }
    const resultContainer = data?.data || data;
    
    if (resultContainer?.score !== undefined) {
      return NextResponse.json({
        score: Number(resultContainer.score),
        judge: resultContainer.judge || '',
        proposal: resultContainer.proposal || ''
      });
    }

    // 兜底逻辑：检查 outputs 内部
    const outputs = resultContainer?.outputs;
    if (outputs?.score !== undefined) {
      return NextResponse.json({
        score: Number(outputs.score),
        judge: outputs.judge || '',
        proposal: outputs.proposal || ''
      });
    }

    throw new Error('未获取到 score 评分数据');
  } catch (error) {
    console.error('Score Error:', error);
    return NextResponse.json({ error: '评分请求失败' }, { status: 500 });
  }
}
