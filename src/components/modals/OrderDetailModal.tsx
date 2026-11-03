import React from 'react';
import { Order, OrderStatus } from '../../types';
import { X, Printer, CheckCircle2, Clock, XCircle, AlertCircle, Package } from 'lucide-react';

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus?: (orderId: string, status: OrderStatus) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
  onUpdateStatus
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Order {order.id}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Placed on {order.orderDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Print Order Invoice"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Customer & Shipping Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 font-medium block">Customer Information</span>
              <p className="font-bold text-slate-900 dark:text-white mt-1">{order.customerName}</p>
              <p className="text-slate-500 dark:text-slate-400">{order.customerEmail}</p>
              <p className="font-mono text-slate-400 text-[11px] mt-0.5">{order.customerId}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Fulfillment & Payment</span>
              <p className="font-medium text-slate-700 dark:text-slate-300 mt-1">
                Method: <span className="font-semibold text-slate-900 dark:text-white">{order.paymentMethod}</span>
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                Destination: <span className="font-medium text-slate-700 dark:text-slate-300">{order.shippingCity}</span>
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-slate-400">Status:</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {order.status}
                </span>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Ordered Items Breakdown
            </h3>
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 text-[11px] font-semibold uppercase">
                    <th className="py-2.5 px-4">Item</th>
                    <th className="py-2.5 px-4">Category</th>
                    <th className="py-2.5 px-4 text-right">Unit Price</th>
                    <th className="py-2.5 px-4 text-center">Qty</th>
                    <th className="py-2.5 px-4 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        {item.productName}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {item.category}
                      </td>
                      <td className="py-3 px-4 font-mono text-right">
                        ${item.unitPrice.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono text-center font-medium">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-4 font-mono text-right font-semibold text-slate-900 dark:text-white">
                        ${item.subtotal.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Totals */}
          <div className="flex justify-end pt-2">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Gross Subtotal:</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Applied Discount:</span>
                  <span className="font-mono">-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>Shipping & Handling:</span>
                <span className="font-mono text-emerald-600">FREE</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between text-sm font-bold text-slate-900 dark:text-white">
                <span>Net Total:</span>
                <span className="font-mono text-blue-600 dark:text-blue-400">
                  ${order.netAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                <span>Net Gross Margin:</span>
                <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                  +${order.profitAmount.toFixed(2)} ({((order.profitAmount / order.netAmount) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
