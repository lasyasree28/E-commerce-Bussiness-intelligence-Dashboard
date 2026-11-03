import React from 'react';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package, 
  CreditCard, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Percent
} from 'lucide-react';
import { SummaryMetrics } from '../../types';

interface SummaryCardsProps {
  metrics: SummaryMetrics;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ metrics }) => {
  const cards = [
    {
      title: 'Total Revenue',
      value: `$${metrics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      growth: metrics.revenueGrowth,
      icon: DollarSign,
      color: 'blue',
      context: 'vs previous period',
    },
    {
      title: 'Total Orders',
      value: metrics.totalOrders.toLocaleString('en-US'),
      growth: metrics.ordersGrowth,
      icon: ShoppingCart,
      color: 'purple',
      context: 'vs previous period',
    },
    {
      title: 'Total Customers',
      value: metrics.totalCustomers.toLocaleString('en-US'),
      growth: metrics.customersGrowth,
      icon: Users,
      color: 'indigo',
      context: 'active buyers',
    },
    {
      title: 'Total Products',
      value: metrics.totalProducts.toString(),
      subtext: `${metrics.activeProducts} in stock · ${metrics.lowStockCount} low stock`,
      icon: Package,
      color: 'emerald',
      isProductCard: true,
    },
    {
      title: 'Average Order Value',
      value: `$${metrics.averageOrderValue.toFixed(2)}`,
      growth: metrics.aovGrowth,
      icon: CreditCard,
      color: 'amber',
      context: 'basket size trend',
    },
    {
      title: 'Total Profit',
      value: `$${metrics.totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      growth: metrics.profitGrowth,
      icon: TrendingUp,
      color: 'rose',
      margin: `${metrics.profitMarginPercent.toFixed(1)}% margin`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const isPositive = (card.growth ?? 0) >= 0;

        return (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 transition-all duration-200 hover:shadow-sm"
          >
            {/* Header: Title and Icon */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {card.title}
              </span>
              <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>

            {/* Main Metric Value */}
            <div className="mt-3">
              <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white tracking-tight">
                {card.value}
              </div>
            </div>

            {/* Footer Growth or Secondary Context */}
            <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
              {card.isProductCard ? (
                <div className="text-slate-500 dark:text-slate-400 truncate">
                  {card.subtext}
                </div>
              ) : (
                <>
                  <div className={`inline-flex items-center font-medium font-mono ${
                    isPositive 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {isPositive ? (
                      <ArrowUpRight className="w-3.5 h-3.5 mr-0.5 shrink-0" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5 mr-0.5 shrink-0" />
                    )}
                    <span>{isPositive ? `+${card.growth}%` : `${card.growth}%`}</span>
                  </div>

                  {card.margin ? (
                    <span className="font-mono font-medium text-slate-500 dark:text-slate-400">
                      {card.margin}
                    </span>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500 truncate">
                      {card.context}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
