export type ProductCategory = 
  | 'Electronics'
  | 'Fashion & Apparel'
  | 'Home & Kitchen'
  | 'Beauty & Personal Care'
  | 'Sports & Outdoors'
  | 'Books & Stationery';

export type PaymentMethod = 
  | 'Credit Card'
  | 'PayPal'
  | 'UPI / Net Banking'
  | 'Cash on Delivery'
  | 'Apple Pay';

export type OrderStatus = 
  | 'Completed'
  | 'Processing'
  | 'Pending'
  | 'Cancelled'
  | 'Refunded';

export type CustomerSegment = 
  | 'VIP Champions'
  | 'Loyal Customers'
  | 'Potential Loyalists'
  | 'At-Risk'
  | 'New Customers';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  registrationDate: string; // YYYY-MM-DD
  totalSpend: number;
  orderCount: number;
  segment: CustomerSegment;
  avatarUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  costPrice: number;
  stockQuantity: number;
  reorderThreshold: number;
  rating: number;
  totalSold: number;
  revenue: number;
  sku: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  category: ProductCategory;
  unitPrice: number;
  unitCost: number;
  quantity: number;
  subtotal: number;
  profit: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  orderDate: string; // YYYY-MM-DD
  totalAmount: number;
  discount: number;
  netAmount: number;
  profitAmount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  shippingCity: string;
  items: OrderItem[];
  itemsSummary: string;
  totalQuantity: number;
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  status: 'Success' | 'Pending' | 'Failed';
  transactionRef: string;
  paymentDate: string;
}

export interface FilterState {
  dateRangePreset: 'all' | '7d' | '30d' | '90d' | 'this_year' | 'last_year' | 'custom';
  startDate: string;
  endDate: string;
  category: string;
  status: string;
  paymentMethod: string;
  searchQuery: string;
  selectedYear: string;
}

export interface SummaryMetrics {
  totalRevenue: number;
  revenueGrowth: number;
  totalOrders: number;
  ordersGrowth: number;
  totalCustomers: number;
  customersGrowth: number;
  totalProducts: number;
  activeProducts: number;
  lowStockCount: number;
  averageOrderValue: number;
  aovGrowth: number;
  totalProfit: number;
  profitGrowth: number;
  profitMarginPercent: number;
}

export interface MonthlySalesData {
  month: string;
  revenue: number;
  profit: number;
  orders: number;
  previousYearRevenue: number;
}

export interface DailySalesData {
  date: string;
  label: string;
  revenue: number;
  orders: number;
}

export interface CategoryRevenueData {
  category: ProductCategory;
  revenue: number;
  unitsSold: number;
  percentage: number;
  profit: number;
}

export interface PaymentDistributionData {
  method: PaymentMethod;
  count: number;
  totalAmount: number;
  percentage: number;
}

export interface CustomerSegmentData {
  segment: CustomerSegment;
  count: number;
  totalRevenue: number;
  percentage: number;
  averageSpend: number;
}

export interface BusinessInsight {
  id: string;
  type: 'positive' | 'warning' | 'info' | 'critical';
  title: string;
  description: string;
  metric?: string;
  action?: string;
}

export type ActiveTab = 
  | 'overview'
  | 'sales'
  | 'products'
  | 'customers'
  | 'orders'
  | 'inventory'
  | 'architecture';
