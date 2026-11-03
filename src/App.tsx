/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ActiveTab, 
  FilterState, 
  Order, 
  Product, 
  Customer, 
  OrderStatus 
} from './types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CUSTOMERS, 
  INITIAL_ORDERS, 
  INITIAL_PAYMENTS 
} from './data/mockData';
import { 
  filterOrders, 
  computeSummaryMetrics, 
  computeMonthlySales, 
  computeDailySales, 
  computeCategoryRevenue, 
  computePaymentDistribution, 
  computeCustomerSegments, 
  generateBusinessInsights 
} from './utils/analytics';

// Layout Components
import { Sidebar } from './components/layout/Sidebar';
import { TopNavbar } from './components/layout/TopNavbar';

// Dashboard Sub-Views
import { FilterBar } from './components/dashboard/FilterBar';
import { SummaryCards } from './components/dashboard/SummaryCards';
import { SalesAnalyticsView } from './components/dashboard/SalesAnalyticsView';
import { ProductAnalyticsView } from './components/dashboard/ProductAnalyticsView';
import { CustomerAnalyticsView } from './components/dashboard/CustomerAnalyticsView';
import { OrderManagementView } from './components/dashboard/OrderManagementView';
import { InventoryView } from './components/dashboard/InventoryView';
import { BusinessInsightsCard } from './components/dashboard/BusinessInsightsCard';
import { RecentTransactionsCard } from './components/dashboard/RecentTransactionsCard';
import { BackendArchitectureView } from './components/dashboard/BackendArchitectureView';

// Modals
import { OrderDetailModal } from './components/modals/OrderDetailModal';
import { NewOrderModal } from './components/modals/NewOrderModal';
import { RestockModal } from './components/modals/RestockModal';
import { NewProductModal } from './components/modals/NewProductModal';

