import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Package, 
  Users, 
  ShoppingCart, 
  AlertTriangle, 
  Terminal, 
  FileSpreadsheet,
  Layers,
  X
} from 'lucide-react';
import { ActiveTab } from '../../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  lowStockCount: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  lowStockCount,
  mobileOpen,
  onCloseMobile
}) => {
  const navItems = [
    { id: 'overview' as ActiveTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'sales' as ActiveTab, label: 'Sales Analytics', icon: TrendingUp },
    { id: 'products' as ActiveTab, label: 'Product Analytics', icon: Package },
    { id: 'customers' as ActiveTab, label: 'Customer Analytics', icon: Users },
    { id: 'orders' as ActiveTab, label: 'Order Management', icon: ShoppingCart },
    { 
      id: 'inventory' as ActiveTab, 
      label: 'Inventory & Alerts', 
      icon: AlertTriangle,
      badge: lowStockCount > 0 ? lowStockCount : undefined
    },
    { 
      id: 'architecture' as ActiveTab, 
      label: 'Flask & MySQL Hub', 
      icon: Terminal,
      highlight: true
    },
  ];

  const content = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white leading-none">
              OmniBI
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              E-Commerce Intelligence
            </p>
          </div>
        </div>
        <button 
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
          Core Analytics
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span className="whitespace-nowrap">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                  isActive ? 'bg-white text-blue-600' : 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300'
                }`}>
                  {item.badge}
                </span>
              )}
              {item.highlight && !isActive && (
                <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded">
                  API
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info / Project Meta */}
      <div className="p-4 mx-3 my-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">System Architecture</span>
          <span className="text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
            Connected
          </span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
          Python Flask &bull; MySQL 3NF &bull; Pandas BI
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-30">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity" 
            onClick={onCloseMobile} 
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-slate-900 shadow-xl z-10">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
