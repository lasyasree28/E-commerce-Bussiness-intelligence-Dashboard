import React from 'react';
import { Order } from '../../types';
import { ShoppingBag, ArrowRight, Eye, CheckCircle2, Clock, XCircle } from 'lucide-react';

interface RecentTransactionsCardProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
  onViewAllOrders: () => void;
}

export const RecentTransactionsCard: React.FC<RecentTransactionsCardProps> = ({
  orders,
  onViewOrder,
  onViewAllOrders
}) => {
  const recent = orders.slice(0, 6);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Recent Transactions & Orders
          </h3>
        </div>
        <button
          onClick={onViewAllOrders}
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
        >
          <span>View All</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {recent.map(order => (
          <div
            key={order.id}
            className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-xs text-blue-600 dark:text-blue-400 shrink-0">
                {order.paymentMethod === 'Credit Card' ? 'CC' : order.paymentMethod === 'PayPal' ? 'PP' : 'NB'}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                    {order.customerName}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {order.id}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {order.itemsSummary || 'Multiple items'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0 text-right">
              <div>
                <div className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                  ${order.netAmount.toFixed(2)}
                </div>
                <div className="text-[10px] text-slate-400">
                  {order.orderDate}
                </div>
              </div>

              <button
                onClick={() => onViewOrder(order)}
                className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="View order details"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
