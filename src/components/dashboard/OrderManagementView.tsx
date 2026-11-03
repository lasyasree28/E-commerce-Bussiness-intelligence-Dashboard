import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types';
import { 
  ShoppingCart, 
  Plus, 
  Eye, 
  Edit3, 
  Trash2, 
  Search, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface OrderManagementViewProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
  onOpenNewOrderModal: () => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onDeleteOrder: (orderId: string) => void;
}

export const OrderManagementView: React.FC<OrderManagementViewProps> = ({
  orders,
  onViewOrder,
  onOpenNewOrderModal,
  onUpdateOrderStatus,
  onDeleteOrder
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter orders locally for this view if needed
  const filtered = orders.filter(order => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchName = order.customerName.toLowerCase().includes(q);
      const matchProd = order.itemsSummary.toLowerCase().includes(q);
      if (!matchId && !matchName && !matchProd) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const currentOrders = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-0.5 rounded-full">
            <Clock className="w-3 h-3" />
            Processing
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-0.5 rounded-full">
            <AlertCircle className="w-3 h-3" />
            Pending
          </span>
        );
      case 'Cancelled':
      case 'Refunded':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2.5 py-0.5 rounded-full">
            <XCircle className="w-3 h-3" />
            {status}
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Table Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Quick Filter Buttons */}
          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
            {['all', 'Completed', 'Processing', 'Pending', 'Cancelled'].map(st => (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  statusFilter === st
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {st === 'all' ? 'All Orders' : st}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by Order ID / Customer..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 w-52 sm:w-64"
            />
          </div>
        </div>

        {/* Create Order Button */}
        <button
          onClick={onOpenNewOrderModal}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Order</span>
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50/75 dark:bg-slate-800/40">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Product Name(s)</th>
                <th className="py-3 px-4">Order Date</th>
                <th className="py-3 px-4 text-center">Qty</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300">
              {currentOrders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                  {/* Order ID */}
                  <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                    <button
                      onClick={() => onViewOrder(order)}
                      className="hover:underline text-left"
                    >
                      {order.id}
                    </button>
                  </td>

                  {/* Customer */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {order.customerName}
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500">
                      {order.shippingCity}
                    </div>
                  </td>

                  {/* Product Name(s) */}
                  <td className="py-3 px-4 max-w-xs">
                    <div className="truncate text-slate-800 dark:text-slate-200" title={order.itemsSummary}>
                      {order.itemsSummary || 'Standard Merchandise'}
                    </div>
                  </td>

                  {/* Order Date */}
                  <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {order.orderDate}
                  </td>

                  {/* Quantity */}
                  <td className="py-3 px-4 font-mono text-center font-medium">
                    {order.totalQuantity}
                  </td>

                  {/* Total Amount */}
                  <td className="py-3 px-4 font-mono text-right font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    ${order.netAmount.toFixed(2)}
                  </td>

                  {/* Payment Method */}
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {order.paymentMethod}
                  </td>

                  {/* Status Pill */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => onViewOrder(order)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                        title="View order invoice & items"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Quick Status Toggle */}
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="text-[11px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-1 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
                        title="Change order status"
                      >
                        <option value="Completed">Completed</option>
                        <option value="Processing">Processing</option>
                        <option value="Pending">Pending</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Refunded">Refunded</option>
                      </select>

                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete or cancel Order ${order.id}?`)) {
                            onDeleteOrder(order.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                        title="Delete order"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {currentOrders.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-xs text-slate-400">
                    No orders found matching the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div>
            Showing <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
              {filtered.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
            </span> to <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
              {Math.min(currentPage * pageSize, filtered.length)}
            </span> of <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
              {filtered.length}
            </span> orders
          </div>

          <div className="inline-flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-xs px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
