'use client';
import { useState } from 'react';
import { Send } from 'lucide-react';

interface TextInputPanelProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

export default function TextInputPanel({ onSubmit, isLoading }: TextInputPanelProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSubmit(text);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="zh-input" className="block text-sm font-medium text-gray-700 mb-2">
            粘贴中文演讲稿
          </label>
          <textarea
            id="zh-input"
            rows={8}
            className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-gray-900"
            placeholder="在这里输入或粘贴您想要练习的中文演讲稿..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
              !text.trim() || isLoading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
            }`}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <Send size={18} />
            )}
            {isLoading ? '正在生成练习...' : '开始生成练习'}
          </button>
        </div>
      </form>
    </div>
  );
}
