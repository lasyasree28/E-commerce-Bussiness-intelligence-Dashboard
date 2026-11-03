import React, { useState } from 'react';
import { Product, ProductCategory } from '../../types';
import { X, PackagePlus } from 'lucide-react';

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (prod: Product) => void;
}

export const NewProductModal: React.FC<NewProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [sku, setSku] = useState(`PRD-${Math.floor(100 + Math.random() * 900)}`);
  const [category, setCategory] = useState<ProductCategory>('Electronics');
  const [price, setPrice] = useState<number>(99.00);
  const [costPrice, setCostPrice] = useState<number>(45.00);
  const [stockQuantity, setStockQuantity] = useState<number>(50);
  const [reorderThreshold, setReorderThreshold] = useState<number>(15);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProd: Product = {
      id: `prod-${Math.floor(100 + Math.random() * 900)}`,
      sku,
      name,
      category,
      price: Number(price),
      costPrice: Number(costPrice),
      stockQuantity: Number(stockQuantity),
      reorderThreshold: Number(reorderThreshold),
      rating: 5.0,
      totalSold: 0,
      revenue: 0,
    };

    onAddProduct(newProd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <PackagePlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Add New Product Catalog Entry
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
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Product Title / Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Pro Wireless Gaming Mouse"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Product SKU
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white"
              >
                <option value="Electronics">Electronics</option>
                <option value="Fashion & Apparel">Fashion & Apparel</option>
                <option value="Home & Kitchen">Home & Kitchen</option>
                <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                <option value="Sports & Outdoors">Sports & Outdoors</option>
                <option value="Books & Stationery">Books & Stationery</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Retail Selling Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                className="w-full text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Cost of Goods ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={costPrice}
                onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
                className="w-full text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Initial Stock Qty
              </label>
              <input
                type="number"
                min="0"
                required
                value={stockQuantity}
                onChange={(e) => setStockQuantity(parseInt(e.target.value) || 0)}
                className="w-full text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Low-Stock Threshold
              </label>
              <input
                type="number"
                min="1"
                required
                value={reorderThreshold}
                onChange={(e) => setReorderThreshold(parseInt(e.target.value) || 0)}
                className="w-full text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white"
              />
            </div>
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
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
