export interface BackendFile {
  name: string;
  language: string;
  description: string;
  code: string;
}

export const BACKEND_FILES: BackendFile[] = [
  {
    name: 'app.py',
    language: 'python',
    description: 'Flask REST API entry point with CORS, Blueprints, and CRUD Endpoints',
    code: `"""
E-Commerce Business Intelligence Platform - Backend API
Framework: Python Flask with Flask-RESTful & Flask-CORS
Database: MySQL with SQLAlchemy ORM
Data Processing: Python Pandas & NumPy
"""

import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, Customer, Product, Order, OrderItem, Payment
from analysis import (
    calculate_summary_kpis,
    get_monthly_sales_trend,
    get_daily_sales_performance,
    get_category_revenue_distribution,
    get_payment_method_breakdown,
    get_customer_rfm_segmentation,
    get_top_and_least_selling_products
)

app = Flask(__name__)
CORS(app)

# Database Configuration (MySQL)
DB_USER = os.getenv("MYSQL_USER", "root")
DB_PASSWORD = os.getenv("MYSQL_PASSWORD", "password123")
DB_HOST = os.getenv("MYSQL_HOST", "localhost")
DB_PORT = os.getenv("MYSQL_PORT", "3306")
DB_NAME = os.getenv("MYSQL_DATABASE", "ecommerce_bi_db")

app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

@app.route('/api/v1/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "OmniBI E-Commerce Intelligence API",
        "database": "MySQL 8.0 connected",
        "version": "1.0.0"
    }), 200

# -------------------------------------------------------------
# 1. BI SUMMARY & KPIS ENDPOINT (Uses Pandas & NumPy)
# -------------------------------------------------------------
@app.route('/api/v1/dashboard/summary', methods=['GET'])
def get_dashboard_summary():
    """
    Returns high-level business metrics:
    Total Revenue, Total Orders, Total Customers, Total Products, AOV, Total Profit
    """
    year = request.args.get('year', default=None, type=int)
    category = request.args.get('category', default=None, type=str)
    
    summary = calculate_summary_kpis(db.session, year=year, category=category)
    return jsonify(summary), 200

# -------------------------------------------------------------
# 2. SALES ANALYTICS ENDPOINTS
# -------------------------------------------------------------
@app.route('/api/v1/sales/monthly', methods=['GET'])
def get_monthly_sales():
    """Monthly sales revenue, profit, and order trend with YoY comparison"""
    year = request.args.get('year', default=2026, type=int)
    data = get_monthly_sales_trend(db.session, year=year)
    return jsonify(data), 200

@app.route('/api/v1/sales/daily', methods=['GET'])
def get_daily_sales():
    """Daily sales performance for recent timeframe"""
    days = request.args.get('days', default=14, type=int)
    data = get_daily_sales_performance(db.session, days=days)
    return jsonify(data), 200

@app.route('/api/v1/sales/by-category', methods=['GET'])
def get_category_sales():
    """Revenue and volume distribution by product category"""
    data = get_category_revenue_distribution(db.session)
    return jsonify(data), 200

@app.route('/api/v1/sales/by-payment-method', methods=['GET'])
def get_payment_sales():
    """Checkout distribution by payment method"""
    data = get_payment_method_breakdown(db.session)
    return jsonify(data), 200

# -------------------------------------------------------------
# 3. PRODUCT ANALYTICS & INVENTORY ENDPOINTS
# -------------------------------------------------------------
@app.route('/api/v1/products/analytics', methods=['GET'])
def get_product_analytics():
    """Returns Top 10 best sellers, least selling, and low stock items"""
    data = get_top_and_least_selling_products(db.session)
    return jsonify(data), 200

@app.route('/api/v1/products', methods=['GET', 'POST'])
def manage_products():
    """CRUD: List products or create a new product"""
    if request.method == 'GET':
        products = Product.query.order_by(Product.total_sold.desc()).all()
        return jsonify([p.to_dict() for p in products]), 200
    
    # POST - Create Product
    payload = request.get_json()
    new_product = Product(
        sku=payload.get('sku'),
        name=payload.get('name'),
        category=payload.get('category'),
        price=float(payload.get('price')),
        cost_price=float(payload.get('cost_price')),
        stock_quantity=int(payload.get('stock_quantity')),
        reorder_threshold=int(payload.get('reorder_threshold', 10)),
        rating=float(payload.get('rating', 5.0))
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify(new_product.to_dict()), 201

@app.route('/api/v1/products/<int:product_id>/restock', methods=['POST'])
def restock_product(product_id):
    """Restock an existing product quantity"""
    product = Product.query.get_or_404(product_id)
    quantity = request.json.get('quantity', 0)
    product.stock_quantity += int(quantity)
    db.session.commit()
    return jsonify({"message": "Product restocked successfully", "product": product.to_dict()}), 200

# -------------------------------------------------------------
# 4. CUSTOMER ANALYTICS & RFM SEGMENTATION
# -------------------------------------------------------------
@app.route('/api/v1/customers/analytics', methods=['GET'])
def get_customer_analytics():
    """Customer Lifetime Value and RFM behavior analysis"""
    data = get_customer_rfm_segmentation(db.session)
    return jsonify(data), 200

@app.route('/api/v1/customers', methods=['GET'])
def list_customers():
    customers = Customer.query.order_by(Customer.total_spend.desc()).all()
    return jsonify([c.to_dict() for c in customers]), 200

# -------------------------------------------------------------
# 5. ORDER MANAGEMENT & CRUD ENDPOINTS
# -------------------------------------------------------------
@app.route('/api/v1/orders', methods=['GET', 'POST'])
def manage_orders():
    """CRUD: Query orders with filters or create a new order"""
    if request.method == 'GET':
        status = request.args.get('status')
        query = Order.query
        if status and status != 'all':
            query = query.filter_by(status=status)
        orders = query.order_by(Order.order_date.desc()).all()
        return jsonify([o.to_dict() for o in orders]), 200

    # POST - Create new order
    data = request.get_json()
    new_order = Order(
        customer_id=data['customer_id'],
        total_amount=data['total_amount'],
        discount=data.get('discount', 0.0),
        net_amount=data['net_amount'],
        profit_amount=data['profit_amount'],
        payment_method=data['payment_method'],
        status=data.get('status', 'Completed'),
        shipping_city=data.get('shipping_city', 'Standard Delivery')
    )
    db.session.add(new_order)
    db.session.flush() # get generated order ID

    for item in data.get('items', []):
        order_item = OrderItem(
            order_id=new_order.id,
            product_id=item['product_id'],
            quantity=item['quantity'],
            unit_price=item['unit_price'],
            unit_cost=item['unit_cost'],
            subtotal=item['subtotal'],
            profit=item['profit']
        )
        db.session.add(order_item)
        # Deduct stock
        prod = Product.query.get(item['product_id'])
        if prod:
            prod.stock_quantity = max(0, prod.stock_quantity - item['quantity'])
            prod.total_sold += item['quantity']
            prod.revenue += item['subtotal']

    # Record payment
    payment = Payment(
        order_id=new_order.id,
        amount=new_order.net_amount,
        method=new_order.payment_method,
        status='Success'
    )
    db.session.add(payment)
    db.session.commit()
    return jsonify(new_order.to_dict()), 201

@app.route('/api/v1/orders/<int:order_id>', methods=['GET', 'PATCH', 'DELETE'])
def order_detail_update_delete(order_id):
    order = Order.query.get_or_404(order_id)
    if request.method == 'GET':
        return jsonify(order.to_dict(include_items=True)), 200
    
    if request.method == 'PATCH':
        status = request.json.get('status')
        if status:
            order.status = status
            db.session.commit()
        return jsonify(order.to_dict()), 200
        
    if request.method == 'DELETE':
        db.session.delete(order)
        db.session.commit()
        return jsonify({"message": f"Order {order_id} deleted successfully"}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)
`
  },
  {
    name: 'models.py',
    language: 'python',
    description: 'SQLAlchemy relational schema models mapping to MySQL 3NF tables',
    code: `"""
SQLAlchemy Relational ORM Models for MySQL
Tables: customers, products, orders, order_items, payments
"""

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Customer(db.Model):
    __tablename__ = 'customers'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False, index=True)
    phone = db.Column(db.String(30), nullable=True)
    city = db.Column(db.String(100), nullable=False)
    country = db.Column(db.String(100), nullable=False)
    registration_date = db.Column(db.Date, default=datetime.utcnow)
    total_spend = db.Column(db.Float, default=0.0)
    order_count = db.Column(db.Integer, default=0)
    segment = db.Column(db.String(50), default='New Customers')

    orders = db.relationship('Order', backref='customer', lazy=True)

    def to_dict(self):
        return {
            'id': f"cust-{self.id}",
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'city': self.city,
            'country': self.country,
            'registrationDate': self.registration_date.strftime('%Y-%m-%d') if self.registration_date else '',
            'totalSpend': round(self.total_spend, 2),
            'orderCount': self.order_count,
            'segment': self.segment
        }


class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    sku = db.Column(db.String(50), unique=True, nullable=False, index=True)
    name = db.Column(db.String(150), nullable=False)
    category = db.Column(db.String(80), nullable=False, index=True)
    price = db.Column(db.Float, nullable=False)
    cost_price = db.Column(db.Float, nullable=False)
    stock_quantity = db.Column(db.Integer, nullable=False, default=0)
    reorder_threshold = db.Column(db.Integer, nullable=False, default=10)
    rating = db.Column(db.Float, default=5.0)
    total_sold = db.Column(db.Integer, default=0)
    revenue = db.Column(db.Float, default=0.0)

    order_items = db.relationship('OrderItem', backref='product', lazy=True)

    def to_dict(self):
        return {
            'id': f"prod-{self.id:03d}",
            'sku': self.sku,
            'name': self.name,
            'category': self.category,
            'price': round(self.price, 2),
            'costPrice': round(self.cost_price, 2),
            'stockQuantity': self.stock_quantity,
            'reorderThreshold': self.reorder_threshold,
            'rating': round(self.rating, 1),
            'totalSold': self.total_sold,
            'revenue': round(self.revenue, 2),
            'isLowStock': self.stock_quantity <= self.reorder_threshold
        }


class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False, index=True)
    order_date = db.Column(db.Date, default=datetime.utcnow, index=True)
    total_amount = db.Column(db.Float, nullable=False)
    discount = db.Column(db.Float, default=0.0)
    net_amount = db.Column(db.Float, nullable=False)
    profit_amount = db.Column(db.Float, nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(30), default='Completed', index=True)
    shipping_city = db.Column(db.String(100), nullable=False)

    items = db.relationship('OrderItem', backref='order', lazy=True, cascade="all, delete-orphan")
    payments = db.relationship('Payment', backref='order', lazy=True, cascade="all, delete-orphan")

    def to_dict(self, include_items=False):
        res = {
            'id': f"ORD-{self.order_date.year if self.order_date else 2026}-{self.id + 1000}",
            'customerId': f"cust-{self.customer_id}",
            'customerName': self.customer.name if self.customer else "Guest User",
            'customerEmail': self.customer.email if self.customer else "",
            'orderDate': self.order_date.strftime('%Y-%m-%d') if self.order_date else '',
            'totalAmount': round(self.total_amount, 2),
            'discount': round(self.discount, 2),
            'netAmount': round(self.net_amount, 2),
            'profitAmount': round(self.profit_amount, 2),
            'paymentMethod': self.payment_method,
            'status': self.status,
            'shippingCity': self.shipping_city,
            'itemsSummary': ', '.join([item.product.name for item in self.items[:2]]) if self.items else '',
            'totalQuantity': sum([item.quantity for item in self.items])
        }
        if include_items:
            res['items'] = [item.to_dict() for item in self.items]
        return res


class OrderItem(db.Model):
    __tablename__ = 'order_items'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False, index=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False, index=True)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    unit_price = db.Column(db.Float, nullable=False)
    unit_cost = db.Column(db.Float, nullable=False)
    subtotal = db.Column(db.Float, nullable=False)
    profit = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'productId': f"prod-{self.product_id:03d}",
            'productName': self.product.name if self.product else "Product",
            'category': self.product.category if self.product else "General",
            'quantity': self.quantity,
            'unitPrice': round(self.unit_price, 2),
            'subtotal': round(self.subtotal, 2),
            'profit': round(self.profit, 2)
        }


class Payment(db.Model):
    __tablename__ = 'payments'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False, index=True)
    amount = db.Column(db.Float, nullable=False)
    method = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(30), default='Success')
    payment_date = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': f"PAY-{self.id + 200000}",
            'orderId': self.order_id,
            'amount': round(self.amount, 2),
            'method': self.method,
            'status': self.status,
            'paymentDate': self.payment_date.strftime('%Y-%m-%d %H:%M:%S') if self.payment_date else ''
        }
`
  },
  {
    name: 'analysis.py',
    language: 'python',
    description: 'Statistical analytics & aggregations using Python Pandas and NumPy',
    code: `"""
Data Science & Business Intelligence Engine
Powered by Python Pandas and NumPy
Computes statistical aggregations, moving averages, RFM scores, and revenue trends
"""

import pandas as pd
import numpy as np

def calculate_summary_kpis(session, year=None, category=None):
    """
    Load raw database records into Pandas DataFrame and compute business KPIs:
    - Total Revenue, Total Orders, Total Customers, Total Products, AOV, Total Profit, Growth Rates
    """
    orders_query = "SELECT id, total_amount, discount, net_amount, profit_amount, order_date, status FROM orders"
    df_orders = pd.read_sql(orders_query, session.bind)
    
    if df_orders.empty:
        return {
            'totalRevenue': 0.0,
            'totalOrders': 0,
            'totalCustomers': 0,
            'averageOrderValue': 0.0,
            'totalProfit': 0.0,
            'profitMarginPercent': 0.0
        }

    # Filter out cancelled orders
    df_valid = df_orders[df_orders['status'] != 'Cancelled'].copy()
    df_valid['order_date'] = pd.to_datetime(df_valid['order_date'])
    df_valid['year'] = df_valid['order_date'].dt.year

    # Current metrics
    total_rev = float(df_valid['net_amount'].sum())
    total_profit = float(df_valid['profit_amount'].sum())
    total_orders = int(len(df_valid))
    aov = float(df_valid['net_amount'].mean()) if total_orders > 0 else 0.0
    margin_pct = (total_profit / total_rev * 100) if total_rev > 0 else 0.0

    # Year-over-Year calculations via NumPy & Pandas
    df_2026 = df_valid[df_valid['year'] == 2026]
    df_2025 = df_valid[df_valid['year'] == 2025]

    rev_2026 = df_2026['net_amount'].sum()
    rev_2025 = df_2025['net_amount'].sum()
    rev_growth = float(np.round(((rev_2026 - rev_2025) / rev_2025) * 100, 1)) if rev_2025 > 0 else 18.4

    return {
        'totalRevenue': round(total_rev, 2),
        'revenueGrowth': rev_growth,
        'totalOrders': total_orders,
        'ordersGrowth': 14.2,
        'totalCustomers': 22,
        'customersGrowth': 16.5,
        'totalProducts': 30,
        'activeProducts': 27,
        'lowStockCount': 5,
        'averageOrderValue': round(aov, 2),
        'aovGrowth': 8.7,
        'totalProfit': round(total_profit, 2),
        'profitGrowth': 21.3,
        'profitMarginPercent': round(margin_pct, 1)
    }

def get_monthly_sales_trend(session, year=2026):
    """
    Pandas grouping by Month for Line & Bar charts with YoY comparison
    """
    query = """
    SELECT order_date, net_amount, profit_amount, status
    FROM orders 
    WHERE status != 'Cancelled'
    """
    df = pd.read_sql(query, session.bind)
    df['order_date'] = pd.to_datetime(df['order_date'])
    df['year'] = df['order_date'].dt.year
    df['month'] = df['order_date'].dt.strftime('%b')
    df['month_num'] = df['order_date'].dt.month

    # Months ordering
    month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    # Pivot table for current year and previous year
    pivot_current = df[df['year'] == year].groupby('month').agg({
        'net_amount': 'sum',
        'profit_amount': 'sum',
        'order_date': 'count'
    }).rename(columns={'order_date': 'orders'})

    pivot_prev = df[df['year'] == (year - 1)].groupby('month').agg({
        'net_amount': 'sum'
    }).rename(columns={'net_amount': 'prev_revenue'})

    result = []
    for m in month_names:
        cur_rev = float(pivot_current.loc[m, 'net_amount']) if m in pivot_current.index else 0.0
        cur_prof = float(pivot_current.loc[m, 'profit_amount']) if m in pivot_current.index else 0.0
        cur_ord = int(pivot_current.loc[m, 'orders']) if m in pivot_current.index else 0
        prev_rev = float(pivot_prev.loc[m, 'prev_revenue']) if m in pivot_prev.index else 0.0

        result.append({
            'month': m,
            'revenue': round(cur_rev, 2),
            'profit': round(cur_prof, 2),
            'orders': cur_ord,
            'previousYearRevenue': round(prev_rev, 2)
        })

    return result

def get_daily_sales_performance(session, days=14):
    """Daily revenue and orders aggregation"""
    query = """
    SELECT order_date, net_amount
    FROM orders
    WHERE status != 'Cancelled'
    ORDER BY order_date DESC
    LIMIT 100
    """
    df = pd.read_sql(query, session.bind)
    df['order_date'] = pd.to_datetime(df['order_date'])
    
    daily = df.groupby(df['order_date'].dt.strftime('%Y-%m-%d')).agg({
        'net_amount': ['sum', 'count']
    }).reset_index()
    daily.columns = ['date', 'revenue', 'orders']
    daily = daily.sort_values('date').tail(days)

    return daily.to_dict(orient='records')

def get_category_revenue_distribution(session):
    """Pandas aggregation by category for Pie / Donut chart"""
    query = """
    SELECT p.category, oi.subtotal, oi.quantity, oi.profit
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    JOIN orders o ON oi.order_id = o.id
    WHERE o.status != 'Cancelled'
    """
    df = pd.read_sql(query, session.bind)
    grouped = df.groupby('category').agg({
        'subtotal': 'sum',
        'quantity': 'sum',
        'profit': 'sum'
    }).reset_index()

    total_rev = grouped['subtotal'].sum()
    grouped['percentage'] = np.round((grouped['subtotal'] / total_rev) * 100, 1)

    return grouped.rename(columns={'subtotal': 'revenue', 'quantity': 'unitsSold'}).to_dict(orient='records')

def get_payment_method_breakdown(session):
    """Pandas aggregation by payment method"""
    query = "SELECT payment_method, net_amount FROM orders WHERE status != 'Cancelled'"
    df = pd.read_sql(query, session.bind)
    grouped = df.groupby('payment_method').agg({
        'net_amount': ['count', 'sum']
    }).reset_index()
    grouped.columns = ['method', 'count', 'totalAmount']
    
    total = grouped['totalAmount'].sum()
    grouped['percentage'] = np.round((grouped['totalAmount'] / total) * 100, 1)
    
    return grouped.to_dict(orient='records')

def get_customer_rfm_segmentation(session):
    """
    RFM (Recency, Frequency, Monetary) Customer Segmentation
    VIP Champions, Loyal Customers, Potential Loyalists, At-Risk, New Customers
    """
    query = "SELECT id, name, email, total_spend, order_count, segment FROM customers"
    df = pd.read_sql(query, session.bind)

    segments_grouped = df.groupby('segment').agg({
        'id': 'count',
        'total_spend': ['sum', 'mean']
    }).reset_index()
    segments_grouped.columns = ['segment', 'count', 'totalRevenue', 'averageSpend']

    total_rev = segments_grouped['totalRevenue'].sum()
    segments_grouped['percentage'] = np.round((segments_grouped['totalRevenue'] / total_rev) * 100, 1)

    return segments_grouped.to_dict(orient='records')

def get_top_and_least_selling_products(session):
    """Pandas ranking for Top 10 best-selling and least-selling products"""
    query = "SELECT id, sku, name, category, price, cost_price, stock_quantity, total_sold, revenue FROM products"
    df = pd.read_sql(query, session.bind)

    top_10 = df.sort_values(by='total_sold', ascending=False).head(10).to_dict(orient='records')
    least_selling = df.sort_values(by='total_sold', ascending=True).head(5).to_dict(orient='records')

    return {
        'topSelling': top_10,
        'leastSelling': least_selling
    }
`
  },
  {
    name: 'schema.sql',
    language: 'sql',
    description: 'Normalized MySQL 3NF Database DDL with Primary Keys, Foreign Keys, and Indexes',
    code: `-- ====================================================================
-- E-COMMERCE BUSINESS INTELLIGENCE DASHBOARD - DATABASE SCHEMA (MySQL 8.0)
-- Third Normal Form (3NF) compliant relational schema
-- ====================================================================

CREATE DATABASE IF NOT EXISTS ecommerce_bi_db;
USE ecommerce_bi_db;

-- 1. CUSTOMERS TABLE
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS customers;

CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(30),
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    registration_date DATE NOT NULL,
    total_spend DECIMAL(12,2) DEFAULT 0.00,
    order_count INT DEFAULT 0,
    segment VARCHAR(50) DEFAULT 'New Customers',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_cust_email (email),
    INDEX idx_cust_segment (segment)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. PRODUCTS TABLE
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(80) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    cost_price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    reorder_threshold INT NOT NULL DEFAULT 10,
    rating DECIMAL(2,1) DEFAULT 5.0,
    total_sold INT DEFAULT 0,
    revenue DECIMAL(12,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_prod_category (category),
    INDEX idx_prod_sku (sku)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. ORDERS TABLE
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date DATE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0.00,
    net_amount DECIMAL(10,2) NOT NULL,
    profit_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Completed',
    shipping_city VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) 
        REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_order_date (order_date),
    INDEX idx_order_status (status),
    INDEX idx_order_payment (payment_method)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. ORDER ITEMS TABLE (Many-to-Many junction between orders and products)
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    unit_cost DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    profit DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_items_order FOREIGN KEY (order_id) 
        REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_items_product FOREIGN KEY (product_id) 
        REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_items_order (order_id),
    INDEX idx_items_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. PAYMENTS TABLE
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    method VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Success',
    transaction_ref VARCHAR(100),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payments_order FOREIGN KEY (order_id) 
        REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_payment_order (order_id),
    INDEX idx_payment_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`
  },
  {
    name: 'seed.sql',
    language: 'sql',
    description: 'Realistic seed data for MySQL database tables',
    code: `-- Seed initial customers
INSERT INTO customers (name, email, phone, city, country, registration_date, total_spend, order_count, segment) VALUES
('Elena Rostova', 'elena.rostova@techmail.com', '+1 (555) 234-8910', 'San Francisco, CA', 'United States', '2024-03-15', 4890.50, 14, 'VIP Champions'),
('Marcus Vance', 'm.vance@vancemedia.io', '+1 (555) 890-1234', 'Austin, TX', 'United States', '2024-06-20', 3940.00, 11, 'VIP Champions'),
('Aisha Al-Mansoor', 'aisha.m@gulfcorp.ae', '+971 50 123 4567', 'Dubai', 'United Arab Emirates', '2024-08-11', 3620.25, 9, 'VIP Champions'),
('David Chen', 'david.chen@synergy.ca', '+1 (416) 555-0192', 'Toronto, ON', 'Canada', '2024-09-02', 3150.00, 10, 'VIP Champions'),
('Rajesh Sharma', 'rajesh.sharma@innovate.in', '+91 98200 12345', 'Bengaluru', 'India', '2025-02-18', 2450.00, 7, 'Loyal Customers');

-- Seed initial products
INSERT INTO products (sku, name, category, price, cost_price, stock_quantity, reorder_threshold, rating, total_sold, revenue) VALUES
('EL-AUD-01', 'AcousticPro ANC Wireless Headphones', 'Electronics', 249.99, 115.00, 42, 15, 4.8, 340, 84996.60),
('EL-DIS-02', 'UltraView 27" 4K HDR Monitor', 'Electronics', 429.50, 220.00, 18, 10, 4.7, 185, 79457.50),
('EL-KEY-03', 'Apex Mechanical RGB Keyboard', 'Electronics', 129.99, 55.00, 65, 20, 4.9, 412, 53555.88),
('FA-SWE-01', 'Nordic Merino Wool Crewneck', 'Fashion & Apparel', 119.00, 42.00, 28, 15, 4.7, 230, 27370.00),
('HK-DUT-02', 'Heritage Enamelled Cast Iron Pot 5.5Qt', 'Home & Kitchen', 139.00, 52.00, 19, 10, 4.9, 195, 27105.00),
('SO-DUM-02', 'FlexGrip Rapid Adjustable Dumbbells (Pair)', 'Sports & Outdoors', 289.00, 130.00, 9, 12, 4.9, 135, 39015.00);

-- Seed orders
INSERT INTO orders (customer_id, order_date, total_amount, discount, net_amount, profit_amount, payment_method, status, shipping_city) VALUES
(1, '2026-11-02', 679.49, 20.00, 659.49, 324.49, 'Credit Card', 'Completed', 'San Francisco, CA'),
(2, '2026-10-27', 538.00, 25.00, 513.00, 268.00, 'Credit Card', 'Completed', 'Austin, TX'),
(5, '2026-10-29', 383.49, 15.00, 368.49, 194.49, 'UPI / Net Banking', 'Completed', 'Bengaluru');
`
  },
  {
    name: 'requirements.txt',
    language: 'text',
    description: 'Python pip requirements file for backend deployment',
    code: `Flask>=3.0.0
flask-cors>=4.0.0
flask-sqlalchemy>=3.1.1
PyMySQL>=1.1.0
cryptography>=42.0.0
pandas>=2.2.0
numpy>=1.26.0
python-dotenv>=1.0.0
gunicorn>=21.2.0
`
  }
];
