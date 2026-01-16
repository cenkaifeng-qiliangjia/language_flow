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
    difyFormData.append('file', audioFile, 'audio.webm');
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

    // 2. 使用 file_id 运行工作流 (使用 multipart/form-data 请求)
    const difyRunFormData = new FormData();
    difyRunFormData.append('inputs', JSON.stringify({ 
      audio: {
        transfer_method: 'local_file',
        upload_file_id: fileId,
        type: 'audio'
      },
      target_text: targetText 
    }));
    difyRunFormData.append('response_mode', 'blocking');
    difyRunFormData.append('user', 'demo-user');

    const response = await fetch('https://api-ai.qiliangjia.org/v1/workflows/run', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DIFY_SCORE_API_KEY}`,
      },
      body: difyRunFormData,
    });

    if (!response.ok) {
      throw new Error('Dify API response was not ok');
    }

    const data = await response.json();
    console.log('Dify score response:', JSON.stringify(data));
    
    // Dify Workflow 阻塞模式通常返回 { data: { outputs: { ... } } }
    // 根据用户反馈，现在 score 接口直接在 data.data 或 data 中返回 score, judge, proposal，不再使用 outputs
    const resultContainer = data?.data || data;
    
    if (resultContainer?.score !== undefined) {
      return NextResponse.json({
        score: resultContainer.score,
        judge: resultContainer.judge || '',
        proposal: resultContainer.proposal || ''
      });
    }

    // 如果没有直接获取到，尝试检查是否还在 outputs 内部（防御性保留，但优先使用外层）
    const outputs = resultContainer?.outputs;
    if (outputs?.score !== undefined) {
      return NextResponse.json({
        score: outputs.score,
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
