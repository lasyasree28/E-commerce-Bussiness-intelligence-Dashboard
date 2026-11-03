import React, { useState } from 'react';
import { BACKEND_FILES, BackendFile } from '../../data/backendCode';
import { 
  Terminal, 
  Database, 
  Code2, 
  Copy, 
  Check, 
  Download, 
  Play, 
  Layers, 
  BookOpen, 
  ShieldCheck, 
  Server,
  FileCode
} from 'lucide-react';
import { SummaryMetrics, CategoryRevenueData } from '../../types';

interface BackendArchitectureViewProps {
  summaryMetrics: SummaryMetrics;
  categoryData: CategoryRevenueData[];
}

export const BackendArchitectureView: React.FC<BackendArchitectureViewProps> = ({
  summaryMetrics,
  categoryData
}) => {
  const [activeFile, setActiveFile] = useState<BackendFile>(BACKEND_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/api/v1/dashboard/summary');
  const [simulatedResponse, setSimulatedResponse] = useState<any>(null);
  const [simulatedSql, setSimulatedSql] = useState<string>('');
  const [isLoadingApi, setIsLoadingApi] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = (file: BackendFile) => {
    const blob = new Blob([file.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRunApiTest = () => {
    setIsLoadingApi(true);
    setTimeout(() => {
      if (selectedEndpoint === '/api/v1/dashboard/summary') {
        setSimulatedSql(`SELECT net_amount, profit_amount, order_date, status FROM orders WHERE status != 'Cancelled';`);
        setSimulatedResponse({
          totalRevenue: summaryMetrics.totalRevenue,
          revenueGrowth: summaryMetrics.revenueGrowth,
          totalOrders: summaryMetrics.totalOrders,
          ordersGrowth: summaryMetrics.ordersGrowth,
          totalCustomers: summaryMetrics.totalCustomers,
          averageOrderValue: summaryMetrics.averageOrderValue,
          totalProfit: summaryMetrics.totalProfit,
          profitMarginPercent: summaryMetrics.profitMarginPercent
        });
      } else if (selectedEndpoint === '/api/v1/sales/by-category') {
        setSimulatedSql(`SELECT p.category, SUM(oi.subtotal) AS revenue, SUM(oi.quantity) AS unitsSold, SUM(oi.profit) AS profit
FROM order_items oi
JOIN products p ON oi.product_id = p.id
JOIN orders o ON oi.order_id = o.id
WHERE o.status != 'Cancelled'
GROUP BY p.category;`);
        setSimulatedResponse(categoryData);
      } else if (selectedEndpoint === '/api/v1/products/analytics') {
        setSimulatedSql(`SELECT id, sku, name, category, price, cost_price, stock_quantity, total_sold, revenue 
FROM products 
ORDER BY total_sold DESC;`);
        setSimulatedResponse({
          status: 'success',
          topSellingCount: 10,
          leastSellingCount: 5,
          lowStockCount: summaryMetrics.lowStockCount,
          inventoryStatus: 'healthy'
        });
      } else {
        setSimulatedSql(`SELECT * FROM orders ORDER BY order_date DESC LIMIT 20;`);
        setSimulatedResponse({
          status: 'success',
          endpoint: selectedEndpoint,
          timestamp: new Date().toISOString(),
          recordCount: 20
        });
      }
      setIsLoadingApi(false);
    }, 280);
  };

  return (
    <div className="space-y-6">
      {/* College Project Banner & Architecture Summary */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-200 text-xs font-semibold mb-2">
              <Server className="w-3.5 h-3.5" />
              <span>Full-Stack Architecture Showcase</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              Python Flask REST API & MySQL Relational Database Center
            </h2>
            <p className="text-xs text-blue-200 mt-1 max-w-2xl leading-relaxed">
              Designed for academic demonstration and enterprise deployments. Features 3NF normalized MySQL database schemas, SQLAlchemy ORM modeling, and Python Pandas/NumPy analytics pipelines.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => BACKEND_FILES.forEach(handleDownloadFile)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-white text-blue-900 rounded-lg hover:bg-blue-50 transition-colors shadow-sm whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>Download All Source Files</span>
            </button>
          </div>
        </div>

        {/* 4 Architecture Pillars */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-blue-800/60 text-xs">
          <div>
            <span className="text-blue-300 block text-[11px]">Backend Framework:</span>
            <span className="font-semibold text-white">Python Flask 3.0</span>
          </div>
          <div>
            <span className="text-blue-300 block text-[11px]">Relational Database:</span>
            <span className="font-semibold text-white">MySQL 8.0 (3NF Schema)</span>
          </div>
          <div>
            <span className="text-blue-300 block text-[11px]">Analytics Engine:</span>
            <span className="font-semibold text-white">Pandas & NumPy</span>
          </div>
          <div>
            <span className="text-blue-300 block text-[11px]">ORM & Routing:</span>
            <span className="font-semibold text-white">Flask-SQLAlchemy & CORS</span>
          </div>
        </div>
      </div>

      {/* Code Explorer & Live API Simulation Console Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Code Viewer (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs flex flex-col">
          {/* File Selector Tabs */}
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between overflow-x-auto">
            <div className="flex items-center gap-1.5">
              {BACKEND_FILES.map(file => (
                <button
                  key={file.name}
                  onClick={() => setActiveFile(file)}
                  className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    activeFile.name === file.name
                      ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>{file.name}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 pl-3">
              <button
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md hover:bg-slate-50 transition-colors"
                title="Copy code to clipboard"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={() => handleDownloadFile(activeFile)}
                className="p-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                title="Download this file"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="px-5 py-2.5 bg-slate-100/70 dark:bg-slate-800/40 text-[11px] text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
            {activeFile.description}
          </div>

          {/* Syntax Code Display */}
          <div className="p-4 bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto h-[480px]">
            <pre className="leading-relaxed">
              <code>{activeFile.code}</code>
            </pre>
          </div>
        </div>

        {/* Right: Live REST API Simulation Console (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Interactive Flask REST API Tester
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded font-semibold">
                Live Simulator
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Test the Flask endpoints in real time. Inspect generated SQL statements and Pandas output data.
            </p>

            {/* Endpoint Selector */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Select API Route:
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={selectedEndpoint}
                  onChange={(e) => setSelectedEndpoint(e.target.value)}
                  className="flex-1 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="/api/v1/dashboard/summary">GET /api/v1/dashboard/summary</option>
                  <option value="/api/v1/sales/by-category">GET /api/v1/sales/by-category</option>
                  <option value="/api/v1/products/analytics">GET /api/v1/products/analytics</option>
                  <option value="/api/v1/orders">GET /api/v1/orders?status=Completed</option>
                </select>

                <button
                  onClick={handleRunApiTest}
                  disabled={isLoadingApi}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs whitespace-nowrap disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </div>

            {/* SQL Execution Preview */}
            <div>
              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                MySQL Query Executed:
              </span>
              <div className="p-3 bg-slate-900 text-blue-300 font-mono text-[11px] rounded-lg overflow-x-auto border border-slate-800">
                {simulatedSql || `SELECT id, total_amount, net_amount, status FROM orders;`}
              </div>
            </div>

            {/* Response Payload Viewer */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  JSON Response Payload:
                </span>
                <span className="text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                  HTTP 200 OK (24ms)
                </span>
              </div>
              <div className="p-3 bg-slate-950 text-slate-200 font-mono text-[11px] rounded-lg overflow-x-auto h-48 border border-slate-800">
                <pre>{JSON.stringify(simulatedResponse || {
                  status: 'ready',
                  message: 'Click [Send] above to query the live Flask controller simulation.'
                }, null, 2)}</pre>
              </div>
            </div>
          </div>

          {/* College Viva Defense Notes */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
              <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>College Project Defense & Viva Tips</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 text-[11px]">
              <li><strong>Normalization:</strong> DB conforms to 3NF; `order_items` eliminates multi-valued repeating groups.</li>
              <li><strong>Integrity:</strong> Foreign keys enforce referential integrity (`ON DELETE CASCADE` for order items).</li>
              <li><strong>Pandas Optimization:</strong> Vectorized NumPy calculations replace slow procedural loops for BI KPIs.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
