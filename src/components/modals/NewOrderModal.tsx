import React, { useState } from 'react';
import { Customer, Product, Order, OrderItem, PaymentMethod, OrderStatus } from '../../types';
import { X, Plus, Trash2, ShoppingCart } from 'lucide-react';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  products: Product[];
  onCreateOrder: (newOrder: Order) => void;
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({
  isOpen,
  onClose,
  customers,
  products,
  onCreateOrder
}) => {
  if (!isOpen) return null;

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Credit Card');
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('Completed');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  
  // Selected items: productId and quantity
  const [selectedItems, setSelectedItems] = useState<{ productId: string; quantity: number }[]>([
    { productId: products[0]?.id || '', quantity: 1 }
  ]);

  const handleAddItem = () => {
    setSelectedItems(prev => [...prev, { productId: products[0]?.id || '', quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: 'productId' | 'quantity', val: any) => {
    setSelectedItems(prev => prev.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: val };
      }
      return item;
    }));
  };

  // Calculations
  const calculatedItems: OrderItem[] = selectedItems.map((sel, idx) => {
    const prod = products.find(p => p.id === sel.productId) || products[0];
    const subtotal = prod.price * sel.quantity;
    const profit = (prod.price - prod.costPrice) * sel.quantity;
    return {
      id: `item-new-${idx}`,
      orderId: '',
      productId: prod.id,
      productName: prod.name,
      category: prod.category,
      unitPrice: prod.price,
      unitCost: prod.costPrice,
      quantity: sel.quantity,
      subtotal,
      profit
    };
  });

  const grossTotal = calculatedItems.reduce((acc, item) => acc + item.subtotal, 0);
  const netAmount = Math.max(0, grossTotal - discountAmount);
  const grossProfit = calculatedItems.reduce((acc, item) => acc + item.profit, 0);
  const netProfit = Math.max(0, grossProfit - discountAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find(c => c.id === selectedCustomerId) || customers[0];
    const today = new Date().toISOString().split('T')[0];
    const orderId = `ORD-2026-${Math.floor(1085 + Math.random() * 900)}`;

    const itemsSummary = calculatedItems.map(i => i.productName).join(', ');

    const newOrder: Order = {
      id: orderId,
      customerId: cust.id,
      customerName: cust.name,
      customerEmail: cust.email,
      orderDate: today,
      totalAmount: grossTotal,
      discount: discountAmount,
      netAmount,
      profitAmount: netProfit,
      paymentMethod,
      status: orderStatus,
      shippingCity: cust.city,
      items: calculatedItems.map(i => ({ ...i, orderId })),
      itemsSummary,
      totalQuantity: calculatedItems.reduce((acc, i) => acc + i.quantity, 0)
    };

    onCreateOrder(newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Create New Order
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Customer Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Customer
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.email}) - {c.city}
                </option>
              ))}
            </select>
          </div>

          {/* Items Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Order Items & Quantities
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Product
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {selectedItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  <select
                    value={item.productId}
                    onChange={(e) => handleItemChange(idx, 'productId', e.target.value)}
                    className="flex-1 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1.5 text-slate-800 dark:text-slate-200"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} - ${p.price.toFixed(2)} ({p.category})
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={item.quantity}
                    onChange={(e) => handleItemChange(idx, 'quantity', parseInt(e.target.value) || 1)}
                    className="w-16 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1.5 text-center font-mono"
                  />

                  {selectedItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1.5 text-rose-500 hover:text-rose-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Payment & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-200"
              >
                <option value="Credit Card">Credit Card</option>
                <option value="PayPal">PayPal</option>
                <option value="UPI / Net Banking">UPI / Net Banking</option>
                <option value="Apple Pay">Apple Pay</option>
                <option value="Cash on Delivery">Cash on Delivery</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Order Status
              </label>
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value as OrderStatus)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-200"
              >
                <option value="Completed">Completed</option>
                <option value="Processing">Processing</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Discount */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Discount Amount ($)
            </label>
            <input
              type="number"
              min={0}
              value={discountAmount}
              onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 font-mono text-slate-900 dark:text-white"
            />
          </div>

          {/* Calculated Totals Preview */}
          <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/40 text-xs space-y-1">
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Gross Total:</span>
              <span className="font-mono font-bold">${grossTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Net Receivable:</span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">${netAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500 text-[11px] pt-1 border-t border-blue-200 dark:border-blue-800">
              <span>Estimated Gross Profit:</span>
              <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">+${netProfit.toFixed(2)}</span>
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
              Confirm & Save Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
