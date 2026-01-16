'use client';
'use client';
import { useState, useEffect, useRef } from 'react';
import { TranslationData } from '@/lib/types';
import { Copy, Volume2, Play, Pause, Square, Gauge } from 'lucide-react';

export default function TranslationResult({ data }: { data: TranslationData }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(0.9);
  const [activeType, setActiveType] = useState<0 | 1 | null>(null);
  
  const mainText = data.format_result || data.english_text || '';

  // 监听播放结束
  useEffect(() => {
    const handleEnd = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setActiveType(null);
    };

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel(); // 初始停止
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const playVoice = (text: string, type: 0 | 1) => {
    if (!text) return;

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // 如果正在播放且类型相同，则切换暂停/继续
      if (isPlaying && activeType === type) {
        if (isPaused) {
          window.speechSynthesis.resume();
          setIsPaused(false);
        } else {
          window.speechSynthesis.pause();
          setIsPaused(true);
        }
        return;
      }

      // 否则开始新的播放
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = type === 0 ? 'en-US' : 'en-GB';
      utterance.rate = playbackRate;
      utterance.pitch = 1;

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setActiveType(null);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setActiveType(null);
      };

      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
      setIsPaused(false);
      setActiveType(type);
    }
  };

  const stopVoice = () => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setActiveType(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-bold text-gray-900">参考译文</h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => playVoice(mainText, 0)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                    activeType === 0 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                      : 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100'
                  }`}
                >
                  {activeType === 0 && isPlaying ? (
                    isPaused ? <Play size={14} fill="currentColor" /> : <Pause size={14} fill="currentColor" />
                  ) : (
                    <Volume2 size={14} />
                  )}
                  <span>美音</span>
                </button>
                <button 
                  onClick={() => playVoice(mainText, 1)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                    activeType === 1 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                      : 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100'
                  }`}
                >
                  {activeType === 1 && isPlaying ? (
                    isPaused ? <Play size={14} fill="currentColor" /> : <Pause size={14} fill="currentColor" />
                  ) : (
                    <Volume2 size={14} />
                  )}
                  <span>英音</span>
                </button>
                {isPlaying && (
                  <button 
                    onClick={stopVoice}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="停止播放"
                  >
                    <Square size={14} fill="currentColor" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                <Gauge size={14} className="text-gray-400" />
                <select 
                  value={playbackRate} 
                  onChange={(e) => {
                    const newRate = parseFloat(e.target.value);
                    setPlaybackRate(newRate);
                    if (isPlaying) {
                      // 如果正在播放，重头以新语速开始，或者提醒用户下次生效
                      // Web Speech API 不支持中途动态修改 rate，需要重新 speak
                      stopVoice();
                    }
                  }}
                  className="bg-transparent text-xs font-medium text-gray-600 outline-none cursor-pointer"
                >
                  <option value="0.5">0.5x 极慢</option>
                  <option value="0.7">0.7x 慢速</option>
                  <option value="0.8">0.8x 较慢</option>
                  <option value="0.9">0.9x 标准</option>
                  <option value="1.0">1.0x 常速</option>
                  <option value="1.2">1.2x 快速</option>
                </select>
              </div>
              <button 
                onClick={() => copyToClipboard(mainText)}
                className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-blue-600 transition-colors"
                title="复制全文"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>
          
          <div className="prose prose-blue max-w-none">
            <div className="text-2xl md:text-3xl leading-relaxed text-gray-900 font-bold whitespace-pre-wrap">
              {data.format_result || data.english_text}
            </div>
          </div>

          {(data.format_pron || data.ipa) && (
            <div className="mt-2 p-3 bg-blue-50 rounded-lg text-blue-700 font-mono text-xs md:text-sm border border-blue-100/50">
              发音辅助: {data.format_pron || data.ipa}
            </div>
          )}
        </div>
      </div>

      {(data.format_helper || data.mnemonics) && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">助记提示</h3>
          <p className="text-gray-600 leading-relaxed italic text-sm md:text-base">
            {data.format_helper || data.mnemonics}
          </p>
        </div>
      )}

      {data.segments && data.segments.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">逐句拆解</h3>
          {data.segments.map((seg, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors group">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">{seg.zh}</p>
                  <p className="text-lg text-gray-900 font-medium">{seg.en}</p>
                  {seg.ipa && <p className="text-sm text-blue-500 font-mono">{seg.ipa}</p>}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => playVoice(seg.en, 0)}
                    className={`p-2 rounded-lg transition-all ${
                      activeType === 0 && isPlaying && !isPaused ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-50 text-blue-400 hover:text-blue-600'
                    }`}
                    title="播放"
                  >
                    {activeType === 0 && isPlaying && !isPaused ? <Pause size={16} /> : <Volume2 size={16} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
