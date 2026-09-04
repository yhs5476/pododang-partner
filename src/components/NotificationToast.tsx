import React from 'react';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface NotificationToastProps {
  message: string;
  type?: 'success' | 'info' | 'reward';
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  message,
  type = 'success',
  onClose,
}) => {
  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-200 max-w-sm w-[92%]">
      <div className="bg-[#191F28] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between gap-2.5 text-xs font-medium">
        <div className="flex items-center gap-2">
          {type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#0FA958] shrink-0" />}
          {type === 'reward' && <Sparkles className="w-4 h-4 text-yellow-300 shrink-0" />}
          {type === 'info' && <AlertCircle className="w-4 h-4 text-[#0FA958] shrink-0" />}
          <span>{message}</span>
        </div>
        <button
          onClick={onClose}
          className="text-[#8B95A1] hover:text-white text-xs font-bold shrink-0 ml-1"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
