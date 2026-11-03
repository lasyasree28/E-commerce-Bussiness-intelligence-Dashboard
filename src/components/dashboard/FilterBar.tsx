import React, { useState } from 'react';
import { 
  Filter, 
  Calendar, 
  RotateCcw, 
  Download, 
  ChevronDown, 
  FileSpreadsheet, 
  Check, 
  SlidersHorizontal 
} from 'lucide-react';
import { FilterState, Order, Product, Customer } from '../../types';
import { exportOrdersToCsv, exportProductsToCsv, exportCustomersToCsv } from '../../utils/exportCsv';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  filteredOrdersCount: number;
  totalOrdersCount: number;
  orders: Order[];
  products: Product[];
  customers: Customer[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  filteredOrdersCount,
  totalOrdersCount,
  orders,
  products,
  customers,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const categories = [
    'All Categories',
    'Electronics',
    'Fashion & Apparel',
    'Home & Kitchen',
    'Beauty & Personal Care',
    'Sports & Outdoors',
    'Books & Stationery'
  ];

  const statuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Processing', label: 'Processing' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Cancelled', label: 'Cancelled' }
  ];

  const paymentMethods = [
    { value: 'all', label: 'All Payments' },
    { value: 'Credit Card', label: 'Credit Card' },
    { value: 'PayPal', label: 'PayPal' },
    { value: 'UPI / Net Banking', label: 'UPI / Net Banking' },
    { value: 'Apple Pay', label: 'Apple Pay' },
    { value: 'Cash on Delivery', label: 'Cash on Delivery' }
  ];

  const resetFilters = () => {
    onFilterChange({
      dateRangePreset: 'all',
      startDate: '',
      endDate: '',
      category: 'all',
      status: 'all',
      paymentMethod: 'all',
      searchQuery: '',
      selectedYear: 'all',
    });
  };

  const isFiltered = 
    filters.dateRangePreset !== 'all' || 
    filters.category !== 'all' || 
    filters.status !== 'all' || 
    filters.paymentMethod !== 'all' || 
    filters.selectedYear !== 'all' ||
    filters.searchQuery !== '';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left: Filter Controls / Responsive Toggle */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Date Presets */}
          <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
            <button
              onClick={() => onFilterChange({ ...filters, dateRangePreset: 'all', selectedYear: 'all' })}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-all ${
                filters.dateRangePreset === 'all' && filters.selectedYear === 'all'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => onFilterChange({ ...filters, dateRangePreset: 'this_year', selectedYear: '2026' })}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-all ${
                filters.dateRangePreset === 'this_year' || filters.selectedYear === '2026'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              2026 (YTD)
            </button>
            <button
              onClick={() => onFilterChange({ ...filters, dateRangePreset: 'last_year', selectedYear: '2025' })}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-all ${
                filters.dateRangePreset === 'last_year' || filters.selectedYear === '2025'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              2025
            </button>
            <button
              onClick={() => onFilterChange({ ...filters, dateRangePreset: '30d', selectedYear: 'all' })}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-all ${
                filters.dateRangePreset === '30d'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => onFilterChange({ ...filters, dateRangePreset: '7d', selectedYear: 'all' })}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-all ${
                filters.dateRangePreset === '7d'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              7 Days
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={filters.category}
              onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
              className="text-xs bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 pr-7 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion & Apparel">Fashion & Apparel</option>
              <option value="Home & Kitchen">Home & Kitchen</option>
              <option value="Beauty & Personal Care">Beauty & Personal Care</option>
              <option value="Sports & Outdoors">Sports & Outdoors</option>
              <option value="Books & Stationery">Books & Stationery</option>
            </select>
          </div>

          {/* Order Status Dropdown */}
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
              className="text-xs bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 pr-7 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              {statuses.map(st => (
                <option key={st.value} value={st.value}>{st.label}</option>
              ))}
            </select>
          </div>

          {/* Payment Method Dropdown */}
          <div className="relative">
            <select
              value={filters.paymentMethod}
              onChange={(e) => onFilterChange({ ...filters, paymentMethod: e.target.value })}
              className="text-xs bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 pr-7 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              {paymentMethods.map(pm => (
                <option key={pm.value} value={pm.value}>{pm.label}</option>
              ))}
            </select>
          </div>

          {/* Reset Filters button */}
          {isFiltered && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Right: Results Count & Export Reports Dropdown */}
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Showing <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{filteredOrdersCount}</span> of <span className="font-mono text-slate-500">{totalOrdersCount}</span> orders
          </div>

          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-2xs whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
              <ChevronDown className="w-3 h-3 ml-0.5" />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1.5 z-40">
                <button
                  onClick={() => {
                    exportOrdersToCsv(orders);
                    setShowExportMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-left"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <div>
                    <p className="font-medium">Export Orders CSV</p>
                    <p className="text-[10px] text-slate-400">Full orders & financials</p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    exportProductsToCsv(products);
                    setShowExportMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-left"
                >
                  <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="font-medium">Export Products CSV</p>
                    <p className="text-[10px] text-slate-400">Inventory & margins</p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    exportCustomersToCsv(customers);
                    setShowExportMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-left"
                >
                  <FileSpreadsheet className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="font-medium">Export Customers CSV</p>
                    <p className="text-[10px] text-slate-400">Segments & lifetime value</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
