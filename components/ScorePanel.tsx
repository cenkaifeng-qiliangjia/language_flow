'use client';
import { ScoreResponse } from '@/lib/types';
import { Star, RefreshCw, PlusCircle } from 'lucide-react';

interface ScorePanelProps {
  data: ScoreResponse;
  onRetry: () => void;
  onNew: () => void;
}

export default function ScorePanel({ data, onRetry, onNew }: ScorePanelProps) {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-blue-600 p-8 text-center text-white">
          <p className="text-blue-100 text-sm font-semibold uppercase tracking-widest mb-2">综合得分</p>
          <div className="text-7xl font-black">{data.score}</div>
          <div className="flex justify-center mt-4">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={20} 
                className={`${i < Math.round(data.score / 20) ? 'fill-yellow-400 text-yellow-400' : 'text-blue-400'}`} 
              />
            ))}
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
              评价
            </h3>
            <div className={`bg-gray-50 rounded-2xl p-6 border border-gray-100 font-medium ${getScoreColor(data.score)}`}>
              {data.judge}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
              改进建议
            </h3>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <p className="text-gray-700 leading-relaxed">
                {data.proposal}
              </p>
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
