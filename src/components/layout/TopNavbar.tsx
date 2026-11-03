import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Menu, 
  CheckCircle2, 
  AlertTriangle, 
  Package, 
  User, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { Product, Order } from '../../types';

interface TopNavbarProps {
  onToggleMobileSidebar: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  lowStockProducts: Product[];
  recentOrders: Order[];
  onNavigateToTab: (tab: any) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onToggleMobileSidebar,
  searchQuery,
  onSearchChange,
  darkMode,
  onToggleDarkMode,
  lowStockProducts,
  recentOrders,
  onNavigateToTab
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalNotifications = lowStockProducts.length + Math.min(recentOrders.length, 3);

  return (
    <header className="sticky top-0 z-20 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search orders, customers, or products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right Action Icons: Notifications, Dark mode, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dark/Light mode toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="System alerts & notifications"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {totalNotifications > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  Notifications & Alerts
                </span>
                <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
                  {totalNotifications} New
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {lowStockProducts.map(prod => (
                  <div 
                    key={prod.id} 
                    onClick={() => {
                      onNavigateToTab('inventory');
                      setShowNotifications(false);
                    }}
                    className="p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors flex items-start gap-3"
                  >
                    <div className="p-2 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 shrink-0">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                          Low Stock Alert: {prod.name}
                        </p>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Only <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">{prod.stockQuantity}</span> units remaining (Threshold: {prod.reorderThreshold}).
                      </p>
                    </div>
                  </div>
                ))}

                {recentOrders.slice(0, 3).map(order => (
                  <div 
                    key={order.id} 
                    onClick={() => {
                      onNavigateToTab('orders');
                      setShowNotifications(false);
                    }}
                    className="p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors flex items-start gap-3"
                  >
                    <div className="p-2 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
                      <Package className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                          Order {order.id}
                        </p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          {order.orderDate}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Received from <span className="font-medium text-slate-700 dark:text-slate-300">{order.customerName}</span> for ${order.netAmount.toFixed(2)}.
                      </p>
                    </div>
                  </div>
                ))}

                {totalNotifications === 0 && (
                  <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                    No active alerts at this moment.
                  </div>
                )}
              </div>

              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 text-center">
                <button
                  onClick={() => {
                    onNavigateToTab('orders');
                    setShowNotifications(false);
                  }}
                  className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View All Activity &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 pl-1.5 pr-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 text-white font-semibold text-xs flex items-center justify-center shadow-xs">
              AD
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                Alexander Davis
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                Lead BI Analyst
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2 z-50">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white">Alexander Davis</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">alex.davis@ecommerce-bi.io</p>
              </div>
              <button 
                onClick={() => {
                  onNavigateToTab('architecture');
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-left"
              >
                <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Backend & Database Hub</span>
              </button>
              <button 
                onClick={() => {
                  onNavigateToTab('customers');
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-left"
              >
                <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Customer Directory</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
