'use client';
import { useState, useEffect } from 'react';
import TextInputPanel from '@/components/TextInputPanel';
import TranslationResult from '@/components/TranslationResult';
import RecorderPanel from '@/components/RecorderPanel';
import ScorePanel from '@/components/ScorePanel';
import HistoryPanel from '@/components/HistoryPanel';
import { AppState, TranslationData, ScoreResponse, PracticeHistory } from '@/lib/types';
import { saveHistory, getHistory, clearHistory } from '@/lib/storage';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function PracticePage() {
  const [state, setState] = useState<AppState>('IDLE');
  const [zhText, setZhText] = useState('');
  const [transData, setTransData] = useState<TranslationData | null>(null);
  const [scoreData, setScoreData] = useState<ScoreResponse | null>(null);
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null);
  const [history, setHistory] = useState<PracticeHistory[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setHistory(getHistory());
  }, [state]);

  const handleTranslate = async (text: string) => {
    setState('TRANSLATING');
    setError(null);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zhText: text }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      const historyId = Date.now().toString();
      setZhText(text);
      setTransData(data);
      setCurrentHistoryId(historyId);
      setState('PRACTICING');
      
      // 保存到本地历史 (初始状态)
      saveHistory({
        id: historyId,
        date: new Date().toISOString(),
        zhText: text,
        translation: data
      });
    } catch (err: any) {
      setError(err.message || '翻译失败');
      setState('IDLE');
    }
  };

  const handleScore = async (audioBlob: Blob) => {
    setState('SCORING');
    setError(null);
    try {
      // 检查 transData 是否存在以及是否有 english_text (或 format_result)
      const targetText = transData?.format_result || transData?.english_text;
      if (!targetText) {
        throw new Error('缺失目标文本，请重新翻译');
      }

      // 使用 FormData 传输音频文件和目标文本
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('targetText', targetText);
      
      const res = await fetch('/api/score', {
        method: 'POST',
        body: formData, // 直接发送 FormData，无需手动设置 Content-Type
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `请求失败: ${res.status}`);
      }
      
      setScoreData(data);
      setState('RESULT');

      // 更新历史记录中的分数
      if (currentHistoryId && zhText && transData) {
        saveHistory({
          id: currentHistoryId,
          date: new Date().toISOString(),
          zhText: zhText,
          translation: transData,
          score: data
        });
      }
    } catch (err: any) {
      console.error('Score processing error:', err);
      setError(err.message || '评分失败');
      setState('PRACTICING');
    }
  };

  const handleSelectHistory = (item: PracticeHistory) => {
    setZhText(item.zhText);
    setTransData(item.translation);
    setScoreData(item.score || null);
    setCurrentHistoryId(item.id);
    if (item.score) {
      setState('RESULT');
    } else {
      setState('PRACTICING');
    }
  };

  const handleClearHistory = () => {
    if (confirm('确定要清除所有练习历史吗？')) {
      clearHistory();
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 顶部导航 */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <Sparkles size={20} />
            </div>
            <span className="font-black text-xl tracking-tight text-gray-900">LanguageFlow</span>
          </div>
          {state !== 'IDLE' && (
            <button 
              onClick={() => setState('IDLE')}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft size={16} />
              返回输入
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-4 md:p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center gap-2">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        {state === 'IDLE' || state === 'TRANSLATING' ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-black text-gray-900 leading-tight">
                将中文演讲稿，<br /><span className="text-blue-600">一键生成地道口语练习</span>
              </h2>
              <p className="text-gray-500 text-lg">AI 智能翻译、助记、纠音，助你从零开始流利表达</p>
            </div>
            <TextInputPanel onSubmit={handleTranslate} isLoading={state === 'TRANSLATING'} />
            
            <HistoryPanel 
              history={history} 
              onSelect={handleSelectHistory} 
              onClear={handleClearHistory} 
            />
          </div>
        ) : (
          <div className={`grid gap-8 ${state === 'PRACTICING' ? 'pb-80' : 'pb-20'}`}>
            {transData && (
              <>
                <div className="animate-in fade-in duration-500">
                  <TranslationResult data={transData} />
                </div>
                
                {state === 'PRACTICING' && (
                  <div className="fixed bottom-0 left-0 right-0 z-20 p-4 md:p-8 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/95 to-transparent pt-16">
                    <div className="max-w-4xl mx-auto">
                      <div className="animate-in slide-in-from-bottom-10 duration-700 ease-out">
                        <div className="relative group">
                          <div className="absolute -top-10 left-0 right-0 flex justify-center">
                            <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold tracking-widest shadow-lg uppercase">
                              准备好后开始练习
                            </div>
                          </div>
                          <div className="shadow-2xl shadow-blue-200/50 rounded-3xl overflow-hidden border border-white/50 backdrop-blur-sm">
                            <RecorderPanel onComplete={handleScore} isLoading={false} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {state === 'SCORING' && (
                  <div className="text-center p-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 animate-ping rounded-full bg-blue-100"></div>
                      <div className="relative bg-blue-600 p-4 rounded-full text-white">
                        <Sparkles size={32} />
                      </div>
                    </div>
                    <h3 className="mt-6 text-xl font-bold text-gray-900">正在分析你的发音...</h3>
                    <p className="mt-2 text-gray-500">AI 正在对比译文进行精准评估</p>
                  </div>
                )}

                {state === 'RESULT' && scoreData && (
                  <ScorePanel 
                    data={scoreData} 
                    onRetry={() => setState('PRACTICING')} 
                    onNew={() => setState('IDLE')} 
                  />
                )}
              </>
            )}
          </div>
        )}
      </main>

      {/* 底部装饰 */}
      <footer className="py-8 text-center text-gray-400 text-sm">
        <p>© 2026 LanguageFlow Demo • Built with Vercel & Dify</p>
      </footer>
    </div>
  );
}
