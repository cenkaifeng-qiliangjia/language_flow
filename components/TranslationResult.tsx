'use client';
import { TranslationData } from '@/lib/types';
import { Copy, Volume2 } from 'lucide-react';

export default function TranslationResult({ data }: { data: TranslationData }) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // 这里可以加一个 toast 提示
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-bold text-gray-900">参考译文</h2>
          <button 
            onClick={() => copyToClipboard(data.english_text)}
            className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-blue-600 transition-colors"
            title="复制全文"
          >
            <Copy size={18} />
          </button>
        </div>
        
        <div className="prose prose-blue max-w-none">
          <div className="text-xl leading-relaxed text-gray-800 font-medium whitespace-pre-wrap">
            {data.english_text}
          </div>
        </div>

        {data.ipa && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-blue-700 font-mono text-sm">
            IPA: {data.ipa}
          </div>
        )}
      </div>

      {data.mnemonics && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">助记提示</h3>
          <p className="text-gray-700 leading-relaxed italic">
            {data.mnemonics}
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
                <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-all">
                  <Volume2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
