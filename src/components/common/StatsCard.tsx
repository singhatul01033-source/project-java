import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  accentColor?: 'indigo' | 'emerald' | 'amber' | 'cyan' | 'purple' | 'rose';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor = 'indigo'
}) => {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-600',
      border: 'border-indigo-100',
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
    },
    amber: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-600',
      border: 'border-amber-100',
    },
    cyan: {
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-600',
      border: 'border-cyan-100',
    },
    purple: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-600',
      border: 'border-purple-100',
    },
    rose: {
      bg: 'bg-rose-500/10',
      text: 'text-rose-600',
      border: 'border-rose-100',
    },
  };

  const current = colorMap[accentColor];

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</span>
        <div className={`p-2 rounded-lg ${current.bg} ${current.text}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-slate-900">{value}</span>
        {trend && (
          <span
            className={`text-xs font-medium ${
              trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
    </div>
  );
};
