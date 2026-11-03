import { Order, Product, Customer } from '../types';

function triggerDownload(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportOrdersToCsv(orders: Order[], filename = 'orders_report.csv') {
  const headers = [
    'Order ID',
    'Order Date',
    'Customer Name',
    'Customer Email',
    'Items Summary',
    'Quantity',
    'Total Amount ($)',
    'Discount ($)',
    'Net Amount ($)',
    'Profit ($)',
    'Payment Method',
    'Status',
    'Shipping City'
  ];

  const rows = orders.map(order => [
    `"${order.id}"`,
    `"${order.orderDate}"`,
    `"${order.customerName.replace(/"/g, '""')}"`,
    `"${order.customerEmail}"`,
    `"${order.itemsSummary.replace(/"/g, '""')}"`,
    order.totalQuantity,
    order.totalAmount.toFixed(2),
    order.discount.toFixed(2),
    order.netAmount.toFixed(2),
    order.profitAmount.toFixed(2),
    `"${order.paymentMethod}"`,
    `"${order.status}"`,
    `"${order.shippingCity}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  triggerDownload(csvContent, filename);
}

export function exportProductsToCsv(products: Product[], filename = 'products_inventory.csv') {
  const headers = [
    'SKU',
    'Product Name',
    'Category',
    'Price ($)',
    'Cost Price ($)',
    'Profit Margin (%)',
    'Stock Quantity',
    'Reorder Threshold',
    'Stock Status',
    'Rating',
    'Total Sold',
    'Total Revenue ($)'
  ];

  const rows = products.map(p => {
    const margin = p.price > 0 ? (((p.price - p.costPrice) / p.price) * 100).toFixed(1) : '0.0';
    const stockStatus = p.stockQuantity <= 0 ? 'Out of Stock' : p.stockQuantity <= p.reorderThreshold ? 'Low Stock' : 'In Stock';
    return [
      `"${p.sku}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      p.price.toFixed(2),
      p.costPrice.toFixed(2),
      `${margin}%`,
      p.stockQuantity,
      p.reorderThreshold,
      `"${stockStatus}"`,
      p.rating,
      p.totalSold,
      p.revenue.toFixed(2)
    ];
  });

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  triggerDownload(csvContent, filename);
}

export function exportCustomersToCsv(customers: Customer[], filename = 'customers_report.csv') {
  const headers = [
    'Customer ID',
    'Full Name',
    'Email',
    'Phone',
    'City',
    'Country',
    'Registration Date',
    'Segment',
    'Total Orders',
    'Total Lifetime Spend ($)',
    'Avg Order Value ($)'
  ];

  const rows = customers.map(c => {
    const aov = c.orderCount > 0 ? (c.totalSpend / c.orderCount).toFixed(2) : '0.00';
    return [
      `"${c.id}"`,
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.email}"`,
      `"${c.phone}"`,
      `"${c.city}"`,
      `"${c.country}"`,
      `"${c.registrationDate}"`,
      `"${c.segment}"`,
      c.orderCount,
      c.totalSpend.toFixed(2),
      aov
    ];
  });

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  triggerDownload(csvContent, filename);
}
