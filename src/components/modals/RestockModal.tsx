import React, { useState } from 'react';
import { Product } from '../../types';
import { X, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface RestockModalProps {
  product: Product | null;
  onClose: () => void;
  onConfirmRestock: (productId: string, quantityToAdd: number) => void;
}

export const RestockModal: React.FC<RestockModalProps> = ({
  product,
  onClose,
  onConfirmRestock
}) => {
  if (!product) return null;

  // Suggested restock quantity based on threshold
  const suggested = Math.max(20, product.reorderThreshold * 2 - product.stockQuantity);
  const [restockQty, setRestockQty] = useState<number>(suggested);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (restockQty > 0) {
      onConfirmRestock(product.id, restockQty);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Restock Product
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <span className="text-xs text-slate-400 font-medium">Selected Product:</span>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
              {product.name}
            </p>
            <p className="text-xs font-mono text-slate-400">
              SKU: {product.sku} · Category: {product.category}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block">Current Stock:</span>
              <span className={`font-mono text-sm font-bold ${
                product.stockQuantity <= product.reorderThreshold 
                  ? 'text-amber-600 dark:text-amber-400' 
                  : 'text-slate-900 dark:text-white'
              }`}>
                {product.stockQuantity} units
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Safety Threshold:</span>
              <span className="font-mono text-sm font-bold text-slate-700 dark:text-slate-300">
                {product.reorderThreshold} units
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Quantity to Receive / Add to Inventory
            </label>
            <input
              type="number"
              min={1}
              max={1000}
              value={restockQty}
              onChange={(e) => setRestockQty(parseInt(e.target.value) || 0)}
              className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-100 dark:border-emerald-900/40 text-xs flex items-center justify-between">
            <span className="text-emerald-800 dark:text-emerald-300 font-medium">
              New Projected Inventory:
            </span>
            <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300 text-sm">
              {product.stockQuantity + (restockQty || 0)} units
            </span>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
            >
              Confirm Restock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
