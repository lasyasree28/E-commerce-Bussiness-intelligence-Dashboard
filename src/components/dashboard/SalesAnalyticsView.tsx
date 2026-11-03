import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions
} from 'chart.js';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import { 
  MonthlySalesData, 
  DailySalesData, 
  CategoryRevenueData, 
  PaymentDistributionData 
} from '../../types';
import { TrendingUp, BarChart3, PieChart, CreditCard, DollarSign } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SalesAnalyticsViewProps {
  monthlyData: MonthlySalesData[];
  dailyData: DailySalesData[];
  categoryData: CategoryRevenueData[];
  paymentData: PaymentDistributionData[];
  darkMode: boolean;
}

export const SalesAnalyticsView: React.FC<SalesAnalyticsViewProps> = ({
  monthlyData,
  dailyData,
  categoryData,
  paymentData,
  darkMode
}) => {
  const [monthlyMetric, setMonthlyMetric] = useState<'revenue' | 'profit' | 'yoy' | 'orders'>('revenue');

  const textColor = darkMode ? '#94A3B8' : '#64748B';
  const gridColor = darkMode ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.7)';

  // 1. Monthly Chart Data
  const monthlyChartData = {
    labels: monthlyData.map(d => d.month),
    datasets: monthlyMetric === 'yoy' ? [
      {
        label: '2026 Sales Revenue ($)',
        data: monthlyData.map(d => d.revenue),
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: '2025 Sales Revenue ($)',
        data: monthlyData.map(d => d.previousYearRevenue),
        borderColor: '#94A3B8',
        borderDash: [5, 5],
        backgroundColor: 'transparent',
        tension: 0.35,
        pointRadius: 3,
        pointHoverRadius: 5,
      }
    ] : monthlyMetric === 'profit' ? [
      {
        label: 'Gross Profit ($)',
        data: monthlyData.map(d => d.profit),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Sales Revenue ($)',
        data: monthlyData.map(d => d.revenue),
        borderColor: '#2563EB',
        backgroundColor: 'transparent',
        borderWidth: 2,
        tension: 0.35,
        pointRadius: 3,
      }
    ] : monthlyMetric === 'orders' ? [
      {
        label: 'Order Volume',
        data: monthlyData.map(d => d.orders),
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.15)',
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ] : [
      {
        label: '2026 Revenue ($)',
        data: monthlyData.map(d => d.revenue),
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37, 99, 235, 0.12)',
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };

  const lineOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: textColor,
          font: { family: 'Plus Jakarta Sans', size: 12 },
          boxWidth: 12,
        }
      },
      tooltip: {
        backgroundColor: darkMode ? '#0F172A' : '#1E293B',
        titleFont: { family: 'Plus Jakarta Sans', size: 13, weight: 'bold' },
        bodyFont: { family: 'JetBrains Mono', size: 12 },
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => {
            const val = ctx.parsed?.y ?? 0;
            if (monthlyMetric === 'orders') return ` Orders: ${val}`;
            return ` ${ctx.dataset.label}: $${val.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 11 } }
      },
      y: {
        grid: { color: gridColor },
        ticks: {
          color: textColor,
          font: { family: 'JetBrains Mono', size: 11 },
          callback: (value) => monthlyMetric === 'orders' ? value : `$${Number(value).toLocaleString()}`
        }
      }
    }
  };

  // 2. Daily Sales Performance (Bar Chart)
  const dailyChartData = {
    labels: dailyData.map(d => d.label),
    datasets: [
      {
        label: 'Daily Revenue ($)',
        data: dailyData.map(d => d.revenue),
        backgroundColor: '#3B82F6',
        borderRadius: 4,
        hoverBackgroundColor: '#2563EB',
      }
    ]
  };

  const dailyOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: darkMode ? '#0F172A' : '#1E293B',
        titleFont: { family: 'Plus Jakarta Sans', size: 12 },
        bodyFont: { family: 'JetBrains Mono', size: 12 },
        padding: 8,
        cornerRadius: 6,
        callbacks: {
          label: (ctx) => ` Revenue: $${(ctx.parsed?.y ?? 0).toLocaleString()}`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 10 }, maxRotation: 45 }
      },
      y: {
        grid: { color: gridColor },
        ticks: {
          color: textColor,
          font: { family: 'JetBrains Mono', size: 10 },
          callback: (val) => `$${Number(val).toLocaleString()}`
        }
      }
    }
  };

  // 3. Category Revenue (Doughnut / Pie)
  const categoryPalette = [
    '#2563EB', // Blue - Electronics
    '#8B5CF6', // Purple - Fashion
    '#10B981', // Emerald - Home
    '#EC4899', // Pink - Beauty
    '#F59E0B', // Amber - Sports
    '#6366F1', // Indigo - Books
  ];

  const categoryChartData = {
    labels: categoryData.map(c => c.category),
    datasets: [
      {
        data: categoryData.map(c => c.revenue),
        backgroundColor: categoryPalette,
        borderWidth: darkMode ? 2 : 1,
        borderColor: darkMode ? '#0F172A' : '#FFFFFF',
        hoverOffset: 6,
      }
    ]
  };

  const donutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: textColor,
          font: { family: 'Plus Jakarta Sans', size: 11 },
          padding: 12,
          boxWidth: 10,
        }
      },
      tooltip: {
        backgroundColor: darkMode ? '#0F172A' : '#1E293B',
        titleFont: { family: 'Plus Jakarta Sans', size: 12 },
        bodyFont: { family: 'JetBrains Mono', size: 11 },
        callbacks: {
          label: (ctx) => {
            const val = ctx.parsed;
            const total = ctx.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const pct = ((val / total) * 100).toFixed(1);
            return ` $${val.toLocaleString()} (${pct}%)`;
          }
        }
      }
    }
  };

  // 4. Payment Method Doughnut
  const paymentPalette = ['#3B82F6', '#8B5CF6', '#10B981', '#06B6D4', '#F97316'];
  const paymentChartData = {
    labels: paymentData.map(p => p.method),
    datasets: [
      {
        data: paymentData.map(p => p.totalAmount),
        backgroundColor: paymentPalette,
        borderWidth: darkMode ? 2 : 1,
        borderColor: darkMode ? '#0F172A' : '#FFFFFF',
        hoverOffset: 6,
      }
    ]
  };

  // 5. Monthly Profit Analysis (Revenue vs Cost vs Profit)
  const monthlyProfitData = {
    labels: monthlyData.map(d => d.month),
    datasets: [
      {
        label: 'Gross Profit ($)',
        data: monthlyData.map(d => d.profit),
        backgroundColor: '#10B981',
        borderRadius: 4,
      },
      {
        label: 'COGS & Expenses ($)',
        data: monthlyData.map(d => Math.max(0, d.revenue - d.profit)),
        backgroundColor: darkMode ? '#334155' : '#CBD5E1',
        borderRadius: 4,
      }
    ]
  };

  const stackedBarOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 11 } }
      },
      y: {
        stacked: true,
        grid: { color: gridColor },
        ticks: {
          color: textColor,
          font: { family: 'JetBrains Mono', size: 11 },
          callback: (val) => `$${Number(val).toLocaleString()}`
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: textColor,
          font: { family: 'Plus Jakarta Sans', size: 11 },
          boxWidth: 10,
        }
      },
      tooltip: {
        backgroundColor: darkMode ? '#0F172A' : '#1E293B',
        titleFont: { family: 'Plus Jakarta Sans', size: 12 },
        bodyFont: { family: 'JetBrains Mono', size: 11 },
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: $${(ctx.parsed?.y ?? 0).toLocaleString()}`
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Main Visual: Monthly Sales Revenue Line Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Monthly Sales Revenue & Trends
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Comparative multi-period financial trajectory across fiscal quarters
            </p>
          </div>

          {/* Metric View Segmented Selector */}
          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs self-start sm:self-auto">
            <button
              onClick={() => setMonthlyMetric('revenue')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                monthlyMetric === 'revenue'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Revenue
            </button>
            <button
              onClick={() => setMonthlyMetric('yoy')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                monthlyMetric === 'yoy'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              YoY Comparison
            </button>
            <button
              onClick={() => setMonthlyMetric('profit')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                monthlyMetric === 'profit'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Revenue vs Profit
            </button>
            <button
              onClick={() => setMonthlyMetric('orders')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                monthlyMetric === 'orders'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Orders Volume
            </button>
          </div>
        </div>

        <div className="h-72 w-full">
          <Line data={monthlyChartData} options={lineOptions} />
        </div>
      </div>

      {/* Row 2: Daily Sales Bar & Monthly Profit Stacked Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Sales Performance */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Daily Sales Performance (Last 14 Active Days)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
              Bar Chart
            </span>
          </div>
          <div className="h-64 w-full">
            <Bar data={dailyChartData} options={dailyOptions} />
          </div>
        </div>

        {/* Monthly Profit Analysis (Stacked) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Monthly Profit & Margin Analysis
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
              COGS vs Profit
            </span>
          </div>
          <div className="h-64 w-full">
            <Bar data={monthlyProfitData} options={stackedBarOptions} />
          </div>
        </div>
      </div>

      {/* Row 3: Revenue by Category & Sales by Payment Method */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Revenue */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Revenue by Category (Pie Chart)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
              6 Categories
            </span>
          </div>
          <div className="h-64 w-full">
            <Doughnut data={categoryChartData} options={donutOptions} />
          </div>
        </div>

        {/* Sales by Payment Method */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Sales by Payment Method (Doughnut Chart)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
              5 Channels
            </span>
          </div>
          <div className="h-64 w-full">
            <Doughnut data={paymentChartData} options={donutOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};
