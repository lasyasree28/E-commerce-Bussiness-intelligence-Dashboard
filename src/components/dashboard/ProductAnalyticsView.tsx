import React, { useState } from 'react';
import { Product, CategoryRevenueData } from '../../types';
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  Star, 
  ArrowUpDown, 
  PlusCircle, 
  RefreshCw,
  Layers,
  CheckCircle2
} from 'lucide-react';

interface ProductAnalyticsViewProps {
  products: Product[];
  categoryData: CategoryRevenueData[];
  onOpenRestockModal: (product: Product) => void;
  onOpenNewProductModal?: () => void;
}

export const ProductAnalyticsView: React.FC<ProductAnalyticsViewProps> = ({
  products,
  categoryData,
  onOpenRestockModal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'top' | 'least' | 'categories' | 'inventory'>('top');

  // Sorted lists
  const top10 = [...products].sort((a, b) => b.totalSold - a.totalSold).slice(0, 10);
  const leastSelling = [...products].sort((a, b) => a.totalSold - b.totalSold).slice(0, 6);
  const lowStock = products.filter(p => p.stockQuantity <= p.reorderThreshold);

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Product & Merchandising Analytics
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Unit velocity, product-level profit margins, category performance, and stock health
          </p>
        </div>

        {/* Segmented Sub Tabs */}
        <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('top')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeSubTab === 'top'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Top 10 Sellers
          </button>
          <button
            onClick={() => setActiveSubTab('least')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeSubTab === 'least'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Least-Selling
          </button>
          <button
            onClick={() => setActiveSubTab('categories')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeSubTab === 'categories'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Category Matrix
          </button>
          <button
            onClick={() => setActiveSubTab('inventory')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeSubTab === 'inventory'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Stock Alerts ({lowStock.length})
          </button>
        </div>
      </div>

      {/* Stock Alert Banner if any items low */}
      {lowStock.length > 0 && activeSubTab !== 'inventory' && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                {lowStock.length} Products Have Reached Safety Stock Reorder Threshold
              </p>
              <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">
                Prevent supply chain disruption and stockout revenue loss.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveSubTab('inventory')}
            className="px-3.5 py-1.5 text-xs font-semibold text-amber-900 dark:text-amber-200 bg-amber-200/80 dark:bg-amber-900/80 rounded-lg hover:bg-amber-300/80 transition-colors self-start sm:self-auto shrink-0"
          >
            Review Stock Items &rarr;
          </button>
        </div>
      )}

      {/* TAB 1: TOP 10 BEST-SELLING PRODUCTS */}
      {activeSubTab === 'top' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Top 10 Best-Selling Products by Sales Volume & Revenue
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">Ranked by Units Sold</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50/75 dark:bg-slate-800/40">
                  <th className="py-3 px-4"># Rank</th>
                  <th className="py-3 px-4">SKU / Product Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-right">Cost Price</th>
                  <th className="py-3 px-4 text-right">Margin (%)</th>
                  <th className="py-3 px-4 text-right">Units Sold</th>
                  <th className="py-3 px-4 text-right">Total Revenue</th>
                  <th className="py-3 px-4 text-center">Stock</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300">
                {top10.map((prod, index) => {
                  const marginPct = prod.price > 0 ? (((prod.price - prod.costPrice) / prod.price) * 100).toFixed(1) : '0';
                  const isLow = prod.stockQuantity <= prod.reorderThreshold;

                  return (
                    <tr key={prod.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-400">
                        #{index + 1}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {prod.name}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">
                          {prod.sku} · ⭐ {prod.rating}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                        {prod.category}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-right text-slate-900 dark:text-white font-medium">
                        ${prod.price.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-right text-slate-400">
                        ${prod.costPrice.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-right font-medium text-emerald-600 dark:text-emerald-400">
                        {marginPct}%
                      </td>
                      <td className="py-3.5 px-4 font-mono text-right font-semibold text-slate-900 dark:text-white">
                        {prod.totalSold.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-right font-bold text-blue-600 dark:text-blue-400">
                        ${prod.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`font-mono text-xs font-semibold ${
                          isLow ? 'text-amber-600 dark:text-amber-400' : 'text-slate-600 dark:text-slate-300'
                        }`}>
                          {prod.stockQuantity}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => onOpenRestockModal(prod)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
                        >
                          Restock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: LEAST-SELLING PRODUCTS */}
      {activeSubTab === 'least' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Least-Selling Products (Dead Stock & Optimization Candidates)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Targeted for promotional discounting, bundle deals, or catalog revision
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">Low Velocity</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50/75 dark:bg-slate-800/40">
                  <th className="py-3 px-4">SKU / Product Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-right">Units Sold</th>
                  <th className="py-3 px-4 text-right">Revenue</th>
                  <th className="py-3 px-4 text-center">Current Stock</th>
                  <th className="py-3 px-4">BI Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300">
                {leastSelling.map(prod => (
                  <tr key={prod.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {prod.name}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">
                        {prod.sku}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                      {prod.category}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-right text-slate-900 dark:text-white">
                      ${prod.price.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-right font-medium text-rose-600 dark:text-rose-400">
                      {prod.totalSold}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-right font-bold text-slate-900 dark:text-white">
                      ${prod.revenue.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-center">
                      {prod.stockQuantity}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                      Apply 15-20% bundle discount or flash sale
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORY PERFORMANCE MATRIX */}
      {activeSubTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryData.map(cat => (
            <div 
              key={cat.category}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {cat.category}
                </span>
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded">
                  {cat.percentage}% of Rev
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <span className="text-slate-400 block text-[11px]">Total Revenue</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                    ${cat.revenue.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Gross Profit</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    ${cat.profit.toLocaleString()}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-slate-400 block text-[11px]">Units Sold</span>
                  <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                    {cat.unitsSold.toLocaleString()} units
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-slate-400 block text-[11px]">Avg Margin</span>
                  <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                    {cat.revenue > 0 ? ((cat.profit / cat.revenue) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>

              {/* Progress visual */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, Math.max(8, cat.percentage))}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: LOW-STOCK PRODUCT ALERTS & RESTOCK */}
      {activeSubTab === 'inventory' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Low-Stock Products Requiring Immediate Reordering
              </h3>
            </div>
            <span className="text-xs font-mono font-semibold text-amber-600 dark:text-amber-400">
              {lowStock.length} Alert{lowStock.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50/75 dark:bg-slate-800/40">
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Current Stock</th>
                  <th className="py-3 px-4 text-center">Reorder Level</th>
                  <th className="py-3 px-4 text-center">Stock Deficit</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300">
                {lowStock.map(prod => {
                  const deficit = Math.max(0, prod.reorderThreshold * 2 - prod.stockQuantity);
                  return (
                    <tr key={prod.id} className="hover:bg-amber-50/30 dark:hover:bg-amber-950/20 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                        {prod.name}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {prod.sku}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                        {prod.category}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-center font-bold text-amber-600 dark:text-amber-400">
                        {prod.stockQuantity}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-center text-slate-400">
                        {prod.reorderThreshold}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-center font-medium text-rose-600 dark:text-rose-400">
                        +{deficit} recommended
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => onOpenRestockModal(prod)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Restock</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {lowStock.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-400 text-xs">
                      All products are currently above their safety stock reorder thresholds!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
