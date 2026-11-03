import React, { useState } from 'react';
import { Product, ProductCategory } from '../../types';
import { 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Plus, 
  Search, 
  Filter 
} from 'lucide-react';

interface InventoryViewProps {
  products: Product[];
  onOpenRestockModal: (product: Product) => void;
  onOpenNewProductModal: () => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  products,
  onOpenRestockModal,
  onOpenNewProductModal
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockStatusFilter, setStockStatusFilter] = useState<'all' | 'low' | 'normal' | 'out'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(p => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (stockStatusFilter === 'low' && (p.stockQuantity > p.reorderThreshold || p.stockQuantity <= 0)) return false;
    if (stockStatusFilter === 'out' && p.stockQuantity > 0) return false;
    if (stockStatusFilter === 'normal' && p.stockQuantity <= p.reorderThreshold) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    }
    return true;
  });

  const lowStockCount = products.filter(p => p.stockQuantity <= p.reorderThreshold && p.stockQuantity > 0).length;
  const outOfStockCount = products.filter(p => p.stockQuantity === 0).length;
  const normalStockCount = products.filter(p => p.stockQuantity > p.reorderThreshold).length;

  return (
    <div className="space-y-4">
      {/* Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Adequate Stock</span>
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-2">
            {normalStockCount} Products
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            Sufficient buffer inventory
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Low Stock (Action Needed)</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-500 mt-2">
            {lowStockCount} Products
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            Below reorder safety threshold
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Out of Stock</span>
            <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-2">
            {outOfStockCount} Products
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            Zero current availability
          </p>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Status Buttons */}
          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setStockStatusFilter('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                stockStatusFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All ({products.length})
            </button>
            <button
              onClick={() => setStockStatusFilter('low')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                stockStatusFilter === 'low'
                  ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Low Stock ({lowStockCount})
            </button>
            <button
              onClick={() => setStockStatusFilter('normal')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                stockStatusFilter === 'normal'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Normal ({normalStockCount})
            </button>
          </div>

          {/* Search SKU/Product */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search product SKU / title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 w-52 sm:w-64"
            />
          </div>
        </div>

        <button
          onClick={onOpenNewProductModal}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50/75 dark:bg-slate-800/40">
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Selling Price</th>
                <th className="py-3 px-4 text-right">Cost Price</th>
                <th className="py-3 px-4 text-center">Stock Level</th>
                <th className="py-3 px-4 text-center">Threshold</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300">
              {filteredProducts.map(prod => {
                const isLow = prod.stockQuantity <= prod.reorderThreshold && prod.stockQuantity > 0;
                const isOut = prod.stockQuantity === 0;

                return (
                  <tr key={prod.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-500">
                      {prod.sku}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      {prod.name}
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                      {prod.category}
                    </td>
                    <td className="py-3 px-4 font-mono text-right text-slate-900 dark:text-white font-medium">
                      ${prod.price.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 font-mono text-right text-slate-400">
                      ${prod.costPrice.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 font-mono text-center font-bold">
                      <span className={isLow ? 'text-amber-600 dark:text-amber-400' : isOut ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}>
                        {prod.stockQuantity}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-center text-slate-400">
                      {prod.reorderThreshold}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {isOut ? (
                        <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2.5 py-0.5 rounded-full">
                          Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-0.5 rounded-full">
                          Low Stock
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onOpenRestockModal(prod)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 rounded-md transition-colors"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Restock</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
