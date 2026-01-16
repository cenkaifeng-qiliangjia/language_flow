import React from 'react';
import { PracticeHistory } from '@/lib/types';
import { History, Calendar, Star, ChevronRight, Trash2 } from 'lucide-react';

interface HistoryPanelProps {
  history: PracticeHistory[];
  onSelect: (item: PracticeHistory) => void;
  onClear: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect, onClear }) => {
  if (history.length === 0) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return `今天 ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`;
    }
    return `${date.getMonth() + 1}月${date.getDate()}日 ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`;
  };

  return (
    <div className="mt-12 space-y-6">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-gray-900">
          <History size={20} className="text-blue-600" />
          <h3 className="text-lg font-bold">练习历史</h3>
        </div>
        <button
          onClick={onClear}
          className="text-xs text-gray-400 hover:text-red-500 active:text-red-600 flex items-center gap-1 transition-colors p-2 -mr-2"
        >
          <Trash2 size={14} />
          清除全部
        </button>
      </div>

      <div className="grid gap-3 w-full">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="group w-full max-w-full overflow-hidden text-left bg-white border border-gray-100 p-3.5 sm:p-4 rounded-2xl hover:border-blue-200 hover:shadow-md active:scale-[0.98] transition-all flex items-center justify-between gap-3"
          >
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-[11px] sm:text-xs text-gray-400">
                <div className="flex items-center gap-1 shrink-0">
                  <Calendar size={12} />
                  <span>{formatDate(item.date)}</span>
                </div>
                {item.score && (
                  <div className="flex items-center gap-0.5 text-orange-500 font-bold bg-orange-50 px-1.5 py-0.5 rounded-md shrink-0">
                    <Star size={10} fill="currentColor" className="sm:w-3 sm:h-3" />
                    <span>{item.score.score}分</span>
                  </div>
                )}
              </div>
              <p className="text-gray-700 font-medium text-sm sm:text-base truncate leading-relaxed pr-1">
                {item.zhText}
              </p>
            </div>
            <div className="bg-gray-50 group-hover:bg-blue-50 p-1.5 rounded-full transition-colors shrink-0">
              <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HistoryPanel;
