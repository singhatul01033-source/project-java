import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none no-print">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let borderClass = 'border-emerald-500/30 bg-emerald-950/90 text-emerald-100';
        let iconColor = 'text-emerald-400';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          borderClass = 'border-rose-500/30 bg-rose-950/90 text-rose-100';
          iconColor = 'text-rose-400';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          borderClass = 'border-amber-500/30 bg-amber-950/90 text-amber-100';
          iconColor = 'text-amber-400';
        } else if (toast.type === 'info') {
          Icon = Info;
          borderClass = 'border-cyan-500/30 bg-slate-900/95 text-slate-100';
          iconColor = 'text-cyan-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-xl transition-all duration-200 animate-in slide-in-from-bottom-5 ${borderClass}`}
          >
            <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold tracking-tight text-white">{toast.title}</h4>
              <p className="text-xs mt-0.5 text-slate-300 leading-relaxed break-words">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