export default function App() {
  // State for core relational data
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Dark/Light Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Global Interactive Filters State
  const [filters, setFilters] = useState<FilterState>({
    dateRangePreset: 'all',
    startDate: '',
    endDate: '',
    category: 'all',
    status: 'all',
    paymentMethod: 'all',
    searchQuery: '',
    selectedYear: 'all',
  });

  // Modals state
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [restockingProduct, setRestockingProduct] = useState<Product | null>(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);

  // Dynamic BI Calculations (Simulating Python Pandas & NumPy Engine)
  const filteredOrders = filterOrders(orders, filters);
  const summaryMetrics = computeSummaryMetrics(filteredOrders, orders, products, customers);
  const monthlySales = computeMonthlySales(filteredOrders.length > 0 ? filteredOrders : orders);
  const dailySales = computeDailySales(filteredOrders.length > 0 ? filteredOrders : orders);
  const categoryRevenue = computeCategoryRevenue(filteredOrders.length > 0 ? filteredOrders : orders);
  const paymentDistribution = computePaymentDistribution(filteredOrders.length > 0 ? filteredOrders : orders);
  const customerSegments = computeCustomerSegments(customers, filteredOrders);
  const businessInsights = generateBusinessInsights(summaryMetrics, categoryRevenue, products, paymentDistribution);
  const lowStockProducts = products.filter(p => p.stockQuantity <= p.reorderThreshold);

  // CRUD Operations Handlers
  const handleCreateOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);

    // Update customer spend & order count
    setCustomers(prev => prev.map(c => {
      if (c.id === newOrder.customerId) {
        return {
          ...c,
          totalSpend: c.totalSpend + newOrder.netAmount,
          orderCount: c.orderCount + 1,
          segment: c.orderCount >= 5 ? 'Loyal Customers' : c.orderCount >= 10 ? 'VIP Champions' : 'Potential Loyalists'
        };
      }
      return c;
    }));

    // Deduct stock quantities for ordered products
    setProducts(prev => prev.map(p => {
      const orderItem = newOrder.items.find(i => i.productId === p.id);
      if (orderItem) {
        const remainingStock = Math.max(0, p.stockQuantity - orderItem.quantity);
        return {
          ...p,
          stockQuantity: remainingStock,
          totalSold: p.totalSold + orderItem.quantity,
          revenue: p.revenue + orderItem.subtotal
        };
      }
      return p;
    }));
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (viewingOrder && viewingOrder.id === orderId) {
      setViewingOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    if (viewingOrder && viewingOrder.id === orderId) {
      setViewingOrder(null);
    }
  };

  const handleConfirmRestock = (productId: string, quantityToAdd: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, stockQuantity: p.stockQuantity + quantityToAdd };
      }
      return p;
    }));
  };

  const handleAddProduct = (newProd: Product) => {
    setProducts(prev => [newProd, ...prev]);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans antialiased text-slate-800 dark:text-slate-100 overflow-hidden">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        lowStockCount={lowStockProducts.length}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navbar */}
        <TopNavbar
          onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
          searchQuery={filters.searchQuery}
          onSearchChange={(q) => setFilters(prev => ({ ...prev, searchQuery: q }))}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          lowStockProducts={lowStockProducts}
          recentOrders={orders}
          onNavigateToTab={setActiveTab}
        />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Universal Interactive Filter Bar */}
          <FilterBar
            filters={filters}
            onFilterChange={setFilters}
            filteredOrdersCount={filteredOrders.length}
            totalOrdersCount={orders.length}
            orders={filteredOrders}
            products={products}
            customers={customers}
          />

          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 6 Summary Cards */}
              <SummaryCards metrics={summaryMetrics} />

              {/* Automated Business Insights */}
              <BusinessInsightsCard 
                insights={businessInsights} 
                onActionClick={(action) => {
                  if (action.includes('Restock')) setActiveTab('inventory');
                }}
              />

              {/* Sales Trends Chart Preview & Recent Transactions Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7">
                  <SalesAnalyticsView
                    monthlyData={monthlySales}
                    dailyData={dailySales}
                    categoryData={categoryRevenue}
                    paymentData={paymentDistribution}
                    darkMode={darkMode}
                  />
                </div>
                <div className="lg:col-span-5 space-y-6">
                  <RecentTransactionsCard
                    orders={filteredOrders.length > 0 ? filteredOrders : orders}
                    onViewOrder={setViewingOrder}
                    onViewAllOrders={() => setActiveTab('orders')}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SALES ANALYTICS */}
          {activeTab === 'sales' && (
            <SalesAnalyticsView
              monthlyData={monthlySales}
              dailyData={dailySales}
              categoryData={categoryRevenue}
              paymentData={paymentDistribution}
              darkMode={darkMode}
            />
          )}

          {/* TAB 3: PRODUCT ANALYTICS */}
          {activeTab === 'products' && (
            <ProductAnalyticsView
              products={products}
              categoryData={categoryRevenue}
              onOpenRestockModal={setRestockingProduct}
              onOpenNewProductModal={() => setIsNewProductModalOpen(true)}
            />
          )}

          {/* TAB 4: CUSTOMER ANALYTICS */}
          {activeTab === 'customers' && (
            <CustomerAnalyticsView
              customers={customers}
              segments={customerSegments}
              orders={filteredOrders}
            />
          )}

          {/* TAB 5: ORDER MANAGEMENT */}
          {activeTab === 'orders' && (
            <OrderManagementView
              orders={filteredOrders}
              onViewOrder={setViewingOrder}
              onOpenNewOrderModal={() => setIsNewOrderModalOpen(true)}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onDeleteOrder={handleDeleteOrder}
            />
          )}

          {/* TAB 6: INVENTORY & LOW-STOCK ALERTS */}
          {activeTab === 'inventory' && (
            <InventoryView
              products={products}
              onOpenRestockModal={setRestockingProduct}
              onOpenNewProductModal={() => setIsNewProductModalOpen(true)}
            />
          )}

          {/* TAB 7: FLASK REST API & MYSQL ARCHITECTURE HUB */}
          {activeTab === 'architecture' && (
            <BackendArchitectureView
              summaryMetrics={summaryMetrics}
              categoryData={categoryRevenue}
            />
          )}
        </main>
      </div>

      {/* MODALS */}
      <OrderDetailModal
        order={viewingOrder}
        onClose={() => setViewingOrder(null)}
        onUpdateStatus={handleUpdateOrderStatus}
      />

      <NewOrderModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        customers={customers}
        products={products}
        onCreateOrder={handleCreateOrder}
      />

      <RestockModal
        product={restockingProduct}
        onClose={() => setRestockingProduct(null)}
        onConfirmRestock={handleConfirmRestock}
      />

      <NewProductModal
        isOpen={isNewProductModalOpen}
        onClose={() => setIsNewProductModalOpen(false)}
        onAddProduct={handleAddProduct}
      />
    </div>
  );
}
