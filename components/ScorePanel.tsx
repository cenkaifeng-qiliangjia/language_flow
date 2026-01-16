'use client';
import { ScoreResponse } from '@/lib/types';
import { Star, TrendingUp, Mic2, FileText, RefreshCw, PlusCircle } from 'lucide-react';

interface ScorePanelProps {
  data: ScoreResponse;
  onRetry: () => void;
  onNew: () => void;
}

export default function ScorePanel({ data, onRetry, onNew }: ScorePanelProps) {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const metrics = [
    { label: '发音', value: data.pronunciation, icon: Mic2 },
    { label: '流利度', value: data.fluency, icon: TrendingUp },
    { label: '完整度', value: data.completeness, icon: FileText },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-blue-600 p-8 text-center text-white">
          <p className="text-blue-100 text-sm font-semibold uppercase tracking-widest mb-2">综合得分</p>
          <div className="text-7xl font-black">{data.overall_score}</div>
          <div className="flex justify-center mt-4">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={20} 
                className={`${i < Math.round(data.overall_score / 20) ? 'fill-yellow-400 text-yellow-400' : 'text-blue-400'}`} 
              />
            ))}
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-3 gap-4">
            {metrics.map((m) => (
              <div key={m.label} className={`p-4 rounded-2xl text-center ${getScoreColor(m.value)}`}>
                <m.icon className="mx-auto mb-2 opacity-70" size={20} />
                <div className="text-2xl font-bold">{m.value}</div>
                <div className="text-xs font-medium uppercase opacity-80">{m.label}</div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
              练习建议
            </h3>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <p className="text-gray-700 leading-relaxed mb-6">
                {data.feedback}
              </p>
              <ul className="space-y-3">
                {data.suggestions.map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-600 italic">
                    <span className="text-blue-500 font-bold">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={onRetry}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-50 transition-all"
            >
              <RefreshCw size={20} />
              针对本篇重练
            </button>
            <button
              onClick={onNew}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-gray-900 text-white font-bold hover:bg-black transition-all"
            >
              <PlusCircle size={20} />
              开始新的练习
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
