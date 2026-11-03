import React from 'react';
import { BusinessInsight, Product } from '../../types';
import { 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';

interface BusinessInsightsCardProps {
  insights: BusinessInsight[];
  onActionClick?: (action: string) => void;
}

export const BusinessInsightsCard: React.FC<BusinessInsightsCardProps> = ({
  insights,
  onActionClick
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Automated Business Intelligence & Operational Insights
          </h3>
        </div>
        <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded font-semibold">
          Real-Time Synthesis
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {insights.map(item => {
          const isCritical = item.type === 'critical';
          const isPositive = item.type === 'positive';

          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border transition-all ${
                isCritical
                  ? 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/80'
                  : isPositive
                  ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/40'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {isCritical ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  )}
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {item.title}
                  </h4>
                </div>
                {item.metric && (
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded text-slate-700 dark:text-slate-300 shadow-2xs">
                    {item.metric}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                {item.description}
              </p>

              {item.action && onActionClick && (
                <button
                  onClick={() => onActionClick(item.action!)}
                  className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <span>{item.action}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
